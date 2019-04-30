import React from 'react';
import Obfuscate from 'react-obfuscate';
import { orderBy } from 'lodash';
import './Card.css';
import { getChannelInfo } from '../../channelProvider';
import classNames from 'classnames';
import helpers from '../../helpers';

function handleAnalytic(channelName) {
  if (window && window.ga) {
    const { ga } = window;

    ga('send', {
      hitType: 'event',
      eventCategory: 'Channel',
      eventAction: 'click',
      eventLabel: channelName,
      transport: 'beacon',
    });
  }
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

const channelsList = channels => {
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

const Avatar = ({ mentor, id }) => {
  return (
    <div className="avatar">
      <i className="fa fa-user-circle" />
      <img
        src={mentor.avatar}
        aria-labelledby={`${id}`}
        alt={`${mentor.name}`}
      />
    </div>
  );
};

const LikeButton = ({ onClick, liked }) => (
  <button onClick={onClick} className="like-button" aria-label="Save Mentor">
    <i
      className={classNames([
        'fa',
        { 'liked fa-heart': liked, 'fa-heart-o': !liked },
      ])}
    />
  </button>
);

const Card = ({
  mentor,
  onFavMentor,
  isFav,
  handleTagClick,
  handleCountryClick,
}) => {
  const toggleFav = () => {
    isFav = !isFav;
    onFavMentor(mentor);
  };

  // don't show the description if it's not provided
  const description = mentor.description ? (
    <p className="description">"{mentor.description}"</p>
  ) : (
    <React.Fragment />
  );

  const mentorId = helpers.generateMentorId();

  const MentorInfo = () => {
    return (
      <>
        <div>
          <h1 className="name" id={`${mentorId}`}>
            {mentor.name}
          </h1>
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
    return (
      <div className="header">
        <button
          className="country location"
          onClick={handleCountryClick.bind(null, mentor.country)}
        >
          <i className={'fa fa-map-marker'} />
          <p>{mentor.country}</p>
        </button>

        <Avatar mentor={mentor} id={mentorId} />
        <LikeButton onClick={toggleFav} liked={isFav} />
      </div>
    );
  };
  return (
    <div className="card" aria-label="Mentor card">
      <CardHeader />
      <MentorInfo />
      <SkillsTags />
      <CardFooter />
    </div>
  );
};

export default Card;
