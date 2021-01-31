import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import {
  getMentorshipRequests,
  getCurrentUser,
  updateMentorshipReqStatus,
} from '../../api';
import Card, { Content } from '../components/Card';
import styled from 'styled-components';
import UserContext from '../../context/userContext/UserContext';
import { UsersList } from './';
import { STATUS } from '../../helpers/mentorship';
import { useModal } from '../../context/modalContext/ModalContext';
import {
  SuccessModal as ApprovedModal,
  DeclinedModal,
} from '../Modals/MentorshipReqModals';

const Root = styled.div`
  margin-bottom: 50px;
  ${({ hasReq }) => hasReq && Content} {
    padding-left: 0;
    padding-right: 0;
  }
`;

const PREV_STATUS = {
  [STATUS.viewed]: STATUS.new,
  [STATUS.approved]: STATUS.viewed,
  [STATUS.rejected]: STATUS.viewed,
};

const MentorshipReq = () => {
  const [mentorState, setMentorState] = useState();
  const [menteeState, setMenteeState] = useState();
  const [selectedReq, setSelectedReq] = useState(null);
  const { currentUser, updateUser } = useContext(UserContext);
  const userId = currentUser?._id;
  const hasReq = mentorState?.length > 0;
  const [loadingState, setLoadingState] = useState(!mentorState);
  const isMount = useRef(true);

  const markViewed = async ({ id, status }) => {
    if (status !== PREV_STATUS[STATUS.viewed]) return;
    await updateReqStatus({ id, userId }, STATUS.viewed);
  };
  const acceptReq = async ({ id, status, username }) => {
    if (status !== PREV_STATUS[STATUS.approved]) return;

    setLoadingState(true);
    await updateReqStatus({ id, userId }, STATUS.approved);
    setLoadingState(false);
    setSelectedReq({ id, username });
    openApprovedModal();
  };
  const onDeclinedReq = ({ id, status, username }) => {
    if (status !== PREV_STATUS[STATUS.rejected]) return;

    setSelectedReq({ id, username });
    openDeclinedModal();
  };

  const declineReq = async msg => {
    await updateReqStatus({ id: selectedReq.id, userId }, STATUS.rejected, msg);
    closeDeclinedModal();
  };

  const getMentorshipReq = useCallback(async () => {
    if (isMount.current) {
      const mentorshipReq = await getMentorshipRequests(userId);
      console.log(
        '🚀 ~ file: MentorshipReq.js ~ line 79 ~ mentorshipReq?.forEach ~ mentorshipReq',
        mentorshipReq
      );
      const list = { asMentee: [], asMentor: [] };
      mentorshipReq?.forEach(({ isMine, ...req }) => {
        if (isMine) list.asMentee.push({ ...req, isMine });
        else list.asMentor.push({ ...req, isMine });
      });
      setMentorState(list.asMentor);
      setMenteeState(list.asMentee);
      setLoadingState(false);
    }
  }, [userId]);

  const updateReqStatus = async ({ id, userId }, nextStatus, reason) => {
    const { success, mentorship } = await updateMentorshipReqStatus(
      id,
      userId,
      {
        status: nextStatus,
        reason,
      }
    );

    if (!success) return;

    const itemIndex = mentorState.findIndex(s => s.id === id);
    const item = mentorState[itemIndex];
    let newState = [...mentorState];
    newState.splice(itemIndex, 1, {
      ...item,
      status: mentorship.status,
    });

    setMentorState(newState);
  };

  const [openApprovedModal] = useModal(
    <ApprovedModal
      username={selectedReq?.username}
      onClose={() => setSelectedReq(null)}
    />,
    [selectedReq?.id]
  );

  const [openDeclinedModal, closeDeclinedModal] = useModal(
    <DeclinedModal
      username={selectedReq?.username}
      onSave={declineReq}
      onClose={() => setSelectedReq(null)}
    />,
    [selectedReq?.id]
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
    getMentorshipReq();
  }, [userId, getMentorshipReq]);

  return (
    <Root hasReq={hasReq} data-testid="mentorship-req">
      <Card title="Mentorship Requests">
        <UsersList
          requests={mentorState}
          onAccept={acceptReq}
          onDeclined={onDeclinedReq}
          isLoading={loadingState}
          onSelect={markViewed}
          closeOpenItem={selectedReq?.id}
        />
      </Card>
      <Card title="My Mentorship Requests">
        <UsersList requests={menteeState} isLoading={loadingState} />
      </Card>
    </Root>
  );
};

MentorshipReq.propTypes = {};

export default MentorshipReq;
