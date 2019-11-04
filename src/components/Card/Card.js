import React, {useContext} from 'react';
import Obfuscate from 'react-obfuscate';
import orderBy from 'lodash/orderBy';
import './Card.css';
import { getChannelInfo } from '../../channelProvider';
import classNames from 'classnames';
import { report } from '../../ga';
import auth from '../../utils/auth';
import { Tooltip } from 'react-tippy';
import messages from '../../messages';
import { useFilters } from '../../context/filtersContext/FiltersContext';
import UserContext from '../../context/userContext/UserContext';

function handleAnalytic(channelName) {
  report('Channel', 'click', channelName);
}

const tagsList = (tags, handleTagClick) =>
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
  handleAnalytic('apply');
  auth.login();
};

const nonLoggedinChannels = () => {
  return (
    <Tooltip title={messages.CARD_APPLY_TOOLTIP} size="big" arrow={true}>
      <button onClick={applyOnClick}>
        <div className="icon">
          <i className="fa fa-hand-o-right fa-lg" />
        </div>
        <p className="type">Apply</p>
      </button>
    </Tooltip>
  );
};

const channelsList = channels => {
  if (!auth.isAuthenticated()) {
    return nonLoggedinChannels();
  }
  const orderedChannels = orderBy(channels, ['type'], ['asc']);
  return orderedChannels.map(channel => {
    const { icon, url } = getChannelInfo(channel);
    if (channel.type === 'email') {
      return (
        <Obfuscate
          key={channel.type}
          email={url.substring('mailto:'.length)}
          linkText=""
          onClick={() => handleAnalytic(`${channel.type}`)}
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
          onClick={() => handleAnalytic(`${channel.type}`)}
        >
          <div className="icon">
            <i className={`fa fa-${icon} fa-lg`} />
          </div>
          <p className="type">{channel.type}</p>
        </a>
      );
    }
  });
};

const Avatar = ({ mentor, id, handleAvatarClick }) => {
  return (
    <button className="avatar" onClick={handleAvatarClick}>
      <i className="fa fa-user-circle" />
      <img
        src={mentor.avatar}
        aria-labelledby={`${id}`}
        alt={`${mentor.name}`}
        onError={e => e.currentTarget.classList.add('broken')}
      />
    </button>
  );
};

const LikeButton = ({ onClick, liked, tooltip }) => (
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

const Card = ({ mentor, onFavMentor, isFav }) => {
  const [, dispatch] = useFilters();
  const { currentUser } = useContext(UserContext);

  const toggleFav = () => {
    if (currentUser) {
      isFav = !isFav;
      onFavMentor(mentor);
    } else {
      auth.login();
    }
  };

  const handleTagClick = tag => {
    dispatch({ type: 'filterTag', payload: tag });
  };
  const handleAvatarClick = name => {
    dispatch({ type: 'filterName', payload: name });
  };
  const handleCountryClick = country => {
    dispatch({ type: 'filterCountry', payload: country });
  };

  // don't show the description if it's not provided
  const description = mentor.description ? (
    <p className="description">"{mentor.description}"</p>
  ) : (
    <React.Fragment />
  );

  const MentorInfo = () => {
    return (
      <>
        <div>
          <h2 className="name" id={`${mentor._id}`}>
            {mentor.name}
          </h2>
          <h4 className="title">{mentor.title}</h4>
          {description}
        </div>
      </>
    );
  };

  const SkillsTags = () => {
    return <div className="tags">{tagsList(mentor.tags, handleTagClick)}</div>;
  };

  const CardFooter = () => {
    return (
      <>
        <div className="wave" />
        <div className="channels">
          <div className="channel-inner">{channelsList(mentor.channels)}</div>
        </div>
      </>
    );
  };

  const CardHeader = () => {
    const tooltip = currentUser ? null : messages.CARD_ANONYMOUS_LIKE_TOOLTIP;
    return (
      <div className="header">
        <button
          className="country location"
          onClick={() => handleCountryClick(mentor.country)}
        >
          <i className={'fa fa-map-marker'} />
          <p>{mentor.country}</p>
        </button>

        <Avatar
          mentor={mentor}
          id={mentor._id}
          handleAvatarClick={handleAvatarClick.bind(null, mentor.name)}
        />
        <LikeButton onClick={toggleFav} liked={isFav} tooltip={tooltip} />
      </div>
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
