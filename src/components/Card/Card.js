import React, { useContext } from 'react';
import './Card.css';
import classNames from 'classnames';
import { report } from '../../ga';
import auth from '../../utils/auth';
import { getAvatarUrl } from '../../helpers/avatar';
import { Tooltip } from 'react-tippy';
import messages from '../../messages';
import { useFilters } from '../../context/filtersContext/FiltersContext';
import UserContext from '../../context/userContext/UserContext';
import { useModal } from '../../context/modalContext/ModalContext';
import MentorshipRequest from '../../Me/Modals/MentorshipRequest';

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

const ApplyButton = ({ mentor }) => {
  const [openModal] = useModal(<MentorshipRequest mentor={mentor} />);
  const isAuth = auth.isAuthenticated();
  const tooltipMessage = isAuth
    ? messages.CARD_APPLY_REQUEST_TOOLTIP
    : messages.CARD_APPLY_TOOLTIP;
  const handleClick = isAuth ? openModal : applyOnClick;
  return (
    <Tooltip title={tooltipMessage} size="big" arrow={true}>
      <button onClick={handleClick}>
        <div className="icon">
          <i className="fa fa-hand-o-right fa-lg" />
        </div>
        <p className="type">Apply</p>
      </button>
    </Tooltip>
  );
};

const Avatar = ({ mentor, id, handleAvatarClick }) => {
  return (
    <button className="avatar" onClick={handleAvatarClick}>
      <i className="fa fa-user-circle" />
      <img
        src={getAvatarUrl(mentor.avatar)}
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

  const handleTagClick = tag => {
    dispatch({ type: 'filterTag', payload: tag });
  };

  const handleAvatarClick = name => {
    dispatch({ type: 'filterName', payload: name });
  };

  const handleCountryClick = country => {
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
              <ApplyButton mentor={mentor} />
            </div>
          ) : (
            <MentorNotAvailable />
          )}
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
          onClick={() => handleCountryClick(country)}
        >
          <i className={'fa fa-map-marker'} />
          <p>{country}</p>
        </button>

        <Avatar
          mentor={mentor}
          id={mentorID}
          handleAvatarClick={handleAvatarClick.bind(null, name)}
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
