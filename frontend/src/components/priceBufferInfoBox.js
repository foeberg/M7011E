import React, { Component } from 'react';
import './pages/pages.css';

export class PriceBufferInfoBox extends Component {
/*Renders info boxes for price/buffer on prosumer page */

  render() {
    return (
        <div className="priceBufferInfoBox">
        <h1>{this.props.title}</h1>
            <h4>{this.props.text}</h4>
            <p>{this.props.value} {this.props.unit}</p>
        </div>
    )
  }
}

export default PriceBufferInfoBox