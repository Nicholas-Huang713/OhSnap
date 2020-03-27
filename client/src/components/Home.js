import React from 'react';
import '../App.css';
import view from '../images/view.jpg';
import beach from '../images/beach-camera.jpg';
import phone from '../images/phone.jpg';
import {withRouter, Link} from 'react-router-dom';

class Home extends React.Component{
    constructor( props ) {
        super( props );
        this.state = {
        }
      }

    render(){
        return (
            <div>
              <div className="jumbotron jumbotron-fluid home-style">
                  <div className="container">
                      <h1 className="display-4">Oh Snap! </h1>
                      <p className="lead">Grab your camera and share this moment with the world.</p>
                      <hr className="my-4"></hr>
                      <p>Create an account for free and start snapping!</p>
                      <p className="lead">
                          <Link to="/register" className="btn btn-sm btn-dark" role="button">Sign up!</Link>
                      </p>
                  </div>
              </div>
              <div className="container text-center">
                  <div className="row">
                      <div className="col-sm"><img src={view} className="home-image" alt="view"/></div>
                      <div className="col-sm mt-5">
                          <h5>Upload your images from anywhere</h5>
                          <p>Images can be uploaded from anywhere in the world directly from your smart phone.</p>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-sm mt-5">
                          <h5>Share your uploads with friends and others</h5>
                          <p>Let other's see your amazing images in HD.</p>
                      </div>
                      <div className="col-sm"><img src={beach} className="home-image" alt="beach"/></div>
                  </div>
                  <div className="row">
                      <div className="col-sm"><img src={phone} className="home-image" alt="smartphone"/></div>
                      <div className="col-sm mt-5">
                          <h5>See what other's are up to</h5>
                          <p>Check out other user's profiles and like and comment their posts.</p>
                      </div>
                  </div>
              </div>
          </div>
        );
    }
  
}

export default withRouter(Home);