import React, { Component } from 'react';
import classNames from 'classnames';

export default class Modal extends Component {
  state = {
    isActive: false,
  };

  handleOpen = children => {
    this.setState({
      isActive: true,
      children,
    });
  };

  handleClose = () => {
    const { onClose } = this.props;

    this.setState({
      isActive: false,
    });

    if (typeof onClose === 'function') {
      onClose();
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.handleOpen(nextProps.children);
    }
  }

  onTransitionEnd = e => {
    if (!this.state.isActive) {
      this.setState({ children: null });
    }
  };

  render() {
    const { isActive, children } = this.state;
    const { title, size = '' } = this.props;
    return (
      <div
        className={classNames(['modal-container', size, { active: isActive }])}
        onTransitionEnd={this.onTransitionEnd}
      >
        <div className="modal-box">
          <button className="close" onClick={this.handleClose}>
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
          <div className="modal-head">
            <h2>{title || ''}</h2>
          </div>
          <div className="scroll-helper">
            <div className="modal-content">
              {children
                ? React.cloneElement(children, { onClose: this.handleClose })
                : ''}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
