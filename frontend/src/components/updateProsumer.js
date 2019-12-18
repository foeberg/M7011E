import React, { Component } from 'react';
import './pages/pages.css';
import 'react-input-range/lib/css/index.css';
import UpdateAccount from './updateAccount';
import axios from'axios';
import $ from 'jquery';

export class updateProsumer extends Component {
/*renders a modal width the chosen prosumers profile (Manager page)*/

    /*update states*/
    updateState = (lastname, username) => {
        this.props.updateState(lastname,username);
    }

    /*delete prosumer account */    
    deleteAccount = (e) =>{
        const fd = new FormData();
        let currentComponet = this;
        fd.append("username", this.props.username);
        e.preventDefault();
        if (window.confirm("Do you want to delete " + this.props.username + "'s account?")) {
            axios.delete('/user', fd)
            .then(function (response) {
                console.log(response);
                currentComponet.props.closeModal();
            })
            .catch(function (error) {
                console.log(error)
                document.getElementById("prosumerMess").innerHTML = "Couldn´t delete account";
                $("#prosumerMess").show();
                $("#prosumerMess").css("color", "red");
                setTimeout(function() { $("#proseumerMess").hide(); }, 5000);
            }); 
        } 
    }

    render() {
        return (
            <div>
                <div id="profileModal" className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={()=>{this.props.closeModal()}}>&times;</span>
                        <h3 id="prosumersProfile">Name</h3>
                        <div className="flexboxRow">
                            <div className="showProfile">
                                <p>Lastname: {this.props.lastname}</p>
                                <p>Username: {this.props.username}</p>
                                <p>Status: {this.props.status} <span className="dot" style={this.props.dotStyle(this.props.status)}/> </p>    
                            </div>
                            <div className="showProfile" style={{border: "none"}}>
                                <UpdateAccount deleteAccount={this.deleteAccount} id={"prosumerMess"} updateState={this.updateState} username={this.props.username} name={this.props.lastname}/>
                            </div>
                        </div>    
                    </div> 
                </div>
            </div>
        )
    }
}

export default updateProsumer