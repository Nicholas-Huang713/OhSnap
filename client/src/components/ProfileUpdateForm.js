import React from 'react';
import axios from 'axios';
import {getJwt} from '../helpers/jwt';
import '../App.css';

class ProfileUpdateForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            errorMsg: ""
        };
    }

    componentDidMount() {
        const jwt = getJwt();
        axios({ 
        url: '/api/getuser',
        method: 'GET',
        headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then((res) => {
            const user = res.data;
            this.setState({
              firstName: user[0].firstname,
              lastName: user[0].lastname,
              email: user[0].email
            });
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name] : value });
    }

    handleProfileUpdate = (e) => {
        e.preventDefault();
        const jwt = getJwt();
        const {firstName, lastName, email} = this.state;
        let updatedInfo = {firstName, lastName, email};
        axios({
          url: '/api/updateprofile',
          method: 'PUT',
          data: updatedInfo,
          headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then(() => {
            this.props.retrieveUser();
            this.props.retrieveAllUsers();
            this.props.retrieveAllPosts();
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
        this.props.closeProfileForm();
    }

    render() {
        const {errorMsg} = this.state;
        return (
            <div className="container mt-3">
                <h3>Update Your Profile</h3>
                <form onSubmit={this.handleProfileUpdate}>
                    <p className="text-danger">{errorMsg}</p>
                    <div className="form-row">
                        <div className="form-group col-md-6 col-lg-6">
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" 
                                className="form-control"  
                                name="firstName"                            
                                value={this.state.firstName}
                                onChange={this.handleChange} />
                        </div>
                        <div className="form-group col-md-6 col-lg-6">
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" 
                                className="form-control" 
                                name="lastName"                            
                                value={this.state.lastName}
                                onChange={this.handleChange} />
                        </div>
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="email">Email</label>
                        <input type="email" 
                            className="form-control" 
                            name="email"                            
                            value={this.state.email}
                            onChange={this.handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
            </div>
        );
    }
}

export default ProfileUpdateForm;