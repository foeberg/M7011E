import React, { Component } from 'react';
import './pages/pages.css';
import LoginRegisterInput from './loginRegisterInput';
import $ from 'jquery';
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
              password: password,
              username: this.props.username
            })
            .then(function (response) {
              console.log(response)
              currentComponent.props.updateState(lastname, password);
              document.getElementById(currentComponent.props.id).innerHTML = "User updated";
              $("#" + currentComponent.props.id).show();
              $("#" + currentComponent.props.id).css("color", "green");
              setTimeout(function() { $("#" + currentComponent.props.id).hide(); }, 5000);
            })
            .catch(function (error) {
              document.getElementById(currentComponent.props.id).innerHTML = "Couldn´t update";
              $("#" + currentComponent.props.id).show();
              $("#" + currentComponent.props.id).css("color", "red");
              setTimeout(function() { $("#" + currentComponent.props.id).hide(); }, 5000);
            });    
        }
        };
 
  render() {
    return (
        <div>
            <h3 style={{textAlign:"center"}}>Update account</h3>
            <form>
                <LoginRegisterInput type={"text"} value ={this.state.lastname} name={"lastname"} title={"Lastname"} errors={this.state.errors} onChange={this.onChange}/> 
                <LoginRegisterInput type={"password"} value ={this.state.password} name={"password"} title={"Password"} errors={this.state.errors} onChange={this.onChange}/>
                <div id={this.props.id} className="message" hidden = {true}></div>
                <input className="updateUserButton" type="submit" value="Update account" onClick={(event) => this.onSubmit(event)}/>
                <button type="submit" className="deleteButton" onClick={(event) => this.props.deleteAccount(event)}>Delete account</button>
            </form>
        </div>
    )
  }
}

export default UpdateAccount