import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, notification, Row, Select, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { Atom } from 'react-loading-indicators';
import '../../assets/css/layout.css';
import useLoading from '../../Hook/useLoading'; // Assuming useLoading hook is available
import { request } from '../../utils/helper'; // Your helper for API calls

export default function UserPage() {
    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [roles, setRoles] = useState([]); // State for roles
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { loading, startLoading, stopLoading } = useLoading();

    const [state, setState] = useState({
        visibleModal: false,
        userId: null,
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        account_type: '',
        phone: '',
        roles: [],
    });

    useEffect(() => {
        getUserList();
        fetchRoles(); // Fetch roles on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchRoles() {
        const res = await request('superadmin/setting/option/role'); // Fetch role options
        if (res && res.data) {
            setRoles(res.data);
        } else {
            notification.error({ message: 'Failed to fetch roles.' });
        }
    }

    async function getUserList(page = currentPage, size = pageSize) {
        startLoading();
        const res = await request(`superadmin/auth/listUser?page=${page}&size=${size}`);
        if (res && res.data) {
            setList(res.data);
            setFilteredList(res.data);
            setTotal(res.total || 0);
        } else {
            notification.error({ message: 'Failed to fetch user list.' });
        }
        stopLoading();
    }

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getUserList(page, pageSize);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = list.filter((user) =>
            user.username.toLowerCase().includes(value) || user.email.toLowerCase().includes(value)
        );
        setFilteredList(filtered);
    };

    const onClickDelete = (item) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: `Are you sure you want to delete the user "${item.username}"?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                const res = await request(`/user/${item.userId}`, 'delete');
                if (res) {
                    getUserList(currentPage, pageSize);
                    notification.success({ message: 'User deleted successfully.' });
                } else {
                    notification.error({ message: 'Failed to delete user.' });
                }
            },
        });
    };

    const onClickEdit = (item) => {
        setState({
            visibleModal: true,
            userId: item.userId,
            username: item.username,
            email: item.email,
            password: '',
            password_confirmation: '',
            account_type: item.account_type || '',
            phone: item.phone,
            roles: item.roles || [],
        });
    };

    const onAddNewUser = async () => {
        const { username, email, password, password_confirmation, account_type, phone, roles } = state;

        if (!username || !email || !password || !password_confirmation || !account_type || !phone || !roles.length) {
            notification.error({
                message: 'Validation Error',
                description: 'Please fill in all required fields.',
            });
            return;
        }

        const data = { username, email, password, password_confirmation, account_type, phone, roles };

        try {
            const res = await request('admin/register', 'post', data);
            if (res) {
                notification.success({ message: 'User registered successfully!' });
                getUserList(currentPage, pageSize);
                onCloseModal();
            } else {
                notification.error({ message: 'Failed to register user.' });
            }
        } catch (error) {
            notification.error({ message: 'Registration Error', description: error.message });
        }
    };

    const onUpdateUser = async () => {
        const { username, email, account_type, phone, roles } = state;

        if (!username || !email || !account_type || !phone || !roles.length) {
            notification.error({
                message: 'Validation Error',
                description: 'Please fill in all required fields.',
            });
            return;
        }

        const data = { username, email, account_type, phone, roles };

        try {
            const res = await request(`user/${state.userId}`, 'put', data);
            if (res) {
                notification.success({ message: 'User updated successfully!' });
                getUserList(currentPage, pageSize);
                onCloseModal();
            } else {
                notification.error({ message: 'Failed to update user.' });
            }
        } catch (error) {
            notification.error({ message: 'Update Error', description: error.message });
        }
    };

    const onCloseModal = () => {
        setState({
            visibleModal: false,
            userId: null,
            username: '',
            email: '',
            password: '',
            password_confirmation: '',
            account_type: '',
            phone: '',
            roles: [],
        });
    };

    return (
        <div className="user-page-container p-6 bg-gray-50" style={{ padding: '20px' }}>
            {loading ? (
                <div className="loader-container flex justify-center items-center min-h-screen">
                    <Atom color="#161074" size="medium" />
                </div>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-4">User List</h1>
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col xs={24} sm={18}>
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={handleSearch}
                                style={{ width: '100%', maxWidth: '300px' }}
                            />
                        </Col>
                        <Col xs={24} sm={6} style={{ textAlign: 'right' }}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setState({ ...state, visibleModal: true })}
                                className="bg-blue-500 hover:bg-blue-700 text-white w-full"
                            >
                                Add New User
                            </Button>
                        </Col>
                    </Row>
                    <Modal
                        open={state.visibleModal}
                        onCancel={onCloseModal}
                        title={state.userId ? 'Edit User' : 'Add New User'}
                        footer={null}
                        centered
                        width="90%"
                        style={{ maxWidth: '600px' }} // Set max-width for larger screens
                    >
                        <div className="p-4">
                            <Row gutter={[16, 16]} style={{ paddingBottom: '10px' }}>
                                <Col xs={24} sm={12}>
                                    <Input
                                        placeholder="Username"
                                        value={state.username}
                                        onChange={(e) => setState({ ...state, username: e.target.value })}
                                    />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Input
                                        placeholder="Email"
                                        value={state.email}
                                        onChange={(e) => setState({ ...state, email: e.target.value })}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <Input
                                        placeholder="Account Type"
                                        value={state.account_type}
                                        onChange={(e) => setState({ ...state, account_type: e.target.value })}
                                    />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Input
                                        placeholder="Phone"
                                        value={state.phone}
                                        onChange={(e) => setState({ ...state, phone: e.target.value })}
                                    />
                                </Col>
                                <Col xs={24}>
                                    <Select
                                        mode="multiple"
                                        placeholder="Select Roles"
                                        value={state.roles}
                                        onChange={(value) => setState({ ...state, roles: value })}
                                        style={{ width: '100%' }}
                                    >
                                        {roles.map((role) => (
                                            <Select.Option key={role.id} value={role.id}>
                                                {role.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Col>
                                {!state.userId && (
                                    <>
                                        <Col xs={24} sm={12}>
                                            <Input.Password
                                                placeholder="Password"
                                                value={state.password}
                                                onChange={(e) => setState({ ...state, password: e.target.value })}
                                            />
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Input.Password
                                                placeholder="Confirm Password"
                                                value={state.password_confirmation}
                                                onChange={(e) =>
                                                    setState({ ...state, password_confirmation: e.target.value })
                                                }
                                            />
                                        </Col>
                                    </>
                                )}
                            </Row>
                            <Row justify="end" className="mt-4">
                                <Button onClick={onCloseModal} style={{ marginRight: '10px' }}>
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={state.userId ? onUpdateUser : onAddNewUser}
                                >
                                    {state.userId ? 'Update User' : 'Add User'}
                                </Button>
                            </Row>
                        </div>
                    </Modal>
                    <Table
                        dataSource={filteredList}
                        rowKey="userId"
                        columns={[
                            {
                                title: 'Username',
                                dataIndex: 'username',
                                key: 'username',
                            },
                            {
                                title: 'Email',
                                dataIndex: 'email',
                                key: 'email',
                            },
                            {
                                title: 'Phone',
                                dataIndex: 'phone',
                                key: 'phone',
                            },
                            {
                                title: 'Roles',
                                dataIndex: 'roles',
                                key: 'roles',
                                render: (roles) =>
                                    roles.map((role) => (
                                        <span key={role.id} className="tag">
                                            {role.name}
                                        </span>
                                    )),
                            },
                            {
                                title: 'Actions',
                                key: 'actions',
                                render: (item) => (
                                    <Space>
                                        <Button
                                            icon={<EditOutlined />}
                                            onClick={() => onClickEdit(item)}
                                        />
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => onClickDelete(item)}
                                        />
                                    </Space>
                                ),
                            },
                        ]}
                        pagination={{
                            current: currentPage,
                            pageSize,
                            total,
                            onChange: handlePageChange,
                        }}
                    />
                </>
            )}
        </div>
    );
}