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
        className="channel-label"
      >
        <div className="icon">
          <i className={`fa fa-${icon} fa-lg`} />
        </div>
        <p className="type">{channel.type}</p>
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
  <button onClick={onClick} className="like-button" aria-label="Save Mentor">
    <i
      className={classNames([
        "fa",
        { "liked fa-heart": liked, "fa-heart-o": !liked }
      ])}
    />
  </button>
);

const Card = ({ mentor, onFavMentor, isFav }) => {
  const toggleFav = () => {
    isFav = !isFav;
    onFavMentor(mentor);
  };

  return (
    <div className="card" aria-label="Mentor card">
      <LikeButton onClick={toggleFav} liked={isFav} />
      <img
        className="country"
        src={`https://www.countryflags.io/${mentor.country}/flat/32.png`}
        alt={countries[mentor.country]}
      />
      <Avatar mentor={mentor} />
      <h1 className="name" id={`${mentor.name}-name`}>
        {mentor.name}
      </h1>
      <h4 className="title">{mentor.title}</h4>
      <p className="description">"{mentor.description}"</p>
      <div className="tags">{tagsList(mentor.tags)}</div>
      <div className="channels">
        <div className="channel-inner">{channelsList(mentor.channels)}</div>
      </div>
    </div>
  );
};

export default Card;
