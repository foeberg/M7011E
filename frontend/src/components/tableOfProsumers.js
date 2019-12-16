import React, { Component } from 'react';
import './pages/pages.css';
import $ from 'jquery';
import ShowProsumersSystem from './showProsumersSystem';
import axios from 'axios';
import history from '../history';

export class TableOfProsumers extends Component {
    /*Renders a table of all prosumers (Manager page) */

    state = {
        prosumers: [],
        blackouts: [],
        production: 0,
        consumption: 0,
        buffer: 0,
        sellRatio: 0,
        buyRatio: 0,
        time: 10,
        username: ""
    }

    /*get info about prosumers */
    componentDidMount() {
        axios.defaults.withCredentials = true;
        axios
        .get('/prosumers')
        .then((response) => {
            this.setState({ prosumers: response.data })
        })
        .catch((error) => {
            if(error.response.status === 400){
                history.push('/');
            }
        })
        this.checkForBlackout();
        axios
        .get('/simulator/blackouts')
        .then((response) => {
            console.log(response)
            this.setState({blackouts: response.data})
            this.checkForBlackout();
        })
        .catch((error) => {
            if(error.response.status === 400){
                history.push('/');
            }
        })
        this.interval = setInterval(() => {
            axios
            .get('/simulator/blackouts')
            .then((response) => {
                this.setState({blackouts: response.data})
                this.checkForBlackout();
            })
            .catch((error) => {
                if(error.response.status === 400){
                    history.push('/');
                }
            })
            }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    /*Check if there is a blackout */
    checkForBlackout = () => {
        if(this.state.blackouts.length){
            document.getElementById("blackouts").innerHTML = "BLACK-OUT!!"
            $("#blackouts").css("font-size", "2.0em");
        }else{
            document.getElementById("blackouts").innerHTML = "No black-outs"
            $("#blackouts").css("font-size", "1.2em"); 
        }

    }
    
    /*on user input, change state */
    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    /*change color on dot depending on online status */
    dotStyle = (status) => {
        if(status === "online"){
            return {background: "green"}
        }return {background: "red"}      
    }

    /*table with all prosumers*/
    renderTableData() {
        return this.state.prosumers.map((prosumer, index) => {
           const { username, lastname, status} = prosumer //destructuring
           let blackout = "";
           if(this.state.blackouts.includes(username)){
                blackout = " (Black-out!)";
           }
            return (
                <tr key={username}>
                    <td>{username + blackout}</td>
                    <td>{lastname}</td>
                    <td>{status} {<span className="dot" style={this.dotStyle(status)}/>}</td>
                    <td><button type="submit" className="viewButton" onClick={() => {this.openModal(username, lastname)}}>View</button></td>
                </tr>
            )
        })
     }

    /*block prosumer from selling to the market for x seconds */ 
    applyBlockProsumer = () => {
        const fd = new FormData();
        let currentComponent = this;
        fd.append("time", this.state.time);
        axios.post("/simulator/blockSelling/" + currentComponent.state.username, fd)
            .then(function (response) {
                console.log(response)
                document.getElementById("blocked").innerHTML = currentComponent.state.username + " is blocked for " + currentComponent.state.time + " seconds";
                $("#blocked").show()
                setTimeout(function() { 
                    $("#blocked").hide()
                }, 3000);
            })
            .catch(function (error) {
                console.log(error.response)
                if(error.response.data === "User already blocked."){
                    document.getElementById("blocked").innerHTML = currentComponent.state.username + " is already blocked" ;
                    $("#blocked").show()
                    setTimeout(function() { 
                        $("#blocked").hide()
                    }, 3000);
                }    
            });
    }

    /*update range sliders */
    updateTimeRange =(value)=>{
        this.setState({ time: Math.round(value)})
    }

    /* When the user clicks the "view" button, open the modal */
    openModal = (username, lastname) => {
        var modal = document.getElementById("myModal");
        document.getElementById("prosumersName").innerHTML= lastname + "'s system";
        document.getElementById("blockName").innerHTML= "Block "+ lastname +" from selling to the market";
        this.getData(username);
        modal.style.display = "block";
    }

    /*get data displayed on modal */
    getData = (username) => {
        let currentComponent = this;
        axios.defaults.withCredentials = true;
        axios
        .get('/simulator/prosumer/'+ username)
        .then((response) => {
            currentComponent.setState({ consumption: Math.round(response.data.consumption * 100)/100,
            production: Math.round(response.data.production * 100)/100,
            buffer: Math.round(response.data.buffer * 100)/100,
            sellRatio: Math.round(response.data.sellRatio * 100),
            buyRatio: Math.round(response.data.buyRatio * 100),
            username: username})
            currentComponent.interval = setInterval(() => {
                axios
                .get('/simulator/prosumer/'+ username)
                .then((response) => {    
                    currentComponent.setState({ consumption: Math.round(response.data.consumption * 100)/100,
                        production: Math.round(response.data.production * 100)/100,
                        buffer: Math.round(response.data.buffer * 100)/100 })
                });
                }, 10000);
        })
        .catch((error) =>{
            if(error.response.status === 400){
                history.push('/');
            }
        });
    }

    /*Close the modal when clicking on button "x" */
    closeModal = () => {
        var modal = document.getElementById("myModal");
        clearInterval(this.interval);
        this.setState({production: 0, consumption: 0, buffer: 0, sellRatio: 0, buyRatio: 0, username: "", time: 10})
        modal.style.display = "none";
        document.getElementById("blocked").innerHTML = ""; 
    }
  
  render() {
    return (
        <div className="profileBox" hidden={!this.props.showProsumers}>
            <h1>Prosumers</h1>
            <div id="blackouts"></div>
            <table id='prosumers'>
               <tbody>
                    <tr>
                        <th>Username</th>
                        <th>Lastname</th>
                        <th>Status</th>
                        <th>System</th>
                    </tr>
                    {this.renderTableData()}
               </tbody>
            </table>
            <ShowProsumersSystem updateTimeRange={this.updateTimeRange} time={this.state.time} applyBlockProsumer={this.applyBlockProsumer} sellRatio={this.state.sellRatio} buyRatio={this.state.buyRatio} production={this.state.production} consumption={this.state.consumption} buffer={this.state.buffer} closeModal={this.closeModal}/>
        </div>
    )
  }
}

export default TableOfProsumers