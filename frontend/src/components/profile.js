import React, { Component } from 'react';
import './pages/pages.css';
import Image from './image';

export class Profile extends Component {
    
  render() {
    return (
        <div className="profileBox">
            <h1>Profile</h1>
            <div className="flexboxRow">
                <div style={{width: "60%", padding: "1.0em", margin: "auto"}} >   
                    <Image source={this.props.imageName} alt={"Manager"}/>
                </div> 
                <div className="profileContent">
                    <p>Name: {this.props.name}</p>
                    <p>E-mail:</p>
                    <p>E-mail:</p>
                    <p>E-mail:</p>
                    <button type="submit" className="updateUserButton" onClick={() => {console.log("update")}}>Update account</button><br/>
                    <button type="submit" className="deleteButton" onClick={() => {console.log("delete")}}>Delete account</button>
                </div>       
            </div>    
        </div>
    )
  }
}

export default Profile