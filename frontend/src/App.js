 
import React, { Component } from 'react';
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom';
import Header from './components/layouts/header';
import Login from './components/pages/login';
import Register from './components/pages/register';
import Prosumer from './components/pages/prosumer';
import Manager from './components/pages/manager';
import PageNotFound from './components/pages/pageNotFound';
import './App.css';
import axios from 'axios';
import history from './history';

class App extends Component {

	componentDidMount() {
		axios.defaults.withCredentials = true;
		axios
		.get('http://localhost:8081/simulator/wind')
		.then((res) => {
			console.log(res.data);	
		});
	}
	logOut =() => {
		axios.defaults.withCredentials = true;
		axios
		.post('http://localhost:8081/logout')
		.then((res) => {
			console.log(res.data);
			history.push('/');	
		});
	}
	
	render() {
		return (
			<Router>
				<div className='App'>
					<Header/>
					<Switch>
						<Route exact path='/' component={Login}/>
						<Route path='/register' component={Register} />
						<Route path ='/prosumer' render={(props)=> 
							<Prosumer logOut={this.logOut} />}/>
						<Route path ='/manager' render={(props)=> 
							<Manager logOut={this.logOut} />}/>
						<Route component={PageNotFound}/>
					</Switch>				
				</div>
			</Router>	
		);
	}
}

export default App;