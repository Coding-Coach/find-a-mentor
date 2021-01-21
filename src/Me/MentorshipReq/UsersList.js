import React from 'react';
import PropTypes from 'prop-types';
import { getAvatarUrl } from '../../helpers/avatar';
import ReqContent from './ReqContent';
import { formatRequestTime } from '../../helpers/mentorship';
import { RichList, RichItem } from '../components/RichList';
import { Loader } from '../../components/Loader';
import styled from 'styled-components';
import { STATUS } from '../../helpers/mentorship';

const Spinner = styled(Loader)`
  position: absolute;
  left: calc(50% - 10px);
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
  requests.map(
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
      return (
        <RichItem
          id={id}
          key={id}
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
            status={status}
            isLoading={isLoading}
            {...{ message, background, expectation }}
            onAccept={() => onAccept({ id, status, user })}
            onDeclined={() => onDeclined({ id, status, user })}
          />
        </RichItem>
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
              props?.onSelect(item);
              onSelect(item.id);
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
