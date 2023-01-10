import { useState, useEffect } from 'react';
import { getCustomers, getCustomer } from '../../apis';
import { serverFunctions } from '../../utils';

const usePublishDetails = () => {
  const [customers, setCustomers] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [solutionsLoading, setSolutionsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const loadCustomers = async () => {
    try {
      setCustomersLoading(true);
      const resData = await getCustomers();
      setCustomers([...resData.sort((a, b) => a.name.localeCompare(b.name))]);
    } catch (error) {
      console.error(error);
      setCustomers([]);
    } finally {
      setCustomersLoading(false);
    }
  };

  const loadSolutions = async (customer) => {
    try {
      setSolutionsLoading(true);
      const resData = await getCustomer(customer);
      setSolutions(resData.data.bots);
    } catch (error) {
      console.error(error);
      setSolutions([]);
    } finally {
      setSolutionsLoading(false);
    }
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const customer = customers.find((c) => c.id === customerId);
    setSelectedCustomer({ ...customer });
  };

  const handleSolutionChange = (e) => {
    setSelectedSolution(e.target.value);
  };

  const handleSavePublishData = async () => {
    await serverFunctions.savePublishDetails({
      customerName: selectedCustomer.name,
      solutionName: selectedSolution,
    });
    setToastMessage({
      title: 'Success',
      description: 'Publish Data saved successfully',
      type: 'success',
    });
    setTimeout(() => {
      handleCloseToast();
    }, 5000);
    await serverFunctions.closeModal();
  };

  const handleCloseToast = () => {
    setToastMessage(null);
  };

  useEffect(() => {
    if (selectedCustomer) {
      loadSolutions(selectedCustomer.name);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    loadCustomers();
  }, []);

  return {
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
  };
};

export default usePublishDetails;
