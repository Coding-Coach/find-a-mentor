import React, { useRef, useEffect, useState, useContext } from 'react';
import { getMentorshipRequests, getCurrentUser } from '../../api';
import RichList from '../components/RichList';
import Card, { Content } from '../components/Card';
import styled from 'styled-components';
import UserContext from '../../context/userContext/UserContext';
import RequestContent from './RequestContent';
import { Loader } from '../../components/Loader';
import { formatRequestTime } from '../../helpers/mentorship';
import { toast } from 'react-toastify';
import messages from '../../messages';

const Root = styled.div`
  ${({ hasReq }) => hasReq && Content} {
    padding-left: 0;
    padding-right: 0;
  }
`;

const StyledLoader = styled.div`
  margin: auto;
  text-align: center;
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
  const userId = currentUser?._id;
  const hasReq = currentUser?.mentorshipReq?.length > 0;
  const isLoading = !Array.isArray(currentUser?.mentorshipReq);
  const isMount = useRef(true);

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
      info: formatRequestTime(date),
      children: message && background && expectation && (
        <RequestContent
          {...{ message, background, expectation }}
          onClick={() => acceptReq(id)}
        />
      ),
    }));

  const acceptReq = id => {
    toast.error(messages.GENERIC_ERROR);
  };

  const setMentorshipReq = async () => {
    if (hasReq) {
      setState(mapData(currentUser?.mentorshipReq));
    } else {
      getMentorshipRequests(userId).then(({ data }) => {
        if (isMount.current) {
          updateUser({ ...currentUser, mentorshipReq: data });
          setState(mapData(data));
        }
      });
    }
  };

  const init = () =>
    getCurrentUser().then(user => {
      if (isMount.current) updateUser(user);
    });

  useEffect(() => {
    if (userId) {
      setMentorshipReq();
    } else {
      init();
    }
  }, [userId]);

  useEffect(() => {
    isMount.current = true;
    return () => {
      isMount.current = false;
    };
  }, []);

  const render = () => {
    if (isLoading)
      return (
        <StyledLoader>
          <Loader />
        </StyledLoader>
      );

    if (hasReq) return <RichList items={state} />;
    else {
      return <p>No requests</p>;
    }
  };

  return (
    <Root hasReq={hasReq}>
      <Card title="Mentorship Requests">{render()}</Card>
    </Root>
  );
};

MentorshipReq.propTypes = {};

export default MentorshipReq;
