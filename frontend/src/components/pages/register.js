import React, { Component } from 'react'
import './pages.css';
import { Link } from 'react-router-dom';
import LoginRegisterInput from '../loginRegisterInput';

export class Register extends Component{
  state = {
    household: '',
    createUsername: '',
    createPassword: '',
    errors: {}
  } 
  
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  handleClick =(e) => {
    e.preventDefault();
    if(this.handleValidation()){

    }else{
    
    }
  };

  handleValidation(){
    let household = this.state.household;
    let username = this.state.createUsername;
    let password = this.state.createPassword;
    let errors = {};
    let formIsValid = true;

    if(!username){
      formIsValid = false;
      errors["createUsername"] = "Username can not be empty";
    }
    if(!password){
      formIsValid = false;
      errors["createPassword"] = "Password can not be empty";
    }

    if(!household){
      formIsValid = false;
      errors["household"] = "Household can not be empty";
    }

    this.setState({errors: errors});
    return formIsValid;
    }

  render() {
    return (
      <React.Fragment>
          <div className="loginRegisterContainer">
              <h1>Register</h1>
              <form>
                <LoginRegisterInput type={"text"} value ={this.state.household} name={"household"} title={"Household"} errors={this.state.errors} onChange={this.onChange}/> 
                <LoginRegisterInput type={"text"} value ={this.state.createUsername} name={"createUsername"} title={"Username"} errors={this.state.errors} onChange={this.onChange}/>
                <LoginRegisterInput type={"password"} value ={this.state.createPassword} name={"createPassword"} title={"Password"} errors={this.state.errors} onChange={this.onChange}/>
              <input className="submitButton" type="submit" value="Submit" onClick={(event) => this.handleClick(event)}/>
              </form>
              <Link className="link" to="/">Back to sign in page</Link>
          </div>    
      </React.Fragment>
    )
  }
}


export default Register;