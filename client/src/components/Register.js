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
            selectedFile: "",
            currentImage: "https://dogisworld.com/wp-content/uploads/2019/05/goldie.jpg",
        }
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name] : value });
    }

    imageChange = (e) => {
        console.log(e.target.files[0]);
        this.setState({
          currentImage: URL.createObjectURL(e.target.files[0]),
          selectedFile: e.target.files[0]
        });
    }

    handleRegister = (event) => {
        event.preventDefault();
        const {firstName, lastName, email, password, selectedFile} = this.state;
        const newUser = {
            firstname: firstName,
            lastname: lastName,
            email,
            password
        }
        axios({
            url: '/api/register',
            method: 'POST',
            data: newUser
        })
        .then((res) => {
            const token = res.data.token;
            localStorage.setItem('token', token);
            const id = res.data.id;
            let newImg = new FormData();
            // if (selectedFile) {
                newImg.append("image", selectedFile, selectedFile.name);
                axios({
                    url: `/api/img-upload/${id}`,
                    method: 'POST',
                    data: newImg,
                    headers: {
                        'accept': 'application/json',
                        'accept-language': 'en-US,en;q=0.8',
                        'Content-Type': `multipart/form-data; boundary=${newImg._boundary}`,
                    }
                })
                .then((res) => {
                    // const token = res.data;
                    // localStorage.setItem('token', token);
                    console.log("success");
                    
                })
                .catch((error) => {
                    console.log(error)
                });
            // }  
            // const token = res.data;
            // console.log(token);
            this.props.history.push('/welcome');
            
        }) 
        .catch((err) => {
            // this.setState({errorMsg: err.response.data});
            console.log(err.response.data);
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
                                <h3>Create Your Account <img className="rounded-circle profile-preview" src={currentImage} /></h3>
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
                                <div className="input-group">
                                    <div className="custom-file">
                                        <input type="file" className="custom-file-input" onChange={this.imageChange} />
                                        <label className="custom-file-label" htmlFor="inputGroupFile01">Choose Profile Image</label>
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
                                        <input className="form-check-input" type="checkbox" id="gridCheck" />
                                        <label className="form-check-label" htmlFor="gridCheck">
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