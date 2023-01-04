/* eslint-disable prefer-template */
import { serverFunctions } from '../../utils';
import { GET_CUSTOMERS_API, GET_CUSTOMER_API } from './url';

const getCustomers = () => serverFunctions.callApi(GET_CUSTOMERS_API());

const getCustomer = (customer) => {
  const customerApi = GET_CUSTOMER_API(customer);
  return serverFunctions.callApi(customerApi);
};

export { getCustomers, getCustomer };
