import React, { Component } from 'react';
import './pages/pages.css';
import LoginRegisterInput from './loginRegisterInput';
import $ from 'jquery';
import history from '../history';

export class UpdateAccount extends Component {
    state = {
        name: this.props.name,
        username: this.props.username,
        email: this.props.email,
        errors: {}
      }
    
    /*On input change, set state*/
    onChange = (e) => this.setState({ [e.target.name]: e.target.value });
    
    validateEmail =() =>{
        var re = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
        return re.test(String(this.state.email).toLowerCase());
    }
    
    /*Validate input*/
    handleValidation(){
        let name = this.state.name;
        let username = this.state.username;
        let email = this.state.email;
        let errors = {};
        let formIsValid = true;
    
        if(!name){
          formIsValid = false;
          errors["name"] = "Name can not be empty";
        }
        if(!username){
          formIsValid = false;
          errors["username"] = "Username can not be empty";
        }
    
        if(!email){
          formIsValid = false;
          errors["email"] = "E-mail can not be empty";
        }
        if(!this.validateEmail()){
            formIsValid = false;
            errors["email"] = "E-mail is not valid";
        }
    
        this.setState({errors: errors});
        return formIsValid;
        }

    onSubmit =(e) => {
        e.preventDefault();
        let currentComponent = this
        let name = this.state.name
        let username = this.state.username
        let email = this.state.email
        if(this.handleValidation()){
            this.props.changeState();
            currentComponent.props.updateState(name, username, email);
            /*axios.post('http://localhost:8081/', {
              name: this.state.name,
              username: this.state.username,
              email: this.state.email
            })
            .then(function (response) {
              currentComponent.props.updateState(name, username, email);
            })
            .catch(function (error) {
              document.getElementById("message").innerHTML = "Couldn´t update";
              $("#message").show();
              $("#message").css("color", "red");
              setTimeout(function() { $("#message").hide(); }, 5000);
            });*/    
        }
        };
    deleteAccount = (e) =>{
        e.preventDefault();
        if (window.confirm("Do you want to delete this account?")) {
            /*axios.post('http://localhost:8081/')
            .then(function (response) {
                history.push('/');
            })
            .catch(function (error) {
            document.getElementById("message").innerHTML = "Couldn´t delete account";
            $("#message").show();
            $("#message").css("color", "red");
            setTimeout(function() { $("#message").hide(); }, 5000);
            });*/  
        } 
    } 
  render() {
    return (
        <div className="profileContent" hidden= {!this.props.updateAccount}>
            <h3 style={{textAlign:"center"}}>Update account <button type="submit" className="exitButton" onClick={this.props.changeState}>X</button></h3>
            <form>
                <LoginRegisterInput type={"text"} value ={this.state.name} name={"name"} title={"Name"} errors={this.state.errors} onChange={this.onChange}/> 
                <LoginRegisterInput type={"text"} value ={this.state.username} name={"username"} title={"Username"} errors={this.state.errors} onChange={this.onChange}/>
                <LoginRegisterInput type={"text"} value ={this.state.email} name={"email"} title={"E-mail"} errors={this.state.errors} onChange={this.onChange}/>
                <div id="message" className="message" hidden = {true}></div>
                <input className="updateUserButton" type="submit" value="Update account" onClick={(event) => this.onSubmit(event)}/>
                <button type="submit" className="deleteButton" onClick={(event) => this.deleteAccount(event)}>Delete account</button>
            </form>
        </div>
    )
  }
}

export default UpdateAccount