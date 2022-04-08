import React, { FC } from 'react';
import Obfuscate from 'react-obfuscate';
import orderBy from 'lodash/orderBy';
import classNames from 'classnames';
import Link from '../Link/Link';
import { Tooltip } from 'react-tippy';

import './Card.css';
import StyledCard from './Card.css';
import { useDeviceType } from '../../hooks/useDeviceType';

import { report } from '../../ga';
import messages from '../../messages';
import { UnstyledList } from '../common';
import { getAvatarUrl } from '../../helpers/avatar';
import { languageName } from '../../helpers/languages';
import { getChannelInfo } from '../../channelProvider';
import { CardProps, CTAButtonProps } from './Card.types';
import { Channel, Country, Mentor } from '../../types/models';
import { useFilterParams } from '../../utils/permaLinkService';
import { useUser } from '../../context/userContext/UserContext';
import { useModal } from '../../context/modalContext/ModalContext';
import MentorshipRequest from '../../Me/Modals/MentorshipRequestModals/MentorshipRequest';
import { formatTimeAgo } from '../../helpers/time';
import { useAuth } from '../../context/authContext/AuthContext';
import { useRoutes } from '../../hooks/useRoutes';

const COMPACT_CARD_TAGS_LENGTH = 5;

function handleAnalytics(channelName: string) {
  report('Channel', 'click', channelName);
}

const tagsList = (
  tags: string[],
  handleTagClick: (tag: string) => void,
  showAll = false
) => {
  return (
    <>
      {tags
        .slice(0, showAll ? tags.length : COMPACT_CARD_TAGS_LENGTH)
        .map((tag, index) => (
          <button
            className="tag"
            key={index}
            tabIndex={0}
            onClick={handleTagClick.bind(null, tag)}
          >
            {tag}
          </button>
        ))}
      {tags.length > COMPACT_CARD_TAGS_LENGTH && !showAll && (
        <div className="tag">+{tags.length - COMPACT_CARD_TAGS_LENGTH}</div>
      )}
    </>
  );
};

const CTAButton = ({ tooltipProps, onClick, text, link }: CTAButtonProps) => {
  if (!onClick && !link) {
    // eslint-disable-next-line no-console
    console.warn('CTA button must have either onClick or link');
  }
  const CTAElement: FC = ({ children }) =>
    link ? (
      <Link href={link}>{children}</Link>
    ) : (
      <button onClick={onClick}>{children}</button>
    );
  return (
    <Tooltip {...tooltipProps} size="big" arrow={true}>
      <CTAElement>
        <span className="icon">
          <i className="fa fa-hand-o-right fa-lg" />
        </span>
        <p className="type">{text}</p>
      </CTAElement>
    </Tooltip>
  );
};

const ApplyButton = ({ mentor }: { mentor: Mentor }) => {
  const { isMobile } = useDeviceType();
  const [openModal] = useModal(<MentorshipRequest mentor={mentor} />);
  const { isAuthenticated } = useUser();
  const auth = useAuth();

  const applyOnClick = () => {
    handleAnalytics('apply');
    auth.login();
  };

  const tooltipMessage = isAuthenticated
    ? messages.CARD_APPLY_REQUEST_TOOLTIP
    : messages.CARD_APPLY_TOOLTIP;
  const handleClick = isAuthenticated ? openModal : applyOnClick;

  return (
    <CTAButton
      tooltipProps={{
        title: tooltipMessage,
        disabled: isMobile,
      }}
      onClick={handleClick}
      text="Apply"
    />
  );
};

const Avatar = ({ mentor, id }: { mentor: Mentor; id: string }) => {
  const urls = useRoutes();
  return (
    <Link href={urls.user.get(mentor)} className="avatar">
      <i className="fa fa-user-circle" />
      <img
        src={getAvatarUrl(mentor.avatar)}
        aria-labelledby={`${id}`}
        alt={`${mentor.name}`}
        onError={(e) => e.currentTarget.classList.add('broken')}
      />
    </Link>
  );
};

const LikeButton = ({
  onClick,
  liked,
  tooltip,
}: {
  onClick: () => void;
  liked: boolean;
  tooltip?: string;
}) => (
  <Tooltip disabled={!tooltip} title={tooltip} size="big" arrow={true}>
    <button onClick={onClick} className="like-button" aria-label="Save Mentor">
      <i
        className={classNames([
          'fa',
          { 'liked fa-heart': liked, 'fa-heart-o': !liked },
        ])}
      />
    </button>
  </Tooltip>
);

