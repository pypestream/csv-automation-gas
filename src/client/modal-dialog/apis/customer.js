/* eslint-disable prefer-template */
import { serverFunctions } from '../../utils/serverFunctions';

const CUSTOMERS_API = process.env.GAS_BOT_MANAGER_API_URL.replace(
  'botmanager',
  'ges/v5/customers'
);

const getCustomers = () => serverFunctions.callApi(CUSTOMERS_API);

const getCustomer = (customer) => {
  const endpoint =
    process.env.GAS_BOT_MANAGER_API_URL + '/customers/' + customer;
  return serverFunctions.callApi(endpoint);
};

export { getCustomers, getCustomer };
