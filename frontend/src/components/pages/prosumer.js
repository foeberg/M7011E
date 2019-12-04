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
            consumption: 0,
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
            //currentComponent.setState({loading: true});
            axios.defaults.withCredentials = true;
            axios
            .get('http://localhost:8081/simulator/wind')
            .then((res) => {
                currentComponent.setState({ wind: Math.round(res.data * 100)/100,
                    production: Math.round(res.data * 100)/100 })
            });
            axios
            .get('http://localhost:8081/simulator/electricityPrice')
            .then((res) => {
                currentComponent.setState({ price: Math.round(res.data * 100)/100 })	
            });
            axios
            .get('http://localhost:8081/householdImage')
            .then((response) => {
                currentComponent.setState({ imageName: response.data, loading: false})
            })
            .catch((error) =>{
                history.push('/');
            });
            axios
            .get('http://localhost:8081/householdBuffer')
            .then((response) => {
                currentComponent.setState({ buffer: Math.round(response.data * 100)/100})
            })
            .catch((error) =>{
                history.push('/');
            });
            axios
            .get('http://localhost:8081/simulator/householdConsumption/')
            .then((response) => {
                currentComponent.setState({ consumption: Math.round(response.data * 100)/100 })
            })
            .catch((error) =>{
                history.push('/');
            });
            axios
            .get('http://localhost:8081/sellRatio')
            .then((response) => {
                currentComponent.setState({ soldToMarket: Math.round(response.data*100)})
            })
            .catch((error) =>{
                history.push('/');
            });
            axios
            .get('http://localhost:8081/buyRatio')
            .then((response) => {
                currentComponent.setState({ buyFromMarket: Math.round(response.data*100), loading: false})
            })
            .catch((error) =>{
                history.push('/');
            });
            currentComponent.interval = setInterval(() => {
                axios
                .get('http://localhost:8081/householdBuffer')
                .then((response) => {
                    currentComponent.setState({ buffer: Math.round(response.data * 100)/100})
                })
                .catch((error) =>{
                    history.push('/');
                });
                axios
                    .get('http://localhost:8081/simulator/wind')
                    .then((res) => {
                        currentComponent.setState({ wind: Math.round(res.data * 100)/100,
                            production: Math.round(res.data * 100)/100 })	
                    });
                axios
                    .get('http://localhost:8081/simulator/electricityPrice')
                    .then((res) => {
                        currentComponent.setState({ price: Math.round(res.data * 100)/100 })
                    });
                axios
                    .get('http://localhost:8081/simulator/householdConsumption/')
                    .then((response) => {
                        currentComponent.setState({ consumption: Math.round(response.data * 100)/100 })
                    })
                    .catch((error) =>{
                        history.push('/');
                    });
                }, 10000);
          }
        
          componentWillUnmount() {
            clearInterval(this.interval);
        }

        
        /*when user want to change ratio of selling to market, send new value to server*/
        sellToMarketHandler = () => {
            this.setState({
                disableSellButton: true
            });
            axios.post("http://localhost:8081/sellRatio", {sellRatio: this.state.soldToMarket/100})
            .then(function (response) {
                document.getElementById("appliedSell").innerHTML = "Saved changes";
                $("#appliedSell").show();
                $("#appliedSell").css("color", "green");
                setTimeout(function() { $("#appliedSell").hide(); }, 2000);
            })
            .catch(function (error) {
                document.getElementById("appliedSell").innerHTML = "Could not save changes";
                $("#appliedSell").show();
                $("#appliedSell").css("color", "red");
                setTimeout(function() { $("#appliedSell").hide(); }, 2000);
            });
        }
        /*when user want to change ratio of buying from market, send new value to server*/
        buyFromMarketHandler = () => {
            this.setState({
                disableBuyButton: true
            });
            axios.post("http://localhost:8081/buyRatio", {buyRatio: this.state.buyFromMarket/100})
            .then(function (response) {
                document.getElementById("appliedBuy").innerHTML = "Saved changes";
                $("#appliedBuy").show();
                $("#appliedBuy").css("color", "green");
                setTimeout(function() { $("#appliedBuy").hide(); }, 2000);
            })
            .catch(function (error) {
                document.getElementById("appliedBuy").innerHTML = "Could not save changes";
                $("#appliedBuy").show();
                $("#appliedBuy").css("color", "red");
                setTimeout(function() { $("#appliedBuy").hide(); }, 2000);
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
                        <h3>{this.state.name} 
                        <input className="sendButton" type="button" value="Log out" onClick={this.props.logOut}/></h3><br/>
                        <Image source={this.state.imageName} alt={"Household"}/>
                    </div> 
                    <div className="mainInfoBox">
                        <h1>Monitoring panel</h1>
                        <div className="displayValues">
                            <ElectricityData value={this.state.wind} title={"Wind"}/>
                            <ElectricityData value={this.state.production} title={"Production"}/>
                            <ElectricityData value={this.state.consumption} title={"Consumption"}/>
                            <ElectricityData value={Math.round((this.state.production - this.state.consumption) * 100)/100} title={"Net Production"}/>
                        </div>
                        <div className="flexboxRow">
                            <div className="ratioContainer">
                                <h3>Excessive production</h3>
                                <h4>Sell to market:</h4>
                                <InputRange  maxValue={100} minValue={0} value={this.state.soldToMarket} onChange={value => this.setState({ soldToMarket: Math.round(value), disableSellButton: false})} />
                                <p>{this.state.soldToMarket}% sold to market</p>
                                <p>{100-this.state.soldToMarket}% sent to buffer</p>
                                <input className="sendButton" type="button" value="Save changes" disabled = {this.state.disableSellButton} onClick={this.sellToMarketHandler}/>
                                <div id="appliedSell" className="appliedSellBuy" hidden={true}></div>
                            </div>
                            <div className="ratioContainer">
                                <h3>Under-production</h3>
                                <h4>Buy from market:</h4>
                                <InputRange  maxValue={100} minValue={0} value={this.state.buyFromMarket} onChange={value => this.setState({ buyFromMarket: Math.round(value), disableBuyButton: false })} />
                                <p>{this.state.buyFromMarket}% bought from market</p>
                                <p>{100-this.state.buyFromMarket}% taken from buffer</p>
                                <input className="sendButton" type="button" value="Save changes" disabled = {this.state.disableBuyButton} onClick={this.buyFromMarketHandler}/>
                                <div id="appliedBuy" className="appliedSellBuy" hidden={true}></div>
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