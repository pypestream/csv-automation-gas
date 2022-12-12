import React from 'react';
import ReactDOM from 'react-dom';
import { CustomersList } from './components';
import './styles.css';

const ModalDialog = ({ ...props }) => {
  return (
    <>
      <CustomersList {...props} />
    </>
  );
};

ReactDOM.render(<ModalDialog />, document.getElementById('index'));
