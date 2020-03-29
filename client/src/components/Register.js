import React from 'react';
import '../App.css';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

class Register extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            errorMsg: "",
            subscribed: false
        }
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name] : value });
    }

    handleSubscribeChange = () => {
        this.setState({subscribed: !this.state.subscribed})
    }

    handleRegister = (event) => {
        event.preventDefault();
        const {firstName, lastName, email, password, subscribed} = this.state;
        const newUser = {
            firstname: firstName,
            lastname: lastName,
            email,
            password,
            subscribed
        }
        axios({
            url: '/api/register',
            method: 'POST',
            data: newUser
        })
        .then((res) => {
            const token = res.data.token;
            localStorage.setItem('token', token);
            this.props.history.push('/welcome');
        }) 
        .catch((err) => {
            this.setState({errorMsg: err.response.data});
        })   
    }

    componentWillUnmount() {
        this.setState({
            firstName: "",
            lastName: "",
            email: "", 
            password: "",
            errorMsg: "",
        })
    }

    render(){
        const {errorMsg, currentImage} = this.state;
        return (
            <div className="reg-style">
                <div className="container-fluid d-flex justify-content-sm-center justify-content-lg-center justify-content-md-center">
                    <div className="bg-white form-bg">
                        <div className="form-content">
                            <form onSubmit={this.handleRegister} encType="multipart/form-data">
                                <h3>Create Your Account </h3>
                                <p className="text-danger">{errorMsg}</p>
                                <div className="form-row">
                                    <div className="form-group col-md-6 col-lg-6">
                                        <label htmlFor="firstname">First Name</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="First" 
                                            name="firstName"                            
                                            value={this.state.firstName}
                                            onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group col-md-6 col-lg-6">
                                        <label htmlFor="lastname">Last Name</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Last" 
                                            name="lastName"                            
                                            value={this.state.lastName}
                                            onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" 
                                        className="form-control" 
                                        placeholder="email@email.com" 
                                        name="email"                            
                                        value={this.state.email}
                                        onChange={this.handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" 
                                        className="form-control" 
                                        name="password"                            
                                        value={this.state.password}
                                        onChange={this.handleChange} />
                                </div>
                                <div className="form-group">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="subscribed" value={this.state.subscribed} onChange={this.handleSubscribeChange} />
                                        <label className="form-check-label" htmlFor="Subscribe Checkbox">
                                            Subscribe for updates
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Register);