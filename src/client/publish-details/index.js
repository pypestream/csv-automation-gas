import React from 'react';
import ReactDOM from 'react-dom';
import { PublishDataModal } from './components';

const PublishDetails = ({ ...props }) => {
  return (
    <>
      <PublishDataModal {...props} />
    </>
  );
};

ReactDOM.render(<PublishDetails />, document.getElementById('index'));
