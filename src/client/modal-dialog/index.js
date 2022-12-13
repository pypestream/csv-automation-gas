import React from 'react';
import ReactDOM from 'react-dom';
import { CSVUpload } from './components';
import './styles.css';

const App = ({ ...props }) => {
  return (
    <>
      <CSVUpload {...props} />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('index'));
