import React, { Component } from 'react';
import './pages/pages.css';
import axios from 'axios';
import $ from 'jquery';

export class Image extends Component {
  state={
    selectedFile: null,
    disableInputButton: true
  }

  /*when a file is selected for upload, set states,update text on button with filename*/
  fileSelectedHandler = (event) => {
    if(event.target.files[0]){
      this.setState({
          selectedFile: event.target.files[0],
          disableInputButton: false
      });
      document.getElementById("choose").innerHTML = event.target.files[0].name;
    }
  }
  
  /*when upload button is pressed, send image to server*/
  fileUploadHandler = () => {
    let currentComponent = this;
    const fd = new FormData();
    fd.append("file", this.state.selectedFile, this.state.selectedFile.name);
    console.log(fd)
    axios.post("http://localhost:8081/householdImage", fd)
        .then(function (response) {
            currentComponent.setState({
                selectedFile: null,
                disableInputButton: true
            });
            document.getElementById("choose").innerHTML = "Choose image";
        })
        .catch(function (error) {
            $("#errorMess").show();
            setTimeout(function() { $("#errorMess").hide(); }, 2000);
            currentComponent.setState({
                selectedFile: null,
                disableInputButton: true
            });
            document.getElementById("choose").innerHTML = "Choose image";
        });
    }

  render() {
    return (
      <div className="imageContainer">
        <div className="flexboxColumnNoFlip">
          <img className="image" src={require("../householdImages/" + this.props.source)} alt={this.props.alt} />
          <input type="file" name="file" id="file" className="inputfile" onInput={this.fileSelectedHandler}/>
          <label htmlFor="file" id="choose" >Choose image</label>
          <input className="sendButton" type="button" value="Upload" disabled = {this.state.disableInputButton} onClick={this.fileUploadHandler}/>
          <div id="errorMess" className="errorMsg" hidden={true}>Invalid image format</div>
        </div>  
      </div>
    )
  }
}

export default Image