import { useRef, useEffect, useState, useCallback } from 'react';
import { getMentorshipRequests, updateMentorshipReqStatus } from '../../api';
import Card from '../components/Card';
import { useUser } from '../../context/userContext/UserContext';
import { UsersList } from './UsersList';
import { STATUS } from '../../helpers/mentorship';
import { useModal } from '../../context/modalContext/ModalContext';
import {
  AcceptModal,
  DeclineModal,
  CancelModal,
} from '../Modals/MentorshipRequestModals';

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

    await updateReqStatus({ id, userId }, STATUS.approved);
    setSelectedReq({ id, username });
    openAcceptModal();
  };

  const onCancel = ({ id, username }) => {
    setSelectedReq({ id, username });
    openCancelModal();
  };

  const cancelRequest = async message => {
    await updateReqStatus(
      { id: selectedReq.id, userId },
      STATUS.cancelled,
      message,
      'mentee'
    );
    closeCancelModal();
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
  /**
   * @param  {import('../../types/models').User} user
   * @param  {import('../../helpers/mentorship').Status} nextStatus
   * @param  {string} reason
   * @param  {'mentee' | 'mentor'} listType
   */
  const updateReqStatus = async (
    { id, userId },
    nextStatus,
    reason,
    listType = 'mentor'
  ) => {
    const { success, mentorship } = await updateMentorshipReqStatus(
      id,
      userId,
      {
        status: nextStatus,
        reason,
      }
    );

    if (!success) return;

    const [list, setList] =
      listType === 'mentor'
        ? [mentorState, setMentorState]
        : [menteeState, setMenteeState];

    const itemIndex = list.findIndex(s => s.id === id);
    const item = list[itemIndex];
    let newState = [...list];
    newState.splice(itemIndex, 1, {
      ...item,
      status: mentorship.status,
    });

    setList(newState);
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

  const [openCancelModal, closeCancelModal] = useModal(
    <CancelModal
      username={selectedReq?.username}
      onSave={cancelRequest}
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
        <UsersList
          requests={menteeState}
          isLoading={loadingState}
          onCancel={onCancel}
        />
      </Card>
    </>
  );
};

MentorshipReq.propTypes = {};

export default MentorshipReq;
