/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  getCustomers,
  getCustomer,
  getBotsData,
  getBotVersion,
  getNLUFileFromServer,
  compileTemplate,
  updateBot,
  deployVersion,
  createNewBotVersion,
} from '../apis';
import { serverFunctions } from '../../utils/serverFunctions';
import { getIntentFormat } from '../utils';

const useUpload = () => {
  const [customers, setCustomers] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState('sandbox');
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

  const handleEnvironmentChange = (e) => {
    setSelectedEnvironment(e.target.value);
  };

  const getNLUData = async (latestVersion) => {
    // 1. bot.csv
    const botCSV = await serverFunctions.createCSVFromSheet();
    // 2. intent.csv
    const intentCSV = await getNLUFileFromServer(
      latestVersion.id,
      'templates/intent.csv'
    );
    // 3. entity.csv
    const entityCSV = await getNLUFileFromServer(
      latestVersion.id,
      'templates/entity.csv'
    );
    const simplifiedTrainingData = getIntentFormat(intentCSV?.data?.file_data);

    return [
      {
        field: 'templateFile',
        data: botCSV,
        type: 'text/xml',
        filename: 'bot.csv',
        isBlob: true,
      },
      {
        field: 'trainingIntentFile',
        data: intentCSV?.data?.file_data,
        type: 'text/xml',
        filename: 'bot.csv',
        isBlob: true,
      },
      {
        field: 'trainingEntityFile',
        data: entityCSV?.data?.file_data,
        type: 'text/xml',
        filename: 'bot.csv',
        isBlob: true,
      },
      {
        field: 'simplifiedTrainingData',
        data: simplifiedTrainingData,
        isBlob: false,
      },
    ];
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
      console.log('****** botData ', botData);
      // 2. Prepare CSV files.
      const template = await getNLUData(botData.latestVersion);
      // 3. Compile Template
      await compileTemplate(template, botData.latestVersion.compilerVersion);
      // 4. Update bot configuration like bot type (main or survey) and language.
      await updateBot(botData.id, {
        botLanguage: botData.botLanguage,
        botType: botData.botType,
      });

      if (botData.botType === 'survey') {
        // 5. In case of survey, update the streams.
      }
      // 6. Deploy version
      await deployVersion(botData.latestVersion.id, selectedEnvironment);
      // 7. Create draft version
      await createNewBotVersion(botData.id);
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
    handleEnvironmentChange,
    handleUploadCSV,
    handleCloseToast,
  };
};

export default useUpload;
