import React, { Component } from 'react'
import './pages.css';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import ElectricityData from '../electricityData';
import PriceBufferInfoBox from '../priceBufferInfoBox';
import Image from '../image';
import axios from 'axios';
import $ from 'jquery';
import history from '../../history';

export class Prosumer extends Component{
        state = {
            soldToMarket: 0,
            buyFromMarket: 0,
            name: "Andersson",
            selectedFile: null,
            consumption: 0,
            disableInputButton: true,
            disableSellButton: true,
            disableBuyButton: true,
            imageName: "placeholder.jpg",
            price: 0,
            wind: 0,
            buffer: 0,
            production: 0,
            loading: true
        }

        /*get data from server*/
        componentDidMount() {
            let currentComponent = this;
            currentComponent.setState({loading: true});
            axios.defaults.withCredentials = true;
            axios
            .get('http://localhost:8081/simulator/wind')
            .then((res) => {
                currentComponent.setState({ wind: Math.round(res.data * 100)/100,
                    production: Math.round(res.data * 100)/100 })
                console.log(res.data);	
            });
            axios
            .get('http://localhost:8081/simulator/electricityPrice')
            .then((res) => {
                currentComponent.setState({ price: Math.round(res.data * 100)/100 })
                console.log(res.data);	
            });
            axios
            .get('http://localhost:8081/householdImage')
            .then((response) => {
                currentComponent.setState({ imageName: response.data})
                console.log(response.data);	
            })
            .catch((error) =>{
                console.log("image " + error.response.data);
                history.push('/');
            });
            axios
            .get('http://localhost:8081/simulator/householdConsumption/')
            .then((response) => {
                currentComponent.setState({ consumption: Math.round(response.data * 100)/100 })
                console.log(response.data);	
            })
            .catch((error) =>{
                console.log("image " + error);
                history.push('/');
            });
            axios
            .get('http://localhost:8081/sellRatio')
            .then((response) => {
                currentComponent.setState({ soldToMarket: response.data*100})
                console.log(response.data);	
            })
            .catch((error) =>{
                console.log("image " + error);
                history.push('/');
            });
            axios
            .get('http://localhost:8081/buyRatio')
            .then((response) => {
                currentComponent.setState({ buyFromMarket: response.data*100, loading: false})
                console.log(response.data);	
            })
            .catch((error) =>{
                console.log("image " + error);
                history.push('/');
            });
            currentComponent.interval = setInterval(() => {
                axios
                    .get('http://localhost:8081/simulator/wind')
                    .then((res) => {
                        currentComponent.setState({ wind: Math.round(res.data * 100)/100,
                            production: Math.round(res.data * 100)/100 })
                        console.log(res.data);	
                    });
                axios
                    .get('http://localhost:8081/simulator/electricityPrice')
                    .then((res) => {
                        currentComponent.setState({ price: Math.round(res.data * 100)/100 })
                        console.log(res.data);	
                    });
                axios
                    .get('http://localhost:8081/simulator/householdConsumption/')
                    .then((response) => {
                        currentComponent.setState({ consumption: Math.round(response.data * 100)/100 })
                        console.log(response.data);	
                    })
                    .catch((error) =>{
                        console.log("image " + error);
                        history.push('/');
                    });
                }, 10000);
          }
        
          componentWillUnmount() {
            clearInterval(this.interval);
        }
        /*when a file is selected for upload, set states,update text on button with filename*/  
        fileSelectedHandler = (event) => {
            this.setState({
                selectedFile: event.target.files[0],
                disableInputButton: false
            });
            document.getElementById("choose").innerHTML = event.target.files[0].name;
        }
        
        /*when upload button is pressed, send image to server*/
        fileUploadHandler = () => {
            let currentComponent = this;
            const fd = new FormData();
            fd.append("file", this.state.selectedFile, this.state.selectedFile.name);
            console.log(fd)
            axios.post("http://localhost:8081/householdImage", fd)
                .then(function (response) {
                    currentComponent.setState({
                        selectedFile: null,
                        disableInputButton: true
                    });
                    document.getElementById("choose").innerHTML = "Choose image";
                })
                .catch(function (error) {
                    $("#errorMess").show();
                    setTimeout(function() { $("#errorMess").hide(); }, 2000);
                    currentComponent.setState({
                        selectedFile: null,
                        disableInputButton: true
                    });
                    document.getElementById("choose").innerHTML = "Choose image";
                });
        }
        
