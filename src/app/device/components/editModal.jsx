import React from "react";
import {Modal} from 'react-bootstrap';
import {toast} from "react-toastify";
import request from "../../../common/request";
import config from "../../../common/config";

class EditModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            device: null,
            callback: null,
            deviceName: ''
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setDevice = this.setDevice.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChangeDeviceName = this.handleChangeDeviceName.bind(this);
    }

    handleClose() {
        this.setState({show: false});

        return this;
    }

    handleShow() {
        this.setState({show: true});

        return this;
    }

    handleChangeDeviceName(event) {
        this.setState({deviceName: event.target.value});
    }

    handleSubmit(event) {
        if(!this.state.deviceName.length) {
            toast.error('Device name is required');
            event.stopPropagation();
        } else {
            this.update();
        }

        event.preventDefault();
    }

    setDevice(device) {
        this.setState({device: device});
        this.setState({deviceName: device.deviceName});

        return this;
    }

    onSubmit(callback) {
        this.setState({callback: callback});

        return this;
    }

    update() {
        request
            .put(config.endpoint + '/classes/Device/' + this.state.device.objectId, {deviceName: this.state.deviceName})
            .then(() => toast.success('Device edited'))
            .then(() => this.state.callback && this.state.callback())
            .then(() => this.handleClose())
            .catch((e) => toast.error(e.message));
    }

    render() {
        if (this.state.device) {
            return (
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update {this.state.device.deviceName}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="form-group">
                                <label htmlFor="deviceName">Device name</label>
                                <input id="deviceName"
                                       className="form-control"
                                       type="text"
                                       placeholder="deviceName"
                                       value={this.state.deviceName}
                                       onChange={this.handleChangeDeviceName} />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="submit" className="btn btn-outline-success">Update</button>
                            <button type="button" className="btn btn-outline-danger" onClick={this.handleClose}>Close</button>
                        </Modal.Footer>
                    </form>
                </Modal>
            );
        } else {
            return (<></>);
        }
    }
}

export default EditModal;
