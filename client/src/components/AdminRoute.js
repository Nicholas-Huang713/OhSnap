import React from 'react';
import { withRouter} from "react-router-dom";
import {getJwt} from '../helpers/jwt';
import axios from 'axios';

class AdminRoute extends React.Component{
  constructor(props){
    super(props);
    this.state ={
        isAdmin: false
    }
  }

  componentDidMount =() => {
    const jwt = getJwt();
    axios({ 
    url: '/api/getuser',
    method: 'GET',
    headers: {'Authorization' : `Bearer ${jwt}`}
    })
    .then((res) => {
        const user = res.data;
        this.setState({
            isAdmin: user[0].admin
        });
    })
    .catch((err) => {
        console.log('Error:' + err);
    });
  }

  render(){
    const {isAdmin} = this.state;
    if(isAdmin){
      return ( 
        <div> {this.props.children}</div>
      )
    }
    return (
        <div><h1>Access Denied</h1></div>
    );   
  }      
}

export default withRouter(AdminRoute);
