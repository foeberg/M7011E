import React, { Component } from 'react';
import './pages/pages.css';
import LoginRegisterInput from './loginRegisterInput';

export class UpdateAccount extends Component {
    state = {
        name: this.props.name,
        username: this.props.username,
        email: this.props.email,
        errors: {}
      }
 
    onChange = (e) => this.setState({ [e.target.name]: e.target.value });
    validateEmail =() =>{
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(this.state.email).toLowerCase());
    }    
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
    handleClick =(e) => {
        e.preventDefault();
        if(this.handleValidation()){
            console.log(this.state.username + this.state.email + this.state.name)
            this.props.changeState();
            /*axios.post('http://localhost:8081/', {
            name: this.state.name,
            username: this.state.username,
            email: this.state.email
            })
            .then(function (response) {
            document.getElementById("message").innerHTML = "Account is updated";
            $("#message").show();
            $("#message").css("color", "green");
            setTimeout(function() { $("#message").hide(); }, 5000);
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
            console.log("delete")
            /*axios.post('http://localhost:8081/')
            .then(function (response) {

            })
            .catch(function (error) {
            document.getElementById("message").innerHTML = "Couldn´t delete account";
            $("#message").show();
            $("#message").css("color", "red");
            setTimeout(function() { $("#message").hide(); }, 5000);
            });*/  
          } else {
            console.log("no delete");
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
                <input className="updateUserButton" type="submit" value="Update account" onClick={(event) => this.handleClick(event)}/>
                <button type="submit" className="deleteButton" onClick={(event) => this.deleteAccount(event)}>Delete account</button>
            </form>
        </div>
    )
  }
}

export default UpdateAccount