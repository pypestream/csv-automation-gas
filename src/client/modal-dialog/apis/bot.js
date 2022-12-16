/* eslint-disable prefer-template */
import { serverFunctions } from '../../utils/serverFunctions';
import {
  GET_BOTS_DATA_API,
  GET_BOTS_ENV_API,
  GET_BOT_HISTORY_API,
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

const getBotVersion = (version) => serverFunctions.callApi(version);

export { getBotsData, getBotsEnv, getBotHistory, getBotVersion };
