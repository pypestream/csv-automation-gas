import React from 'react';
import ReactDOM from 'react-dom';
import { CustomersList } from './components';
import './styles.css';

const App = ({ ...props }) => {
  return (
    <>
      <CustomersList {...props} />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('index'));
