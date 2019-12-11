import React, { Component } from 'react';
import './pages/pages.css';
import ElectricityData from './electricityData';
import RangeSliders from './rangeSliders';
import LoginRegisterInput from './loginRegisterInput';
import $ from 'jquery';

export class CoalPowerPlant extends Component {
    state = {
        status: this.props.status,
        productionRate: this.props.productionRate,
        bufferRate: this.props.bufferRate,
        price: this.props.price,
        errors: {}
    }

    /*on input change => set state */
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, errors: {} });

    }

    /*when user submits form */
    onSubmit =(e) => {
        e.preventDefault();
        if(this.handleValidation()){
            /*axios.post('http://localhost:8081/setPrice', {
                price: this.state.price,
            })
            .then(function (response) {
                if(response.status === 200){
                    this.props.updatePrice(this.state.price);
                    document.getElementById("errorMess").innerHTML = "Price updated";
                    $("#errorMess").show();
                    $("#errorMess").css("color", "green");
                    setTimeout(function() { $("#errorMess").hide(); }, 5000);
                }    
            })
            .catch(function (error) {
                document.getElementById("errorMess").innerHTML = "Couldn't update price";
                $("#errorMess").show();
                $("#errorMess").css("color", "red");
                setTimeout(function() { $("#errorMess").hide(); }, 5000);
            });*/
        }
    }

    /*validate form */
    handleValidation(){
        let price = this.state.price;
        let errors = {};
        let formIsValid = true;

        if(!price){
        formIsValid = false;
        errors["price"] = "Field can not be empty";
        }
        if(isNaN(price)){
        formIsValid = false;
        errors["price"] = "Input not valid";
        }

        this.setState({errors: errors});
        return formIsValid;
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
                    <ElectricityData title={"Producing:"} value={this.props.production}/>
                    <ElectricityData title={"Market demand:"} value={this.props.demand}/>
                </div>
                <div style={{borderTop: "1px solid #6D6B6B", borderBottom: "1px solid #6D6B6B", paddingBottom: "1.0em"}}>
                    <h2>Electricity price</h2>
                    <div className="flexboxRowNoFlip">
                        <ElectricityData title={"Modelled price:"} value={this.props.modelledPrice}/>
                        <ElectricityData title={"Current price:"} value={this.props.price}/>
                    </div>
                    <form>
                        <LoginRegisterInput type={"text"} value ={this.state.price} name={"price"} title={"Set market price"} errors={this.state.errors} onChange={this.onChange}/>
                        <input className="sendButton" type="submit" value="Submit" style={{width: "15%"}} onClick={(event) => this.onSubmit(event)}/>
                        <div id="errorMess" className="errorMsg"></div>
                    </form>
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