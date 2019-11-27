  
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect,Switch } from 'react-router-dom';
import Header from './components/layouts/header';
import Login from './components/pages/login';
import Register from './components/pages/register';
import Prosumer from './components/pages/prosumer';
import PageNotFound from './components/pages/pageNotFound';
import axios from 'axios';
import './App.css';


class App extends Component {
	state = {
		soldToMarket: 50,
		buyFromMarket: 50,
		wind: 3.01,
		production: 4.01,
		price: 4,
		buffer:5,
		isLoggedIn: true
	}

	componentDidMount() {
		axios.defaults.withCredentials = true;
		axios
		.get('http://localhost:8081/simulator/wind')
		.then((res) => {
			this.setState({ wind: Math.round(res.data * 100)/100,
				production: Math.round(res.data * 100)/100 })
			console.log(res.data);	
		});
		axios
		.get('http://localhost:8081/simulator/electricityPrice')
		.then((res) => {
			this.setState({ price: Math.round(res.data * 100)/100 })
			console.log(res.data);	
		});
		this.interval = setInterval(() => {
		axios
			.get('http://localhost:8081/simulator/wind')
			.then((res) => {
				this.setState({ wind: Math.round(res.data * 100)/100,
					production: Math.round(res.data * 100)/100 })
				console.log(res.data);	
			});
		axios
			.get('http://localhost:8081/simulator/electricityPrice')
			.then((res) => {
				this.setState({ price: Math.round(res.data * 100)/100 })
				console.log(res.data);	
			});
		}, 10000);	
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	logOut =() => {
		alert("hej");
		this.setState({isLoggedIn: false});
		/*axios.get('http://localhost:8081/logout')
			.then((res) => {
				console.log(res.data);	
		});*/
	}
	
	render() {
		return (
				<Router>
					<div className='App'>
						<Header/>
						<Switch>
							<Route exact path='/' render={(props) =>
								<Login/> } />
							<Route path='/register' component={Register} />
							<Route exact path='/prosumer' render={(props) => 
									this.state.isLoggedIn ? (
									<Prosumer imageName={this.state.imageName} logOut={this.logOut} production={this.state.production} wind={this.state.wind} buyFromMarket={this.state.buyFromMarket}
									price={this.state.price} buffer={this.state.buffer}/>
								) : (
									<Redirect to={{ pathname: '/'}} />
								)}
							/>
							<Route component={PageNotFound}/>
						</Switch>				
					</div>
				</Router>	

		);
	}
}

export default App;