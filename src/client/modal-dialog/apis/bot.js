/* eslint-disable prefer-template */
import { serverFunctions } from '../../utils';
import {
  GET_BOTS_DATA_API,
  GET_BOTS_ENV_API,
  GET_BOT_HISTORY_API,
  GET_BOT_VERSION_API,
  GET_BOT_FILE_API,
  GET_COMPILE_API,
  GET_UPDATE_BOT_API,
  GET_DEPLOY_API,
  GET_CREATE_BOT_VERSION_API,
  GET_UPLOAD_TEMPLATE_API,
} from './url';

const getBotsData = (customer, solution) => {
  const botsDataAPI = GET_BOTS_DATA_API(customer, solution);
  return serverFunctions.callApi(botsDataAPI);
};

const getBotsEnv = (customer, solution) => {
  const botsEnvAPI = GET_BOTS_ENV_API(customer, solution);
  return serverFunctions.callApi(botsEnvAPI);
};

const getBotHistory = (customer, solution) => {
  const botsHistoryAPI = GET_BOT_HISTORY_API(customer);
  const payloadData = {
    bot: JSON.stringify(solution),
    contentType: 'application/json',
  };
  return serverFunctions.callApi(botsHistoryAPI, 'post', {
    payload: payloadData,
  });
};

const getBotVersion = (solution, version) => {
  const botVersionAPI = GET_BOT_VERSION_API(solution, version);
  return serverFunctions.callApi(botVersionAPI);
};

const getNLUFileFromServer = (version, filename) => {
  const botFileAPI = GET_BOT_FILE_API(version, filename);
  return serverFunctions.callApi(botFileAPI);
};

const uploadTemplate = (versionId, botVersion, template) => {
  const updateTemplateAPI = GET_UPLOAD_TEMPLATE_API(versionId, botVersion);
  return serverFunctions.callApiWithFormData(
    updateTemplateAPI,
    'post',
    { payload: template },
    { contentType: 'multipart/form-data' }
  );
};

const compileTemplate = (template, compilerVersion) => {
  const compileAPI = GET_COMPILE_API(compilerVersion);
  return serverFunctions.callApiWithFormData(
    compileAPI,
    'put',
    { payload: template },
    { contentType: 'multipart/form-data' }
  );
};

const updateBot = (botId, botConfig) => {
  const updateBotAPI = GET_UPDATE_BOT_API(botId);

  return serverFunctions.callApi(updateBotAPI, 'patch', { payload: botConfig });
};

const deployVersion = (versionId, environment) => {
  const deployAPI = GET_DEPLOY_API(versionId);

  const payloadData = JSON.stringify({ environment });

  return serverFunctions.callApi(deployAPI, 'put', {
    payload: payloadData,
    contentType: 'application/json',
  });
};

const createNewBotVersion = (botId) => {
  const createBotAPI = GET_CREATE_BOT_VERSION_API(botId);

  return serverFunctions.callApi(createBotAPI, 'post', {
    payload: JSON.stringify({ botId }),
    contentType: 'application/json',
  });
};

export {
  getBotsData,
  getBotsEnv,
  getBotHistory,
  getBotVersion,
  getNLUFileFromServer,
  uploadTemplate,
  compileTemplate,
  updateBot,
  deployVersion,
  createNewBotVersion,
};
