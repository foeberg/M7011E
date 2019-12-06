import React, { Component } from 'react';
import './pages/pages.css';

export class ProsumerItem extends Component {
    
    dotStyle=(status)=>{
        if(status === "Online"){
            return {background: "green"}
        }return {background: "red"}      
    }  
  render() {
    return this.props.prosumers.map((prosumers) => (
    <p>{prosumers.name}: {prosumers.status} <span className="dot" style={this.dotStyle(prosumers.status)}/> </p>
      ));
  }
}

export default ProsumerItem