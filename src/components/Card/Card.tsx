import React from 'react';
import Obfuscate from 'react-obfuscate';
import orderBy from 'lodash/orderBy';
import './Card.css';
import { getChannelInfo } from '../../channelProvider';
import classNames from 'classnames';
import { report } from '../../ga';
import auth from '../../utils/auth';
import { getAvatarUrl } from '../../helpers/avatar';
import { Tooltip } from 'react-tippy';
import messages from '../../messages';
import { useFilters } from '../../context/filtersContext/FiltersContext';
import { useUser } from '../../context/userContext/UserContext';
import { useModal } from '../../context/modalContext/ModalContext';
import MentorshipRequest from '../../Me/Modals/MentorshipRequestModals/MentorshipRequest';
import { useDeviceType } from '../../utils/useDeviceType';
import { Channel, Country, Mentor } from '../../types/models';

type CardProps = {
  mentor: Mentor;
  isFav: boolean;
  onAvatarClick?(): void;
  onFavMentor(mentor: Mentor): void;
};

function handleAnalytics(channelName: string) {
  report('Channel', 'click', channelName);
}

const tagsList = (tags: string[], handleTagClick: (tag: string) => void) =>
  tags.map((tag, index) => {
    return (
      <button
        className="tag"
        key={index}
        tabIndex={0}
        onClick={handleTagClick.bind(null, tag)}
      >
        {tag}
      </button>
    );
  });

const applyOnClick = () => {
  handleAnalytics('apply');
  auth.login();
};

const ApplyButton = ({ mentor }: { mentor: Mentor }) => {
  const isDesktop = useDeviceType();
  const [openModal] = useModal(<MentorshipRequest mentor={mentor} />);
  const { isAuthenticated } = useUser();

  const tooltipMessage = isAuthenticated
    ? messages.CARD_APPLY_REQUEST_TOOLTIP
    : messages.CARD_APPLY_TOOLTIP;
  const handleClick = isAuthenticated ? openModal : applyOnClick;

  return (
    <Tooltip
      disabled={!isDesktop}
      title={tooltipMessage}
      size="big"
      arrow={true}
    >
      <button onClick={handleClick}>
        <div className="icon">
          <i className="fa fa-hand-o-right fa-lg" />
        </div>
        <p className="type">Apply</p>
      </button>
    </Tooltip>
  );
};

const Avatar = ({
  mentor,
  id,
  handleAvatarClick,
}: {
  mentor: Mentor;
  id: string;
  handleAvatarClick: () => void;
}) => {
  return (
    <button className="avatar" onClick={handleAvatarClick}>
      <i className="fa fa-user-circle" />
      <img
        src={getAvatarUrl(mentor.avatar)}
        aria-labelledby={`${id}`}
        alt={`${mentor.name}`}
        onError={(e) => e.currentTarget.classList.add('broken')}
      />
    </button>
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

const Card = ({
  mentor,
  onFavMentor,
  isFav,
  onAvatarClick = () => {},
}: CardProps) => {
  const [, dispatch] = useFilters();
  const { currentUser } = useUser();
  const {
    name,
    country,
    description,
    tags,
    title,
    _id: mentorID,
    available: availability,
  } = mentor;

  const toggleFav = () => {
    if (currentUser) {
      isFav = !isFav;
      onFavMentor(mentor);
    } else {
      auth.login();
    }
  };

  const handleTagClick = (tag: string) => {
    dispatch({ type: 'filterTag', payload: tag });
  };

  const handleCountryClick = (country: Country) => {
    dispatch({ type: 'filterCountry', payload: country });
  };

  const MentorDescription = () => {
    return description ? (
      <p className="description">"{description}"</p>
    ) : (
      <React.Fragment />
    );
  };

  const MentorInfo = () => {
    return (
      <>
        <div>
          <h2 className="name" id={`${mentorID}`}>
            {name}
          </h2>
          <h4 className="title">{title}</h4>
          <MentorDescription />
        </div>
      </>
    );
  };

  const SkillsTags = () => {
    return <div className="tags">{tagsList(tags, handleTagClick)}</div>;
  };

  const MentorNotAvailable = () => {
    return (
      <div className="channel-inner mentor-unavailable">
        This mentor is not taking new mentees for now
      </div>
    );
  };

  const CardFooter = () => {
    return (
      <>
        <div className="wave" />
        <div className="channels">
          {availability ? (
            <div className="channel-inner">
              <Channels channels={mentor.channels} />
            </div>
          ) : (
            <MentorNotAvailable />
          )}
        </div>
      </>
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

        <Avatar
          mentor={mentor}
          id={mentorID}
          handleAvatarClick={onAvatarClick}
        />
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

  return (
    <div className="card" aria-label="Mentor card" data-testid="mentor-card">
      <CardHeader />
      <MentorInfo />
      <SkillsTags />
      <CardFooter />
    </div>
  );
};

export default Card;
