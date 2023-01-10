import React, { useState, useEffect, useCallback } from 'react';
import Card from 'react-bootstrap/Card';
import {
  getBotsData,
  getBotVersion,
  getNLUFileFromServer,
  uploadTemplate,
  compileTemplate,
  updateBot,
  deployVersion,
  createNewBotVersion,
} from '../../apis';
import { getIntentFormat, serverFunctions, STEPS } from '../../utils';
import useProgress from './useProgress';

const usePublish = (selectedEnvironment) => {
  const [toastMessage, setToastMessage] = useState(null);
  const [publishDetails, setPublishDetails] = useState(null);

  const { resetProgress, addProgress, progressStack, ProgressElement } =
    useProgress();

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

  const handlePublish = async (selectedCustomer, selectedSolution) => {
    let currentStep = {};
    try {
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
      // 7. Publish version
      addProgress('loading', STEPS.DEPLOY_SOLUTION);
      currentStep = STEPS.DEPLOY_SOLUTION;
      await deployVersion(botData.latestVersion.id, selectedEnvironment);
      // 8. Create draft version
      await createNewBotVersion(botData.id);
      addProgress('success', STEPS.DEPLOY_SOLUTION);
      currentStep = {};
      setToastMessage({
        type: 'success',
        title: 'Success',
        description: `You've successfully published ${botData.latestVersion.version} of ${botData.botName} MicroApp on ${selectedEnvironment}.`,
      });
    } catch (error) {
      console.error(error);
      addProgress('error', currentStep);
      setToastMessage({
        type: 'danger',
        title: 'Error',
        description: error?.message?.split(' - ')?.[0],
      });
    }
  };

  const handleCloseToast = () => {
    setToastMessage(null);
  };

  useEffect(() => {
    const fetchPublishDataAsync = async () => {
      const publishData = await serverFunctions.getPublishDetails();
      if (!publishData?.customerName || !publishData?.solutionName) {
        return;
      }
      setPublishDetails({
        customerName: publishData.customerName,
        solutionName: publishData.solutionName,
      });
      handlePublish(publishData.customerName, publishData.solutionName);
    };
    fetchPublishDataAsync();
  }, []);

  const renderProgress = useCallback(() => {
    return (
      <Card body>
        <Card.Title>{publishDetails?.customerName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {publishDetails?.solutionName}
        </Card.Subtitle>
        {progressStack.map((step) => (
          <div key={step.id} className="step-in-progress">
            <ProgressElement status={step.status} msg={step.msg} />
          </div>
        ))}
      </Card>
    );
  }, [publishDetails, progressStack]);

  return {
    toastMessage,
    handleCloseToast,
    renderProgress,
  };
};

export default usePublish;
