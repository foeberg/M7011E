import React, { Component } from 'react';
import './pages/pages.css';
import Image from './image';
import UpdateAccount from './updateAccount';

export class Profile extends Component {
    state = {
        updateAccount: false,
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        document.getElementById("errorMessage").innerHTML = "";
        }
    changeState = () => {
        this.setState({updateAccount: false})
    }      
    
  render() {
    return (
        <div className="profileBox">
            <h1>Profile</h1>
            <div className="flexboxRow">
                <div style={{width: "60%", padding: "1.0em", margin: "auto"}} >   
                    <Image source={this.props.imageName} alt={"Manager"}/>
                </div>
                <UpdateAccount updateAccount={this.state.updateAccount} changeState={this.changeState} email={this.props.email} username={this.props.username} name={this.props.name} onChange={this.onChange}/> 
                <div className="profileContent" hidden={this.state.updateAccount}>
                    <p>Name: {this.props.name}</p>
                    <p>Username: {this.props.username}</p>
                    <p>E-mail: {this.props.email}</p>
                    <button type="submit" className="updateUserButton" onClick={() => {this.setState({updateAccount: true})}}>Update account</button>
                </div>       
            </div>    
        </div>
    )
  }
}

export default Profile