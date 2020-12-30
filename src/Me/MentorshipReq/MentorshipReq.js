import React, { useEffect, useState, useContext } from 'react';
import { getMentorshipRequests, getCurrentUser } from '../../api';
import RichList from '../components/RichList';
import Card from '../components/Card';
import styled from 'styled-components';
import UserContext from '../../context/userContext/UserContext';
import RequestContent from './RequestContent';

const Root = styled.div`
  > div {
    padding-left: 0;
    padding-right: 0;
  }
`;

const STATUS_THEME = {
  Approved: 'primary',
  Pending: 'secondary',
  Rejected: 'danger',
  Cancelled: 'disabled',
};

const MentorshipReq = () => {
  const [state, setState] = useState();
  const { currentUser, updateUser } = useContext(UserContext);

  const mapData = res =>
    res.map(({ id, status, date, message, background, expectation, user }) => ({
      id: id,
      avatar: user.avatar,
      title: user.name,
      subtitle: user.title,
      tag: {
        value: status,
        theme: STATUS_THEME[status],
      },
      info: date,
      children: <RequestContent {...{ message, background, expectation }} />,
    }));

  const setMentorshipReq = async () => {
    if (currentUser?.mentorshipReq) {
      setState(mapData(currentUser?.mentorshipReq));
    } else {
      getMentorshipRequests().then(({ data }) => {
        updateUser({ ...currentUser, mentorshipReq: data });
        setState(mapData(data));
      });
    }
  };

  useEffect(() => {
    if (currentUser) {
      setMentorshipReq();
    } else {
      getCurrentUser().then(user => updateUser(user));
    }
  }, [!!currentUser]);

  return (
    <Root>
      <Card title="Mentorship Requests">
        <RichList items={state} />
      </Card>
    </Root>
  );
};

MentorshipReq.propTypes = {};

export default MentorshipReq;
