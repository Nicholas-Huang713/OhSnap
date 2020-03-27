import React from 'react';
import '../App.css';
import axios from 'axios';
import {getJwt} from '../helpers/jwt';

class Favorites extends React.Component {
    state = {
        posts: [],
        currentUser: undefined,
        faveList: []
    };

    componentDidMount(){
        this.retrieveUser();
        this.retrieveAllPosts();
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
                currentUser: user,
                faveList: user[0].favelist
            });
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }

    retrieveAllPosts = () => {
        const jwt = getJwt();
        axios({ 
        url: '/api/getposts',
        method: 'GET',
        headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then((res) => {
            const posts = res.data.reverse();
            this.setState({posts});
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }


    unlikePost = (id) => {
        const jwt = getJwt();
        const postId = {id};
        axios({
            url: '/api/unlike',
            method: 'PUT',
            data: postId,
            headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then(() => {
            this.retrieveUser();
            this.retrieveAllPosts();
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }

    render() {
        const {currentUser, faveList, posts} = this.state;
        if(currentUser === undefined){
            return <span>Loading...</span>
        }
        
        return (
        <div className="container mt-2">
            <h3>Favorites</h3>
            <hr />
            <div className="album-style">
                <div className="row">
                    {
                        posts.map((post) => {
                            return( 
                            faveList.includes(post._id) &&
                                <div key={post._id} className="card col-sm-4">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col">
                                                <img src={post.profileImg} className="rounded-circle post-profile mr-1" alt="post creator profile" /> 
                                                {post.creatorName}
                                            </div>
                                            <div className="col text-right">
                                                <button onClick={() => this.unlikePost(post._id)} className="close-btn">&#10006;</button>
                                            </div>
                                        </div>
                                    </div>
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

export default Favorites; 