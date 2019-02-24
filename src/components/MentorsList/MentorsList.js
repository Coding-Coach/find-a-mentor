import React, { Component } from 'react';

import { Card, Image, Label } from 'semantic-ui-react';
import { getChannelInfo } from '../../channelProvider';
import InfiniteScroll from 'react-infinite-scroller';

const itemsInPage = 10;

export default class MentorsLists extends Component {
  state = {
    page: 1
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

  render() {
    const { mentors } = this.props;
    const items = mentors.slice(0, this.state.page * itemsInPage).map((mentor, index) => {
      return (<Card key={index}>
        <Card.Content>
          <Image floated='right' size='mini' src={mentor.avatar} />
          <Card.Header>{mentor.name}</Card.Header>
          <Card.Meta>{mentor.title}</Card.Meta>
          <Card.Description>{mentor.description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
        {
          mentor.tags.map(tag => {
            return (
              <Label key={tag} horizontal>{tag}</Label>
            );
          })
        }
        </Card.Content>
        <Card.Content extra>
        {
          mentor.channels.map(channel => {
            const { icon, url } = getChannelInfo(channel);
            return (
              <a key={channel.type} href={url} target="_blank" rel="noopener noreferrer">
                <Label key={icon} content={channel.type} icon={icon} />
              </a>
            )
          })
        }
        </Card.Content>
      </Card>)
    });

    return (
      <div className="mentors-wrapper">
        <Card.Group centered>
          <InfiniteScroll
            className="ui centered cards"
            loadMore={this.loadMore}
            hasMore={items.length < mentors.length}
          >
            {items}
          </InfiniteScroll>
        </Card.Group>
      </div>);
  }
}