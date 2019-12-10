import React, { Component } from 'react';
import './pages/pages.css';
import ElectricityData from './electricityData';
import RangeSliders from './rangeSliders';

export class CoalPowerPlant extends Component {
    state = {
        status: this.props.status,
        productionRate: this.props.productionRate,
        bufferRate: this.props.bufferRate
    }

    /*style for production dot */
    dotStyle=()=>{
        if(this.state.status === "Stopped"){
            return {background: "red"}
        }else if(this.state.status === "Running"){
            return {background: "green"}
        }else if(this.state.status === "Starting"){
            return {background: "orange"}
        }       
    }
    /*check if coal power plant is producing */
    producing=()=>{
        if(this.state.status==="Running"){
            return false
        }return true
    }
    /*text for start/stop button */
    startStop=()=>{
        if(this.producing()){
            return "Start"
        }return "Stop"
    }

    /*when pressing save changes button for production ratio*/
    applyProductionRate=()=>{
        console.log("applied rate")
        /*axios.post("http://localhost:8081/buyRatio", {buyRatio: this.state.productionRate/100})
        .then(function (response) {
            document.getElementById("appliedProductionRate").innerHTML = "Saved changes";
            $("#appliedProductionRate").show();
            $("#appliedProductionRate").css("color", "green");
            setTimeout(function() { $("#appliedProductionRate").hide(); }, 2000);
        })
        .catch(function (error) {
            document.getElementById("appliedProductionRate").innerHTML = "Could not save changes";
            $("#appliedProductionRate").show();
            $("#appliedProductionRate").css("color", "red");
            setTimeout(function() { $("#appliedProductionRate").hide(); }, 2000);
        });*/
    }
    
    /*when pressing save changes button for send to buffer ratio*/
    applySendToBuffer=()=>{
        console.log("applied rate")
        /*axios.post("http://localhost:8081/buyRatio", {buyRatio: this.state.bufferRate/100})
        .then(function (response) {
            document.getElementById("appliedBufferRate").innerHTML = "Saved changes";
            $("#appliedBufferRate").show();
            $("#appliedBufferRate").css("color", "green");
            setTimeout(function() { $("#appliedBufferRate").hide(); }, 2000);
        })
        .catch(function (error) {
            document.getElementById("appliedBufferRate").innerHTML = "Could not save changes";
            $("#appliedBufferRate").show();
            $("#appliedBufferRate").css("color", "red");
            setTimeout(function() { $("#appliedBufferRate").hide(); }, 2000);
        });*/
    }

    /*when pressing start/stop production button */
    startStopProduction=()=>{
        let currentComponent= this;
        if(this.state.status==="Running"){
            currentComponent.setState({status: "Stopped"});
            /*axios.post("http://localhost:8081/buyRatio", {buyRatio: this.state.bufferRate/100})
            .then(function (response) {
                currentComponent.setState({status: "Stopped"});
            })
            .catch(function (error) {
            });*/
        }else if(this.state.status === "Stopped"){
            currentComponent.setState({status: "Starting"});
            setTimeout(function(){ currentComponent.setState({status: "Running"}) }, 30000);
            /*axios.post("http://localhost:8081/buyRatio", {buyRatio: this.state.bufferRate/100})
            .then(function (response) {
                currentComponent.setState({status: "Starting"});
                current.Component.setTimeout(function(){ currentComponent.setState({status: "Running"}) }, 30000);
            })
            .catch(function (error) {
            });*/
        }
    }

  render() {
    return (
        <div className="coalPowerPlantBox">
            <h1>Coal Power plant</h1><br/>
            <div style={{margin: "1.0em"}}><b>Status:</b> {this.state.status} <span className="dot" style={this.dotStyle()}/></div><br/><button type="submit" className="sendButton" style={{float: "none", margin: "1.0em"}} onClick={()=>{this.startStopProduction()}}>{this.startStop() + " production"}</button>
            <div className="flexboxRowNoFlip" style={{borderTop: "1px solid #6D6B6B"}}>
                <ElectricityData title={"Market demand:"} value={this.props.demand}/>
                <ElectricityData title={"Producing:"} value={this.props.production}/>
            </div>
            <div hidden={this.producing()}>    
                <div className="ratioContainer">
                    <RangeSliders title={"Production rate"} id={"appliedProductionRate"}  value={this.state.productionRate} message={"% production rate"} secondMessage={""} hidden={true} applyHandler={this.applyProductionRate}/>
                </div>
                <div className="ratioContainer">
                    <RangeSliders title={"Send to buffer/Market"} id={"appliedBufferRate"}  value={this.state.bufferRate} message={"% sent to buffer"} secondMessage={"% sent to market"} hidden={false} applyHandler={this.applySendToBuffer}/>
                </div>
            </div>
        </div>
    )
  }
}

export default CoalPowerPlant