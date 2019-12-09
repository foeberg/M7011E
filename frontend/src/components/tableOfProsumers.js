import React, { Component } from 'react';
import './pages/pages.css';
import $ from 'jquery';
import InfoPopup from './infoPopup';
import ShowProsumersSystem from './showProsumersSystem';

export class TableOfProsumers extends Component {
    state = {
        prosumers: [{name: "Andersson", status: "Online", id: "5ddbcf110832a6287c5847be"}, {name: "Larsson", status: "Offline", id: "slxaslnx"}],
        production: 0,
        consumption: 0,
        buffer: 0
    }

    /*change color on dot depending on online status */
    dotStyle = (status) => {
        if(status === "Online"){
            return {background: "green"}
        }return {background: "red"}      
    }

    /*block prosumer from selling to the market for 10 sec */
    blockProsumer = (id) => {
        document.getElementById(id).innerHTML = "blocked";
        $("#"+id).css("background-color", "red");
        setTimeout(function() { $("#"+id).css("background-color", "green"); document.getElementById(id).innerHTML = "block";}, 10000);
    }

    /*tabel with all prosumers*/
    renderTableData() {
        return this.state.prosumers.map((prosumer, index) => {
           const { id, name, status} = prosumer //destructuring
           return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{status} {<span className="dot" style={this.dotStyle(status)}/>}</td>
                    <td>{<button type="submit" className="blockButton" id={id} onClick={() => {this.blockProsumer(id)}}>block</button>}</td>
                    <td><button type="submit" id={id} className="viewButton" onClick={() => {this.openModal(id, name)}}>View</button></td>
                </tr>
           )
        })
     }

    // When the user clicks the "view" button, open the modal 
    openModal = (id, name) => {
        console.log("open modal " + id)
        var modal = document.getElementById("myModal");
        document.getElementById("prosumersName").innerHTML= name + "'s system";
        console.log(modal);
        this.getData(id);
        modal.style.display = "block";
    }

    /*get data displayed on modal */
    getData = (id) => {
        let currentComponent = this;
        console.log("get data " + id)
        //axios.defaults.withCredentials = true;
        currentComponent.interval = setInterval(() => {
            currentComponent.setState({production: this.state.production + 1,
                consumption: this.state.consumption + 2, buffer: this.state.buffer + 1})
            }, 1000);

    }

    /*Close the modal when clicking on button "x" */
    closeModal = () => {
        console.log("close modal ")
        var modal = document.getElementById("myModal");
        clearInterval(this.interval);
        this.setState({production: 0, consumption: 0, buffer: 0})
        modal.style.display = "none";
    }
  
  render() {
    return (
        <div className="profileBox" hidden={!this.props.profile}>
            <h1>Prosumers</h1>
            <table id='prosumers'>
               <tbody>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Block <InfoPopup message={"Block prosumer from selling to the market"}/></th>
                        <th>System</th>
                    </tr>
                    {this.renderTableData()}
               </tbody>
            </table>
            <ShowProsumersSystem production={this.state.production} consumption={this.state.consumption} buffer={this.state.buffer} closeModal={this.closeModal}/>
        </div>
    )
  }
}

export default TableOfProsumers