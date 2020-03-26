import React from 'react';
import '../App.css';
import axios from 'axios';
import {getJwt} from '../helpers/jwt';
import liked from '../images/likedbtn.png';
import unliked from '../images/unlikedbtn.png';
import chatTwo from '../images/chat2.png';
import closeIcon from '../images/closeicon.png';
import CommentModal from './Modal/CommentModal';
import UploadModal from './Modal/UploadModal';
import Modal from 'react-modal';
import {withRouter} from 'react-router-dom';
import UserAlbum from './UserAlbum';
import ImageUpdateForm from './ImageUpdateForm';
import ProfileUpdateForm from './ProfileUpdateForm';

class Dashboard extends React.Component {
  state = {
    currentUser: undefined,
    profileImage: "",
    firstName: "",
    allUsers: [],
    postList: [],
    showCommentModal: false,
    showAlbumModal: false,
    showImageFormModal: false,
    showProfileFormModal: false,
    postId: "",
    albumUserId: ""
  };

  componentDidMount(){
    this.retrieveUser();
    this.retrieveAllUsers();
    this.retrieveAllPosts();
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
          console.log("State Post list: " + this.state.postList);
      })
      .catch((err) => {
          console.log('Error:' + err);
    });
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
          profileImage: user[0].imageData,
          firstName: user[0].firstname
        });
    })
    .catch((err) => {
        console.log('Error:' + err);
    });
  }

  likePost = (id) => {
    const jwt = getJwt();
    const postId = {
      id
    };
    axios({
        url: '/api/like',
        method: 'PUT',
        data: postId,
        headers: {'Authorization' : `Bearer ${jwt}`}
    })
    .then(() => {
      this.retrieveUser();
      this.retrieveAllPosts();
    })
    .catch((err) => {
        console.log('Error: ' + err);
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

  handleOpenCommentModal = (postId) => {
    this.setState({ showCommentModal: true, postId: postId });
  }
    
  handleCloseCommentModal = () => {
    this.setState({ showCommentModal: false });
  }
  handleOpenAlbumModal = (userId) => {
    this.setState({ showAlbumModal: true, albumUserId: userId});
  }
    
  handleCloseAlbumModal = () => {
    this.setState({ showAlbumModal: false });
  }

  handleUserModals = (name, value) => {
    this.setState({[name]: value});
  }

  closeImageForm = () => {
    this.setState({
      showImageFormModal: false 
    });
  }

  closeProfileForm = () => {
    this.setState({
      showProfileFormModal: false
    });
  }

  render() {
    const {currentUser, allUsers, postList, profileImage, firstName} = this.state;
    let name;
    let profile;
    let faveList;
    let userId;
    if(currentUser === undefined){
      name = "";
      faveList = [];
      profile = "";
      userId = "";
    } else{
        name = firstName;
        profile = profileImage;
        faveList = currentUser[0].favelist;
        userId = currentUser[0]._id;
    }
    return (
      <div className="container-fluid mt-1">
        <div className="row">
          <div className="col-sm">
            <div className="card text-center">
              <img className="card-img-top dashboard-profile" src={profile} alt="Profile Img" onClick={() => this.handleUserModals("showImageFormModal", true)}/>
              <div className="card-body">
                <h5>{name}</h5>
                <button onClick={() => this.handleUserModals("showProfileFormModal", true)} className="card-link btn btn-primary">Edit Profile</button>
              </div>
            </div>
          </div>
          <Modal isOpen={this.state.showImageFormModal}>   
              <button onClick={() => this.handleUserModals("showImageFormModal", false)} className="close-btn"><img src={closeIcon} className="close-icon"/></button>
              <ImageUpdateForm closeImageForm={this.closeImageForm} retrieveUser={this.retrieveUser} retrieveAllPosts={this.retrieveAllPosts} retrieveAllUsers={this.retrieveAllUsers} />
          </Modal>
          <Modal isOpen={this.state.showProfileFormModal}>   
              <button onClick={() => this.handleUserModals("showProfileFormModal", false)} className="close-btn"><img src={closeIcon} className="close-icon"/></button>
              <ProfileUpdateForm closeProfileForm={this.closeProfileForm} retrieveUser={this.retrieveUser} retrieveAllPosts={this.retrieveAllPosts} retrieveAllUsers={this.retrieveAllUsers} />
          </Modal>
          <div className="col-sm-6 dashboard-post-list"> 
            {
              postList.map((post) => {
                return (
                  <div className="card">
                      <div className="card-header">
                        <img src={post.profileImg} className="rounded-circle post-profile" onClick={() => this.handleOpenAlbumModal(post.creatorId)} /> {post.creatorName}
                      </div>
                      <div className="card-body">
                        <img className="card-img-top" src={post.imageData} />
                        {faveList.includes(post._id) ? 
                          <img src={liked} onClick={() => this.unlikePost(post._id)} className="post-profile" />
                        :  
                          <img src={unliked} onClick={() => this.likePost(post._id)} className="post-profile"/>
                        }  
                        <img src={chatTwo} className="post-profile" onClick={() => this.handleOpenCommentModal(post._id)} />
                        {post.description}
                        <div className="row ml-2">
                          {post.likes.length} likes
                        </div>
                      </div>
                      <div className="card-footer text-muted">
                        <small>{Date(post.date)}</small>
                      </div>
                    </div>
                )
              })
            }

            <Modal isOpen={this.state.showCommentModal}>   
                <button onClick={this.handleCloseCommentModal} className="close-btn"><img src={closeIcon} className="close-icon"/></button>
                <CommentModal creatorId={userId} postId={this.state.postId} firstName={firstName} profile={profile} />
            </Modal>

          </div>
          <div className="col-sm">
            <h5>Photographers</h5>
            <div className="dashboard-user-list">
              <ul className="list-unstyled">
              {
                allUsers.map((user) => {
                  if(user._id === userId) return;
                  return (
                    <li key={user._id} className="media">
                      <img src={user.imageData} onClick={() => this.handleOpenAlbumModal(user._id)} className="mr-3 rounded-circle post-profile" alt="profile" />
                      <div className="media-body">
                        <h5 className="mt-0 mb-1">{user.firstname}</h5>
                        {user.posts.length} posts 
                      </div>
                    </li>
                  )
                })
              }
              </ul>
            </div>
          </div>
          <Modal isOpen={this.state.showAlbumModal}>   
              <button onClick={this.handleCloseAlbumModal} className="close-btn"><img src={closeIcon} className="close-icon"/></button>
              <UserAlbum albumUserId={this.state.albumUserId} />
          </Modal>
        </div>
        
      </div>
    );
  }
}

export default withRouter(Dashboard);
