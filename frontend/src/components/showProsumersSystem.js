import React, { Component } from 'react';
import './pages/pages.css';
import ElectricityData from './electricityData';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

export class ShowProsumersSystem extends Component {
/*renders a modal width the chosen prosumers system (Manager page)*/

    render() {
        return (
            <div>
                <div id="myModal" className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={()=>{this.props.closeModal()}}>&times;</span>
                        <h3 id="prosumersName">Name</h3>
                        <div className="displayValues">
                            <ElectricityData unit={"kWh"} value={this.props.production} title={"Production"}/>
                            <ElectricityData unit={"kWh"} value={this.props.consumption} title={"Consumption"}/>
                            <ElectricityData unit={"kWh"} value={Math.round((this.props.production - this.props.consumption) * 100)/100} title={"Net Production"}/>
                            <ElectricityData unit={"kWh"} value={this.props.buffer} title={"Buffer"}/>
                            <ElectricityData unit={"%"} value={this.props.sellRatio} title={"Sold to market"}/>
                            <ElectricityData unit={"%"} value={this.props.buyRatio} title={"Bought from market"}/>
                        </div>
                        <div id="blockProsumer">
                            <h3 id="blockName">Block prosumer from selling to the market</h3>
                            <InputRange maxValue={100} minValue={10} value={this.props.time} onChange={value => {this.props.updateTimeRange(value)}} />
                            <p>{this.props.time + " seconds"}</p>
                            <button className="sendButton" onClick={(e)=>{this.props.applyBlockProsumer()}}>Block</button>
                            <div id="blocked"></div>  
                        </div>    
                     </div> 
                </div>
            </div>
        )
    }
}

export default ShowProsumersSystem