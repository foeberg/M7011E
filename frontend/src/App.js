  
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/layouts/header';
import Login from './components/pages/login';
import Register from './components/pages/register';
import Prosumer from './components/pages/prosumer';
//import axios from 'axios';

import './App.css';


class App extends Component {
	state = {

	}

	render() {
		return (
				<Router>
					<div className='App'>
						<Header/>
						<Route exact path='/' component={Login} />
						<Route path='/register' component={Register} />
						<Route path='/prosumer' component={Prosumer} />
					</div>
				</Router>	

		);
	}
}

export default App;