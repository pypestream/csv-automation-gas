import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

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
      {!!toastMessage && (
        <Alert
          variant={toastMessage.type}
          onClose={handleCloseToast}
          dismissible
        >
          <Alert.Heading>
            <strong className="mr-auto">{toastMessage.title}</strong>
          </Alert.Heading>
          <p>{toastMessage.description}</p>
        </Alert>
      )}
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
      <Form.Group className="mb-3" controlId="formEnv">
        <Form.Label>Environment</Form.Label>
        <Form.Control as="select" onChange={handleSolutionChange}>
          <option value="sandbox">Sandbox</option>
          <option value="live">Live</option>
        </Form.Control>
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        disabled={dataLoading || !selectedCustomer || !selectedSolution}
      >
        Publish
      </Button>
    </Form>
  );
};

export default CSVUpload;
