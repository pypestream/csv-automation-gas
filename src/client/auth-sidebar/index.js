import React from 'react';
import ReactDOM from 'react-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { serverFunctions } from '../utils/serverFunctions';
import PypestreamLogo from './logo.svg';

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
    <div
      className="d-flex flex-column align-items-center"
      style={{ marginTop: '150px' }}
    >
      <img
        src={PypestreamLogo}
        alt="pypestream-logo"
        style={{ width: '240px' }}
      />
      <Card
        style={{
          margin: '1rem',
          padding: '30px',
          borderRadius: '5px',
          border: '1px solid rgba(0, 0, 0, 0.2)',
        }}
      >
        <Card.Body style={{ padding: 0, marginBottom: '30px' }}>
          <Card.Text
            style={{ textAlign: 'center', fontSize: '16px', fontWeight: 500 }}
          >
            First we need to Authorize with our API.
          </Card.Text>
        </Card.Body>
        <Button
          variant="primary"
          onClick={handleClick}
          style={{
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #0067f3',
            backgroundColor: '#0067f3',
          }}
        >
          Authorize
        </Button>
      </Card>
    </div>
  );
};

ReactDOM.render(<Sidebar />, document.getElementById('index'));
