import React from 'react';
import PropTypes from 'prop-types';
import { getAvatarUrl } from '../../helpers/avatar';
import ReqContent from './ReqContent';
import { formatRequestTime } from '../../helpers/mentorship';
import { RichList, RichItem } from '../components/RichList';
import { Loader } from '../../components/Loader';
import styled from 'styled-components';

const Spinner = styled(Loader)`
  position: absolute;
  left: calc(50% - 10px);
`;

const STATUS_THEME = {
  Approved: 'primary',
  Cancelled: 'disabled',
  New: 'secondary',
  Rejected: 'danger',
  Viewed: 'checked',
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
            isLoading={isLoading}
            {...{ message, background, expectation }}
            onAccept={() => onAccept({ id, user })}
            onDeclined={() => onDeclined({ id, user })}
          />
        </RichItem>
      );
    }
  );

const UsersList = ({ isLoading, closeOpenItem, ...props }) => {
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
