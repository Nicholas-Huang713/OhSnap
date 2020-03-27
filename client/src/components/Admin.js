import React from 'react';
import axios from 'axios';
import {getJwt} from '../helpers/jwt';
import '../App.css';

class Admin extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId: "",
            profileImage: "",
            firstName: "",
            lastName: "",
            userCol: 4,
            postCol: 4,
            commentCol: 4,
            allUsers: [],
            postList: [],
            commentList: [],
            postList: []
        };
    }

    componentDidMount() {
        this.retrieveUser();
        this.retrieveAllUsers();
        this.retrieveAllPosts();
        this.retrieveAllComments();
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
              profileImage: user[0].imageData,
              firstName: user[0].firstname,
              lastName: user[0].lastname,
              userId: user[0]._id
            });
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }

    retrieveAllUsers = () => {
        const jwt = getJwt();
        axios({
            url: '/api/',
            method: 'GET',
            headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then((res) => {
            const allUsers = res.data;
            this.setState({allUsers});
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
                this.setState({
                    postList: posts
                });
            })
            .catch((err) => {
                console.log('Error:' + err);
        });
    }

    retrieveAllComments = () => {
        axios({ 
            url: '/api/getcomments',
            method: 'GET'
            })
            .then((res) => {
                const commentList = res.data;
                this.setState({commentList});
            })
            .catch((err) => {
                console.log('Error:' + err);
        });
    }

    handleUserClick = () => {
        this.setState({
            userCol: 10,
            postCol: 1,
            commentCol: 1
        })
    }

    handlePostClick = () => {
        this.setState({
            userCol: 1,
            postCol: 10,
            commentCol: 1
        })
    }

    handleCommentClick = () => {
        this.setState({
            userCol: 1,
            postCol: 1,
            commentCol: 10
        })
    }

    handleAllClick = () => {
        this.setState({
            userCol: 4,
            postCol: 4,
            commentCol: 4
        })
    }
    
    makeAdmin = (id) => {
        const jwt = getJwt();
        axios({ 
            url: `/api/makeAdmin/${id}`,
            method: 'PUT',
            headers: {'Authorization' : `Bearer ${jwt}`}
            })
            .then((res) => {
                const allUsers = res.data;
                this.setState({allUsers});
            })
            .catch((err) => {
                console.log('Error:' + err);
        });
    }

    removeAdmin = (id) => {
        const jwt = getJwt();
        axios({ 
            url: `/api/removeAdmin/${id}`,
            method: 'PUT',
            headers: {'Authorization' : `Bearer ${jwt}`}
            })
            .then((res) => {
                const allUsers = res.data;
                this.setState({allUsers});
            })
            .catch((err) => {
                console.log('Error:' + err);
        });
    }

    render() {
        const {userId, firstName, lastName, profileImage, commentList, allUsers, postList, userCol, postCol, commentCol} = this.state;
        return (
            <div className="container-fluid mt-3">
                <h3><img src={profileImage} className="album-profile" alt="profile" /> {firstName} {lastName} (Admin)</h3>
                <button onClick={this.handleAllClick}>All</button> | <button onClick={this.handleUserClick}>Users</button> | <button onClick={this.handlePostClick}>Posts</button> | <button onClick={this.handleCommentClick}>Comments</button>
                <hr />
                <div className="row">
                    <div className={`border-right border-left bg-white col-${userCol}`}>
                        <h3>Users <small className="bg-success text-white">(Admin)</small></h3>
                        <table className="table">
                            <thead>
                                <tr> 
                                <th scope="col">ID</th>
                                <th scope="col">Profile</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Email</th>
                                <th scope="col">Posts</th>
                                <th scope="col">Admin Rights</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map((user, index) => {
                                    return(
                                        <tr>
                                            <th>{user._id}</th>
                                            <td><img src={user.imageData} className="post-profile" alt="profile"/></td>
                                            {user.admin ? 
                                                <td className="bg-success text-light">{user.firstname}</td>
                                                :
                                                <td>{user.firstname}</td>
                                            }
                                            <td>{user.lastname}</td>
                                            <td><i class="fa fa-envelope-o"></i> {user.email}</td>
                                            <td>{user.posts}</td>
                                            <td>
                                                {
                                                    userId === user._id  ?
                                                        <span></span>
                                                        :
                                                        <div>
                                                            {   user.admin ?
                                                                <button onClick={() => this.removeAdmin(user._id)}>Remove Admin</button>
                                                                :
                                                                <button onClick={() => this.makeAdmin(user._id)}>Make Admin</button>
                                                            }
                                                        </div>
                                                }
                                            </td>
                                            <th><i class="fa fa-trash-o"></i></th>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className={`border-right border-left bg-white col-${postCol}`}>
                        <h3>Posts</h3>
                        <table className="table">
                            <thead>
                                <tr> 
                                <th scope="col">#</th>
                                <th scope="col">Image</th>
                                <th scope="col">Creator</th>
                                <th scope="col">Desc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {postList.map((post, index) => {
                                    return(
                                        <tr>
                                            <th>{index + 1}</th>
                                            <td><img src={post.imageData} className="post-profile" alt="profile"/></td>
                                            <td>{post.creatorName}</td>
                                            <td>{post.description}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className={`border-right border-left bg-white col-${commentCol}`}>
                        <h4>Comments</h4>
                        <table className="table">
                            <thead>
                                <tr> 
                                    <th scope="col">#</th>
                                    <th scope="col">Creator</th>
                                    <th scope="col">Comment</th>
                                    <th scope="col">Post ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commentList.map((comment, index) => {
                                    return(
                                        <tr>
                                            <th>{index + 1}</th>
                                            <td>{comment.creatorName}</td>
                                            <td>{comment.content}</td>
                                            <td>{comment.postId}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Admin;