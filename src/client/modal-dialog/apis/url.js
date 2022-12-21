const baseUrl = process.env.GAS_BOT_MANAGER_API_URL;

const GET_CUSTOMERS_API = () =>
  baseUrl.replace('botmanager', 'ges/v5/customers');

const GET_CUSTOMER_API = (customerName) =>
  `${baseUrl}/customers/${customerName}`;

const GET_BOTS_DATA_API = (customerName, solutionName) => {
  const botId = `${solutionName}`;
  return `${baseUrl}/bots/${botId}`;
};

const GET_BOTS_ENV_API = (customerName, solutionName) => {
  const botId = `${customerName}.${solutionName}`;
  return `${baseUrl}/envs/${botId}`;
};

const GET_BOT_HISTORY_API = (customerName) =>
  `${baseUrl}/history/${customerName}`;

const GET_BOT_VERSION_API = (solution, version) =>
  `${baseUrl}/versions/${solution}.${version}`;

const GET_BOT_FILE_API = (version, filePath) =>
  `${baseUrl}/versions/${version}/files?filePath=${filePath}`;

export {
  GET_CUSTOMERS_API,
  GET_CUSTOMER_API,
  GET_BOTS_DATA_API,
  GET_BOTS_ENV_API,
  GET_BOT_HISTORY_API,
  GET_BOT_VERSION_API,
  GET_BOT_FILE_API,
};
