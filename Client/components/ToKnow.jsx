/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Health from './Health.jsx';
import Rules from './Rules.jsx';
import ToKnowModal from './ToKnowModal.jsx';

const ToKnow = () => {
  const [showRules, setShowRules] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const [toKnow, setToKnow] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/toKnow/${id}`)
      .then(({ data }) => {
        setToKnow(data);
      })
      .catch((err) => console.log(err));
  });

  const { rules, health, cancelPolicy } = toKnow;
  const healthTitle = 'Health & Safety';

  const openModal = (e, cb) => {
    e.preventDefault();
    cb(true);
  };

  return !rules ? <div />
    : (
      <div>
        <br />
        <div id='toKnow-title'>Things to know</div>
        <br />
        <div id='toKnow-grid'>
          <div>
            <div className='Know-subtitle'>House rules</div>
            <Rules rules={rules.house} />
            <a href='#' className="a-loc" onClick={(e) => openModal(e, setShowRules)}>
              Show more
              <ChevronRightIcon />
            </a>
          </div>
          <div>
            <div className='Know-subtitle'>{healthTitle}</div>
            <Health health={health.safety} />
            <a href='#' className="a-loc" onClick={(e) => openModal(e, setShowSafety)}>
              Show more
              <ChevronRightIcon />
            </a>
          </div>
          <div>
            <div className='Know-subtitle'>Cancellation policy</div>
            {cancelPolicy.map((line) => <div className='rule' key={line}>{line}</div>)}
            <a href='#' className="a-loc" onClick={(e) => openModal(e, setShowCancel)}>
              More details
              <ChevronRightIcon />
            </a>
          </div>
        </div>
        <br />
        <hr />
        <ToKnowModal
          whatToKnow={rules}
          show={showRules}
          close={() => setShowRules(false)}
        />
        <ToKnowModal
          whatToKnow={health}
          show={showSafety}
          close={() => setShowSafety(false)}
        />
        <ToKnowModal
          whatToKnow={cancelPolicy}
          show={showCancel}
          close={() => setShowCancel(false)}
        />
      </div>
    );
};

export default ToKnow;
