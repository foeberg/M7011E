import React, { Component } from 'react';
import './pages/pages.css';

export class LoginRegisterInput extends Component {

  render() {
    return (
      <div>
        <label>
          {this.props.title}:<br/>
          <input className="loginInput" type={this.props.type} value = {this.props.value} name={this.props.name} onChange={this.props.onChange}/>
        </label><br/>
        <span style={{color: "red"}}>{this.props.errors[this.props.name]}</span><br/>
      </div>
    )
  }
}

export default LoginRegisterInput