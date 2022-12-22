/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  getCustomers,
  getCustomer,
  getBotsData,
  getBotVersion,
  getNLUFileFromServer,
  compileTemplate,
} from '../apis';
import { serverFunctions } from '../../utils/serverFunctions';
import { getIntentFormat } from '../utils';

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

  const getNLUData = async (latestVersion) => {
    // 1. bot.csv
    const botCSV = await serverFunctions.createCSVFromSheet();
    const botBlob = await serverFunctions.createBlob(
      botCSV,
      'text/xml',
      'bot.csv'
    );
    // 2. intent.csv
    const intentCSV = await getNLUFileFromServer(
      latestVersion.id,
      'templates/intent.csv'
    );
    const intentBlob = await serverFunctions.createBlob(
      intentCSV?.data?.file_data,
      'text/xml',
      'intent.csv'
    );
    // 3. entity.csv
    const entityCSV = await getNLUFileFromServer(
      latestVersion.id,
      'templates/entity.csv'
    );
    const entityBlob = await serverFunctions.createBlob(
      entityCSV?.data?.file_data,
      'text/xml',
      'entity.csv'
    );
    const simplifiedTrainingData = getIntentFormat(intentCSV?.data?.file_data);
    // 4. Make FormData object.
    const formData = {
      templateFile: botBlob,
      trainingIntentFile: intentBlob,
      trainingEntityFile: entityBlob,
      simplifiedTrainingData,
    };
    console.log('***** formData ', formData);

    return formData;
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
      setDataLoading(true);
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
      const template = await getNLUData(botData.latestVersion);
      // 3. Compile Template
      const { status, data } = await compileTemplate(
        template,
        botData.latestVersion.compilerVersion
      );
      console.log('**** status, data ', status, data);
      setToastMessage({
        type: 'success',
        title: 'Success',
        description: "You've successfully uploaded CSV.",
      });
    } catch (error) {
      console.error('**** error', error);
    } finally {
      setDataLoading(false);
    }
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
