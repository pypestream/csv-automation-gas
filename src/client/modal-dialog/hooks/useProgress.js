import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

const useProgress = () => {
  const [progressStack, updateProgressStack] = useState([]);
  const [currentStep, setCurrentStep] = useState({});

  const resetProgress = () => {
    updateProgressStack([]);
    setCurrentStep({});
  };

  const addProgress = (status, step = {}) => {
    updateProgressStack((prev) => {
      if (status === 'loading') {
        setCurrentStep(step);
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
          msg: currentStep[status],
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

    return (
      <>
        <Spinner animation="border" variant="primary" size="sm" />
        <span>{msg}</span>
      </>
    );
  };

  const renderProgress = () => {
    return (
      <Card body>
        {progressStack.map((step) => (
          <div key={step.id}>
            <ProgressElement status={step.status} msg={step.msg} />
          </div>
        ))}
      </Card>
    );
  };

  return {
    resetProgress,
    addProgress,
    renderProgress,
  };
};

export default useProgress;
