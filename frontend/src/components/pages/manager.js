import React, { Component } from 'react'
import './pages.css';
import ManagerProfile from '../managerProfile';
import CoalPowerPlant from '../coalPowerPlant';
import TableOfProsumers from '../tableOfProsumers';

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
        profile: false
    }

    /*show either profile or table of prosumers */
    enterProfile = () => {
        this.setState({profile: false})
    }
    enterProsumers = () => {
        this.setState({profile: true})
    }

  render() {
    return (
      <React.Fragment>
        <div className="menu">
            <input type="button" value="Profile" className="menuLink" onClick={() => {this.enterProfile()}}/><input type="button" value="Prosumers" className="menuLink" onClick={() => {this.enterProsumers()}}/><input type="button" value="Log out" className="menuLink" onClick={() => {this.props.logOut()}}/>
        </div>
        <div className="flexboxRowStart">
            <CoalPowerPlant demand={this.state.demand} bufferRate={this.state.bufferRate} status={this.state.status} production={this.state.production} productionRate={this.state.productionRate}/>
            <TableOfProsumers profile={this.state.profile}/>
            <ManagerProfile profile={this.state.profile} imageName={this.state.imageName} email={this.state.email} username={this.state.username} name={this.state.name}/>
        </div>    
      </React.Fragment>
    )
  } 
}


export default Manager;