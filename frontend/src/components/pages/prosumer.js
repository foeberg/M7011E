import React, { Component } from 'react'
import './pages.css';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import ElectricityData from '../electricityData';
import PriceBufferInfoBox from '../priceBufferInfoBox';


export class Prosumer extends Component{
        state = {
            soldToMarket: 0,
            buyFromMarket: 0,
        }

  render() {
    return (
        <React.Fragment>
            <div className="flexboxRow">
                <div className="householdInfoBox">
                    <h1>Household</h1>
                    <p>name</p><br/>
                    <input className="submitButton" type="button" value="Sign out"/>

                </div> 
                <div className="mainInfoBox">
                    <h1>Electricity panel</h1>
                    <div className="displayValues">
                        <ElectricityData value={this.props.wind} title={"Wind"}/>
                        <ElectricityData value={this.props.production} title={"Production"}/>
                        <ElectricityData value={this.props.consumption} title={"Consumption"}/>
                        <ElectricityData value={this.props.production - this.props.consumption} title={"Net Production"}/>
                    </div>
                    <div className="flexboxRow">
                    <div className="ratioContainer">
                            <h3>Excessive production</h3>
                            <h4>Sell to market:</h4><br/>
                            <InputRange  maxValue={100} minValue={0} value={this.state.soldToMarket} onChange={value => this.setState({ soldToMarket: value })} />
                            <p>{this.state.soldToMarket}% sold to market</p>
                            <p>{100-this.state.soldToMarket}% sent to buffer</p>
                        </div>
                        <div className="ratioContainer">
                            <h3>Under-production</h3>
                            <h4>Buy from market:</h4><br/>
                            <InputRange  maxValue={100} minValue={0} value={this.state.buyFromMarket} onChange={value => this.setState({ buyFromMarket: value })} />
                            <p>{this.state.buyFromMarket}% bought from market</p>
                            <p>{100-this.state.buyFromMarket}% taken from buffer</p>
                        </div>
                    </div>  
                </div>
            <div className="flexboxColumn"> 
                <PriceBufferInfoBox title={"Market Price"} value={this.props.price}/>
                <PriceBufferInfoBox title={"Buffer"} value={this.props.buffer}/>
            </div>    
        </div>      
        </React.Fragment>
    )
  } 
}

export default Prosumer;