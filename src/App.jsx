import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faUser, faLock, faPencilAlt, faTrash, faSort, faSearch, faPlus} from '@fortawesome/free-solid-svg-icons';
import {ToastContainer} from "react-toastify";
import Token from "./common/token";
import Login from "./app/login/login";
import {BrowserRouter as Router, Route, Switch, NavLink, withRouter, Redirect} from 'react-router-dom';
import DeviceList from "./app/device/deviceList/deviceList";
import DeviceInfo from "./app/device/deviceInfo/deviceInfo";

library.add(faUser, faLock, faSearch, faPencilAlt, faTrash, faSort, faPlus);

class App extends React.Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        Token.deleteToken();
        this.props.history.push('/login');
    }

    render() {
        if (Token.isAuthenticated()) {
            return (
                <Router>
                    <div>
                        <div className="top-wrapper">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-6">
                                        <a href="/">Lantern app</a>
                                    </div>
                                    <div className="col-6 text-right">
                                        <button className="btn-sm btn btn-danger" onClick={this.logout}>logout</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container-fluid page-wrapper">
                            <div className="row">
                                <div className="col-lg-3 col-xl-2 menu">
                                    <div className="profile">
                                        Mike's profile
                                    </div>
                                    <NavLink className="item" to="/device-list">Device list</NavLink>
                                    <NavLink className="item" to="#">Menu item</NavLink>
                                    <NavLink className="item" to="#">Menu item</NavLink>
                                    <NavLink className="item" to="#">Menu item</NavLink>
                                    <NavLink className="item" to="#">Menu item</NavLink>
                                    <NavLink className="item" to="#">Menu item</NavLink>
                                    <NavLink className="item" to="#">Menu item</NavLink>
                                </div>
                                <div className="col-lg-9 col-xl-10 offset-lg-3 offset-xl-2">
                                    <div className="page">
                                        <Switch>
                                            <Route exact path="/login" component={Login}/>
                                            <Route exact path="/device-list" component={DeviceList}/>
                                            <Route exact path="/device-list/device/:deviceObjectId" component={DeviceInfo}/>
                                        </Switch>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ToastContainer/>
                    </div>
                </Router>
            );
        } else {
            return (
                <Router>
                    <Switch>
                        <Route exact path="/login" component={Login}/>
                        <Redirect from="/" to="/login"/>
                    </Switch>
                </Router>
            );
        }
    }
}

export default withRouter(App);
