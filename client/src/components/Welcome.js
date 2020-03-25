import React from 'react';
import '../App.css';
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios';
import {getJwt} from '../helpers/jwt';

class Welcome extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            firstName: ""
        }
    }
    componentDidMount(){
        this.retrieveUser();
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
              firstName: user[0].firstname
            });
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }

    render() {
        return (
            <div className="jumbotron jumbotron-fluid welcome-bg text-white">
                <div className="container">
                    <h1 className="display-4">Welcome to ohSnap! </h1>
                    <p className="lead">Thanks for joining us <span className="text-large">{this.state.firstName}</span></p>
                    <p>Head on over to the dashboard and begin connecting with others!</p>
                    <p className="lead">
                        <Link to="/dashboard" className="btn btn-sm btn-dark" role="button">Dashboard</Link>
                    </p>
                </div>
            </div>
        )
    }
}

export default withRouter(Welcome);