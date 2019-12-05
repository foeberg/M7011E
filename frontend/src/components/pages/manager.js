import React, { Component } from 'react'
import './pages.css';
import Profile from '../profile';
import CoalPowerPlant from '../coalPowerPlant';

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
        demand: 2322
    }

  render() {
    return (
      <React.Fragment>
          <div className="flexboxRow">
            <Profile imageName={this.state.imageName} email={this.state.email} username={this.state.username} name={this.state.name}/>
            <CoalPowerPlant demand={this.state.demand} bufferRate={this.state.bufferRate} status={this.state.status} production={this.state.production} productionRate={this.state.productionRate}/>
          </div>    
      </React.Fragment>
    )
  } 
}


export default Manager;