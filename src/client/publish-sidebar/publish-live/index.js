import React from 'react';
import ReactDOM from 'react-dom';
import { CSVPublish } from '../components';
import '../styles.css';

const PublishSolutionLive = () => <CSVPublish env="live" />;

ReactDOM.render(<PublishSolutionLive />, document.getElementById('index'));
