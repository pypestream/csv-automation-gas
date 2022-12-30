/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
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
  const [toastMessage, setToastMessage] = useState(null);

  const progress = useProgress();

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
      const {
        setSolutionDetailsProgress,
        setPrepareCSVFilesProgress,
        setCompileTemplateProgress,
        setUpdateBotConfigProgress,
        setDeployVersionProgress,
      } = progress;
      setIsPublishing(true);
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
      setSolutionDetailsProgress('loading');
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
      setSolutionDetailsProgress('on');
      setPrepareCSVFilesProgress('loading');
      // 2. Prepare CSV files.
      const template = await getNLUData(botData.latestVersion);
      setPrepareCSVFilesProgress('on');
      setCompileTemplateProgress('loading');
      // 3. Upload solution
      await uploadTemplate(
        botData.latestVersion.id,
        botData.latestVersion.compilerVersion,
        template
      );
      // 4. Compile Template
      await compileTemplate(template, botData.latestVersion.compilerVersion);
      setCompileTemplateProgress('on');
      setUpdateBotConfigProgress('loading');
      // 5. Update bot configuration like bot type (main or survey) and language.
      await updateBot(botData.id, {
        botLanguage: botData.botLanguage,
        botType: botData.botType,
      });

      if (botData.botType === 'survey') {
        // 6. In case of survey, update the streams.
      }
      setUpdateBotConfigProgress('on');
      setDeployVersionProgress('loading');
      // 7. Deploy version
      await deployVersion(botData.latestVersion.id, selectedEnvironment);
      // 8. Create draft version
      await createNewBotVersion(botData.id);
      setToastMessage({
        type: 'success',
        title: 'Success',
        description: "You've successfully uploaded CSV.",
      });
      setDeployVersionProgress('on');
    } catch (error) {
      console.error(error);
    } finally {
      setIsPublishing(false);
      serverFunctions.closeModal();
    }
  };

  const handleCloseToast = () => {
    setToastMessage(null);
  };

  const ProgressElement = ({ fetched, fetchingMsg, fetchedMsg }) => {
    if (fetched) {
      return (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
              fill="#0fa30f"
            />
          </svg>
          <span>{fetchedMsg}</span>
        </>
      );
    }
    return (
      <>
        <Spinner animation="border" variant="primary" size="sm" />
        <span>{fetchingMsg}...</span>
      </>
    );
  };

  const renderProgress = () => {
    const {
      solutionDetailsProgress,
      prepareCSVFilesProgress,
      compileTemplateProgress,
      updateBotConfigProgress,
      deployVersionProgress,
    } = progress;
    return (
      <Card body>
        {solutionDetailsProgress !== 'off' && (
          <div>
            <ProgressElement
              fetched={solutionDetailsProgress === 'on'}
              fetchingMsg="Fetching Solution Details"
              fetchedMsg="Solution Details Fetched."
            />
          </div>
        )}
        {prepareCSVFilesProgress !== 'off' && (
          <div>
            <ProgressElement
              fetched={prepareCSVFilesProgress === 'on'}
              fetchingMsg="Preparing CSV files"
              fetchedMsg="CSV Files ready."
            />
          </div>
        )}
        {compileTemplateProgress !== 'off' && (
          <div>
            <ProgressElement
              fetched={compileTemplateProgress === 'on'}
              fetchingMsg="Compiling Template"
              fetchedMsg="Template ready."
            />
          </div>
        )}
        {updateBotConfigProgress !== 'off' && (
          <div>
            <ProgressElement
              fetched={updateBotConfigProgress === 'on'}
              fetchingMsg="Updating configuration"
              fetchedMsg="Configuration in place."
            />
          </div>
        )}
        {deployVersionProgress !== 'off' && (
          <div>
            <ProgressElement
              fetched={deployVersionProgress === 'on'}
              fetchingMsg="Uploading CSV and deploying new version."
              fetchedMsg="CSV updated in a new version."
            />
          </div>
        )}
      </Card>
    );
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
    handleCustomerChange,
    handleSolutionChange,
    handleEnvironmentChange,
    handleUploadCSV,
    handleCloseToast,
    renderProgress,
  };
};

export default useUpload;
