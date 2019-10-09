import React from "react";
import {Modal} from 'react-bootstrap';
import {toast} from "react-toastify";
import request from "../../../common/request";
import config from "../../../common/config";
import {countries} from "../../../countries";

class AddModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            device: {
                deviceName: '',
                osType: '',
                countryIsoCode: '',
                otherDomesticCountryIsoCode: '',
            },
            callback: null
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChangeDeviceName = this.handleChangeDeviceName.bind(this);
        this.handleChangeOsType = this.handleChangeOsType.bind(this);
        this.handleChangeCountryIsoCode = this.handleChangeCountryIsoCode.bind(this);
        this.handleChangeOtherDomesticCountryIsoCode = this.handleChangeOtherDomesticCountryIsoCode.bind(this);
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
        const device = this.state.device;
        device.deviceName = event.target.value;

        this.setState({device: device});
    }

    handleChangeOsType(event) {
        const device = this.state.device;
        device.osType = event.target.value;

        this.setState({device: device});
    }

    handleChangeCountryIsoCode(event) {
        const device = this.state.device;
        device.countryIsoCode = event.target.value;

        this.setState({device: device});
    }

    handleChangeOtherDomesticCountryIsoCode(event) {
        const device = this.state.device;
        device.otherDomesticCountryIsoCode = event.target.value;

        this.setState({device: device});
    }

    handleSubmit(event) {
        const {deviceName, osType, countryIsoCode, otherDomesticCountryIsoCode} = this.state.device;

        if (!deviceName.length || !osType.length || !countryIsoCode.length || !otherDomesticCountryIsoCode.length) {
            toast.error('Fields are required');
            event.stopPropagation();
        } else if (!countries.find((country) => country.Code.toLowerCase() === countryIsoCode.toLowerCase())) {
            toast.error('Country iso code is not valid');
            event.stopPropagation();
        } else if (!countries.find((country) => country.Code.toLowerCase() === otherDomesticCountryIsoCode.toLowerCase())) {
            toast.error('Other domestic country iso code is not valid');
            event.stopPropagation();
        } else {
            this.add();
        }

        event.preventDefault();
    }

    onSubmit(callback) {
        this.setState({callback: callback});

        return this;
    }

    add() {
        request
            .post(config.endpoint + '/classes/Device', this.state.device)
            .then(() => toast.success('Device added'))
            .then(() => this.state.callback && this.state.callback(this.state.device))
            .then(() => this.handleClose())
            .catch((e) => toast.error(e.message));
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose}>
                <form onSubmit={this.handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new device</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label htmlFor="deviceName">Device name</label>
                            <input id="deviceName"
                                   className="form-control"
                                   type="text"
                                   placeholder="Device name"
                                   value={this.state.device.deviceName}
                                   onChange={this.handleChangeDeviceName}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="osType">Os type</label>
                            <select
                                id="osType"
                                className="form-control"
                                value={this.state.device.osType}
                                onChange={this.handleChangeOsType}>
                                <option value=""></option>
                                <option value="iPhone">iPhone</option>
                                <option value="Android">Android</option>
                                <option value="WindowsPhone">WindowsPhone</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="countryIsoCode">Country iso code</label>
                            <input id="countryIsoCode"
                                   className="form-control"
                                   type="text"
                                   placeholder="Country iso code"
                                   value={this.state.device.countryIsoCode}
                                   onChange={this.handleChangeCountryIsoCode}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="otherDomesticCountryIsoCode">Other domestic country iso code</label>
                            <input id="otherDomesticCountryIsoCode"
                                   className="form-control"
                                   type="text"
                                   placeholder="Other domestic country iso code"
                                   value={this.state.device.otherDomesticCountryIsoCode}
                                   onChange={this.handleChangeOtherDomesticCountryIsoCode}/>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-outline-success">Add</button>
                        <button type="button" className="btn btn-outline-danger" onClick={this.handleClose}>Close
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export default AddModal;
