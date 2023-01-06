import React from 'react';
import Alert from 'react-bootstrap/Alert';

import usePublish from '../hooks/usePublish';

const CSVPublish = ({ env }) => {
  const { toastMessage, handleCloseToast, renderProgress } = usePublish(env);

  return (
    <>
      {!!toastMessage && (
        <Alert
          variant={toastMessage.type}
          onClose={handleCloseToast}
          dismissible
        >
          <Alert.Heading>
            <strong className="mr-auto">{toastMessage.title}</strong>
          </Alert.Heading>
          <p>{toastMessage.description}</p>
        </Alert>
      )}
      {renderProgress()}
    </>
  );
};

export default CSVPublish;
