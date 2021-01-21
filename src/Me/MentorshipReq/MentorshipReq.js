import React, { useRef, useEffect, useState, useContext } from 'react';
import {
  getMentorshipRequests,
  getCurrentUser,
  updateMentorshipReqStatus,
} from '../../api';
import RichList from '../components/RichList';
import Card, { Content } from '../components/Card';
import styled from 'styled-components';
import UserContext from '../../context/userContext/UserContext';
import { ReqContent, UsersList } from './';
import { Loader } from '../../components/Loader';
import { formatRequestTime } from '../../helpers/mentorship';
import { toast } from 'react-toastify';
import messages from '../../messages';
import { getAvatarUrl } from '../../helpers/avatar';
import { useModal } from '../../context/modalContext/ModalContext';
import {
  MentorApprovedModal as ApprovedModal,
  DeclinedModal,
} from '../Modals/MentorshipReqModals';

const Root = styled.div`
  ${({ hasReq }) => hasReq && Content} {
    padding-left: 0;
    padding-right: 0;
  }
`;

const Spinner = styled(Loader)`
  position: absolute;
  left: calc(50% - 10px);
`;
export const STATUS = {};
const STATUS_THEME = {
  Approved: 'primary',
  Cancelled: 'disabled',
  New: 'secondary',
  Rejected: 'danger',
  Viewed: 'checked',
};

Object.keys(STATUS_THEME).forEach(key => (STATUS[key.toLowerCase()] = key));

export const NEXT_STATUS = {
  ...STATUS,
  New: 'Viewed',
  // Approved: 'Cancelled',
  Viewed: null,
};

const MentorshipReq = () => {
  const [state, setState] = useState();
  const [selectedReq, setSelectedReq] = useState(null);
  const { currentUser, updateUser } = useContext(UserContext);
  const userId = currentUser?._id;
  const hasReq = state?.length > 0;
  // const isLoading = !state;
  const [loadingState, setLoadingState] = useState(!state);
  const isMount = useRef(true);

  const acceptReq = async ({ id, name: username }) => {
    setLoadingState(true);
    await updateReqStatus({ id, userId, status: STATUS.approved });
    setLoadingState(false);
    setSelectedReq({ username });
    openApprovedModal();
  };
  const onDeclinedReq = (id, { name: username }) => {
    setSelectedReq({ id, username });
    openDeclinedModal();
  };

  const declineReq = async msg => {
    //await
    // closeDeclinedModal();
  };

  const setMentorshipReq = async () => {
    const mentorshipReq = await getMentorshipRequests(userId);

    if (isMount.current) {
      updateUser({ ...currentUser, mentorshipReq });
      // setState(mapData(mentorshipReq));
      setState(mentorshipReq);
      setLoadingState(false);
    }
  };

  const updateReqStatus = async ({ id, status, userId }, reason) => {
    console.log(id, status);
    // const nextStatus = NEXT_STATUS[status];
    if (status === STATUS.viewed) return;

    const { success, mentorship } = await updateMentorshipReqStatus(
      id,
      userId,
      {
        status: status,
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

  const render = () => {
    if (!hasReq && loadingState) return <Spinner />;

    if (hasReq)
      return (
        <UsersList
          requests={state}
          onAccept={acceptReq}
          onDeclined={onDeclinedReq}
          isLoading={loadingState}
          onSelect={updateReqStatus}
          closeOpenItem={selectedReq?.username}
        />
      );
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
