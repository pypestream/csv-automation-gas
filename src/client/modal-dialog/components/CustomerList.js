import React, { useEffect, useState } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const CustomersList = ({ ...props }) => {
  const [names, setNames] = useState('');
  useEffect(() => {
    // Call a server global function here and handle the response with .then() and .catch()
    const setActiveSheetName = async () => {
      const sheets = await serverFunctions.getSheetsData();
      const sheetName = sheets.find((sh) => sh.isActive).name;
      setNames(sheetName);
    };
    setActiveSheetName();
  }, []);

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
        <option value="TestCustomer">TestCustomer</option>
        <option value="TestCustomer1">TestCustomer1</option>
        <option value="TestCust">Test Cust</option>
      </select>
      <p>Active Sheet: {names}</p>
    </>
  );
};

export default CustomersList;
