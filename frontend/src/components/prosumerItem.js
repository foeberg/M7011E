import React, { Component } from 'react';
import './pages/pages.css';
import $ from 'jquery';
export class ProsumerItem extends Component {

    dotStyle = (status) => {
        if(status === "Online"){
            return {background: "green"}
        }return {background: "red"}      
    }
    blockProsumer = (id) => {
        document.getElementById(id).innerHTML = "blocked";
        $("#"+id).css("background-color", "red");
        setTimeout(function() { $("#"+id).css("background-color", "green"); document.getElementById(id).innerHTML = "block";}, 10000);
    }  
  render() {
    return this.props.prosumers.map((prosumers) => (
        <div key={prosumers.id} className="prosumersList">
            <p>{prosumers.name}: {prosumers.status} <span className="dot" style={this.dotStyle(prosumers.status)}/>
            <button type="submit" className="blockButton" id={prosumers.id} onClick={() => {this.blockProsumer(prosumers.id)}}>block</button></p>
        </div>
      ));
  }
}

export default ProsumerItem