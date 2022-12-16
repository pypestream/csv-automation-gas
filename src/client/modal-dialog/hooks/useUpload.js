import { useState, useEffect } from 'react';
import {
  getCustomers,
  getCustomer,
  getBotHistory,
  getBotsData,
  getBotsEnv,
} from '../apis';

const useUpload = () => {
  const [customers, setCustomers] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const loadCustomers = async () => {
    try {
      setDataLoading(true);
      const resData = await getCustomers();
      setCustomers([...resData.sort((a, b) => a.name.localeCompare(b.name))]);
    } catch (error) {
      console.log(error);
      setCustomers([]);
    } finally {
      setDataLoading(false);
    }
  };

  const loadSolutions = async (customer) => {
    try {
      setDataLoading(true);
      const resData = await getCustomer(customer);
      setSelectedCustomerDetails({ ...resData.data });
      setSolutions(resData.data.bots);
    } catch (error) {
      console.log(error);
      setSolutions([]);
    } finally {
      setDataLoading(false);
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

  const handleUploadCSV = async () => {
    const bot = await getBotsData(selectedCustomer, selectedSolution);
    const envs = await getBotsEnv(selectedCustomer, selectedSolution);
    const botHistory = await getBotHistory(selectedCustomer, selectedSolution);
    // Need further implementation to get versions, file related data.
    console.log(bot, envs, botHistory);
    setToastMessage({
      type: 'success',
      title: 'Success',
      description: "You've successfully uploaded CSV.",
    });
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
    dataLoading,
    customers,
    solutions,
    selectedCustomer,
    selectedSolution,
    toastMessage,
    selectedCustomerDetails,
    handleCustomerChange,
    handleSolutionChange,
    handleUploadCSV,
    handleCloseToast,
  };
};

export default useUpload;
