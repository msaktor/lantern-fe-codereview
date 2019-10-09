import React from "react";
import {Modal} from 'react-bootstrap';
import {toast} from "react-toastify";
import request from "../../../common/request";
import config from "../../../common/config";

class DeleteModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            device: null,
            callback: null
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.setDevice = this.setDevice.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleClose() {
        this.setState({show: false});

        return this;
    }

    handleShow() {
        this.setState({show: true});

        return this;
    }

    handleDelete(event) {
        this.delete();

        event.preventDefault();
    }

    setDevice(device) {
        this.setState({device: device});

        return this;
    }

    onSubmit(callback) {
        this.setState({callback: callback});

        return this;
    }

    delete() {
        request
            .delete(config.endpoint + '/classes/Device/' + this.state.device.objectId)
            .then(() => toast.success('Device deleted'))
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
                            <div className="text-center">
                                <h4 className="mb-3">Are you sure?</h4>
                                <p className="mb-0">You will not be able to recover this device!</p>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-outline-danger"
                                    onClick={this.handleDelete}>Delete
                            </button>
                            <button type="button" className="btn btn-outline-dark" onClick={this.handleClose}>Close
                            </button>
                        </Modal.Footer>
                    </form>
                </Modal>
            );
        } else {
            return (<></>);
        }
    }
}

export default DeleteModal;
