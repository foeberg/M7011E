  
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
		soldToMarket: 50,
		buyFromMarket: 50,
		wind: 3.01,
		production: 4.01,
		consumption: 5.01,
		price: 4,
		buffer:5,
	}

	/*componentDidMount() {
		axios
			.get('https://localhost:8081/simulator/wind')
			.then((res) => this.setState({ wind: res.data }));
	}
*/
	render() {
		return (
				<Router>
					<div className='App'>
						<Header/>
						<Route exact path='/' component={Login} />
						<Route path='/register' component={Register} />
						<Route
							exact
							path='/prosumer'
							render={(props) => (
								<Prosumer consumption={this.state.consumption} production={this.state.production} wind={this.state.wind} buyFromMarket={this.state.buyFromMarket}
								price={this.state.price} buffer={this.state.buffer} />
							)}
						/>				
					</div>
				</Router>	

		);
	}
}

export default App;