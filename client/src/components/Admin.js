import React from 'react';
import axios from 'axios';
import {getJwt} from '../helpers/jwt';
import '../App.css';
import {withRouter} from 'react-router-dom';
import '../App.css';

class Admin extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId: "",
            profileImage: "",
            firstName: "",
            lastName: "",
            currentList: "all",
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
            if(!user[0].admin){
                this.props.history.push('/dashboard');
            }
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
            currentList: "user"
        })
    }

    handlePostClick = () => {
        this.setState({
            currentList: "post"
        })
    }

    handleCommentClick = () => {
        this.setState({
            currentList: "comment"
        })
    }

    handleAllClick = () => {
        this.setState({
            currentList: "all"
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

    deleteUser = (userId) => {
        const jwt = getJwt();
        axios({ 
            url: `/api/deleteUser/${userId}`,
            method: 'DELETE',
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

    deletePost = (postId, creatorId) => {
        const jwt = getJwt();
        const id = {creatorId}
        axios({ 
            url: `/api/deletePost/${postId}`,
            method: 'DELETE',
            data: id,
            headers: {'Authorization' : `Bearer ${jwt}`}
            })
        .then((res) => {
            const postList = res.data;
            this.setState({postList});
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }

    deleteComment = (commentId) => {
        const jwt = getJwt();
        axios({ 
            url: `/api/deleteComment/${commentId}`,
            method: 'DELETE',
            headers: {'Authorization' : `Bearer ${jwt}`}
            })
        .then((res) => {
            const commentList = res.data;
            this.setState({commentList});
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }

    emailUser = (name, email) => {
        const jwt = getJwt();
        let info = {name, email};
        axios({ 
            url: '/api/emailUser',
            method: 'POST',
            data: info,
            headers: {'Authorization' : `Bearer ${jwt}`}
            })
        .then(() => {
            
            console.log("Email sent");
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
        alert(`Email sent to ${name} @ ${email}`);
    }

    render() {
        const {userId, firstName, lastName, profileImage, commentList, allUsers, postList, currentList} = this.state;
        return (
            <div className="container-fluid mt-3">
                <h3><img src={profileImage} className="album-profile" alt="profile" /> {firstName} {lastName} (Admin)</h3>
                <button onClick={this.handleAllClick} className="btn btn-secondary ml-5">All</button> | 
                <button onClick={this.handleUserClick} className="btn btn-secondary">Users</button> | 
                <button onClick={this.handlePostClick} className="btn btn-secondary">Posts</button> | 
                <button onClick={this.handleCommentClick} className="btn btn-secondary">Comments</button>
                <hr/>
                <div>
                    {currentList === "user" || currentList === "all" ?
                        <div>
                            <h3>Users <small className="bg-success text-white">(Admin)</small></h3>
                            <div className="admin-list-style">
                                
                                <table className="table">
                                    <thead>
                                        <tr> 
                                        <th scope="col">ID</th>
                                        <th scope="col">Profile</th>
                                        <th scope="col">First</th>
                                        <th scope="col">Last</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Subscribed</th>
                                        <th scope="col">Posts</th>
                                        <th scope="col">Admin Rights</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allUsers.map((user) => {
                                            return(
                                                <tr key={user._id}>
                                                    <th>{user._id}</th>
                                                    <td><img src={user.imageData} className="post-profile" alt="profile"/></td>
                                                    {user.admin ? 
                                                        <td className="bg-success text-light">{user.firstname}</td>
                                                        :
                                                        <td>{user.firstname}</td>
                                                    }
                                                    <td>{user.lastname}</td>
                                                    <td><button onClick={() => this.emailUser(user.firstname, user.email)} className="btn btn-outline-dark"><i className="fa fa-envelope-o"></i></button> {user.email}</td>
                                                    <td>{user.subscribed? <span className="text-primary">True</span> : <span className="text-danger">False</span>}</td>
                                                    <td>{user.posts}</td>
                                                    <td>
                                                        {userId === user._id ?
                                                            <span>Current User</span>
                                                            :
                                                            <div>
                                                                {user.admin ?
                                                                    <button onClick={() => this.removeAdmin(user._id)} className="btn btn-danger">Remove Admin</button>
                                                                    :
                                                                    <button onClick={() => this.makeAdmin(user._id)} className="btn btn-success">Make Admin</button>
                                                                }
                                                            </div>
                                                        }
                                                    </td>
                                                    {(userId === user._id || user.admin) ?
                                                        <span></span>
                                                        :
                                                        <th><i className="fa fa-trash-o" onClick={() => this.deleteUser(user._id)}></i></th>
                                                    }
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        :
                        <span></span>
                    }     
                    {currentList === "post" || currentList === "all" ? 
                        <div>
                            <h3>Posts</h3>
                            <div className="admin-list-style">
                                
                                <table className="table">
                                    <thead>
                                        <tr> 
                                        <th scope="col">ID</th>
                                        <th scope="col">Post Image</th>
                                        <th scope="col">Creator Name</th>
                                        <th scope="col">Creator ID</th>
                                        <th scope="col">Creator Profile</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Comments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {postList.map((post) => {
                                            return(
                                                <tr key={post._id}>
                                                    <th>{post._id}</th>
                                                    <td><img src={post.imageData} className="post-profile" alt="profile"/></td>
                                                    <td>{post.creatorName}</td>
                                                    <td>{post.creatorId}</td>
                                                    <td><img src={post.profileImg} className="post-profile" alt="profile" /></td>
                                                    <td>{post.description}</td>
                                                    <td>{post.comments.length}</td>
                                                    <td><i className="fa fa-trash-o" onClick={() => this.deletePost(post._id, post.creatorId)}></i></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        :
                        <span></span>
                    }
                    {currentList === "comment" || currentList === "all" ?
                        <div>
                            <h4>Comments</h4>
                            <div className="admin-list-style">
                                
                                <table className="table">
                                    <thead>
                                        <tr> 
                                            <th scope="col">ID</th>
                                            <th scope="col">Creator</th>
                                            <th scope="col">Creator ID</th>
                                            <th scope="col">Creator Profile</th>
                                            <th scope="col">Comment</th>
                                            <th scope="col">Post ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentList.map((comment) => {
                                            return(
                                                <tr key={comment._id}>
                                                    <th>{comment._id}</th>
                                                    <td>{comment.creatorName}</td>
                                                    <td>{comment.creatorId}</td>
                                                    <td><img src={comment.creatorImg} className="post-profile" alt="profile"/></td>
                                                    <td>{comment.content}</td>
                                                    <td>{comment.postId}</td>
                                                    <td><i className="fa fa-trash-o" onClick={() => this.deleteComment(comment._id)}></i></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        :
                        <span></span>
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(Admin);