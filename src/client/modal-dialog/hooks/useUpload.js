/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { getCustomers, getCustomer, getBotsData, getBotVersion } from '../apis';

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
    try {
      /** Instructions
       * 1. Get solution details.
       * 2. Prepare CSV files.
       * 3. Compile Template
       * 4. Update bot configuration like bot type (main or survey) and language.
       * 5. In case of survey, update the streams.
       * 6. Deploy version
       * 7. upload default NLU Data
       * */
      // 1. Get solution details.
      let botData = {};
      const bot = await getBotsData(selectedCustomer, selectedSolution);
      botData = { ...bot.data };
      const maxVersion = Math.max(
        ...bot.data.versions.map((v) => Number(v.substr(1)))
      );
      const botVersion = await getBotVersion(
        selectedSolution,
        `v${maxVersion}`
      );
      botData.latestVersion = botVersion.data;
      // 2. Prepare CSV files.
    } catch (error) {
      console.error(error);
    }
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
