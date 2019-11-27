import React, { Component } from 'react'
import './pages.css';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import ElectricityData from '../electricityData';
import PriceBufferInfoBox from '../priceBufferInfoBox';
import Image from '../image';
import axios from 'axios';
import $ from 'jquery';


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
            imageName: "default.png"
        }

        /*get data from server*/
        componentDidMount() {
            axios.defaults.withCredentials = true;
            axios
            .get('http://localhost:8081/householdImage')
            .then((res) => {
                this.setState({ imageName: res.data})
                console.log(res.data);	
            });
            axios
            .get('http://localhost:8081/simulator/householdConsumption/')
            .then((res) => {
                this.setState({ consumption: Math.round(res.data * 100)/100 })
                console.log(res.data);	
            });
            axios
            .get('http://localhost:8081/sellRatio')
            .then((res) => {
                this.setState({ soldToMarket: res.data*100})
                console.log(res.data);	
            });
            axios
            .get('http://localhost:8081/buyRatio')
            .then((res) => {
                this.setState({ buyFromMarket: res.data*100})
                console.log(res.data);	
            });
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
            const fd = new FormData();
            console.log(this.state.selectedFile + this.state.selectedFile.name)
            fd.append("image", this.state.selectedFile, this.state.selectedFile.name);
            axios.post("http://localhost:8081/householdImage", fd)
                .then(function (response) {
                    console.log(response);
                    this.setState({
                        selectedFile: null,
                        disableInputButton: true
                    });
                    document.getElementById("choose").innerHTML = "Choose image";
                })
                .catch(function (error) {
                    console.log(error);
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
    return (
        <React.Fragment>
            <div className="flexboxRow">
                <div className="householdInfoBox">
                    <h1>Household </h1>
                    <h3>{this.state.name} <input className="sendButton" type="button" value="Log out" onClick={this.props.logOut}/></h3><br/>
                    <Image source={this.state.imageName}/>
                    <input type="file" name="file" id="file" className="inputfile" onChange={this.fileSelectedHandler}/>
                    <label htmlFor="file" id="choose" >Choose image</label>
                    <input className="sendButton" type="button" value="Upload" disabled = {this.state.disableInputButton} onClick={this.fileUploadHandler}/>
                </div> 
                <div className="mainInfoBox">
                    <h1>Monitoring panel</h1>
                    <div className="displayValues">
                        <ElectricityData value={this.props.wind} title={"Wind"}/>
                        <ElectricityData value={this.props.production} title={"Production"}/>
                        <ElectricityData value={this.state.consumption} title={"Consumption"}/>
                        <ElectricityData value={Math.round(this.props.production - this.state.consumption * 100)/100} title={"Net Production"}/>
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
                <PriceBufferInfoBox title={"Market"} value={this.props.price} text={"Current electricity price:"}/>
                <PriceBufferInfoBox title={"Buffer"} value={this.props.buffer} text={"Your current buffer:"}/>
            </div>    
        </div>      
        </React.Fragment>
    )
  } 
}

export default Prosumer;