import React, { Component } from 'react';
import './pages/pages.css';
import Image from './image';
import UpdateAccount from './updateAccount';
import history from '../history';
import axios from 'axios';
import $ from 'jquery';

export class ManagerProfile extends Component {
    /*Renders a profile page for the manager */

    /*show either update account or profile data */
    enterUpdateProfile = () => {
        history.push('/updateProfile')
    }

    enterProfile = () => {
        history.push('/manager')
    }
    
    /*update states*/
    updateState = (lastname, username) => {
        this.props.updateState(lastname,username);
    }

    /*delete manager account */    
    deleteAccount = (e) =>{
        e.preventDefault();
        if (window.confirm("Do you want to delete your account?")) {
            axios.delete('/user', { data: {
                username: this.props.username
            }
        })
            .then(function (response) {
                console.log(response)
                history.push('/');
            })
            .catch(function (error) {
                console.log(error)
                document.getElementById("managerMess").innerHTML = "Couldn´t delete account";
                $("#managerMess").show();
                $("#managerMess").css("color", "red");
                setTimeout(function() { $("#managerMess").hide(); }, 5000);
            }); 
        } 
    }
    
  render() {
    return (
        <div className="profileBox" hidden={this.props.showProsumers}>
            <h1>Manager</h1>
            <div className="flexboxRow">
                <div style={{width: "60%", padding: "1.0em", margin: "auto"}} >   
                    <Image updateImageName={this.props.updateImageName} source={this.props.imageName} alt={"Manager"}/>
                </div>
                <div className="profileContent" hidden= {!this.props.updateAccount}>
                    <UpdateAccount deleteAccount={this.deleteAccount} id={"managerMess"} updateState={this.updateState} username={this.props.username} name={this.props.name}/> 
                </div>  
                <div className="profileContent" hidden={this.props.updateAccount}>
                    <p>Lastname: {this.props.lastname}</p>
                    <p>Username: {this.props.username}</p>
                    <button type="submit" className="updateUserButton" onClick={() => {this.enterUpdateProfile()}}>Update account</button>
                </div>         
            </div>    
        </div>
    )
  }
}

export default ManagerProfile