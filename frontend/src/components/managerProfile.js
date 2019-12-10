import React, { Component } from 'react';
import './pages/pages.css';
import Image from './image';
import UpdateAccount from './updateAccount';

export class Profile extends Component {
    state = {
        updateAccount: false,
    }
    /*show either update account or profile data */
    changeState = () => {
        this.setState({updateAccount: false})
    }
    
    /*update states*/
    updateState = (name, username, email) => {
        this.props.updateState(name,username, email);
    }
    
  render() {
    return (
        <div className="profileBox" hidden={this.props.showProsumers}>
            <h1>Profile</h1>
            <div className="flexboxRow">
                <div style={{width: "60%", padding: "1.0em", margin: "auto"}} >   
                    <Image source={this.props.imageName} alt={"Manager"}/>
                </div>
                <UpdateAccount updateState={this.updateState} updateAccount={this.state.updateAccount} changeState={this.changeState} email={this.props.email} username={this.props.username} name={this.props.name}/> 
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