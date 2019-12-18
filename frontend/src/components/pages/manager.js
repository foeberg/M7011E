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
        lastname: "",
        username: "",
        loading: true
    }

    /*Check if user is logged in as manager */
    componentDidMount() {
      let currentComponent = this;
      axios.defaults.withCredentials = true;
      axios
      .get('/user')
      .then((res) => {
        if(res.data.role === "prosumer"){
          history.push('/prosumer')
        }else{
          currentComponent.setState({loading: false, username: res.data.username, lastname: res.data.lastname})
          currentComponent.getData();
        }  
      })
      .catch((error) =>{
          if(error.response.status=== 400){
              history.push('/');
          }
      });
      }

    /*get manager data */
    getData(){
      let currentComponent = this;
          axios
          .get('/profileImage')
          .then((response) => {
              currentComponent.setState({ imageName: response.data})
          })
          .catch((error) =>{
              if(error.response.status === 400){
                history.push('/');
              }
          })
    }
    
    componentWillUnmount() {
      clearInterval(this.interval);
    }

    /*show either profile or table of prosumers */
    enterHome = () => {
        history.push('/manager')
    }
    enterProsumers = () => {
        history.push('/showProsumers')
    }

    /*update states*/
    updateState = (lastname, password) => {
        this.setState({lastname: lastname, password: password})
    }

    updateImageName = (name) => {
      if(name === this.state.imageName){
        history.push('/manager')
      }else{
          this.setState({ imageName: name})
      }
    }

  render() {
    if(this.state.loading){
      return(<div></div>)
    }else{
      return (
        <React.Fragment>
          <div className="menu">
              <input type="button" value="Home" className="menuLink" onClick={() => {this.enterHome()}}/><input type="button" value="Prosumers" className="menuLink" onClick={() => {this.enterProsumers()}}/><input type="button" value="Log out" className="menuLink" onClick={() => {this.props.logOut()}}/>
          </div>
          <div className="flexboxRowStart">
              <CoalPowerPlant/>
              <TableOfProsumers updateState={this.updateState} showProsumers={this.props.showProsumers}/>
              <ManagerProfile updateAccount={this.props.updateAccount} updateImageName={this.updateImageName} updateState={this.updateState} showProsumers={this.props.showProsumers} imageName={this.state.imageName} lastname={this.state.lastname} username={this.state.username}/>
          </div>    
        </React.Fragment>
      )
    }  
  } 
}


export default Manager;