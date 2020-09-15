import React, { Component } from 'react';
import { connect } from "react-redux";
import { toast } from 'react-toastify';
import { User, X, Check, Edit2, Trash2 } from "react-feather";
import { Table, Tag, Space, Checkbox, Switch, Radio } from 'antd';
import { Card, CardBody, Button, Form, FormGroup, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

// const antdClass = require("antd/dist/antd.css");
import antdClass from 'antd/dist/antd.css';
import antdClass2 from "../../assets/css/vendors/customAntdTable.css";
import _ from 'lodash';

import { getUsers, deleteUserInfo, editUserInfo } from '../../services/user';
import { getPermissions } from '../../services/permission';
import { getUserTypes } from '../../services/userType';


const mapStateToProps = (state) => {
    return state
}


toast.configure({ bodyClassName: "customFont" });

class UsersPage extends Component {

    //#region VARIABLES ----------------------------------------------------

    Columns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
            sorter: {
                compare: (a, b) => a.firstName.localeCompare(b.firstName),
                multiple: 4
            },
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: 'ascend',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
            sorter: {
                compare: (a, b) => a.lastName.localeCompare(b.lastName),
                multiple: 3
            },
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'User Code',
            dataIndex: 'userCode',
            key: 'userCode',
            sorter: {
                compare: (a, b) => a.userCode.localeCompare(b.userCode),
                multiple: 2
            },
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'User Type',
            dataIndex: 'userType',
            key: 'userType',
            render: userType => (
                <Tag color={userType === "Admin" ? "blue" : "volcano"}>{
                    userType
                }</Tag>
            ),
            sorter: {
                compare: (a, b) => a.userType.localeCompare(b.userType),
                multiple: 1
            },
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Is Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: isActive => (
                <Tag color={isActive ? "cyan" : "red"}>{
                    isActive ? "Active" : "Inactive"
                }</Tag>
            )
        },
        {
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button className="btn-warning mt-1" size="sm" onClick={() => this.handleEditUser(record)}>
                        <Edit2 size={16} />
                    </Button>
                    <Button className="btn-danger mt-1" size="sm" onClick={() => this.handleDeleteUser(record)}>
                        <Trash2 size={16} />
                    </Button>
                    {/* <a onClick={() => this.handleDeleteUser(record)}>Delete <Edit2 size={16} /></a> */}
                </Space>
            ),
        }
    ];

    UserStatus = ["Active", "Inactive"];

    //#endregion -----------------------------------------------------------

    //#region INITIAL FUNCTIONS -----------------------------------------

    constructor(props) {
        super(props)
        this.state = { ListOfUserTypes: [], ListOfPermissions: [], ListOfUsers: [], ListOfUsersForTable: [], selectedRowKeys: [], editModal: false, deleteModal: false, currentRow: {} };
    }

    createDataModelForDataTabel(data) {
        return data.map(item => {
            const permissions = item.permissions.filter(c => c.isGranted).map(item => item.name).join(", ");
            return { ...item, permissions, key: item._id }
        })
    }

    componentDidMount() {
        getUsers().then(res => {
            if (res.data.result) {
                this.setState({ ListOfUsers: res.data.data, ListOfUsersForTable: this.createDataModelForDataTabel(res.data.data) })
            }
        });
        getPermissions().then(res => {
            if (res.data.result) {
                this.setState({ ListOfPermissions: res.data.data });
            }
        });
        getUserTypes().then(res => {
            if (res.data.result) {
                this.setState({ ListOfUserTypes: res.data.data });
            }
        })
    }

    //#endregion -----------------------------------------------------------

    //#region EDIT USER INFO EVENTS ----------------------------------------

    handleEditUser = (userData) => {
        //   console.log('userData for edit', userData);
        const userInfo = { ..._(this.state.ListOfUsers).filter(c => c._id === userData._id).first() };
        // userInfo.userCode = 123456;
        // const permissions = [..._(this.state.ListOfUsers).filter(c => c._id == userData._id).first().permissions];
        // permissions[0] = { ...permissions[0] };
        // permissions[0].name = "XXXX";
        // userInfo.permissions = permissions;
        this.setState({ currentRow: userInfo })
        this.editToggle();
    }

    editToggle = () => {
        this.setState({
            editModal: !this.state.editModal
        });
    }

    handleUserPermissionsChange(checkedValues, permissionName) {
        // console.log('checked = ', checkedValues, permissionName, this.state.currentRow.permissions);
        const currentRow = { ...this.state.currentRow };

        const permissions = [...currentRow.permissions];
        const indexOfP = _(permissions).findIndex(c => c.name === permissionName);
        permissions[indexOfP] = { ...permissions[indexOfP] };

        const permission = { ...permissions[indexOfP] };
        const access = [...permission.access];

        access.map((item, index) => {
            if (checkedValues.length === 0) {
                access[index] = { ...access[index] };
                access[index].value = false;
            }

            else {
                const existItemInSelectedValues = _(checkedValues).filter(c => c === item.key).first();

                if (existItemInSelectedValues) {
                    //console.log(existItemInSelectedValues)
                    access[index] = { ...access[index] };
                    access[index].value = true;
                }
                else {
                    access[index] = { ...access[index] };
                    access[index].value = false;
                }
            }
        });

        permission.access = access;
        permissions[indexOfP] = permission;
        currentRow.permissions = permissions;
        this.setState({ currentRow: currentRow });
    }

    handleUserPermissionGrantedChange = (switchValue, permissionName) => {
        const currentRow = { ...this.state.currentRow };
        const permissions = [...currentRow.permissions];
        const indexOfP = _(permissions).findIndex(c => c.name === permissionName);
        permissions[indexOfP] = { ...permissions[indexOfP] };
        permissions[indexOfP].isGranted = switchValue;
        currentRow.permissions = permissions;
        this.setState({ currentRow: currentRow })
        //console.log(switchValue);
    }

    handleUserTypeChange = ({ value }) => {
        console.log('handleUserTypeChange', value);
        const currentRow = { ...this.state.currentRow };
        currentRow.userType = value;
        this.setState({ currentRow })
    }

    handleUserStatusChange = ({ value }) => {
        console.log('handleUserStatusChange', value);
        const currentRow = { ...this.state.currentRow };
        currentRow.isActive = value === "Active" ? true : false;
        this.setState({ currentRow })
    }

    handleCancelEditUserInfo = () => {
        this.setState({ currentRow: {} });
        this.editToggle();
    }

    handleSubmitEditUserInfo = () => {
        console.log('submit edit user info', this.state.currentRow);
        const userData = { ...this.state.currentRow };
        delete userData.password;
        console.log('delete password from user data edit', userData);
        editUserInfo(userData).then(response => {
            if (response.data.result) {
                toast.success('User info has been updated successfully');
                const users = [...this.state.ListOfUsers];
                const index = _(users).findIndex(c => c._id === this.state.currentRow._id);
                users[index] = { ...users[index] };
                users[index] = this.state.currentRow;

                this.setState({ ListOfUsers: users, ListOfUsersForTable: this.createDataModelForDataTabel(users), currentRow: {} });
                this.editToggle();
            }
            else {
                toast.success('There is an error in editing user info');
                this.setState({ currentRow: {} });
                this.editToggle();
            }
        }).catch(error => {
            this.editToggle();
            this.setState({ currentRow: {} });
            //return toast.error(error.message);

        })
    }

    //#endregion -----------------------------------------------------------------------------------------

    //#region DELETE USER INFO EVENTS ---------------------------------------

    handleDeleteUser = (userData) => {
        console.log('userData for delete', userData);
        const userInfo = { ..._(this.state.ListOfUsers).filter(c => c._id === userData._id).first() };
        this.setState({ currentRow: userInfo })
        this.deleteToggle();
    }

    deleteToggle = () => {
        this.setState({
            deleteModal: !this.state.deleteModal
        });
    }

    handleCancelDeleteUserInfo = () => {
        this.setState({ currentRow: {} });
        this.deleteToggle();
    }

    handleSubmitDeleteUserInfo = () => {
        deleteUserInfo(this.state.currentRow._id).then(response => {
            if (response.data.result) {
                toast.success('User info has been delete successfully');
                const originalUsers = [...this.state.ListOfUsers];
                const users = originalUsers.filter(c => c._id !== this.state.currentRow._id);
                this.setState({ ListOfUsers: users, ListOfUsersForTable: this.createDataModelForDataTabel(users), currentRow: {} });
                this.deleteToggle();
            }
            else {
                toast.success('There is an error in deleting user info');
                this.setState({ currentRow: {} });
                this.deleteToggle();
            }
        }).catch(error => {
            this.deleteToggle();
            this.setState({ currentRow: {} });
            //return toast.error(error.message);

        })
    }
    //#endregion -----------------------------------------------------------------------------------------

    //#region GRID SELECTION EVENT ------------------------------------------

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    //#endregion ------------------------------------------------------------

    render() {
        const { selectedRowKeys } = this.state.selectedRowKeys;
       // console.log('render state', this.state);
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            selections: [
                Table.SELECTION_ALL,

            ],
        };
        return (
            <React.Fragment>
                {/* <h4 className="mt-4 mb-0 text-bold-400">Users</h4>
                <p>
                    Constrain the width of cards via custom CSS, our predefined grid classes, or with custom styles using our grid
                    mixins.
            </p> */}

                <Row className="row-eq-height">
                    <Col sm="12" md="12">
                        <Card>
                            <CardBody>
                                {/* <CardTitle>Users</CardTitle> */}
                                {/* <CardText>With supporting text below as a natural lead-in to additional content.</CardText> */}
                                <Form>
                                    <div className="form-body">
                                        <h4 className="form-section">
                                            <User size={20} color="#212529" /> Users
                                        </h4>
                                        <Row>
                                            <Col md="12">
                                                <FormGroup>
                                                    {/* <Input type="text" id="projectinput1" name="fname" placeholder="First Name" /> */}
                                                    <Table
                                                        rowSelection={rowSelection}
                                                        className={antdClass + antdClass2}
                                                        columns={this.Columns}
                                                        dataSource={this.state.ListOfUsersForTable}
                                                        pagination={{ position: ["bottomCenter"] }}
                                                        scroll={{ x: 'max-content', y: 200 }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            {/* <Col md="6">
                                                <FormGroup>
                                                    <Input type="text" id="projectinput2" name="lname" placeholder="Last Name" />
                                                </FormGroup>
                                            </Col> */}
                                        </Row>

                                    </div>

                                    <div className="form-actions text-right">
                                        <Button color="warning" className="mr-1">
                                            <X size={20} color="#FFF" /> Cancel
                              </Button>
                                        <Button color="success">
                                            <Check size={20} color="#FFF" /> Save
                              </Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Modal
                    isOpen={this.state.editModal}
                    toggle={this.editToggle}
                    className={this.props.className}
                    backdrop="static"
                >
                    <ModalHeader toggle={this.editToggle}>Edit User Permissions</ModalHeader>
                    <ModalBody>
                        <Row>
                            {
                                this.state.currentRow && this.state.currentRow.permissions &&
                                this.state.currentRow.permissions.map(permission => {
                                    let access = permission.access.map(item => { return { label: item.key.split('-').join(' '), value: item.key } });
                                    let defaultValue = permission.access.filter(c => c.value === true).map(item => item.key);
                                    //  console.log('access', access);
                                    return (

                                        <Col md="12" key={permission.name}>
                                            <Row>
                                                <Col md="8">
                                                    <Tag color="magenta">{permission.name + ' Permission'}</Tag>
                                                </Col>
                                                <Col md="4" style={{ justifyContent: "right", direction: "rtl", display: "flex" }} >
                                                    {/* <span className="ml-1 pb-90">{permission.isGranted ? 'Granted' : 'Not Granted'}</span> */}
                                                    <Switch
                                                        name={permission.name}
                                                        size="default"
                                                        defaultChecked={permission.isGranted}
                                                        checkedChildren={permission.isGranted ? "Granted" : ""}
                                                        unCheckedChildren={!permission.isGranted ? "Not Granted" : ""}
                                                        onChange={(value) => this.handleUserPermissionGrantedChange(value, permission.name)}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12" className="ml-1">
                                                    <Checkbox.Group disabled={!permission.isGranted} options={access} defaultValue={defaultValue} onChange={(checkedValues) => this.handleUserPermissionsChange(checkedValues, permission.name)} />
                                                </Col>
                                            </Row>
                                            <hr />
                                        </Col>
                                    )
                                })
                            }
                            <Col md="12">
                                <Tag color="magenta">User Type</Tag>
                                {this.state.ListOfUserTypes &&
                                    <Radio.Group
                                        options={this.state.ListOfUserTypes.map(c => c.name)}
                                        value={this.state.currentRow.userType}
                                        onChange={(e) => this.handleUserTypeChange(e.target)}
                                    />
                                }

                            </Col>
                            <Col md="12" className="mt-1">
                                <Tag color="magenta">User Status</Tag>
                                {this.UserStatus &&
                                    <Radio.Group
                                        options={this.UserStatus}
                                        value={this.state.currentRow.isActive ? "Active" : "Inactive"}
                                        onChange={(e) => this.handleUserStatusChange(e.target)}
                                    />
                                }
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleSubmitEditUserInfo}>
                            Save
                  </Button>{" "}
                        <Button color="secondary" onClick={this.handleCancelEditUserInfo}>
                            Cancel
                  </Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    isOpen={this.state.deleteModal}
                    toggle={this.deleteToggle}
                    className={this.props.className}
                    backdrop="static"
                >
                    <ModalHeader toggle={this.deleteToggle}>Delete User Info</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete {this.state.currentRow.firstName + ' ' + this.state.currentRow.lastName + '\'s info'} ?
               </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleSubmitDeleteUserInfo}>
                            Save
                  </Button>{" "}
                        <Button color="secondary" onClick={this.handleCancelDeleteUserInfo}>
                            Cancel
                  </Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(UsersPage);