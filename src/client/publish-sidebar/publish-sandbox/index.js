import React from 'react';
import ReactDOM from 'react-dom';
import { CSVPublish } from '../components';
import '../styles.css';

const PublishSolutionSandbox = () => <CSVPublish env="sandbox" />;

ReactDOM.render(<PublishSolutionSandbox />, document.getElementById('index'));
