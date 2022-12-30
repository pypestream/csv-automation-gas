import { useState } from 'react';

const useProgress = () => {
  const [solutionDetailsProgress, setSolutionDetailsProgress] = useState('off');
  const [prepareCSVFilesProgress, setPrepareCSVFilesProgress] = useState('off');
  const [compileTemplateProgress, setCompileTemplateProgress] = useState('off');
  const [updateBotConfigProgress, setUpdateBotConfigProgress] = useState('off');
  const [deployVersionProgress, setDeployVersionProgress] = useState('off');

  return {
    solutionDetailsProgress,
    prepareCSVFilesProgress,
    compileTemplateProgress,
    updateBotConfigProgress,
    deployVersionProgress,
    setSolutionDetailsProgress,
    setPrepareCSVFilesProgress,
    setCompileTemplateProgress,
    setUpdateBotConfigProgress,
    setDeployVersionProgress,
  };
};

export default useProgress;
