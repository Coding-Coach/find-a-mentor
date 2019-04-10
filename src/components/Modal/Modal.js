import React, { Component } from 'react';

import './Modal.css';

export default class Modal extends Component {
  state = {
    isActive: false,
  };

  handleOpen = () => {
    this.setState({
      isActive: true
    });
  }

  handleClose = () => {
    const { onClose } = this.props;

    this.setState({
      isActive: false
    });

    if (typeof onClose === 'function') {
      onClose();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.handleOpen();
    }
  }

  render() {
    const { isActive } = this.state;
    const { children, title } = this.props;

    return (
      <div className={`modal-container ${isActive ? 'active' : ''}`}>
        <div className="modal-box">
          <button className="close" onClick={this.handleClose}>x</button>
          <div className="modal-head"><h2>{title || ''}</h2></div>
          <div className="modal-content">{children || ''}</div>
        </div>
      </div>
    );
  }
}
