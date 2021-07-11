import { getAvatarUrl } from '../../helpers/avatar';
import ReqContent from './ReqContent';
import { formatRequestTime, Status } from '../../helpers/mentorship';
import { RichList, RichItem } from '../components/RichList';
import { Loader } from '../../components/Loader';
import styled from 'styled-components';
import { STATUS } from '../../helpers/mentorship';
import { ReactComponent as UserWasRemovedIcon } from '../../assets/me/icon-user-remove.svg';
import { MentorshipRequest } from '../../types/models';
import { useExpendableRichItems } from '../components/RichList/RichList';
import { RichItemTagTheme } from '../components/RichList/ReachItemTypes';

const Spinner = styled(Loader)`
  position: absolute;
  left: calc(50% - 10px);
`;

const UserWasRemoved = styled.div`
  display: grid;
  grid-template-columns: 21px auto;
  align-items: center;
  grid-gap: 10px;
  height: 40px;
`;

type MentorshipRequestOnResponsePayload = {
  id: string;
  status: Status;
  username: string;
};

type MentorshipRequestOnSelectPayload = {
  id: string;
  status: Status;
};

type UsersListProps = {
  isLoading: boolean;
  requests: MentorshipRequest[];
  onSelect(params: MentorshipRequestOnSelectPayload): void;
  onDecline(params: MentorshipRequestOnResponsePayload): Promise<void>;
  onAccept(params: MentorshipRequestOnResponsePayload): Promise<void>;
  onCancel(params: MentorshipRequestOnResponsePayload): Promise<void>;
};

type RenderListPayload = UsersListProps & {
  expandId: string;
};

const STATUS_THEME: { [key in Status]: RichItemTagTheme } = {
  [STATUS.approved]: 'primary',
  [STATUS.cancelled]: 'cancelled',
  [STATUS.new]: 'secondary',
  [STATUS.rejected]: 'danger',
  [STATUS.viewed]: 'checked',
} as const;

const renderList = ({
  requests,
  expandId,
  onSelect,
  onAccept,
  onDecline,
  onCancel,
  isLoading,
}: RenderListPayload) =>
  requests?.map(
    ({
      id,
      status,
      date,
      message,
      background,
      expectation,
      isMine,
      mentee,
      mentor,
    }) => {
      const user = isMine ? mentor : mentee;
      if (!user) {
        return (
          <li key={id}>
            <UserWasRemoved>
              <UserWasRemovedIcon />
              User was removed
            </UserWasRemoved>
          </li>
        );
      }
      const username = user.name;
      return (
        <li key={id}>
          <RichItem
            id={id}
            avatar={getAvatarUrl(user.avatar)}
            title={user.name}
            subtitle={user.title}
            onClick={() => {
              onSelect({ id, status });
            }}
            expand={id === expandId}
            tag={{
              value: status,
              theme: STATUS_THEME[status],
            }}
            info={formatRequestTime(new Date(date))}
          >
            <ReqContent
              status={status}
              message={message}
              isLoading={isLoading}
              background={background}
              expectation={expectation}
              menteeEmail={mentee.email}
              onAccept={
                onAccept ? () => onAccept({ id, status, username }) : null
              }
              onDecline={
                onDecline ? () => onDecline({ id, status, username }) : null
              }
              onCancel={
                onCancel ? () => onCancel({ id, status, username }) : null
              }
            />
          </RichItem>
        </li>
      );
    }
  );

export const UsersList = ({
  isLoading,
  requests,
  onAccept,
  onDecline,
  onCancel,
  onSelect: onItemSelect,
}: UsersListProps) => {
  const { expandId, onSelect } = useExpendableRichItems();

  if (!isLoading && !(requests?.length > 0)) {
    return <p>No requests</p>;
  }

  return (
    <>
      {isLoading && <Spinner />}
      <RichList>
        {renderList({
          requests,
          expandId,
          isLoading,
          onAccept,
          onDecline,
          onCancel,
          onSelect: (item: MentorshipRequestOnSelectPayload) => {
            onItemSelect?.(item);
            onSelect?.(item.id);
          },
        })}
      </RichList>
    </>
  );
};
