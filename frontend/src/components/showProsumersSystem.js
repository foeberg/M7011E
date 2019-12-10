import React, { Component } from 'react';
import './pages/pages.css';
import ElectricityData from './electricityData';

export class ShowProsumersSystem extends Component {

/*renders a modal width the chosen prosumers system */
    render() {
        return (
            <div>
                <div id="myModal" className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={()=>{this.props.closeModal()}}>&times;</span>
                        <h3 id="prosumersName">Name</h3>
                        <div className="displayValues">
                            <ElectricityData value={this.props.production} title={"Production"}/>
                            <ElectricityData value={this.props.consumption} title={"Consumption"}/>
                            <ElectricityData value={Math.round((this.props.production - this.props.consumption) * 100)/100} title={"Net Production"}/>
                            <ElectricityData value={this.props.buffer} title={"Buffer"}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ShowProsumersSystem