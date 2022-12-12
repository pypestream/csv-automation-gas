import React, { useEffect, useState } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const CustomersList = ({ ...props }) => {
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    const fetchCustomers = async () => {
      const resourceAPI = 'https://api.claybox1.im.pype.tech/ges/v5/customers';
      const customersData = await serverFunctions.callApi(resourceAPI);
      console.log(customersData);
      setCustomers(customersData);
    };
    fetchCustomers();
  }, []);

  console.log(customers);
  return (
    <>
      <h3>Customers List:</h3>
      <select
        className="form-select"
        aria-label="Default select example"
        defaultValue=""
        {...props}
      >
        <option value="">Select a Customer</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default CustomersList;
