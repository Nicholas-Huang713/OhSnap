import React from 'react';
import axios from 'axios';
import {getJwt} from '../../helpers/jwt';
import './UploadModal.css';
import uparrow from '../../images/uparrow.png';
import downarrow from '../../images/downarrow.png';

class CommentModal extends React.Component {
  state = {
    comments: [],
    commentText: "",
    postId: undefined,
    firstName: undefined,
    profile: undefined,
    creatorId: undefined,
    commentGroup: [],
    pageStart: 0,
    pageEnd: 6
  };

  componentDidMount() {
    this.getPostComments();
  }

  getPostComments = () => {
    const jwt = getJwt();
    const {postId, firstName, profile, creatorId} = this.props;
    axios({ 
        url: `/api/getpostcomments/${postId}`,
        method: 'GET',
        headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then((res) => {
            const comments = res.data.reverse();
            let commentGroup = [];
            for(let i = 0; i < 6; i++){
                if(!comments[i]){
                    break;
                }
                commentGroup.push(comments[i]);
            }
            this.setState({comments, commentGroup, postId, firstName, profile, creatorId});
            console.log("Comments " + this.state.comments);
        })
        .catch((err) => {
            console.log('Error:' + err);
    });
  } 

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name] : value });
  };

  handleCommentSubmit = (e) => {
    const {commentText, postId, firstName, profile, creatorId} = this.state;
    if(commentText===""){
        e.preventDefault();
        return;
    }
    e.preventDefault();
    const jwt = getJwt();
    const newComment = {
        postId,
        creatorId,
        creatorName: firstName,
        creatorImg: profile,
        content: commentText
    }
    axios({ 
        url: '/api/postcomment',
        method: 'PUT',
        data: newComment,
        headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then((res) => {
            this.setState({commentText: ""});
            this.getPostComments();
            console.log("Comments " + this.state.comments);
        })
        .catch((err) => {
            console.log('Error:' + err);
    });
    
  }

  pageUp = () => {
    const {pageStart, pageEnd, comments} = this.state;
    const newStart = pageStart - 6;
    const newEnd = pageEnd - 6;
    if(!comments[newStart]) return;
    let newCommentGroup = [];
    for (let i = newStart; i < newEnd; i++){
        if(!comments[i]){
            break;
        }
        newCommentGroup.push(comments[i]);
    }
    this.setState({
        commentGroup: newCommentGroup,
        pageStart: newStart,
        pageEnd: newEnd
    })
  }

  pageDown = () => {
    const {pageStart, pageEnd, comments} = this.state;
    const newStart = pageStart + 6;
    const newEnd = pageEnd + 6;
    if(!comments[newStart]) return;
    let newCommentGroup = [];
    for (let i = newStart; i < newEnd; i++){
        if(!comments[i]){
            break;
        }
        newCommentGroup.push(comments[i]);
    }
    this.setState({
        commentGroup: newCommentGroup,
        pageStart: newStart,
        pageEnd: newEnd
    })
  }

  render() {
    const {firstName, profile} = this.props;
    const {commentText, commentGroup} = this.state;
    return (
        <div className="container mt-3">

            <div className="media">
                <img src={profile} className="rounded-circle comment-profile mr-2" alt="User Profile" />
                <div className="media-body">
                    <h4 className="mt-0">{firstName}</h4>
                    <form onSubmit={this.handleCommentSubmit}>
                        <div className="form-group">
                            <input type="text" className="form-control"  
                                name="commentText"                            
                                value={commentText}
                                onChange={this.handleChange}
                                placeholder="Enter comment" />
                            <button className="btn btn-primary mt-1">Submit</button>
                        </div>
                        
                    </form>
                </div>
            </div>
            <div className="row">
                <div className="col-11">
                    <ul>
                        {
                            commentGroup.map((comment) => {
                                return (
                                    <li key={comment._id}>
                                        <div className="card">
                                            <div className="card-body">
                                            <img src={comment.creatorImg} className="rounded-circle comment-profile mr-1" alt="creator profile" />
                                            <b className="mr-2">{comment.creatorName}</b>  
                                            {comment.content}
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="col">
                    <img src={uparrow} className="arrow-btn" alt="up button" onClick={this.pageUp} />
                    <img src={downarrow} className="arrow-btn" alt="down button" onClick={this.pageDown}/>
                </div>
            </div>
            
        </div>
    );
  }
}

export default CommentModal;