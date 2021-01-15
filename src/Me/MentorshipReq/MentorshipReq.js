import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useContext,
} from 'react';
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
import {getAvatarUrl} from '../../helpers/avatar';

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
  Cancelled: 'disabled',
  New: 'secondary',
  Rejected: 'danger',
  Viewed: 'checked',
};

const MentorshipReq = () => {
  const [state, setState] = useState();
  const { currentUser, updateUser } = useContext(UserContext);
  const userId = currentUser?._id;
  const hasReq = currentUser?.mentorshipReq?.length > 0;
  const isLoading = !Array.isArray(currentUser?.mentorshipReq);
  const isMount = useRef(true);

  const acceptReq = id => {
    toast.error(messages.GENERIC_ERROR);
  };
  const declinedReq = id => {
    toast.error(messages.GENERIC_ERROR);
  };

  const mapData = (res = []) =>
    res.map(({ id, status, date, message, background, expectation, isMine, ...data }) => {
      const user = isMine ? data.mentor : data.mentee;

      return {
        id: id,
        avatar: getAvatarUrl(user.avatar),
        title: user.name,
        subtitle: user.title,
        tag: {
          value: status,
          theme: STATUS_THEME[status],
        },
        info: formatRequestTime(Date.parse(date)),
        children: message && background && expectation && (
          <RequestContent
            {...{ message, background, expectation }}
            onAccept={acceptReq}
            onDeclined={declinedReq}
          />
        ),
      }
    });

  const setMentorshipReq = async () => {
    if (hasReq) {
      setState(mapData(currentUser?.mentorshipReq));
    } else {
      const mentorshipReq = await getMentorshipRequests(userId);

      if (isMount.current) {
        updateUser({ ...currentUser, mentorshipReq });
        setState(mapData(mentorshipReq));
      }
    }
  };

  useEffect(() => {
    isMount.current = true;
    return () => {
      isMount.current = false;
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      getCurrentUser().then(user => {
        if (isMount.current) updateUser(user);
      });
    }
  }, [userId, updateUser]);

  useEffect(() => {
    if (!userId) return;
    setMentorshipReq();
  }, [userId]);

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
    <Root hasReq={hasReq} data-testid="mentorship-req">
      <Card title="Mentorship Requests">{render()}</Card>
    </Root>
  );
};

MentorshipReq.propTypes = {};

export default MentorshipReq;
