import { useState, useEffect } from 'react';

const useUpload = () => {
  const [customers, setCustomers] = useState([]);
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    setCustomers([
      'Customer 1',
      'Customer 2',
      'Customer 3',
      'Customer 4',
      'Customer 5',
    ]);
    setSolutions([
      'Solution 1',
      'Solution 2',
      'Solution 3',
      'Solution 4',
      'Solution 5',
    ]);
  }, []);

  return {
    customers,
    solutions,
  };
};

export default useUpload;
