import React, { Component } from 'react';
import Content from '../Content/Content';

export default class ModalContent extends Component {
  state = {
    modal: {
      title: null,
      content: null,
      onClose: null,
    },
  };

  render() {
    const { content, onClose, policyTitle, handleModal } = this.props;
    return (
      <li
        onClick={() => {
          this.setState(
            {
              modal: {
                title: policyTitle,
                content: <Content topic={content} />,
                onClose,
              },
            },
            () => {
              handleModal &&
                handleModal(policyTitle, <Content topic={content} />, onClose);
            }
          );
        }}
      >
        {policyTitle}
      </li>
    );
  }
}
