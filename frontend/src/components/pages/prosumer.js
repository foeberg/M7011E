import React, { Component } from 'react'
import './pages.css';
import ElectricityData from '../electricityData';
import PriceBufferInfoBox from '../priceBufferInfoBox';
import RangeSliders from '../rangeSliders';
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
            imageName: "placeholder.jpg",
            price: 0,
            wind: 0,
            buffer: 0,
            production: 0,
            loading: true,
            error: false,
        }
        async getData(){
            let currentComponent = this;
            axios.defaults.withCredentials = true;
            await Promise.all([
                axios
                .get('http://localhost:8081/simulator/wind')
                .then((res) => {    
                    currentComponent.setState({ wind: Math.round(res.data * 100)/100,
                        production: Math.round(res.data * 100)/100 })
                }),
                axios
                .get('http://localhost:8081/simulator/electricityPrice')
                .then((res) => {
                    currentComponent.setState({ price: Math.round(res.data * 100)/100 })	
                }),
                axios
                .get('http://localhost:8081/householdImage')
                .then((response) => {
                    currentComponent.setState({ imageName: response.data})
                })
                .catch((error) =>{
                    if(error.response.status=== 400){
                        currentComponent.setState({error: true});
                    }
                }),
                axios
                .get('http://localhost:8081/householdBuffer')
                .then((response) => {
                    currentComponent.setState({ buffer: Math.round(response.data * 100)/100})
                })
                .catch((error) =>{
                    if(error.response.status=== 400){
                        currentComponent.setState({error: true});
                    }
                }),
                axios
                .get('http://localhost:8081/simulator/householdConsumption/')
                .then((response) => {
                    currentComponent.setState({ consumption: Math.round(response.data * 100)/100 })
                })
                .catch((error) =>{
                    if(error.response.status=== 400){
                        currentComponent.setState({error: true});
                    }
                }),
                axios
                .get('http://localhost:8081/sellRatio')
                .then((response) => {
                    currentComponent.setState({ soldToMarket: Math.round(response.data*100)})
                })
                .catch((error) =>{
                    if(error.response.status=== 400){
                        currentComponent.setState({error: true});
                    }
                }),
                axios
                .get('http://localhost:8081/buyRatio')
                .then((response) => {
                    currentComponent.setState({ buyFromMarket: Math.round(response.data*100)})
                })
                .catch((error) =>{
                    if(error.response.status=== 400){
                        currentComponent.setState({error: true});
                    }
                })]).then(function(){
                    if(!currentComponent.state.error){currentComponent.setState({loading: false})
                    }else{
                        history.push('/');
                    }
                });
        }
        /*get data from server*/
        componentDidMount() {
            let currentComponent = this;
            axios.defaults.withCredentials = true;
            this.getData();
            currentComponent.interval = setInterval(() => {
                axios
                .get('http://localhost:8081/householdBuffer')
                .then((response) => {
                    currentComponent.setState({ buffer: Math.round(response.data * 100)/100})
                })
                .catch((error) =>{
                    if(error.response.status=== 400){
                        history.push('/');
                    }
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
                        if(error.response.status=== 400){
                            history.push('/');
                        }
                    });
                }, 10000);
          }
        
          componentWillUnmount() {
            clearInterval(this.interval);
        }

        
        /*when user want to change ratio of selling to market, send new value to server*/
        sellToMarketHandler = (rangeValue) => {
            axios.post("http://localhost:8081/sellRatio", {sellRatio: rangeValue/100})
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
        buyFromMarketHandler = (rangeValue) => {
            axios.post("http://localhost:8081/buyRatio", {buyRatio: rangeValue/100})
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
                                <RangeSliders title={"Sell to market"} id={"appliedSell"} value={this.state.soldToMarket} message={"% sold to market"} secondMessage={"% sent to buffer"} hidden={false} applyHandler={this.sellToMarketHandler}/>
                            </div>
                            <div className="ratioContainer">
                                <h3>Under-production</h3>
                                <RangeSliders title={"Buy from market"} id={"appliedBuy"}  value={this.state.buyFromMarket} message={"% bought from market"} secondMessage={"% taken from buffer"} hidden={false} applyHandler={this.buyFromMarketHandler}/>
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