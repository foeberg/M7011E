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
            name: "",
            username: "",
            consumption: 0,
            imageName: "placeholder.jpg",
            price: 0,
            wind: 0,
            buffer: 0,
            production: 0,
            loading: true,
            error: false,
        }
        
        /*Check if user is logged in as prosumer */
        componentDidMount() {
            let currentComponent = this;
            axios.defaults.withCredentials = true;
            axios
            .get('/user')
            .then((res) => {
                if(res.data.role === "manager"){
                    history.push('/manager')
                }else{
                currentComponent.setState({loading: false, username: res.data.username, name: res.data.lastname})
                currentComponent.getData();
                }  
            })
            .catch((error) =>{
                if(error.response.status=== 400){
                    history.push('/');
                }
            });
          }

        /*Get data for prosumers page*/
        async getData(){
            let currentComponent = this;
            await Promise.all([
                axios
                .get('/simulator/wind')
                .then((res) => {    
                    currentComponent.setState({ wind: Math.round(res.data * 100)/100
                })}),
                axios
                .get('/simulator/managerElectricityPrice')
                .then((res) => {
                    currentComponent.setState({ price: Math.round(res.data * 100)/100 })	
                }),
                axios
                .get('/profileImage')
                .then((response) => {
                    currentComponent.setState({ imageName: response.data})
                })
                .catch((error) =>{
                    if(error.response.status=== 400){
                        currentComponent.setState({error: true});
                    }
                }),
                axios
                .get('/simulator/householdBuffer')
                .then((response) => {
                    currentComponent.setState({ buffer: Math.round(response.data * 100)/100})
                })
                .catch((error) =>{
                    if(error.response.status=== 400){
                        currentComponent.setState({error: true});
                    }
                }),
                axios
                .get('/simulator/householdConsumption/')
                .then((response) => {
                    currentComponent.setState({ consumption: Math.round(response.data * 100)/100 })
                })
                .catch((error) =>{
                    if(error.response.status=== 400){
                        currentComponent.setState({error: true});
                    }
                }),
                axios
                .get('/simulator/householdProduction/')
                .then((response) => {
                    currentComponent.setState({ production: Math.round(response.data * 100)/100 })
                })
                .catch((error) =>{
                    if(error.response.status=== 400){
                        currentComponent.setState({error: true});
                    }
                }),
                axios
                .get('/simulator/sellRatio')
                .then((response) => {
                    currentComponent.setState({ soldToMarket: Math.round(response.data*100)})
                })
                .catch((error) =>{
                    if(error.response.status=== 400){
                        currentComponent.setState({error: true});
                    }
                }),
                axios
                .get('/simulator/buyRatio')
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
                currentComponent.interval = setInterval(() => {
                    axios
                    .get('/simulator/householdBuffer')
                    .then((response) => {
                        currentComponent.setState({ buffer: Math.round(response.data * 100)/100})
                    })
                    .catch((error) =>{
                        if(error.response.status=== 400){
                            history.push('/');
                        }
                    });
                    axios
                        .get('/simulator/wind')
                        .then((res) => {
                            currentComponent.setState({ wind: Math.round(res.data * 100)/100})	
                        });
                    axios
                        .get('/simulator/managerElectricityPrice')
                        .then((res) => {
                            currentComponent.setState({ price: Math.round(res.data * 100)/100 })
                        });
                    axios
                        .get('/simulator/householdConsumption/')
                        .then((response) => {
                            currentComponent.setState({ consumption: Math.round(response.data * 100)/100 })
                        })
                        .catch((error) =>{
                            if(error.response.status=== 400){
                                history.push('/');
                            }
                        });
                    axios
                    .get('/simulator/householdProduction/')
                    .then((response) => {
                        currentComponent.setState({ production: Math.round(response.data * 100)/100 })
                    })
                    .catch((error) =>{
                        if(error.response.status=== 400){
                            currentComponent.setState({error: true});
                        }
                    });
                    }, 10000);
        }
        
        componentWillUnmount() {
            clearInterval(this.interval);
        }
        
        /*when user want to change ratio of selling to market, send new value to server*/
        sellToMarketHandler = () => {
            axios.post("/simulator/sellRatio", {sellRatio: this.state.soldToMarket/100})
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
            axios.post("/simulator/buyRatio", {buyRatio: this.state.buyFromMarket/100})
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

    /*update range states */    
    updateSellRange =(value)=>{
        this.setState({ soldToMarket: Math.round(value)})
    }
    updateBuyRange =(value)=>{
        this.setState({ buyFromMarket: Math.round(value)})
    }

    updateImageName = (name) => {
        this.setState({ imageName: name})
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
                        <h3>{this.state.name}</h3>
                        <input className="sendButton" style={{marginBottom: "0.5em"}} type="button" value="Log out" onClick={this.props.logOut}/><br/>
                        <Image updateImageName={this.updateImageName} source={this.state.imageName} alt={"Household"}/>
                    </div> 
                    <div className="mainInfoBox">
                        <h1>Monitoring panel</h1>
                        <div className="displayValues">
                            <ElectricityData unit={"m/s"} value={this.state.wind} title={"Wind"}/>
                            <ElectricityData unit={"kWh"} value={this.state.production} title={"Production"}/>
                            <ElectricityData unit={"kWh"} value={this.state.consumption} title={"Consumption"}/>
                            <ElectricityData unit={"kWh"} value={Math.round((this.state.production - this.state.consumption) * 100)/100} title={"Net Production"}/>
                        </div>
                        <div className="flexboxRow">
                            <div className="ratioContainer">
                                <h3>Excessive production</h3>
                                <RangeSliders minValue={0} maxValue={100} updateRange={this.updateSellRange} title={"Sell to market"} id={"appliedSell"} value={this.state.soldToMarket} message={"% sold to market"} secondMessage={"% sent to buffer"} hidden={false} applyHandler={this.sellToMarketHandler}/>
                            </div>
                            <div className="ratioContainer">
                                <h3>Under-production</h3>
                                <RangeSliders minValue={0} maxValue={100} updateRange={this.updateBuyRange} title={"Buy from market"} id={"appliedBuy"}  value={this.state.buyFromMarket} message={"% bought from market"} secondMessage={"% taken from buffer"} hidden={false} applyHandler={this.buyFromMarketHandler}/>
                            </div>
                        </div>  
                    </div>
                <div className="flexboxColumn"> 
                    <PriceBufferInfoBox title={"Market"} unit={"kr"} value={this.state.price} text={"Current electricity price:"}/>
                    <PriceBufferInfoBox title={"Buffer"} unit={"kWh"} value={this.state.buffer} text={"Your current buffer:"}/>
                </div>    
            </div>      
            </React.Fragment>
        )
    }
  } 
}

export default Prosumer;