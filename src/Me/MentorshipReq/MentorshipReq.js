import { useRef, useEffect, useState, useCallback } from 'react';
import { getMentorshipRequests, updateMentorshipReqStatus } from '../../api';
import Card from '../components/Card';
import { useUser } from '../../context/userContext/UserContext';
import { UsersList } from './UsersList';
import { STATUS } from '../../helpers/mentorship';
import { useModal } from '../../context/modalContext/ModalContext';
import { AcceptModal, DeclineModal } from '../Modals/MentorshipReqModals';

const PREV_STATUS = {
  [STATUS.viewed]: STATUS.new,
  [STATUS.approved]: STATUS.viewed,
  [STATUS.rejected]: STATUS.viewed,
};

const MentorshipReq = () => {
  const [mentorState, setMentorState] = useState();
  const [menteeState, setMenteeState] = useState();
  const [selectedReq, setSelectedReq] = useState(null);
  const { currentUser } = useUser();
  const userId = currentUser?._id;
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
    openAcceptModal();
  };
  const onDeclineReq = ({ id, status, username }) => {
    if (status !== PREV_STATUS[STATUS.rejected]) return;
    setSelectedReq({ id, username });
    openDeclineModal();
  };

  const declineReq = async msg => {
    await updateReqStatus({ id: selectedReq.id, userId }, STATUS.rejected, msg);
    closeDeclineModal();
  };

  const getMentorshipReq = useCallback(async () => {
    if (isMount.current) {
      const mentorshipReq = await getMentorshipRequests(userId);
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

  const [openAcceptModal] = useModal(
    <AcceptModal
      username={selectedReq?.username}
      onClose={() => setSelectedReq(null)}
    />,
    [selectedReq?.id]
  );

  const [openDeclineModal, closeDeclineModal] = useModal(
    <DeclineModal
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
    if (!userId) return;
    getMentorshipReq();
  }, [userId, getMentorshipReq]);
  return (
    <>
      <Card title="Mentorship Requests">
        <UsersList
          requests={mentorState}
          onAccept={acceptReq}
          onDecline={onDeclineReq}
          isLoading={loadingState}
          onSelect={markViewed}
          closeOpenItem={selectedReq?.id}
        />
      </Card>
      <Card title="My Mentorship Requests">
        <UsersList requests={menteeState} isLoading={loadingState} />
      </Card>
    </>
  );
};

MentorshipReq.propTypes = {};

export default MentorshipReq;
