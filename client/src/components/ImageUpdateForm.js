import React from 'react';
import axios from 'axios';
import {getJwt} from '../helpers/jwt';
import '../App.css';
import loading from '../images/loading.gif';

class ImageUpdateForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentImage: undefined,
            selectedFile: undefined,
            errorMsg: "",
            hasSubmitted: false
        };
    }

    componentDidMount() {
        this.retrieveUser();
    }

    retrieveUser = () => {
        const jwt = getJwt();
        axios({ 
        url: '/api/getuser',
        method: 'GET',
        headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then((res) => {
            const user = res.data;
            this.setState({
              currentImage: user[0].imageData
            });
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }

    imageChange = (e) => {
        if(!e.target.files[0]) return;
        console.log(e.target.files[0]);
        this.setState({
            currentImage: URL.createObjectURL(e.target.files[0]),
            selectedFile: e.target.files[0]
        });
    }

    handleProfileUpdate = (e) => {
        e.preventDefault();
        const jwt = getJwt();
        const {selectedFile} = this.state;
        this.setState({hasSubmitted: true});
        let newImage = new FormData();
        newImage.append('image', selectedFile, selectedFile.name);
        axios({
          url: '/api/updateprofileimg',
          method: 'PUT',
          data: newImage, 
          headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data; boundary=${newImage._boundary}`,
            'Authorization' : `Bearer ${jwt}`
            }
        })
        .then((response) => {
            if ( 200 === response.status ) {
                if( response.data.error ) {
                    if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
                    this.setState({ 
                        errorMsg: 'Max size: 2MB',
                        hasSubmitted: false
                    });
                    } else {
                        console.log( response.data );
                        this.setState({ 
                            errorMsg: "File must be an image",
                            hasSubmitted: false
                        });
                    }
                } else {
                    let fileName = response.data;
                    console.log('filedata', fileName );
                    alert("New profile photo uploaded");
                    this.props.retrieveUser();
                    this.props.retrieveAllUsers();
                    this.props.retrieveAllPosts();
                    this.props.closeImageForm();
                }
            }
        })
        .catch(() => {
            this.setState({
                errorMsg: "Error loading image",
                hasSubmitted: false
            })
        });
    };

    render() {
        const {currentImage, hasSubmitted} = this.state;
        let current;
        if(currentImage === undefined){
            current = ""
        }
        else {
           current = currentImage; 
        }
        return (
            <div className="container mt-3">
                <div className="row">
                    <div className="col-sm"></div>
                    <div className="col-sm-8">
                        <h5>Profile Photo Update</h5>
                        <img src={current} className="img-thumbnail preview-img" alt="current profile" />
                        <form onSubmit={this.handleProfileUpdate}>
                        <span className="text-danger">{this.state.errorMsg}</span>
                            <div className="input-group">
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" onChange={this.imageChange} />
                                    <label className="custom-file-label" htmlFor="inputGroupFile01">Choose new profile photo</label>
                                </div>
                            </div>
                            <button className="btn btn-primary">Submit</button> 
                            {hasSubmitted && <img src={loading} alt="progress loading" />}
                        </form>
                    </div>
                    <div className="col-sm"></div>
                </div>
                
            </div>
        );
    }
}

export default ImageUpdateForm;