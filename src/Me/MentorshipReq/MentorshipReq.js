import React, { useRef, useEffect, useState, useContext } from 'react';
import { getMentorshipRequests, getCurrentUser } from '../../api';
import RichList from '../components/RichList';
import Card, { Content } from '../components/Card';
import styled from 'styled-components';
import UserContext from '../../context/userContext/UserContext';
import ReqContent from './ReqContent';
import { Loader } from '../../components/Loader';
import { formatRequestTime } from '../../helpers/mentorship';
import { toast } from 'react-toastify';
import messages from '../../messages';
import { getAvatarUrl } from '../../helpers/avatar';
import { useModal } from '../../context/modalContext/ModalContext';
import ReqModal from './ReqModal';

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
  const [selectedMentee, setSelectedMentee] = useState(null);
  const { currentUser, updateUser } = useContext(UserContext);
  const userId = currentUser?._id;
  const hasReq = state?.length > 0;
  const isLoading = !state;
  const isMount = useRef(true);

  const acceptReq = (id, { name }) => {
    //await
    setSelectedMentee({ name, isApproved: true });
    openModal();
    // toast.error(messages.GENERIC_ERROR);
  };
  const declinedReq = (id, { name }) => {
    setSelectedMentee({ name, isApproved: false });
    openModal();
    toast.error(messages.GENERIC_ERROR);
  };

  const mapData = (res = []) =>
    res.map(
      ({
        id,
        status,
        date,
        message,
        background,
        expectation,
        isMine,
        ...data
      }) => {
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
            <ReqContent
              {...{ message, background, expectation }}
              onAccept={() => acceptReq(id, user)}
              onDeclined={() => declinedReq(id, user)}
            />
          ),
        };
      }
    );

  const setMentorshipReq = async () => {
    const mentorshipReq = await getMentorshipRequests(userId);

    if (isMount.current) {
      updateUser({ ...currentUser, mentorshipReq });
      setState(mapData(mentorshipReq));
    }
  };

  const [openModal] = useModal(
    <ReqModal
      onSave={() => {}}
      username={selectedMentee?.name}
      isApproved={selectedMentee?.isApproved}
      onClose={() => setSelectedMentee(null)}
    />,
    [selectedMentee?.name?.name]
  );

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

    if (hasReq)
      return <RichList items={state} closeOpenItem={selectedMentee?.name} />;
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