const Card = ({ mentor, onFavMentor, isFav, appearance }: CardProps) => {
  const extended = appearance === 'extended';
  const { setFilterParams } = useFilterParams();
  const { currentUser } = useUser();
  const urls = useRoutes();
  const {
    name,
    country,
    description,
    tags,
    title,
    _id: mentorID,
    available: availability,
    createdAt,
  } = mentor;

  const auth = useAuth();

  const toggleFav = () => {
    if (currentUser) {
      isFav = !isFav;
      onFavMentor(mentor);
    } else {
      auth.login();
    }
  };

  const handleTagClick = (tag: string) => {
    setFilterParams('technology', tag);
  };

  const handleCountryClick = (country: Country) => {
    setFilterParams('country', country);
  };

  const MentorDescription = () => {
    return description ? (
      <p className="description">{description}</p>
    ) : (
      <React.Fragment />
    );
  };

  const MentorInfo = () => {
    return (
      <div>
        <h2 className="name" id={`${mentorID}`}>
          {name}
        </h2>
        <h4 className="title">{title}</h4>
        {extended && (
          <>
            <Languages />
            <Joined />
          </>
        )}
        <MentorDescription />
      </div>
    );
  };

  const SkillsTags = () => {
    return (
      <div className="tags">{tagsList(tags, handleTagClick, extended)}</div>
    );
  };

  const MentorNotAvailable = () => {
    return (
      <div className="channel-inner mentor-unavailable">
        This mentor is not taking new mentees for now
      </div>
    );
  };

  const getChannelsContent = () => {
    const isMyMentor = mentor.channels.length > 0;
    if (!availability && !isMyMentor) {
      return <MentorNotAvailable />;
    }
    return appearance === 'extended' ? (
      <Channels channels={mentor.channels} />
    ) : (
      <CTAButton
        tooltipProps={{
          disabled: true,
        }}
        link={urls.user.get(mentor)}
        text="Go to profile"
      />
    );
  };

  const CardFooter = () => {
    return (
      <div className="channels">
        <div className="channel-inner">{getChannelsContent()}</div>
      </div>
    );
  };

  const CardHeader = () => {
    const tooltip = currentUser
      ? undefined
      : messages.CARD_ANONYMOUS_LIKE_TOOLTIP;
    return (
      <div className="header">
        <button
          className="country location"
          onClick={() => handleCountryClick(country)}
        >
          <i className={'fa fa-map-marker'} />
          <p>{country}</p>
        </button>

        <Avatar mentor={mentor} id={mentorID} />
        <LikeButton onClick={toggleFav} liked={isFav} tooltip={tooltip} />
      </div>
    );
  };

  const Channels = ({ channels }: { channels: Channel[] }) => {
    if (!channels.length) {
      return <ApplyButton mentor={mentor} />;
    }
    const orderedChannels = orderBy(channels, ['type'], ['asc']);
    return (
      <>
        {orderedChannels.map((channel) => {
          const { icon, url } = getChannelInfo(channel);
          if (channel.type === 'email') {
            return (
              <Obfuscate
                key={channel.type}
                email={url.substring('mailto:'.length)}
                linkText=""
                onClick={() => handleAnalytics(`${channel.type}`)}
              >
                <div className="icon">
                  <i className={`fa fa-${icon} fa-lg`} />
                </div>
                <p className="type">{channel.type}</p>
              </Obfuscate>
            );
          } else {
            return (
              <a
                key={channel.type}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="channel-label"
                onClick={() => handleAnalytics(`${channel.type}`)}
              >
                <div className="icon">
                  <i className={`fa fa-${icon} fa-lg`} />
                </div>
                <p className="type">{channel.type}</p>
              </a>
            );
          }
        })}
      </>
    );
  };

  const Languages = () => (
    <div className="languages" title="Spoken Languages">
      <i className="fa fa-language" />
      <UnstyledList>
        {mentor.spokenLanguages.map((languageCode) => (
          <li key={languageCode}>{languageName(languageCode)}</li>
        ))}
      </UnstyledList>
    </div>
  );

  const Joined = () =>
    createdAt ? (
      <div className="joined">
        <i className="fa fa-clock-o" />
        <span>Joined {formatTimeAgo(new Date(createdAt))}</span>
      </div>
    ) : null;

  return (
    <StyledCard
      aria-label="Mentor card"
      data-testid="mentor-card"
      appearance={appearance}
    >
      <CardHeader />
      <MentorInfo />
      <SkillsTags />
      <CardFooter />
    </StyledCard>
  );
};

export default Card;
