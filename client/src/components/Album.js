import React from 'react';
import '../App.css';
import axios from 'axios';
import {getJwt} from '../helpers/jwt';
import UploadModal from './Modal/UploadModal';
import PostImageUpdateForm from './PostImageUpdateForm';
import Modal from 'react-modal';
import plusIcon from '../images/plusicon.png';
import closeIcon from '../images/closeicon.png';
import {withRouter} from 'react-router-dom';

class Album extends React.Component {
    state = {
        currentUser: undefined,
        postList: [],
        showModal: false,
        showImageUpdateModal: false,
        currentImageId: "",
        currentPost: "",
        description: "",
        errorMsg: ""
    };

    componentDidMount(){
        this.retrieveUser();
        this.retrieveUserPosts();
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
                showModal: false
            });
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }

    retrieveUserPosts = () => {
        const jwt = getJwt();
        axios({ 
        url: '/api/getloguserposts',
        method: 'GET',
        headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then((res) => {
            const posts = res.data;
            this.setState({postList: posts.reverse()});
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }

    

    handleOpenModal = () => {
        this.setState({ showModal: true });
    }
      
    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    // handleOpenImageUpdateModal = () => {
    //     this.setState({ showImageUpdateModal: true });
    // }

    openImageUpdateModal = (postId) => {
        this.setState({
            showImageUpdateModal: true,
            currentImageId: postId
        })
    }  

    handleCloseImageUpdateModal = () => {
        this.setState({ showImageUpdateModal: false });
    }

    refreshList = (list) => {
        console.log(list);
        this.setState({
            showModal: false
        })
        this.retrieveUserPosts();
    }

    openDescriptionForm = (postId) => {
        const jwt = getJwt();
        axios({
            url: `/api/getonepost/${postId}`,
            method: 'GET',
            headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then((res) => {
            console.log(res.data);
            const currentDescription = res.data.description;
            this.setState({
                description: currentDescription,
                currentPost: postId
            });
        })
        .catch((err) => {
            console.log(err);
        })
    } 

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name] : value });
    }

    editDescription = (e) => {
        const {description, currentPost} = this.state;
        if(description.length <= 2){
            e.preventDefault();
            this.setState({errorMsg: "Description must be longer than 2 characters"});
            return;
        }
        e.preventDefault();
        const jwt = getJwt();
        const newDescription = {description};
        axios({
            url: `/api/editdescription/${currentPost}`,
            method: 'PUT',
            data: newDescription,
            headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then((res) => {
            const list = res.data
            console.log(list);
            this.setState({
                currentPost: "",
                postList: list.reverse(),
                errorMsg: ""
            });
        })
        .catch((err) => {
            console.log(err);
        })
    }

    completeImageUpdate = () => {
        this.retrieveUserPosts();
        this.setState({showImageUpdateModal: false});
    }

    deletePost = (postId) => {
        const jwt = getJwt();
        const id = {postId}
        axios({
            url: '/api/deletePost',
            method: 'DELETE',
            data: id,
            headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then((res) => {
            const list = res.data.reverse();
            this.setState({postList: list});
        })
        .catch((err) => {
            console.log(err);
        })
    }

    render() {
        const {currentUser, postList, errorMsg, description, currentPost, currentImageId} = this.state;
        let firstName;
        let userId;
        let profileImg;
        if(currentUser === undefined){
            firstName = "";
            profileImg = "";
            userId = "";
        } else{
            firstName = currentUser[0].firstname;
            profileImg = currentUser[0].imageData;
            userId = currentUser[0]._id;
        }
        return (
        <div className="container">
            <h3>
                <img src={profileImg} onClick={()=> this.props.history.push('/dashboard')} className="rounded-circle album-profile mr-1 mt-2" alt="profile"/> 
                {firstName}  
            </h3>
            <button className="upload-btn ml-3" onClick={this.handleOpenModal}><img src={plusIcon} className="open-modal-btn" alt="open form"/></button>New
            <Modal isOpen={this.state.showModal}>   
                <button onClick={this.handleCloseModal} className="close-btn"><img src={closeIcon} className="close-icon" alt="close icon" /></button>
                <UploadModal refreshList={this.refreshList} retrieveUser={this.retrieveUser} firstName={firstName} profileImg= {profileImg}/>
            </Modal>
            <Modal isOpen={this.state.showImageUpdateModal}>   
              <button onClick={this.handleCloseImageUpdateModal} className="close-btn"><img src={closeIcon} className="close-icon" alt="close icon"/></button>
              <PostImageUpdateForm completeImageUpdate={this.completeImageUpdate} currentImageId={currentImageId} />
            </Modal>
            <hr />
            <div className="album-style">
                <div className="row">
                    {
                        postList.map((post) => {
                            return (
                                (post.creatorId === userId) &&
                                <div key={post._id} className="card col-sm-4">
                                    <div className="card-header text-right">
                                        <button onClick={() => this.deletePost(post._id)} className="close-btn">&#10006;</button>
                                    </div>
                                    <img onClick={() => this.openImageUpdateModal(post._id)} src={post.imageData} alt="post" className="card-img-top border border-dark" />
                                    <div className="card-body">
                                        <div className="card-text">
                                            {currentPost === post._id ? 
                                                <form onSubmit={this.editDescription}>
                                                    <span className="text-danger">{errorMsg}</span>
                                                    <div className="input-group mb-3">
                                                        <input type="text" 
                                                            className="form-control" 
                                                            name="description"                            
                                                            value={description}
                                                            onChange={this.handleChange}
                                                        />
                                                        <div className="input-group-append">
                                                            <button className="btn btn-outline-secondary" type="submit">&#10003;</button>
                                                        </div>
                                                    </div>
                                                </form>
                                                :
                                                <div onClick={() => this.openDescriptionForm(post._id)} className="description-container">{post.description}</div>
                                            }
                                        </div>
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

export default withRouter(Album); 