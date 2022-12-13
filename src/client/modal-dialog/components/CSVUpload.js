import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import useUpload from '../hooks/useUpload';

const CSVUpload = () => {
  const { customers, solutions } = useUpload();

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formCustomer">
        <Form.Label>Customer</Form.Label>
        <Form.Control as="select">
          <option>Select a customer</option>
          {customers.map((customer, index) => (
            <option key={index} value={customer}>
              {customer}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formSolution">
        <Form.Label>Solution</Form.Label>
        <Form.Control as="select">
          <option>Select a solution</option>
          {solutions.map((solution, index) => (
            <option key={index} value={solution}>
              {solution}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit">
        Upload CSV
      </Button>
    </Form>
  );
};

export default CSVUpload;
