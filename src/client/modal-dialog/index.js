import React from 'react';
import ReactDOM from 'react-dom';
import { CSVUpload } from './components';
import './styles.css';

const ModalDialog = ({ ...props }) => {
  return (
    <>
      <CSVUpload {...props} />
    </>
  );
};

ReactDOM.render(<ModalDialog />, document.getElementById('index'));
