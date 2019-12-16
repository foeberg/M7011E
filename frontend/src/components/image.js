import React, { Component } from 'react';
import './pages/pages.css';
import axios from 'axios';
import $ from 'jquery';

export class Image extends Component {
  /*Renders profile image and functionality for uploading a new image */

  state={
    selectedFile: null,
    label: "Choose image",
    disableInputButton: true,
  }

  /*when a file is selected for upload, set states,update text on button with filename*/
  fileSelectedHandler = (event) => {
    if(event.target.files[0]){
      this.setState({
          selectedFile: event.target.files[0],
          label: event.target.files[0].name,
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
    axios.post("/profileImage", fd)
        .then(function (response) {
            currentComponent.props.updateImageName(response.data);
            currentComponent.setState({
                selectedFile: null,
                label: "Choose image",
                disableInputButton: true
            });
            $("#errorMess").css("color", "green");
            $("#errorMess").show();
            document.getElementById("errorMess").innerHTML= "Image uploaded";
            setTimeout(function() { $("#errorMess").hide(); }, 2000);
        })
        .catch(function (error) {
            $("#errorMess").show();
            document.getElementById("errorMess").innerHTML= "Could not upload image";
            setTimeout(function() { $("#errorMess").hide(); }, 2000);
            currentComponent.setState({
                selectedFile: null,
                label: "Choose image",
                disableInputButton: true
            });
        });
    }

  render() {
    return (
      <div className="imageContainer">
        <div className="flexboxColumnNoFlip">
          <img className="image" src={"http://localhost:8081/householdImages/" + this.props.source} alt={this.props.alt} />
          <input type="file" name="file" id="file" className="inputfile" onInput={this.fileSelectedHandler}/>
          <label htmlFor="file" id="choose" >{this.state.label}</label>
          <input className="sendButton" type="button" value="Upload" disabled = {this.state.disableInputButton} onClick={this.fileUploadHandler}/>
          <div id="errorMess" className="errorMsg" hidden={true}></div>
        </div>  
      </div>
    )
  }
}

export default Image