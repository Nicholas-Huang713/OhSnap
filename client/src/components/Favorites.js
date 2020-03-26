import React from 'react';
import '../App.css';
// import '../Album.css';
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
                faveList: user[0].favelist.reverse()
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
            const posts = res.data;
            this.setState({posts});
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
            <div className="row">
                {
                    posts.map((post) => {
                        return( 
                        faveList.includes(post._id) ? 
                            <div key={post._id} className="card col-sm-4">
                                <img src={post.imageData} alt="post" className="card-img-top border border-dark" />
                                <div className="card-body">
                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                </div>
                            </div>  
                            : 
                            <span></span>
                        )
                    })
                }
            </div> 
        </div>
        );
    }
}

export default Favorites; 