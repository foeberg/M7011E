import React, { Component } from 'react'
import './pages.css';
import { Link } from 'react-router-dom';
import LoginRegisterInput from '../loginRegisterInput';
import axios from 'axios';
import $ from 'jquery';
import history from '../../history';

export class Register extends Component{
  state = {
    lastname: '',
    createUsername: '',
    createPassword: '',
    errors: {},
    loading: true
  } 
  
  /*check if user is logged in */
  componentDidMount(){
    axios.defaults.withCredentials = true;
		axios
		.get('/user')
		.then((res) => {
			if(res.data.role === "prosumer"){
				history.push('/prosumer')
			}else if(res.data.role === "manager"){
				history.push('/manager')
			}
		})
		.catch((error) =>{
      this.setState({loading: false})
		});
  }
  
  /*on user input, change state */
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  /*on submit send data to server */
  onSubmit =(e) => {
    e.preventDefault();
    if(this.handleValidation()){
      axios.post('/signup', {
        lastname: this.state.lastname,
        username: this.state.createUsername,
        password: this.state.createPassword
      })
      .then(function (response) {
        console.log(response)
        document.getElementById("message").innerHTML = "User created";
        $("#message").show();
        $("#message").css("color", "green");
        setTimeout(function() { $("#message").hide(); }, 5000);
        history.push('/prosumer');
      })
      .catch(function (error) {
        document.getElementById("message").innerHTML = "Username already exist";
        $("#message").show();
        $("#message").css("color", "red");
        setTimeout(function() { $("#message").hide(); }, 5000);
      });
    }
  };

  /*validate form */
  handleValidation(){
    let lastname = this.state.lastname;
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

    if(!lastname){
      formIsValid = false;
      errors["lastname"] = "Lastname can not be empty";
    }

    this.setState({errors: errors});
    return formIsValid;
    }

  render() {
    if(this.state.loading){
      return(<div></div>)
    }else{
      return (
        <React.Fragment>
            <div className="loginRegisterContainer">
                <h1>Register</h1>
                <form>
                  <LoginRegisterInput type={"text"} value ={this.state.lastname} name={"lastname"} title={"Lastname"} errors={this.state.errors} onChange={this.onChange}/> 
                  <LoginRegisterInput type={"text"} value ={this.state.createUsername} name={"createUsername"} title={"Username"} errors={this.state.errors} onChange={this.onChange}/>
                  <LoginRegisterInput type={"password"} value ={this.state.createPassword} name={"createPassword"} title={"Password"} errors={this.state.errors} onChange={this.onChange}/>
                  <div id="message" className="message" hidden = {true}></div>
                  <input className="submitButton" type="submit" value="Submit" onClick={(event) => this.onSubmit(event)}/>
                </form>
                <Link className="link" to="/">Back to sign in page</Link>
            </div>    
        </React.Fragment>
      )
    }  
  }
}


export default Register;