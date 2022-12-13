import React from 'react';
import ReactDOM from 'react-dom';
import { serverFunctions } from '../utils/serverFunctions';

const Sidebar = () => {
  const handleClick = async () => {
    try {
      const url = await serverFunctions.authorizeSidebar();
      if (url) {
        window.open(url, '_blank');
        await serverFunctions.closeSidebar();
        await serverFunctions.openDialog();
      }
    } catch (err) {
      // eslint-disable-next-line no-undef
      Logger.log(err.message);
      console.log(err.message);
      await serverFunctions.closeSidebar();
    }
  };
  return (
    <div>
      <p className="header">First we need to Authorize with our API.</p>
      <button className="btn" id="btn" onClick={handleClick}>
        Authorize
      </button>
    </div>
  );
};

ReactDOM.render(<Sidebar />, document.getElementById('index'));
