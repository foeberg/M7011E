import React, { Component } from 'react'
import './pages.css';
import ManagerProfile from '../managerProfile';
import CoalPowerPlant from '../coalPowerPlant';
import TableOfProsumers from '../tableOfProsumers';
import axios from 'axios';
import history from '../../history';

export class Manager extends Component{
    state = {
        imageName: "placeholderManager.jpg",
        name: "Andersson",
        username: "jossan",
        email: "jossan@gmail.com",
        status: "Running",
        production: 938,
        productionRate: 30,
        bufferRate: 30,
        demand: 2322,
        modelledPrice: 22,
        price: 33,
        showProsumers: false,
        error: false,
        loading: false
    }

    async getData(){
      let currentComponent = this;
      axios.defaults.withCredentials = true;
      await Promise.all([
          axios
          .get('http://localhost:8081/production')
          .then((res) => {    
              currentComponent.setState({production: Math.round(res.data * 100)/100 })
          }),
          axios
          .get('http://localhost:8081/demand')
          .then((res) => {
              currentComponent.setState({ demand: Math.round(res.data * 100)/100 })	
          }),
          axios
          .get('http://localhost:8081/householdImage')
          .then((response) => {
              currentComponent.setState({ imageName: response.data})
          })
          .catch((error) =>{
              if(error.response.status=== 400){
                  currentComponent.setState({error: true});
              }
          })]).then(function(){
              if(!currentComponent.state.error){currentComponent.setState({loading: false})
              }else{
                  history.push('/');
              }
          });
    }
    /*get data from server*/
    /*componentDidMount() {
      let currentComponent = this;
      axios.defaults.withCredentials = true;
      this.getData();
      currentComponent.interval = setInterval(() => {
          axios
          .get('http://localhost:8081/production')
          .then((res) => {    
              currentComponent.setState({production: Math.round(res.data * 100)/100 })
          });
          axios
          .get('http://localhost:8081/demand')
          .then((res) => {
              currentComponent.setState({ demand: Math.round(res.data * 100)/100 })	
          });
          }, 10000);
      }
  
    componentWillUnmount() {
      clearInterval(this.interval);
    }*/

    /*show either profile or table of prosumers */
    enterProfile = () => {
        this.setState({showProsumers: false})
    }
    enterProsumers = () => {
        this.setState({showProsumers: true})
    }

    /*update states*/
    updateState = (name, username, email) => {
        this.setState({name: name, username: username, email: email})
    }

    /*update price*/
    updatePrice = (price) => {
      this.setState({price: price})
    }

  render() {
    if(this.state.loading){
      return(<div></div>)
    }else{
      return (
        <React.Fragment>
          <div className="menu">
              <input type="button" value="Profile" className="menuLink" onClick={() => {this.enterProfile()}}/><input type="button" value="Prosumers" className="menuLink" onClick={() => {this.enterProsumers()}}/><input type="button" value="Log out" className="menuLink" onClick={() => {this.props.logOut()}}/>
          </div>
          <div className="flexboxRowStart">
              <CoalPowerPlant updatePrice={this.updatePrice} price={this.state.price} modelledPrice={this.state.modelledPrice} demand={this.state.demand} bufferRate={this.state.bufferRate} status={this.state.status} production={this.state.production} productionRate={this.state.productionRate}/>
              <TableOfProsumers showProsumers={this.state.showProsumers}/>
              <ManagerProfile updateState={this.updateState} showProsumers={this.state.showProsumers} imageName={this.state.imageName} email={this.state.email} username={this.state.username} name={this.state.name}/>
          </div>    
        </React.Fragment>
      )
    }  
  } 
}


export default Manager;