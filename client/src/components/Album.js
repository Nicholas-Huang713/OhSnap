import React from 'react';
import '../App.css';
import axios from 'axios';
import {getJwt} from '../helpers/jwt';
import UploadModal from './Modal/UploadModal';
import Modal from 'react-modal';
import plusIcon from '../images/plusicon.png';
import closeIcon from '../images/closeicon.png';
import {withRouter} from 'react-router-dom';

class Album extends React.Component {
    state = {
        currentUser: undefined,
        postList: [],
        showModal: false,
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
        url: '/api/getposts',
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

    refreshList = (list) => {
        console.log(list);
        this.setState({
            postList: list.reverse(),
            showModal: false
        })
    }

    render() {
        const {currentUser, postList} = this.state;
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
            <h4>
                <img src={profileImg} onClick={()=> this.props.history.push('/dashboard')} className="rounded-circle album-profile mr-1 mt-2" alt="profile"/> 
                {firstName}  
            </h4>
            <button className="upload-btn" onClick={this.handleOpenModal}><img src={plusIcon} className="open-modal-btn"/></button>
            <Modal isOpen={this.state.showModal}>   
                <button onClick={this.handleCloseModal} className="close-btn"><img src={closeIcon} className="close-icon"/></button>
                <UploadModal refreshList={this.refreshList} retrieveUser={this.retrieveUser} firstName={firstName} profileImg= {profileImg}/>
            </Modal>
            <hr />
            <div className="row">
                {
                    postList.map((post) => {
                        return (
                            (post.creatorId === userId) ?
                            <div key={post._id} className="card col-sm-4">
                                <img src={post.imageData} alt="post" className="card-img-top border border-dark" />
                                <div className="card-body">
                                    <p className="card-text">
                                        {post.description}
                                    </p>
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

export default withRouter(Album); 