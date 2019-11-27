import React, { Component } from 'react';
import './pages/pages.css';

export class Image extends Component {

  render() {
    return (
      <div className="imageContainer">
          <img className="image" src={require("../householdImages/" + this.props.source)} alt="household" />
      </div>
    )
  }
}

export default Image