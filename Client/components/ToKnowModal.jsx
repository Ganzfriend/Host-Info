import React from 'react';
import { Modal } from 'react-bootstrap';
import CloseIcon from '@material-ui/icons/Close';
import Health from './Health.jsx';
import Rules from './Rules.jsx';

const ToKnowModal = ({ whatToKnow, show, close }) => {
  let title = 'House rules';
  let subTitle = 'Additional rules';
  let mainShow = <Rules rules={whatToKnow.house} />;
  let subShow = <Rules rules={whatToKnow.additional} />;
  const { Body, Title } = Modal;

  if (whatToKnow.safety) {
    title = 'Health & Safety';
    subTitle = 'You must also acknowledge';
    mainShow = <Health health={whatToKnow.safety} />;
    subShow = <Health health={whatToKnow.acknowledge} />;
  }
  if (Array.isArray(whatToKnow)) {
    title = 'Cancellation Policy';
    [subTitle] = whatToKnow;
    mainShow = '';
    [, subShow] = whatToKnow;
  }

  return (
    <Modal
      show={show}
      onHide={close}
      centered
      animation
    >
      <div id='close-modal'>
        <button type='button' onClick={close}>
          <CloseIcon fontSize='small' />
        </button>
      </div>
      <Body>
        <Title>{title}</Title>
        {mainShow}
        <div id='modal-subtitle'>
          {subTitle}
        </div>
        {subShow}
      </Body>
    </Modal>
  );
};

export default ToKnowModal;
