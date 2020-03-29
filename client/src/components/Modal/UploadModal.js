import React from 'react';
import './UploadModal.css';
import axios from 'axios';
import {getJwt} from '../../helpers/jwt';
import loading from './../../images/loading.gif';

class UploadModal extends React.Component {
  state = {
    selectedFile: undefined,
    currentImage: "https://dogisworld.com/wp-content/uploads/2019/05/goldie.jpg",
    title: "",
    description: "",
    errorMsg: "",
    hasSubmitted: false
  };

  imageChange = (e) => {
    if(!e.target.files[0]) return;
    this.setState({
      currentImage: URL.createObjectURL(e.target.files[0]),
      selectedFile: e.target.files[0]
    });
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name] : value });
  }

  uploadImage = (e) => {
    const {selectedFile, description} = this.state;
    const {firstName, profileImg} = this.props;
    if(!selectedFile){
      this.setState({
        errorMsg: "No image selected"
      })
      return;
    }
    if(description.length <= 2){
      e.preventDefault();
      this.setState({
        errorMsg: "Description must be longer than 2 characters"
      })
      return;
    }
    e.preventDefault();
    this.setState({hasSubmitted: true});
    const jwt = getJwt();
    let newImage = new FormData();
    newImage.append("image", selectedFile, selectedFile.name);
    newImage.append("description", description);
    newImage.append("creatorName", firstName);
    newImage.append("profileImg", profileImg);
    axios({
      url: '/api/newpost',
      method: 'POST',
      data: newImage,
      headers: {
        'accept': 'application/json',
        'accept-language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${newImage._boundary}`,
        'Authorization' : `Bearer ${jwt}`
      }
    })
    .then((res) => {
      const list = res.data.reverse(); 
      this.props.refreshList(list);
    })
    .catch((error) => {
      this.setState({errorMsg: "Images only!"});
      this.setDefaultImage();
    }); 
  };

  setDefaultImage() {
    this.setState({
      multerImage: "https://dogisworld.com/wp-content/uploads/2019/05/goldie.jpg",
      hasSubmitted: false
    })
  };

  render() {
    const {description, currentImage, hasSubmitted} = this.state;
    return (
        <div className="container text-center">
          <div className="row">
            <div className="col-sm"></div>
            <div className="col-sm-8">
              <form onSubmit={(e) => this.uploadImage(e)} encType="multipart/form-data">
                <div className="preview-img">
                  <img src={currentImage} className="img-thumbnail img-fluid" alt="current upload preview" />
                </div>
                <div className="row">
                  <div className="col-sm"></div>
                  <div className="col-sm-9">
                    <div className="input-group">
                      <div className="custom-file">
                          <input type="file" className="custom-file-input" onChange={this.imageChange} />
                          <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm"></div>
                </div>
                <div class="form-group mt-1">
                <span className="text-danger">{this.state.errorMsg}</span>
                  <textarea class="form-control" rows="2" id="comment" 
                    type="text" 
                    placeholder="description..."
                    name="description"                            
                    value={description}
                    onChange={this.handleChange}
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Post</button> 
                {hasSubmitted && <img src={loading} alt="progress loading" />}
              </form>
            </div>
            <div className="col-sm"></div>
          </div>
        </div>
    );
  }
}

export default UploadModal;


