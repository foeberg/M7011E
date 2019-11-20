import React, { Component } from 'react'
import './pages.css';
import { Link } from 'react-router-dom';

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
      errors["username"] = "Username can not be empty";
    }
    
    if(!password){
      formIsValid = false;
      errors["password"] = "Password can not be empty";
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
              <label>
                  Household:<br/>
                  <input className="loginInput" type="text" name="household" onChange={this.onChange}/>
              </label><br/>
              <span style={{color: "red"}}>{this.state.errors["household"]}</span><br/>
              <label>
                  Username:<br/>
                  <input className="loginInput" type="text" name="createUsername" onChange={this.onChange}/>
              </label><br/>
              <span style={{color: "red"}}>{this.state.errors["username"]}</span><br/>
              <label>
                  Password:<br/>
                  <input className="loginInput" type="password" name="createPassword" onChange={this.onChange}/>
              </label><br/>
              <span style={{color: "red"}}>{this.state.errors["password"]}</span><br/>
              <input className="submitButton" type="submit" value="Submit" onClick={(event) => this.handleClick(event)}/>
              </form>
              <Link className="link" to="/">Back to sign in page</Link>
          </div>    
      </React.Fragment>
    )
  }
}


export default Register;