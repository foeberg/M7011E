import React, { Component } from 'react';
import './pages/pages.css';
import ProsumerItem from './prosumerItem';

export class ProsumerList extends Component {
    state = {
        prosumers: [{name: "Andersson", status: "Online", id: "ejdewkj"}, {name: "Larsson", status: "Offline", id: "slxaslnx"}]
    }
    
  render() {
    return (
        <div className="profileBox" hidden={!this.props.profile}>
            <h1>Prosumers</h1>
            <ProsumerItem prosumers={this.state.prosumers}/>     
        </div>
    )
  }
}

export default ProsumerList