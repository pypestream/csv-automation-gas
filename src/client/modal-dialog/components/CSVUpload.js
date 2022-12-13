import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';

import useUpload from '../hooks/useUpload';

const CSVUpload = () => {
  const {
    dataLoading,
    customers,
    solutions,
    selectedCustomer,
    selectedSolution,
    toastMessage,
    handleCustomerChange,
    handleSolutionChange,
    handleUploadCSV,
    handleCloseToast,
  } = useUpload();

  return (
    <Form onSubmit={handleUploadCSV}>
      <Form.Group className="mb-3" controlId="formCustomer">
        <Form.Label>Customer</Form.Label>
        <Form.Control
          as="select"
          disabled={dataLoading}
          onChange={handleCustomerChange}
        >
          <option>Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formSolution">
        <Form.Label>Solution</Form.Label>
        <Form.Control
          as="select"
          disabled={dataLoading || !selectedCustomer}
          onChange={handleSolutionChange}
        >
          <option>Select a solution</option>
          {solutions.map((solution, index) => (
            <option key={index} value={solution}>
              {solution}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      {!!toastMessage && (
        <Toast bg={toastMessage.type} onClose={handleCloseToast}>
          <Toast.Header>
            <strong className="mr-auto">{toastMessage.title}</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage.description}</Toast.Body>
        </Toast>
      )}
      <Button
        variant="primary"
        type="submit"
        disabled={dataLoading || !selectedCustomer || !selectedSolution}
      >
        Upload CSV
      </Button>
    </Form>
  );
};

export default CSVUpload;
