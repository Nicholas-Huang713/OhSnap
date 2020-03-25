import React from 'react';
import axios from 'axios';
import {getJwt} from '../helpers/jwt';
import '../App.css';
// import '../Album.css';

class UserAlbum extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: undefined
        };
    }

  componentDidMount() {
    this.getCurrentUser();
  }

  componentWillUnmount() {
      this.setState({
        currentUser: undefined
      })
  }

getCurrentUser = () => {
    const jwt = getJwt();
    const {albumUserId} = this.props;
    axios({ 
    url: `/api/getuser/${albumUserId}`,
    method: 'GET',
    headers: {'Authorization' : `Bearer ${jwt}`}
    })
    .then((res) => {
        const user = res.data;
        this.setState({
            currentUser: user
        });

    })
    .catch((err) => {
        console.log('Error:' + err);
    });
}

  render() {
    const {currentUser} = this.state;
    let firstName;
    let profile;
    let postList;
    if(currentUser === undefined ){
        firstName = "";
        profile = "";
        postList = [];
    } else{
        firstName = currentUser.firstname;
        profile = currentUser.imageData;
        postList = currentUser.posts.reverse();
    }

    return (
        <div className="container-fluid mt-3">
            <h3> <img src={profile} className="rounded-circle post-profile mr-2" alt="profile" /> {firstName}</h3>
            <hr />
            <div className="row">
            {
                postList.map((post) => {
                    return (
                        <div key={post._id} className="card col-sm-4">
                            <img src={post.imageData} alt="post" className="card-img-top border border-dark" />
                            <div className="card-body">
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>  
                    )
                })
            }
            </div>
            
        </div>
    );
  }
}

export default UserAlbum;