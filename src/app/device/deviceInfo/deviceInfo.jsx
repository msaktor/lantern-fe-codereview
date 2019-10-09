import './deviceInfo.css';

import React from "react";
import request from "../../../common/request";
import config from "../../../common/config";
import {toast} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {withRouter} from "react-router-dom";
import EditModal from "../components/editModal";
import TrafficModal from "../components/trafficModal";

class DeviceInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            device: null,
            eventList: null,
            eventRows: null,
            deviceInfoRows: null,
            connectButton: null,
            deviceObjectId: this.props.match.params.deviceObjectId,
            editModalRef: React.createRef(),
            trafficModalRef: React.createRef(),
        };

        this.openEditModal = this.openEditModal.bind(this);
        this.openTrafficModal = this.openTrafficModal.bind(this);
        this.createEventBody = this.createEventBody.bind(this);
        this.createDeviceInfoBody = this.createDeviceInfoBody.bind(this);
        this.connectWifi = this.connectWifi.bind(this);
        this.disconnectWifi = this.disconnectWifi.bind(this);
    }

    componentWillMount() {
        this
            .loadDevice()
            .loadEventList();
    }

    isDeviceConnected(device = null) {
        if (!this.state.eventList || !this.state.eventList.length) {
            return false;
        }

        const event = device || this.state.eventList[0];

        return event.eventType === 'connect';
    }

    setEventList(eventList) {
        eventList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        this.setState({eventList: eventList});
    }

    setDevice(device) {
        this.setState({device: device});
    }

    openEditModal() {
        this.state.editModalRef.current
            .setDevice(this.state.device)
            .onSubmit(() => this.loadDevice())
            .handleShow();
    }

    openTrafficModal() {
        this.state.trafficModalRef.current
            .setDevice(this.state.device)
            .onSubmit(() => this.loadDevice())
            .handleShow();
    }

    loadDevice() {
        request
            .get(config.endpoint + '/classes/Device/' + this.state.deviceObjectId)
            .then((response) => this.setDevice(response.data))
            .then(() => this.createDeviceInfoBody())
            .catch((e) => toast.error(e.message));

        return this;
    }

    loadEventList() {
        const device = {
            device: {
                __type: 'Pointer',
                className: 'Device',
                objectId: this.state.deviceObjectId
            }
        };

        request
            .get(config.endpoint + '/classes/WiFiEvent', {params: {where: JSON.stringify(device)}})
            .then((response) => this.setEventList(response.data.results))
            .then(() => this.createEventBody())
            .then(() => this.createConnectButton())
            .catch((e) => toast.error(e.message));

        return this;
    }

    connectWifi() {
        const event = {
            device: {
                __type: 'Pointer',
                className: 'Device',
                objectId: this.state.deviceObjectId
            },
            eventType: 'connect'
        };

        request
            .post(config.endpoint + '/classes/WiFiEvent/', event)
            .then(() => this.loadEventList())
            .catch((e) => toast.error(e.message));
    }

    disconnectWifi() {
        const event = {
            device: {
                __type: 'Pointer',
                className: 'Device',
                objectId: this.state.deviceObjectId
            },
            eventType: 'disconnect'
        };

        request
            .post(config.endpoint + '/classes/WiFiEvent/', event)
            .then(() => this.loadEventList())
            .catch((e) => toast.error(e.message));
    }

    createDeviceInfoBody() {
        const device = this.state.device;
        const deviceInfoRows = [];
        let roaming = 'false';

        if (device.roaming) {
            roaming = device.roaming.toString();
        } else if (!device.otherDomesticCountryIsoCode) {
            roaming = 'false';
        } else {
            roaming = (device.countryIsoCode !== device.otherDomesticCountryIsoCode).toString();
        }

        deviceInfoRows.push(<div key={1}><strong>Device name: </strong>{device.deviceName}</div>);
        deviceInfoRows.push(<div key={2}><strong>OS type: </strong>{device.osType}</div>);
        deviceInfoRows.push(<div key={3}><strong>Country iso code: </strong>{device.countryIsoCode}</div>);
        deviceInfoRows.push(<div key={4}><strong>Other domestic country iso code: </strong>{device.otherDomesticCountryIsoCode}</div>);
        deviceInfoRows.push(<div key={5}><strong>Roaming: </strong>{roaming}</div>);
        deviceInfoRows.push(<div key={6}><strong>Traffic counter: </strong>{device.trafficCounter || 0}</div>);
        deviceInfoRows.push(<div key={7}><strong>Created at: </strong>{device.createdAt}</div>);
        deviceInfoRows.push(<div key={8}><strong>Last update: </strong>{device.updatedAt}</div>);

        this.setState({deviceInfoRows: deviceInfoRows});
    }

    createEventBody() {
        const rows = [];
        const eventList = this.state.eventList;

        for (const key in eventList) {
            const eventType = this.isDeviceConnected(eventList[key]) ? 'success' : 'danger';

            rows.push(
                <li key={key} className={"list-group-item list-group-item-" + eventType}>
                    <div className="row">
                        <div className="col-6">
                            {eventList[key].eventType}
                        </div>
                        <div className="col-6 text-right">
                            <small>{eventList[key].createdAt}</small>
                        </div>
                    </div>
                </li>
            )
        }

        this.setState({eventRows: rows});
    }

    createConnectButton() {
        if (this.isDeviceConnected()) {
            this.setState({
                connectButton: [
                    <button key={1} className="btn btn-sm btn-outline-danger" onClick={this.disconnectWifi}>Disconnect</button>
                ]
            });
        } else {
            this.setState({
                connectButton: [
                    <button key={1} className="btn btn-sm btn-outline-success" onClick={this.connectWifi}>Connect</button>
                ]
            });
        }
    }

    render() {
        return (
            <>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            Device
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <div className="card">
                                        <div className="card-header">
                                            Info
                                        </div>
                                        <div className="card-body">
                                            <div>{this.state.deviceInfoRows}</div>
                                            <div className="row mt-4">
                                                <div className="col-6">
                                                    <button className="btn btn-outline-primary" onClick={this.openEditModal}>
                                                        Edit device <FontAwesomeIcon icon="pencil-alt"/>
                                                    </button>
                                                </div>
                                                <div className="col-6 text-right">
                                                    <button className="btn btn-outline-success" onClick={this.openTrafficModal}>
                                                        Add traffic <FontAwesomeIcon icon="plus"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="card">
                                        <div className="card-header">
                                            Wifi event list
                                        </div>
                                        <div className="card-body">
                                            <ul className="list-group event-list-group">{this.state.eventRows}</ul>
                                        </div>
                                        <div className="card-footer text-right">{this.state.connectButton}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <EditModal ref={this.state.editModalRef}/>
                <TrafficModal ref={this.state.trafficModalRef}/>
            </>
        );
    }
}

export default withRouter(DeviceInfo);
