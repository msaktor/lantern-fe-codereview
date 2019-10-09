import React from "react";
import {Modal} from 'react-bootstrap';
import {toast} from "react-toastify";
import request from "../../../common/request";
import config from "../../../common/config";
import {countries} from "../../../countries";

class TrafficModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            device: null,
            callback: null,
            countryIsoCode: '',
            traffic: 0
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setDevice = this.setDevice.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChangeTraffic = this.handleChangeTraffic.bind(this);
        this.handleChangeCountryIsoCode = this.handleChangeCountryIsoCode.bind(this);
    }

    handleClose() {
        this.setState({show: false});

        return this;
    }

    handleShow() {
        this.setState({show: true});

        return this;
    }

    handleChangeTraffic(event) {
        this.setState({traffic: event.target.value});
    }

    handleChangeCountryIsoCode(event) {
        this.setState({countryIsoCode: event.target.value});
    }

    handleSubmit(event) {
        if (!this.state.countryIsoCode.length || this.state.traffic === null) {
            toast.error('Fields are required');
        } else if (this.state.traffic < 0) {
            toast.error('Traffic must be zero or bigger');
        } else if (!countries.find((item) => item.Code.toLowerCase() === this.state.countryIsoCode.toLowerCase())) {
            toast.error('Country iso code is invalid');
        } else {
            this.update();
        }

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

    update() {
        const event = {
            device: {
                __type: 'Pointer',
                className: 'Device',
                objectId: this.state.device.objectId
            },
            countryIsoCode: this.state.countryIsoCode,
            traffic: parseInt(this.state.traffic, 10)
        };

        request
            .post(config.endpoint + '/classes/StatusUpdate/', event)
            .then(() => toast.success('Status updated'))
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
                            <Modal.Title>Traffic for {this.state.device.deviceName}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="form-group">
                                <label htmlFor="traffic">Traffic</label>
                                <input id="traffic"
                                       className="form-control"
                                       type="number"
                                       placeholder="Traffic"
                                       value={this.state.traffic}
                                       onChange={this.handleChangeTraffic}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="countryIsoCode">Country iso code</label>
                                <input id="countryIsoCode"
                                       className="form-control"
                                       type="text"
                                       placeholder="Country iso code"
                                       value={this.state.countryIsoCode}
                                       onChange={this.handleChangeCountryIsoCode}/>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="submit" className="btn btn-outline-success">Update</button>
                            <button type="button" className="btn btn-outline-danger" onClick={this.handleClose}>Close
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

export default TrafficModal;
