import { useRef, useEffect, useState, useCallback } from 'react';
import Card from '../components/Card';
import { useApi } from '../../context/apiContext/ApiContext';
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
  const api = useApi();

  const markViewed = async ({ _id, status }) => {
    if (status !== PREV_STATUS[STATUS.viewed]) return;
    await updateReqStatus({ _id, userId }, STATUS.viewed);
  };
  const acceptReq = async ({ _id, status, username, menteeEmail }) => {
    if (status !== PREV_STATUS[STATUS.approved]) return;

    await updateReqStatus({ _id, userId }, STATUS.approved);
    setSelectedReq({ _id, username, menteeEmail });
    openAcceptModal();
  };

  const onCancel = ({ _id, username }) => {
    setSelectedReq({ _id, username });
    openCancelModal();
  };

  const cancelRequest = async (message) => {
    await updateReqStatus(
      { _id: selectedReq._id, userId },
      STATUS.cancelled,
      message,
      'mentee'
    );
    closeCancelModal();
  };

  const onDeclineReq = ({ _id, status, username }) => {
    if (status !== PREV_STATUS[STATUS.rejected]) return;
    setSelectedReq({ _id, username });
    openDeclineModal();
  };

  const declineReq = async (msg) => {
    await updateReqStatus({ _id: selectedReq._id, userId }, STATUS.rejected, msg);
    closeDeclineModal();
  };

  const getMentorshipReq = useCallback(async () => {
    if (isMount.current) {
      const mentorshipReq = await api.getMentorshipRequests(userId);
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
    { _id, userId },
    nextStatus,
    reason,
    listType = 'mentor'
  ) => {
    const { success, data: mentorship } = await api.updateMentorshipReqStatus(
      _id,
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

    const itemIndex = list.findIndex((s) => s._id === _id);
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
      menteeEmail={selectedReq?.menteeEmail}
      onClose={() => setSelectedReq(null)}
    />,
    [selectedReq?._id]
  );

  const [openDeclineModal, closeDeclineModal] = useModal(
    <DeclineModal
      username={selectedReq?.username}
      onSave={declineReq}
      onClose={() => setSelectedReq(null)}
    />,
    [selectedReq?._id]
  );

  const [openCancelModal, closeCancelModal] = useModal(
    <CancelModal
      username={selectedReq?.username}
      onSave={cancelRequest}
      onClose={() => setSelectedReq(null)}
    />,
    [selectedReq?._id]
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
      <Card title="Mentorship Requests I've Received">
        <UsersList
          requests={mentorState}
          onAccept={acceptReq}
          onDecline={onDeclineReq}
          isLoading={loadingState}
          onSelect={markViewed}
          closeOpenItem={selectedReq?._id}
        />
      </Card>
      <Card title="Mentorship Requests I've Sent">
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
