import React, { Component } from 'react'
import './pages.css';
import Profile from '../profile'

export class Manager extends Component{
    state = {
        imageName: "placeholderManager.jpg",
        name: "Andersson"
    }

  render() {
    return (
      <React.Fragment>
          <div className="flexboxRow">
            <Profile imageName={this.state.imageName} name={this.state.name}/>
            <div className="coalPowerPlantBox">
                <h1>Coal Power plant</h1>
            </div>
          </div>    
      </React.Fragment>
    )
  } 
}


export default Manager;