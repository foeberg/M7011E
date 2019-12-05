import React, { Component } from 'react';
import './pages/pages.css';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

export class RangeSliders extends Component {
    state = {
        disableButton: true,
        rangeValue: this.props.value
    }

    onClick = (e) => {
        this.setState({disableButton: true});
        this.props.applyHandler(this.state.rangeValue);
      }

  render() {
    return (
        <div>
            <h4>{this.props.title}:</h4>
            <InputRange  maxValue={100} minValue={0} value={this.state.rangeValue} onChange={value => this.setState({ rangeValue: Math.round(value), disableButton: false})} />
            <p>{this.state.rangeValue + this.props.message}</p>
            <p hidden={this.props.hidden}>{100-this.state.rangeValue + this.props.secondMessage}</p>
            <input className="sendButton" type="button" value="Save changes" disabled = {this.state.disableButton} onClick={this.onClick}/>
            <div id={this.props.id} className="appliedSellBuy" hidden={true}></div>
        </div>
    )
  }
}

export default RangeSliders