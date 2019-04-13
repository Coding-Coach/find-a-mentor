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
    const { content, onClose, policyTitle, handleModal } = this.props
    console.log("SEE STATE", this.state)
    return (
      <div>

      {/* <div>
      <Modal onClose={this.closeModal} title={modal.title}>
        {modal.content}
      </Modal>
      </div> */}


        <li onClick={() => {
          this.setState({
            modal: {
              title : policyTitle,
              content : <Content topic={content} />,
              onClose
            }
          }, () => {
            handleModal && handleModal(policyTitle, <Content topic={content} />, onClose)
          })
        }}>
        {policyTitle}
        </li>
      

{/* 
        <li onClick={() => this.openModal('Cookies Policy', <Content topic="cookies-policy" />)}>
          Cookies Policy
        </li>

        <li onClick={() =>
            this.openModal(
              'Code of Conduct',
              <Content topic="code-conduct" />
            )
          }
        >
          Code of Conduct
    </li>
        <li
          onClick={() =>
            this.openModal(
              'Terms & Conditions',
              <Content topic="terms-conditions" />
            )
          }
        >
          Terms & Conditions
    </li>
        <li
          onClick={() =>
            this.openModal(
              'Privacy Statement',
              <Content topic="privacy-policy" />
            )
          }
        >
          Privacy Statement
    </li> */}
      </div>
    )
  }
}