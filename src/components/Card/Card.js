import React from "react";
import "./Card.css";
import { getChannelInfo } from "../../channelProvider";
import classNames from "classnames";
import countries from "svg-country-flags/countries.json";

const tagsList = tags =>
  tags.map((tag, index) => {
    return (
      <div className="tag" key={index}>
        {tag}
      </div>
    );
  });

const channelsList = channels =>
  channels.map(channel => {
    const { icon, url } = getChannelInfo(channel);
    return (
      <a
        key={channel.type}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={channel.type}
      >
        <div className="icon">
          <i className={`fa fa-${icon}`} />
        </div>
      </a>
    );
  });

const Avatar = ({ mentor }) => {
  return (
    <div className="avatar">
      <i className="fa fa-user-circle" />
      <img src={mentor.avatar} aria-labelledby={`${mentor.name}-name`} alt="" />
    </div>
  );
};

const LikeButton = ({ onClick, liked }) => (
  <button onClick={onClick} className="like-button">
    <i
      className={classNames([
        "fa",
        { "liked fa-heart": liked, "fa-heart-o": !liked }
      ])}
    />
  </button>
);

const Info = ({mentor}) => {

  // Don't show the description if it's not provided.
  const description = mentor.description ? <div className="description">"{mentor.description}"</div> : <React.Fragment />;

  return (
    <React.Fragment>
      <div className="name" id={`${mentor.name}-name`}>
        {mentor.name}
      </div>
      <div className="title">{mentor.title}</div>
      {description}
      <div className="tags">{tagsList(mentor.tags)}</div>
      <div className="channels">
        <div className="channel-inner">{channelsList(mentor.channels)}</div>
      </div>
    </React.Fragment>
  )
};

const Card = ({ mentor, onToggleFav, isFav }) => {
  const toggleFav = () => {
    isFav = !isFav;
    onToggleFav(mentor);
  };

  return (
    <div className="card">
      <LikeButton onClick={toggleFav} liked={isFav} />
      <img
        className="country"
        src={`https://www.countryflags.io/${mentor.country}/flat/32.png`}
        alt={countries[mentor.country]}
      />
      <Avatar mentor={mentor} />
      <Info mentor={mentor} />
    </div>
  );
};

export default Card;
