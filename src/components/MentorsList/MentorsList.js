import './MentorList.css';

import React, { Component } from 'react';

import { Card, Label, Icon, Button } from 'semantic-ui-react';
import classNames from 'classnames';
import { getChannelInfo } from '../../channelProvider';
import InfiniteScroll from 'react-infinite-scroller';
import { toggle, get } from '../../favoriteManager';

const itemsInPage = 10;

const tagsList = tags => tags.map((tag, index) => {
  return (
    <Label className="mentor-tag" key={index}>{tag}</Label>
  );
});

const items = (mentors, favs, onToggleFav) => mentors.map((mentor, index) => {
  return (<Card className="mentor-card" key={index}>
    <header>
      <button className="ui right corner label" onClick={onToggleFav.bind(null, mentor)}>
        <Icon name="heart" color={favs.indexOf(mentor.id) > -1 ? 'red' : 'black'} />
      </button>
      <img src={mentor.avatar} alt={`${mentor.name}'s avatar`} />
      <div className="details">
        <Card.Header>{mentor.name}</Card.Header>
        <Card.Meta>{mentor.title}</Card.Meta>
        {tagsList(mentor.tags)}
      </div>
    </header>
    <div className="details">
      <Card.Description>
        <Icon className="mentor-quote" name="quote left" />
        {mentor.description}
      </Card.Description>
    </div>
    <Button.Group attached='bottom'>
    {
      mentor.channels.map(channel => {
        const { icon, url } = getChannelInfo(channel);
        return (
          <a className="ui black basic button" key={channel.type} href={url} target="_blank" rel="noopener noreferrer">
            <Icon name={icon} />
            <span>{channel.type}</span>
          </a>
        )
      })
    }
    </Button.Group>
  </Card>)
});

export default class MentorsLists extends Component {
  state = {
    page: 1,
    favs: get()
  }

  loadMore = () => {
    this.setState({
      page: this.state.page + 1
    })
  }

  componentWillReceiveProps(newProps) {
    if (newProps.mentors !== this.props.mentors) {
      this.setState({
        page: 1
      })
    }
  }

  onToggleFav = (mentor) => {
    const favs = toggle(mentor);
    this.setState({
      favs
    })
  }

  render() {
    const { mentors, className } = this.props;
    const { page, favs } = this.state;

    const mentorsInList = mentors.slice(0, page * itemsInPage);

    return (
      <div className={classNames([
        'mentors-wrapper',
        className
      ])}>
        <Card.Group centered className="mentors-cards">
          <InfiniteScroll
            className="ui centered cards mentors-cards"
            loadMore={this.loadMore}
            hasMore={mentorsInList.length < mentors.length}
          >
            {items(mentorsInList, favs, this.onToggleFav)}
          </InfiniteScroll>
        </Card.Group>
      </div>);
  }
}