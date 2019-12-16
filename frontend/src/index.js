import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Router } from 'react-router-dom';
import history from './history';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8081/api/';

ReactDOM.render(<Router history={history}><App /></Router>, document.getElementById('root'));
