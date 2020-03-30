import React from 'react';
import '../App.css';
import axios from 'axios';
import {getJwt} from '../helpers/jwt';
import liked from '../images/likedbtn.png';
import unliked from '../images/unlikedbtn.png';
import chatTwo from '../images/chat2.png';
import closeIcon from '../images/closeicon.png';
import CommentModal from './Modal/CommentModal';
import Modal from 'react-modal';
import {withRouter} from 'react-router-dom';
import UserAlbum from './UserAlbum';
import ImageUpdateForm from './ImageUpdateForm';
import ProfileUpdateForm from './ProfileUpdateForm';

class Dashboard extends React.Component {
  state = {
    currentUser: undefined,
    isAdmin: false,
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
      url: '/api/getusers',
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
          firstName: user[0].firstname,
          isAdmin: user[0].admin
        });
    })
    .catch((err) => {
        console.log('Error:' + err);
    });
  }

  likePost = (id) => {
    const jwt = getJwt();
    const postId = {id};
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
    this.setState({ showCommentModal: true, postId });
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
    const {currentUser, allUsers, postList, profileImage, firstName, isAdmin} = this.state;
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
        {(profile === "https://via.placeholder.com/500x450?text=No+Profile+Image+Chosen") &&
          <div class="alert alert-warning alert-dismissible fade show" role="alert">
            Your profile photo has not been set yet. Click on the profile preview to choose an image!
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        }
        <div className="row">
          <div className="col-sm">
            <div className="card text-center">
              <img className="card-img-top dashboard-profile" src={profile} alt="Profile" onClick={() => this.handleUserModals("showImageFormModal", true)}/>
              <div className="card-body">
                <h5>{name}</h5>
                <button onClick={() => this.handleUserModals("showProfileFormModal", true)} className="card-link btn btn-primary">Edit Profile</button>
                {isAdmin && 
                  <button onClick={() => this.props.history.push('/admin')} className="card-link btn btn-success">Admin Page</button>
                }
              </div>
            </div>
          </div>
          <Modal isOpen={this.state.showImageFormModal}>   
              <button onClick={() => this.handleUserModals("showImageFormModal", false)} className="close-btn"><img src={closeIcon} className="close-icon" alt="close icon" /></button>
              <ImageUpdateForm closeImageForm={this.closeImageForm} retrieveUser={this.retrieveUser} retrieveAllPosts={this.retrieveAllPosts} retrieveAllUsers={this.retrieveAllUsers} />
          </Modal>
          <Modal isOpen={this.state.showProfileFormModal}>   
              <button onClick={() => this.handleUserModals("showProfileFormModal", false)} className="close-btn"><img src={closeIcon} className="close-icon" alt="close icon"/></button>
              <ProfileUpdateForm closeProfileForm={this.closeProfileForm} retrieveUser={this.retrieveUser} retrieveAllPosts={this.retrieveAllPosts} retrieveAllUsers={this.retrieveAllUsers} />
          </Modal>
          <div className="col-sm-6 dashboard-post-list"> 
            {
              postList.map((post) => {
                return (
                  <div className="card" key={post._id}>
                      <div className="card-header">
                        <img src={post.profileImg} alt="profile" className="rounded-circle post-profile" onClick={() => this.handleOpenAlbumModal(post.creatorId)} /> {post.creatorName}
                      </div>
                      <div className="card-body">
                        <img className="card-img-top" src={post.imageData} alt="post" />
                        {faveList.includes(post._id) ? 
                          <img src={liked} onClick={() => this.unlikePost(post._id)} className="post-profile" alt="unlike button" />
                        :  
                          <img src={unliked} onClick={() => this.likePost(post._id)} className="post-profile" alt="like button" />
                        }  
                        <img src={chatTwo} className="post-profile mr-2" onClick={() => this.handleOpenCommentModal(post._id)} alt="comment link" />
                        {post.description}
                      </div>
                      <div className="card-footer text-muted">
                        <small>{Date(post.date)}</small>
                      </div>
                    </div>
                )
              })
            }

            <Modal isOpen={this.state.showCommentModal}>   
                <button onClick={this.handleCloseCommentModal} className="close-btn"><img src={closeIcon} className="close-icon" alt="close icon"/></button>
                <CommentModal creatorId={userId} postId={this.state.postId} firstName={firstName} profile={profile} />
            </Modal>

          </div>
          <div className="col-sm card">
            <div className="card-header">
              <h5>Most Active Users</h5>
            </div>
            <div className="dashboard-user-list mt-1">
              <ul className="list-unstyled">
              {
                allUsers.map((user) => {
                  if(user._id === userId) return;
                  return (
                    <li key={user._id} className="media">
                      <img src={user.imageData} onClick={() => this.handleOpenAlbumModal(user._id)} className="mr-3 rounded-circle post-profile" alt="profile" />
                      <div className="media-body">
                        <h5 className="mt-0 mb-1">{user.firstname}</h5>
                        {user.posts} posts 
                      </div>
                    </li>
                  )
                })
              }
              </ul>
            </div>
          </div>
          <Modal isOpen={this.state.showAlbumModal}>   
              <button onClick={this.handleCloseAlbumModal} className="close-btn"><img src={closeIcon} className="close-icon" alt="close icon"/></button>
              <UserAlbum albumUserId={this.state.albumUserId} />
          </Modal>
        </div>
        
      </div>
    );
  }
}

export default withRouter(Dashboard);