        /*when user want to change ratio of selling to market, send new value to server*/
        sellToMarketHandler = () => {
            this.setState({
                disableSellButton: true
            });
            axios.post("http://localhost:8081/sellRatio", {sellRatio: this.state.soldToMarket/100})
            .then(function (response) {
                console.log(response);
                $("#appliedSell").show();
                setTimeout(function() { $("#appliedSell").hide(); }, 2000);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        /*when user want to change ratio of buying from market, send new value to server*/
        buyFromMarketHandler = () => {
            this.setState({
                disableBuyButton: true
            });
            axios.post("http://localhost:8081/buyRatio", {buyRatio: this.state.buyFromMarket/100})
            .then(function (response) {
                console.log(response);
                $("#appliedBuy").show();
                setTimeout(function() { $("#appliedBuy").hide(); }, 2000);
            })
            .catch(function (error) {
                console.log(error);
            });
        }

  render() {
      if(this.state.loading){
        return(<div></div>)
      }else{
        return (
            <React.Fragment>
                <div className="flexboxRow">
                    <div className="householdInfoBox">
                        <h1>Household </h1>
                        <h3>{this.state.name} <input className="sendButton" type="button" value="Log out" onClick={this.props.logOut}/></h3><br/>
                        <Image source={this.state.imageName}/>
                        <input type="file" name="file" id="file" className="inputfile" onInput={this.fileSelectedHandler}/>
                        <label htmlFor="file" id="choose" >Choose image</label>
                        <input className="sendButton" type="button" value="Upload" disabled = {this.state.disableInputButton} onClick={this.fileUploadHandler}/>
                        <div id="errorMess" className="errorMsg" hidden={true}>Invalid image format</div>
                    </div> 
                    <div className="mainInfoBox">
                        <h1>Monitoring panel</h1>
                        <div className="displayValues">
                            <ElectricityData value={this.state.wind} title={"Wind"}/>
                            <ElectricityData value={this.state.production} title={"Production"}/>
                            <ElectricityData value={this.state.consumption} title={"Consumption"}/>
                            <ElectricityData value={Math.round(this.state.production - this.state.consumption * 100)/100} title={"Net Production"}/>
                        </div>
                        <div className="flexboxRow">
                            <div className="ratioContainer">
                                <h3>Excessive production</h3>
                                <h4>Sell to market:</h4>
                                <InputRange  maxValue={100} minValue={0} value={this.state.soldToMarket} onChange={value => this.setState({ soldToMarket: value, disableSellButton: false})} />
                                <p>{this.state.soldToMarket}% sold to market</p>
                                <p>{100-this.state.soldToMarket}% sent to buffer</p>
                                <input className="sendButton" type="button" value="Save changes" disabled = {this.state.disableSellButton} onClick={this.sellToMarketHandler}/>
                                <div id="appliedSell" className="appliedSellBuy" hidden={true}>Saved changes</div>
                            </div>
                            <div className="ratioContainer">
                                <h3>Under-production</h3>
                                <h4>Buy from market:</h4>
                                <InputRange  maxValue={100} minValue={0} value={this.state.buyFromMarket} onChange={value => this.setState({ buyFromMarket: value, disableBuyButton: false })} />
                                <p>{this.state.buyFromMarket}% bought from market</p>
                                <p>{100-this.state.buyFromMarket}% taken from buffer</p>
                                <input className="sendButton" type="button" value="Save changes" disabled = {this.state.disableBuyButton} onClick={this.buyFromMarketHandler}/>
                                <div id="appliedBuy" className="appliedSellBuy" hidden={true}>Saved changes</div>
                            </div>
                        </div>  
                    </div>
                <div className="flexboxColumn"> 
                    <PriceBufferInfoBox title={"Market"} value={this.state.price} text={"Current electricity price:"}/>
                    <PriceBufferInfoBox title={"Buffer"} value={this.state.buffer} text={"Your current buffer:"}/>
                </div>    
            </div>      
            </React.Fragment>
        )
    }
  } 
}

export default Prosumer;