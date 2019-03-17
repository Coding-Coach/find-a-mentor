import React from 'react';
import ReactDOM from 'react-dom';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = document.createElement('div');
    document.body.appendChild(this.modal);
  }

  componentDidMount() {
    document.body.classList.add('overflow-hidden');
  }

  componentWillUnmount() {
    const { body } = document;

    body.removeChild(this.modal);
    body.classList.remove('overflow-hidden');
  }

  render() {
    return ReactDOM.createPortal(this._renderModal(), this.modal);
  }

  _renderModal() {
    const { onClose } = this.props;

    return (
      <div
        className="fixed pin w-full h-full bg-modal flex items-center justify-center z-20"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative pt-10 pb-10 pl-5 pr-5 w-full md:w-auto md:max-w-md lg:max-w-lg xl:max-w-xl"
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Modal;