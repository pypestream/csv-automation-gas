import React from 'react';
import ReactDOM from 'react-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import PypestreamLogo from './logo.svg';

const Sidebar = () => {
  return (
    <Container
      className="d-flex flex-column justify-content-center"
      style={{ height: '100vh' }}
    >
      <Row className="justify-content-center">
        <Col className="d-flex justify-content-center">
          <img
            src={PypestreamLogo}
            alt="pypestream-logo"
            style={{ width: '240px' }}
          />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col className="d-flex justify-content-center">
          <Card
            style={{
              width: '410px',
              margin: '1rem',
              padding: '30px',
              borderRadius: '5px',
              border: '1px solid rgba(0, 0, 0, 0.2)',
            }}
          >
            <Card.Body style={{ padding: 0 }}>
              <Card.Text
                style={{
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                Successfully Logged in to Pypestream
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

ReactDOM.render(<Sidebar />, document.getElementById('index'));
