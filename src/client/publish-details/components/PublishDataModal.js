import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

import usePublishDetails from '../hooks/usePublishDetails';

const PublishDataModal = () => {
  const {
    customersLoading,
    solutionsLoading,
    customers,
    solutions,
    selectedCustomer,
    selectedSolution,
    toastMessage,
    handleCustomerChange,
    handleSolutionChange,
    handleSavePublishData,
    handleCloseToast,
  } = usePublishDetails();

  const handleSubmit = async () => {
    await handleSavePublishData();
  };

  return (
    <Form onSubmit={handleSubmit}>
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
      <Form.Group
        className="mb-3 position-relative"
        controlId="formCustomer"
        style={{ width: '400px' }}
      >
        <Form.Label>Customer</Form.Label>
        <Form.Control
          as="select"
          className="mx-1"
          disabled={customersLoading}
          value={selectedCustomer?.id || ''}
          onChange={handleCustomerChange}
        >
          <option key="default-cust-0" value="">
            Select a customer
          </option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </Form.Control>
        {customersLoading && (
          <Spinner
            animation="border"
            variant="primary"
            size="sm"
            className="position-absolute"
            style={{
              top: '44px',
              right: '0.5rem',
            }}
          />
        )}
      </Form.Group>
      <Form.Group
        className="mb-3 position-relative"
        controlId="formSolution"
        style={{ width: '400px' }}
      >
        <Form.Label>Solution</Form.Label>
        <Form.Control
          as="select"
          className="mx-1"
          disabled={solutionsLoading || customersLoading || !selectedCustomer}
          value={selectedSolution || ''}
          onChange={handleSolutionChange}
        >
          <option key="default-sol-0" value="">
            Select a solution
          </option>
          {solutions.map((solution, index) => (
            <option key={index} value={solution}>
              {solution}
            </option>
          ))}
        </Form.Control>
        {solutionsLoading && (
          <Spinner
            animation="border"
            variant="primary"
            size="sm"
            className="position-absolute"
            style={{
              top: '44px',
              right: '0.5rem',
            }}
          />
        )}
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        disabled={
          customersLoading ||
          solutionsLoading ||
          !selectedCustomer ||
          !selectedSolution
        }
      >
        Save Publish Settings
      </Button>
    </Form>
  );
};

export default PublishDataModal;
