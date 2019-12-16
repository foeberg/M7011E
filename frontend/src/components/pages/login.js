import React, { Component } from 'react'
import './pages.css';
import { Link } from 'react-router-dom';
import LoginRegisterInput from '../loginRegisterInput';
import axios from 'axios';
import history from '../../history';

export class Login extends Component{
  state = {
    username: '',
    password: '',
    errors: {},
    loading: true
  }

  /*check if user is logged in */
  componentDidMount() {
    axios.defaults.withCredentials = true;
		axios
		.get('http://localhost:8081/api/user')
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
  
  /*on input change => set state */
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    document.getElementById("errorMessage").innerHTML = "";
  }

  /*when user submits form with username and password */
  onSubmit =(e) => {
    e.preventDefault();
    if(this.handleValidation()){
      axios.post('http://localhost:8081/login', {
        username: this.state.username,
        password: this.state.password
      })
      .then(function (response) {
        if(response.status === 200){
          console.log(response)
          history.push('/prosumer');
        }    
      })
      .catch(function (error) {
        if(error.response.status === 400){
          document.getElementById("errorMessage").innerHTML = "Wrong username or password";
        }
      });
    }
  };

  /*validate forms, empty input not accepted*/
  handleValidation(){
    let username = this.state.username;
    let password = this.state.password;
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
                  <h1>Sign in</h1>
                  <form>
                  <LoginRegisterInput type={"text"} value ={this.state.username} name={"username"} title={"Username"} errors={this.state.errors} onChange={this.onChange}/>
                  <LoginRegisterInput type={"password"} value ={this.state.password} name={"password"} title={"Password"} errors={this.state.errors} onChange={this.onChange}/>
                  <div id="errorMessage" className="errorMsg"></div>
                  <input className="submitButton" type="submit" value="Login" onClick={(event) => this.onSubmit(event)}/>
                  </form>
                  <Link className="link" to="/register">Register new user</Link>
              </div>    
          </React.Fragment>
        )
      }
    } 

  }

export default Login;