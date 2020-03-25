import React from 'react';
import '../App.css';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {dashboard} from '../actions';

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            errorMsg: ""
        }
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name] : value });
    }

    handleLogin = (event) => {
        const {email, password} = this.state;
        event.preventDefault();
        const currentUser = {
            email,
            password
        }
        axios({
            url: '/api/login',
            method: 'POST',
            data: currentUser 
        })
        .then((res) => {
            localStorage.setItem('token', res.data);
            // const dispatch = useDispatch();
            // dispatch(dashboard());
            this.props.history.push('/dashboard');
        })
        .catch((err) => {
            this.setState({errorMsg: err.response.data});
        });        
    }

    componentWillUnmount() {
        this.setState({
            email: "",
            password: "",
            errorMsg: "",
        })
    }

    render(){
        const {errorMsg} = this.state;
        return (
            <div className="login-style">
                <div className="container-fluid mt-4">
                    <div className="row">
                        <div className="col-sm"></div>
                        <div className="bg-white form-bg col-md-4 col-lg-4 ml-3 mr-3">
                            <div className="form-content">
                                <form onSubmit={this.handleLogin}>
                                    <h3>Login Here</h3>
                                    <p className="text-danger">{errorMsg}</p>
                                    <div className="form-group">
                                        <label>Email address</label>
                                        <input type="email" 
                                                className="form-control" 
                                                aria-describedby="email" 
                                                placeholder="Enter email" 
                                                name="email"                            
                                                value={this.state.email}
                                                onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password" 
                                                className="form-control" 
                                                placeholder="Password"
                                                name="password"                            
                                                value={this.state.password}
                                                onChange={this.handleChange}  />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Login</button>
                                </form>
                            </div>
                        </div> 
                        <div className="col-sm"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;