import React, { useRef, useEffect, useState, useContext } from 'react';
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
  const [state, setState] = useState();
  const [selectedReq, setSelectedReq] = useState(null);
  const { currentUser, updateUser } = useContext(UserContext);
  const userId = currentUser?._id;
  const hasReq = state?.length > 0;
  const [loadingState, setLoadingState] = useState(!state);
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

  const setMentorshipReq = async () => {
    const mentorshipReq = await getMentorshipRequests(userId);

    if (isMount.current) {
      updateUser({ ...currentUser, mentorshipReq });
      setState(mentorshipReq);
      setLoadingState(false);
    }
  };

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

    const itemIndex = state.findIndex(s => s.id === id);
    const item = state[itemIndex];
    let newState = [...state];
    newState.splice(itemIndex, 1, {
      ...item,
      status: mentorship.status,
    });

    setState(newState);
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
    setMentorshipReq();
  }, [userId]);

  return (
    <Root hasReq={hasReq} data-testid="mentorship-req">
      <Card title="Mentorship Requests">
        <UsersList
          requests={state}
          onAccept={acceptReq}
          onDeclined={onDeclinedReq}
          isLoading={loadingState}
          onSelect={markViewed}
          closeOpenItem={selectedReq?.id}
        />
      </Card>
    </Root>
  );
};

MentorshipReq.propTypes = {};

export default MentorshipReq;
