import React from 'react';
import axios from 'axios';
import {getJwt} from '../helpers/jwt';
import '../App.css';

class UserAlbum extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: undefined,
            postList: []
        };
    }

    componentDidMount() {
        this.getCurrentUser();
        this.getUserPosts();
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
            this.setState({currentUser: user});
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }

    getUserPosts = () => {
        const jwt = getJwt();
        const {albumUserId} = this.props;
        axios({ 
        url: `/api/getuserposts/${albumUserId}`,
        method: 'GET',
        headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then((res) => {
            const posts = res.data.reverse();
            this.setState({
                postList: posts
            });
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }

  render() {
    const {currentUser, postList} = this.state;
    let firstName;
    let profile;
    if(currentUser === undefined ){
        firstName = "";
        profile = "";
    } else{
        firstName = currentUser.firstname;
        profile = currentUser.imageData; 
    }
    return (
        <div className="container-fluid mt-3">
            <h3> <img src={profile} className="rounded-circle post-profile mr-2" alt="profile" /> {firstName}</h3>
            <hr />
            <div className="album-style">
                <div className="row">
                {
                    postList.map((post) => {
                        return (
                            <div key={post._id} className="card col-sm-4">
                                <img src={post.imageData} alt="post" className="card-img-top border border-dark" />
                                <div className="card-body">
                                    <p className="card-text">{post.description}</p>
                                </div>
                            </div>  
                        )
                    })
                }
                </div>
            </div>
        </div>
    );
  }
}

export default UserAlbum;