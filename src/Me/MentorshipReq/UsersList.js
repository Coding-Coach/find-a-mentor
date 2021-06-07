import React from 'react';
import { getAvatarUrl } from '../../helpers/avatar';
import ReqContent from './ReqContent';
import { formatRequestTime } from '../../helpers/mentorship';
import { RichList, RichItem } from '../components/RichList';
import { Loader } from '../../components/Loader';
import styled from 'styled-components';
import { STATUS } from '../../helpers/mentorship';
import { ReactComponent as UserWasRemovedIcon } from '../../assets/me/icon-user-remove.svg';

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

const STATUS_THEME = {
  [STATUS.approved]: 'primary',
  [STATUS.cancelled]: 'disabled',
  [STATUS.new]: 'secondary',
  [STATUS.rejected]: 'danger',
  [STATUS.viewed]: 'checked',
};

const renderList = ({
  requests,
  expandId,
  onSelect,
  onAccept,
  onDeclined,
  isLoading,
}) =>
  requests?.map(
    ({
      id,
      status,
      date,
      message,
      background,
      expectation,
      isMine,
      ...props
    }) => {
      const user = isMine ? props.mentor : props.mentee;
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
            info={formatRequestTime(Date.parse(date))}
          >
            <ReqContent
              menteeEmail={props.mentee.email}
              status={status}
              isLoading={isLoading}
              isMine={isMine}
              {...{ message, background, expectation }}
              onAccept={() => onAccept({ id, status, username })}
              onDeclined={() => onDeclined({ id, status, username })}
            />
          </RichItem>
        </li>
      );
    }
  );

const UsersList = ({ isLoading, closeOpenItem, ...props }) => {
  if (!isLoading && !(props.requests?.length > 0)) return <p>No requests</p>;
  return (
    <>
      {isLoading && <Spinner />}
      <RichList
        closeOpenItem={closeOpenItem}
        render={({ onSelect, expandId }) =>
          renderList({
            ...props,
            isLoading,
            onSelect: item => {
              props?.onSelect && props.onSelect(item);
              onSelect && onSelect(item.id);
            },
            expandId,
          })
        }
      />
    </>
  );
};

UsersList.propTypes = {};

export default UsersList;
