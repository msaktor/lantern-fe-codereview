import './login.css';

import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import config from "../../common/config";
import request from "../../common/request";
import Token from "../../common/token";
import {toast} from "react-toastify";
import {withRouter} from "react-router-dom";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };

        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        if (Token.getToken()) {
            window.location.href = '/device-list';
        }
    }

    handleChangeUsername(event) {
        this.setState({username: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event) {
        if(!this.state.password.length || !this.state.username.length) {
            toast.error('Username and Password are required');
            event.stopPropagation();
        } else {
            this.login();
        }

        event.preventDefault();
    }

    login() {
        request
            .get(config.endpoint + '/login', {
                params: {
                    username: this.state.username,
                    password: this.state.password,
                }
            })
            .then((response) => Token.setToken(response.data.sessionToken))
            .then(() => toast.success('Login successful'))
            .then(() => this.props.history.push('/device-list'))
            .catch((e) => toast.error(e.message));
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4 offset-md-4">
                        <div className="login-form-wrapper">
                            <div className="card">
                                <div className="card-body">
                                    <h2 className="text-center mb-4">Log in</h2>
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="form-group position-relative">
                                            <FontAwesomeIcon icon="user"/>
                                            <input type="text"
                                                   className="form-control"
                                                   placeholder="Username"
                                                   value={this.state.username}
                                                   onChange={this.handleChangeUsername} />
                                        </div>
                                        <div className="form-group position-relative">
                                            <FontAwesomeIcon icon="lock"/>
                                            <input type="password"
                                                   className="form-control"
                                                   placeholder="Password"
                                                   value={this.state.password}
                                                   onChange={this.handleChangePassword} />
                                        </div>
                                        <div className="form-group mt-4 mb-0">
                                            <button type="submit" className="btn btn-primary btn-block">Log in</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);
