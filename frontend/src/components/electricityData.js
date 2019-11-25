import React, { Component } from 'react';
import './pages/pages.css';

export class ElectricityData extends Component {

  render() {
    return (
        <div className="value">
            <h4>{this.props.title}</h4>
            <div className="data">{this.props.value}</div>
        </div>
    )
  }
}

export default ElectricityData