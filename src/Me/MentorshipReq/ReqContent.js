import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '../components/Button';
import { STATUS } from '../../helpers/mentorship';

const Block = styled.div`
  & + div {
    margin-top: 24px;
  }
  h4 {
    font-weight: bold;
    color: #828282;
  }

  p {
    margin: 4px 0;
    color: #4f4f4f;
  }
`;

const CallToAction = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  > button {
    width: 110px;
    height: 36px;
    border-radius: 3px;
    margin: 0;

    & + button {
      margin-left: 8px;
    }
  }
`;

const ReqContent = ({
  message,
  background,
  expectation,
  status,
  onAccept,
  onDeclined,
  isLoading,
  isMine,
}) => {
  const hideBtns =
    isMine || [STATUS.approved, STATUS.rejected].includes(status);
  return (
    <div data-testid="request-content">
      <Block>
        <h4>Message</h4>
        <p>{message}</p>
      </Block>
      {background && (
        <Block>
          <h4>Background</h4>
          <p>{background}</p>
        </Block>
      )}
      {expectation && (
        <Block>
          <h4>Expectations</h4>
          <p>{expectation}</p>
        </Block>
      )}
      {hideBtns ? null : (
        <CallToAction>
          <Button skin="secondary" onClick={onDeclined}>
            Declined
          </Button>
          <Button skin="primary" onClick={onAccept} isLoading={isLoading}>
            Accept
          </Button>
        </CallToAction>
      )}
    </div>
  );
};

ReqContent.propTypes = {
  message: PropTypes.string.isRequired,
  background: PropTypes.string,
  expectation: PropTypes.string,
  onAccept: PropTypes.func.isRequired,
  onDeclined: PropTypes.func.isRequired,
};

export default ReqContent;
