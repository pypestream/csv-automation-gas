/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  getCustomers,
  getCustomer,
  getBotsData,
  getBotVersion,
  getNLUFileFromServer,
  uploadTemplate,
  compileTemplate,
  updateBot,
  deployVersion,
  createNewBotVersion,
} from '../apis';
import { getIntentFormat, serverFunctions } from '../../utils';
import useProgress from './useProgress';
import STEPS from './steps';

const useUpload = () => {
  const [customers, setCustomers] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState('sandbox');
  // const [isPublishDataSelected, setIsPublishDataSelected] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const { resetProgress, addProgress, renderProgress } = useProgress();

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
    let currentStep = {};
    try {
      setIsPublishing(true);
      resetProgress();
      /** Instructions
       * 1. Get solution details.
       * 2. Prepare CSV files.
       * 3. Upload solution
       * 4. Compile Template
       * 5. Update bot configuration like bot type (main or survey) and language.
       * 6. In case of survey, update the streams.
       * 7. Deploy version
       * 8. upload default NLU Data
       * */
      // setDataLoading(true);
      // 1. Get solution details.
      addProgress('loading', STEPS.FETCH_SOLUTION_DETAILS);
      currentStep = STEPS.FETCH_SOLUTION_DETAILS;
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
      addProgress('success', STEPS.FETCH_SOLUTION_DETAILS);
      // 2. Prepare CSV files.
      addProgress('loading', STEPS.PREPARE_CSV_FILES);
      currentStep = STEPS.PREPARE_CSV_FILES;
      const template = await getNLUData(botData.latestVersion);
      addProgress('success', STEPS.PREPARE_CSV_FILES);
      // 3. Upload solution
      addProgress('loading', STEPS.UPLOAD_CSV_FILES);
      currentStep = STEPS.UPLOAD_CSV_FILES;
      await uploadTemplate(
        botData.latestVersion.id,
        botData.latestVersion.compilerVersion,
        template
      );
      addProgress('success', STEPS.UPLOAD_CSV_FILES);
      // 4. Compile Template
      addProgress('loading', STEPS.COMPILE_TEMPLATE);
      currentStep = STEPS.COMPILE_TEMPLATE;
      await compileTemplate(template, botData.latestVersion.compilerVersion);
      addProgress('success', STEPS.COMPILE_TEMPLATE);
      // 5. Update bot configuration like bot type (main or survey) and language.
      addProgress('loading', STEPS.UPDATE_CONFIGURATION);
      currentStep = STEPS.UPDATE_CONFIGURATION;
      await updateBot(botData.id, {
        botLanguage: botData.botLanguage,
        botType: botData.botType,
      });

      if (botData.botType === 'survey') {
        // 6. In case of survey, update the streams.
      }
      addProgress('success', STEPS.UPDATE_CONFIGURATION);
      // 7. Deploy version
      addProgress('loading', STEPS.DEPLOY_SOLUTION);
      currentStep = STEPS.DEPLOY_SOLUTION;
      await deployVersion(botData.latestVersion.id, selectedEnvironment);
      // 8. Create draft version
      await createNewBotVersion(botData.id);
      setToastMessage({
        type: 'success',
        title: 'Success',
        description: "You've successfully uploaded CSV.",
      });
      addProgress('success', STEPS.DEPLOY_SOLUTION);
      currentStep = {};
    } catch (error) {
      console.error(error);
      addProgress('error', currentStep);
      setToastMessage({
        type: 'danger',
        title: 'Error',
        description: error?.message?.split(' - ')?.[0],
      });
    } finally {
      setIsPublishing(false);
      setIsPublished(true);
      serverFunctions.closeModal();
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

  // useEffect(() => {
  //   if (serverFunctions.checkPublishDataExistsInPropertiesService()) {
  //     setIsPublishDataSelected(true);
  //     const { customerName, solutionName } =
  //       serverFunctions.checkPublishDataExistsInPropertiesService();
  //     setSelectedCustomer(customerName);
  //     setSelectedSolution(solutionName);
  //   } else {
  //     loadCustomers();
  //   }
  // }, []);

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
    isPublishing,
    isPublished,
    handleCustomerChange,
    handleSolutionChange,
    handleEnvironmentChange,
    handleUploadCSV,
    handleCloseToast,
    renderProgress,
  };
};

export default useUpload;
