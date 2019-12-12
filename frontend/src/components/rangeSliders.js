import React, { Component } from 'react';
import './pages/pages.css';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

export class RangeSliders extends Component {
    /*Renders an input range with a heading and a submit button */

    state = {
        disableButton: true,
    }

    onClick = (e) => {
        this.setState({disableButton: true})
        this.props.applyHandler();
    } 

  render() {
    return (
        <div className="rangeSliders">
            <h4>{this.props.title}:</h4>
            <InputRange  maxValue={this.props.maxValue} minValue={this.props.minValue} value={this.props.value} onChange={value => {this.props.updateRange(value); this.setState({disableButton: false})}} />
            <p>{this.props.value + this.props.message}</p>
            <p hidden={this.props.hidden}>{100-this.props.value + this.props.secondMessage}</p>
            <input className="sendButton" type="button" value="Save changes" disabled = {this.state.disableButton} onClick={(e)=>{this.onClick()}}/>
            <div id={this.props.id} className="appliedSellBuy" hidden={true}></div>
        </div>
    )
  }
}

export default RangeSliders