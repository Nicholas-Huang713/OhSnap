import React from 'react';
import '../App.css';
import logo from '../images/logo.png';
import {withRouter, Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {home, register, login, album, dashboard, favorites} from '../actions';

function NavBar() {
    const currentPage = useSelector(state => state.currentPage)
    const dispatch = useDispatch();   
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link to="/" onClick={() => dispatch(home())} className="navbar-brand"><img src={logo} width="30" height="30" className="d-inline-block align-top" alt="logo" /> <span className="logo-font">ohSnap</span></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
                {
                    localStorage.getItem("token") ?
                        <ul className="navbar-nav mr-auto">
                            <li className={`${currentPage==="dashboard" ? "nav-item active" : "nav-item"}`}>
                                <Link to="/dashboard" onClick={() => dispatch(dashboard())} className="nav-link">Home<span className="sr-only">(current)</span></Link>
                            </li>
                            <li className={`${currentPage==="album" ? "nav-item active" : "nav-item"}`}>
                                <Link to="/album" onClick={() => dispatch(album())} className="nav-link">Album</Link>
                            </li>
                            <li className={`${currentPage==="favorites" ? "nav-item active" : "nav-item"}`}>
                                <Link to="/favorites" onClick={() => dispatch(favorites())} className="nav-link">Favorites</Link>
                            </li>
                        </ul>
                    : 
                        <ul className="navbar-nav mr-auto">
                            <li className={`${currentPage==="login" ? "nav-item active" : "nav-item"}`}>
                                <Link to="/login" onClick={() => dispatch(login())} className="nav-link">Login</Link>
                            </li>
                            <li className={`${currentPage==="register" ? "nav-item active" : "nav-item"}`}>
                                <Link to="/register" onClick={() => dispatch(register())} className="nav-link">Register</Link>
                            </li>
                        </ul>
                }
                {
                    localStorage.getItem("token") &&
                        <span className="navbar-text">
                            <Link to="/" onClick={() => localStorage.removeItem("token")} className="btn btn-dark">Signout</Link>
                        </span>
                }
            </div>
        </nav>
    );
};

export default withRouter(NavBar);