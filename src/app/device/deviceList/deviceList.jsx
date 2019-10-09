import './deviceList.css';

import React from "react";
import request from "../../../common/request";
import config from "../../../common/config";
import {toast} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NavLink, withRouter} from "react-router-dom";
import EditModal from "../components/editModal";
import DeleteModal from "../components/deleteModal";
import AddModal from "../components/addModal";

class DeviceList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deviceList: null,
            tableRows: null,
            addModalRef: React.createRef(),
            editModalRef: React.createRef(),
            deleteModalRef: React.createRef()
        };

        this.sortByDeviceName = this.sortByDeviceName.bind(this);
        this.sortByCountryCode = this.sortByCountryCode.bind(this);
        this.sortByCreateDate = this.sortByCreateDate.bind(this);
        this.openAddModal = this.openAddModal.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.createTableBody = this.createTableBody.bind(this);
    }

    componentWillMount() {
        this.loadDevices();
    }

    setDeviceList(deviceList) {
        this.setState({deviceList: deviceList});
    }

    sortByDeviceName() {
        const deviceList = this.state.deviceList;

        deviceList.sort((a, b) => a.deviceName.localeCompare(b.deviceName));

        this.setDeviceList(deviceList);
        this.createTableBody();
    }

    sortByCountryCode() {
        const deviceList = this.state.deviceList;

        deviceList.sort((a, b) => a.countryIsoCode.localeCompare(b.countryIsoCode));

        this.setDeviceList(deviceList);
        this.createTableBody();
    }

    sortByCreateDate() {
        const deviceList = this.state.deviceList;

        deviceList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        this.setDeviceList(deviceList);
        this.createTableBody();
    }

    openAddModal() {
        this.state.addModalRef.current
            .onSubmit(device => {
                const devices = this.state.deviceList;
                devices.push(device);
                this.setDeviceList(devices);
                this.createTableBody();
            })
            .handleShow();
    }

    openEditModal(device) {
        this.state.editModalRef.current
            .setDevice(device)
            .onSubmit(() => this.loadDevices())
            .handleShow();
    }

    openDeleteModal(device) {
        this.state.deleteModalRef.current
            .setDevice(device)
            .onSubmit(() => this.loadDevices())
            .handleShow();
    }

    loadDevices() {
        request
            .get(config.endpoint + '/classes/Device')
            .then((response) => this.setDeviceList(response.data.results))
            .then(() => this.createTableBody())
            .catch((e) => toast.error('error', e.message));
    }

    createTableBody() {
        const rows = [];
        const deviceList = this.state.deviceList;

        for (const key in deviceList) {
            rows.push(
                <tr key={key}>
                    <td>{deviceList[key].deviceName}</td>
                    <td>{deviceList[key].countryIsoCode}</td>
                    <td>{deviceList[key].createdAt}</td>
                    <td>
                        <div className="btn-group btn-group-sm" role="group">
                            <NavLink className="btn btn-outline-info"
                                     to={"/device-list/device/" + deviceList[key].objectId}>
                                show <FontAwesomeIcon icon="search"/>
                            </NavLink>
                            <button className="btn btn-outline-primary"
                                    onClick={() => this.openEditModal(deviceList[key])}>
                                edit <FontAwesomeIcon icon="pencil-alt"/>
                            </button>
                            <button className="btn btn-outline-danger"
                                    onClick={() => this.openDeleteModal(deviceList[key])}>
                                delete <FontAwesomeIcon icon="trash"/>
                            </button>
                        </div>
                    </td>
                </tr>
            )
        }

        this.setState({tableRows: rows});
    }

    render() {
        return (
            <>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            Device list
                        </div>
                        <div className="card-body">
                            <div className="text-right my-3">
                                <button className="btn btn-sm btn-outline-success" onClick={this.openAddModal}>
                                    add device <FontAwesomeIcon icon="plus"/>
                                </button>
                            </div>
                            <table className="table table-striped table-bordered">
                                <thead className="thead-light">
                                <tr>
                                    <th scope="col">
                                        <span onClick={this.sortByDeviceName}>
                                            Device name <FontAwesomeIcon icon="sort"/>
                                        </span>
                                    </th>
                                    <th scope="col">
                                        <span onClick={this.sortByCountryCode}>
                                            Country code <FontAwesomeIcon icon="sort"/>
                                        </span>
                                    </th>
                                    <th scope="col">
                                        <span onClick={this.sortByCreateDate}>
                                            Created <FontAwesomeIcon icon="sort"/>
                                        </span>
                                    </th>
                                    <th scope="col" width="230">Action</th>
                                </tr>
                                </thead>
                                <tbody>{this.state.tableRows}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <AddModal ref={this.state.addModalRef}/>
                <EditModal ref={this.state.editModalRef}/>
                <DeleteModal ref={this.state.deleteModalRef}/>
            </>
        );
    }
}

export default withRouter(DeviceList);
