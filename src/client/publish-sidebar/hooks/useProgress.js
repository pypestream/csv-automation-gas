import React, { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

const useProgress = () => {
  const [progressStack, updateProgressStack] = useState([]);

  const resetProgress = () => {
    updateProgressStack([]);
  };

  const addProgress = (status, step = {}) => {
    updateProgressStack((prev) => {
      if (status === 'loading') {
        return [
          ...prev,
          {
            id: new Date().toISOString(),
            status,
            msg: step[status],
          },
        ];
      }

      prev.pop();
      return [
        ...prev,
        {
          id: new Date().toISOString(),
          status,
          msg: step[status],
        },
      ];
    });
  };

  const ProgressElement = ({ status, msg }) => {
    if (status === 'success') {
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
          <span>{msg}</span>
        </>
      );
    }

    if (status === 'error') {
      return (
        <>
          <div className="error-icon" />
          <span>{msg}</span>
        </>
      );
    }

    return (
      <>
        <Spinner animation="border" variant="primary" size="sm" />
        <span>{msg}</span>
      </>
    );
  };

  return {
    resetProgress,
    addProgress,
    progressStack,
    ProgressElement,
  };
};

export default useProgress;
