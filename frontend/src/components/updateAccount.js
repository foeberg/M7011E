import React, { Component } from 'react';
import './pages/pages.css';
import LoginRegisterInput from './loginRegisterInput';
import $ from 'jquery';
import history from '../history';
import axios from 'axios';

export class UpdateAccount extends Component {
  /*Renders an update account page for manager */

    state = {
        lastname: "",
        password: "",
        errors: {}
      }
    
    /*On input change, set state*/
    onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  
    
    /*Validate input*/
    handleValidation(){
        let lastname = this.state.lastname;
        let password = this.state.password;
        let errors = {};
        let formIsValid = true;
    
        if(!lastname){
          formIsValid = false;
          errors["lastname"] = "Lastname can not be empty";
        }
        if(!password){
          formIsValid = false;
          errors["password"] = "Password can not be empty";
        }
    
        this.setState({errors: errors});
        return formIsValid;
        }
    
    /*update user */
    onSubmit =(e) => {
        e.preventDefault();
        let currentComponent = this
        let lastname = this.state.lastname
        let password = this.state.password
        if(this.handleValidation()){
            axios.post('/user', {
              lastname: lastname,
              password: password
            })
            .then(function (response) {
              console.log(response)
              currentComponent.props.changeState()
              currentComponent.props.updateState(lastname, password);
              document.getElementById("updatedUser").innerHTML = "User updated";
              $("#updatedUser").show();
              $("#updatedUser").css("color", "green");
              setTimeout(function() { $("#updatedUser").hide(); }, 5000);
            })
            .catch(function (error) {
              console.log(error)
              document.getElementById("message").innerHTML = "Couldn´t update";
              $("#message").show();
              $("#message").css("color", "red");
              setTimeout(function() { $("#message").hide(); }, 5000);
            });    
        }
        };

    /*delete manager account */    
    deleteAccount = (e) =>{
        e.preventDefault();
        if (window.confirm("Do you want to delete this account?")) {
            axios.delete('/user')
            .then(function (response) {
                console.log(response)
                history.push('/');
            })
            .catch(function (error) {
              console.log(error)
              document.getElementById("message").innerHTML = "Couldn´t delete account";
              $("#message").show();
              $("#message").css("color", "red");
              setTimeout(function() { $("#message").hide(); }, 5000);
            }); 
        } 
    } 
  render() {
    return (
        <div className="profileContent" hidden= {!this.props.updateAccount}>
            <h3 style={{textAlign:"center"}}>Update account <button type="submit" className="exitButton" onClick={this.props.changeState}>X</button></h3>
            <form>
                <LoginRegisterInput type={"text"} value ={this.state.lastname} name={"lastname"} title={"Lastname"} errors={this.state.errors} onChange={this.onChange}/> 
                <LoginRegisterInput type={"password"} value ={this.state.password} name={"password"} title={"Password"} errors={this.state.errors} onChange={this.onChange}/>
                <div id="message" className="message" hidden = {true}></div>
                <input className="updateUserButton" type="submit" value="Update account" onClick={(event) => this.onSubmit(event)}/>
                <button type="submit" className="deleteButton" onClick={(event) => this.deleteAccount(event)}>Delete account</button>
            </form>
        </div>
    )
  }
}

export default UpdateAccount