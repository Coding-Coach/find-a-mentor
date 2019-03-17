import React from 'react';
import { Modal, Button } from 'semantic-ui-react'

const ModalNew = (props) => (
  // var {page, titles} = props
  // console.log('props', props)
  // return (
    <Modal open={props.open}>
      <Modal.Header
        className='px-6 pt-6 pb-5 border-b border-secondary-lightest min-h-20'>
        <h2 className="text-primary text-2xl m-0 uppercase fjalla-one-regular font-titles font-normal tracking-wide">
          {props.titles[props.page]}
        </h2>
      </Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          {props.children}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='teal' size="small" onClick={props.onClose}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  // )
)

export default ModalNew
