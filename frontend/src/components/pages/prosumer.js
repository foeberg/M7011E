import React, { Component } from 'react'
import './pages.css';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

export class Prosumer extends Component{
    state = {
        soldToMarket: 20,
        buyFromMarket: 20
        }
    
  render() {
    return (
        <React.Fragment>
            <div className="flexboxRow">
                <div className="householdInfoBox">
                    <h1>Household</h1>
                    <p>name</p><br/>
                    <input className="submitButton" type="button" value="SignOut"/>
                </div> 
                <div className="mainInfoBox">
                    <h1>Electricity panel</h1>
                    <div className="displayValues">
                        <div className="value">
                            <h4>Wind</h4>
                            <div className="data">0.00</div>
                        </div>
                        <div className="value">
                            <h4>Production</h4>
                            <div className="data">0.00</div>
                        </div>
                        <div className="value">
                            <h4>Consumption</h4>
                            <div className="data">0.00</div>
                        </div>
                        <div className="value">
                            <h4>Net production</h4>
                            <div className="data">0.00</div>
                        </div>
                    </div>
                    <div className="flexboxRow">
                        <div className="ratioContainer">
                            <h3>Excessive production</h3>
                            <p>Sell to market: </p><br/>
                            <InputRange maxValue={100} minValue={0} value={this.state.soldToMarket} onChange={value => this.setState({ ["soldToMarket"]: value })} />
                        </div>
                        <div className="ratioContainer">
                            <h3>Under-production</h3>
                            <p>Buy from market:</p><br/>
                            <InputRange maxValue={100} minValue={0} value={this.state.buyFromMarket} onChange={value => this.setState({ ["buyFromMarket"]: value })} />
                        </div>
                    </div>  
                </div>
            <div className="flexboxColumn">        
                <div className="priceBufferInfoBox">
                    <h1>Market price</h1>
                        <p>price</p>
                </div>
                <div className="priceBufferInfoBox">
                    <h1>Buffer</h1>
                        <p>buffer</p>
                </div>
            </div>    
        </div>      
        </React.Fragment>
    )
  } 
}


export default Prosumer;