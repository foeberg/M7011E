import React, { Component } from 'react'
import './pages.css';

export class PageNotFound extends Component{
    state = {
        loggedIn: null
    }

  render() {
    return (
      <React.Fragment>
          <div>
            <h1>404 - Page not found</h1>
          </div>    
      </React.Fragment>
    )
  } 
}


export default PageNotFound;