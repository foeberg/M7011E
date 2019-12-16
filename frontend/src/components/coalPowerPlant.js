import React, { Component } from 'react';
import './pages/pages.css';
import ElectricityData from './electricityData';
import RangeSliders from './rangeSliders';
import LoginRegisterInput from './loginRegisterInput';
import $ from 'jquery';
import axios from 'axios';
import history from '../history';

export class CoalPowerPlant extends Component {
    /*Renders coal power plant */

    state = {
        production: 0,
        productionRate: 0,
        bufferRate: 0,
        demand: 0,
        modelledPrice: 0,
        price: 0,
        input: 0,
        status: "",
        buffer: 0,
        errors: {}
    }
    
    /*Get data for coal power plant */
    componentDidMount() {
        let currentComponent = this;
        axios.defaults.withCredentials = true;
        axios
        .get('/simulator/marketDemand')
        .then((res) => {
            currentComponent.setState({ demand: Math.round(res.data * 100)/100 })	
        })
        .catch((error)=>{
            if(error.response.status=== 400){
                history.push('/');
            }
        })
        axios
        .get('/simulator/electricityPrice')
        .then((res) => {
            currentComponent.setState({ modelledPrice: Math.round(res.data * 100)/100 })	
        })
        .catch((error)=>{
            if(error.response.status=== 400){
                history.push('/');
            }
        })
        axios
        .get('/simulator/managerElectricityPrice')
        .then((res) => {
            currentComponent.setState({ price: Math.round(res.data * 100)/100 })	
        })
        .catch((error)=>{
            if(error.response.status=== 400){
                history.push('/');
            }
        })
        axios
        .get('/simulator/powerplant/status')
        .then((res) => {
            currentComponent.setState({status: res.data})
        })
        .catch((error)=>{
            if(error.response.status=== 400){
                history.push('/');
            }
        })
        axios
        .get('/simulator/powerplant/bufferRatio')
        .then((res) => {    
            currentComponent.setState({bufferRate: Math.round(res.data*100) })
        })
        .catch((error) =>{
            if(error.response.status=== 400){
                history.push('/');
            }
        })
        axios
        .get('/simulator/powerplant/buffer')
        .then((res) => {    
            currentComponent.setState({buffer: Math.round(res.data * 1000)/100 })
        })
        .catch((error) =>{
            if(error.response.status=== 400){
                history.push('/');
            }
        })
        axios
        .get('/simulator/powerplant/production')
        .then((res) => {  
            currentComponent.setState({production: Math.round(res.data.value * 100)/100,
            productionRate: res.data.ratio * 100})
        })
        .catch((error) =>{
            if(error.response.status=== 400){
                history.push('/');
            }
        })
        currentComponent.interval = setInterval(() => {
            axios
            .get('/simulator/marketDemand')
            .then((res) => {
                currentComponent.setState({ demand: Math.round(res.data * 100)/100 })	
            })
            .catch((error) =>{
                if(error.response.status=== 400){
                    history.push('/');
                }
            })
            axios
            .get('/simulator/powerplant/production')
            .then((res) => {  
                currentComponent.setState({production: Math.round(res.data.value * 100)/100})
            })
            .catch((error) =>{
                if(error.response.status=== 400){
                    history.push('/');
                }
            })
            axios
            .get('/simulator/powerplant/buffer')
            .then((res) => {    
                currentComponent.setState({buffer: Math.round(res.data * 100)/100 })
            })
            .catch((error) =>{
                if(error.response.status=== 400){
                    history.push('/');
                }
            })
            axios
            .get('/simulator/electricityPrice')
            .then((res) => {
                currentComponent.setState({ modelledPrice: Math.round(res.data * 100)/100 })	
            })
            .catch((error)=>{
                if(error.response.status=== 400){
                    history.push('/');
                }
            })
            }, 10000);
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    /*on input change => set state */
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, errors: {} });

    }

    /*when user submits form */
    onSubmit =(e) => {
        e.preventDefault();
        let currentComponent = this;
        if(this.handleValidation()){
            axios.post('/simulator/managerElectricityPrice', {
                electricityPrice: this.state.input,
            })
            .then(function (response) {
                if(response.status === 200){
                    currentComponent.setState({price: currentComponent.state.input,
                    input: 0})
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
            });
        }
    }
    /*validate form */
    handleValidation(){
        let price = this.state.input;
        let errors = {};
        let formIsValid = true;

        if(!price){
        formIsValid = false;
        errors["input"] = "Field can not be empty";
        }
        if(isNaN(price)){
        formIsValid = false;
        errors["input"] = "Input not valid";
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
        let currentComponent = this;
        axios.post("/simulator/powerplant/production", {production: this.state.productionRate/100})
        .then(function (response) {
            console.log(response)
            if(currentComponent.state.status === "Running"){
                currentComponent.setState({production: 10*(currentComponent.state.productionRate)})
            }
            document.getElementById("appliedProductionRate").innerHTML = "Saved changes";
            $("#appliedProductionRate").show();
            $("#appliedProductionRate").css("color", "green");
            setTimeout(function() { $("#appliedProductionRate").hide(); }, 2000);
        })
        .catch(function (error) {
            console.log(error)
            document.getElementById("appliedProductionRate").innerHTML = "Could not save changes";
            $("#appliedProductionRate").show();
            $("#appliedProductionRate").css("color", "red");
            setTimeout(function() { $("#appliedProductionRate").hide(); }, 2000);
        });
    }
    
    /*when pressing save changes button for send to buffer ratio*/
    applySendToBuffer=()=>{
        axios.post("/simulator/powerplant/bufferRatio", {bufferRatio: this.state.bufferRate/100})
        .then(function (response) {
            console.log(response)
            document.getElementById("appliedBufferRate").innerHTML = "Saved changes";
            $("#appliedBufferRate").show();
            $("#appliedBufferRate").css("color", "green");
            setTimeout(function() { $("#appliedBufferRate").hide(); }, 2000);
        })
        .catch(function (error) {
            console.log(error)
            document.getElementById("appliedBufferRate").innerHTML = "Could not save changes";
            $("#appliedBufferRate").show();
            $("#appliedBufferRate").css("color", "red");
            setTimeout(function() { $("#appliedBufferRate").hide(); }, 2000);
        });
    }

    /*update range states */
    updateProductionRate =(value)=>{
        this.setState({ productionRate: Math.round(value)})
    }

    updateBufferRate =(value)=>{
        this.setState({ bufferRate: Math.round(value)})
    }

    /*when pressing start/stop production button */
    startStopProduction=()=>{
        let currentComponent= this;
        if(this.state.status==="Running"){
            axios.post("/simulator/powerplant/stop")
            .then(function (response) {
                console.log(response)
                currentComponent.setState({status: "Stopped", production: 0, productionRatio: 0});
            })
            .catch(function (error) {
                console.log(error)
                document.getElementById("startStopMess").innerHTML = "Could not stop";
                $("#startStopMess").show();
                $("#startStopMess").css("color", "red");
                setTimeout(function() { $("#startStopMess").hide(); }, 2000);
            });
        }else if(this.state.status === "Stopped"){
            axios.post("/simulator/powerplant/start")
            .then(function (response) {
                console.log(response)
                currentComponent.setState({status: "Starting"});
                setTimeout(function(){ currentComponent.setState({status: "Running", production: 10*currentComponent.state.production}) }, 20000);
            })
            .catch(function (error) {
                console.log(error)
                document.getElementById("startStopMess").innerHTML = "Could not start";
                $("#startStopMess").show();
                $("#startStopMess").css("color", "red");
                setTimeout(function() { $("#startStopMess").hide(); }, 2000);
            });
        }
    }

  render() {
    return (
        <div className="coalPowerPlantBox">
            <h1>Coal Power plant</h1><br/>
            <div style={{margin: "1.0em"}}><b>Status:</b> {this.state.status} <span className="dot" style={this.dotStyle()}/></div><br/>
            <button type="submit" className="sendButton" style={{float: "none", margin: "1.0em"}} onClick={()=>{this.startStopProduction()}}>{this.startStop() + " production"}</button>
            <div id="startStopMess"></div>
                <div className="flexboxRowNoFlip" style={{borderTop: "1px solid #6D6B6B"}}>
                    <ElectricityData unit={"kWh"} title={"Producing:"} value={this.state.production}/>
                    <ElectricityData unit={"kWh"} title={"Market demand:"} value={this.state.demand}/>
                    <ElectricityData unit={"kWh"} title={"Buffer:"} value={this.state.buffer}/>
                </div>
                <div style={{borderTop: "1px solid #6D6B6B", borderBottom: "1px solid #6D6B6B", paddingBottom: "1.0em"}}>
                    <h2>Electricity price</h2>
                    <div className="flexboxRowNoFlip">
                        <ElectricityData unit={"kr"} title={"Modelled price:"} value={this.state.modelledPrice}/>
                        <ElectricityData unit={"kr"} title={"Current price:"} value={this.state.price}/>
                    </div>
                    <form>
                        <LoginRegisterInput type={"text"} value ={this.state.input} name={"input"} title={"Set market price"} errors={this.state.errors} onChange={this.onChange}/>
                        <input className="sendButton" type="submit" value="Submit" style={{width: "20%"}} onClick={(event) => this.onSubmit(event)}/>
                        <div id="errorMess" className="errorMsg"></div>
                    </form>
                </div>     
            <div hidden={this.producing()}>    
                <div className="ratioContainer">
                    <RangeSliders minValue={0} maxValue={100} updateRange={this.updateProductionRate} title={"Production rate"} id={"appliedProductionRate"}  value={this.state.productionRate} message={"% production rate"} secondMessage={""} hidden={true} applyHandler={this.applyProductionRate}/>
                </div>
                <div className="ratioContainer">
                    <RangeSliders minValue={0} maxValue={100} updateRange={this.updateBufferRate} title={"Send to buffer/Market"} id={"appliedBufferRate"}  value={this.state.bufferRate} message={"% sent to buffer"} secondMessage={"% sent to market"} hidden={false} applyHandler={this.applySendToBuffer}/>
                </div>
            </div>
        </div>
    )
  }
}

export default CoalPowerPlant