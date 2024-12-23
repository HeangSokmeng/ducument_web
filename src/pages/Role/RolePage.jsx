import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, Pagination, Row, Space, Table, notification } from 'antd';
import { useEffect, useState } from 'react';
import { Atom } from 'react-loading-indicators';
import '../../assets/css/layout.css';
import useLoading from '../../Hook/useLoading';
import '../../index.css';
import { request } from '../../utils/helper';

export default function RolePage() {
    const [filteredList, setFilteredList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { loading, startLoading, stopLoading } = useLoading();

    const [state, setState] = useState({
        visibleModal: false,
        roleId: null,
        name: '',
        description: '',
    });

    useEffect(() => {
        getRoleList();
    }, []);

    async function getRoleList(page = currentPage, size = pageSize) {
        startLoading();
        try {
            const res = await request(`superadmin/role?page=${page}&size=${size}`);
            if (res) {
                setList(res.data);
                setFilteredList(res.data);
                setTotal(res.total);
            }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            notification.error({ message: 'Failed to fetch roles.' });
        }
        stopLoading();
    }

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getRoleList(page, pageSize);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = list.filter(
            (item) =>
                item.name.toLowerCase().includes(value) ||
                item.description.toLowerCase().includes(value)
        );
        setFilteredList(filtered);
    };

    const onClickDelete = (item) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: `Are you sure you want to delete the role "${item.name}"?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    const res = await request(`superadmin/role/${item.id}`, 'delete');
                    if (res) {
                        getRoleList(currentPage, pageSize);
                        notification.success({ message: 'Role deleted successfully.' });
                    }
                // eslint-disable-next-line no-unused-vars
                } catch (error) {
                    notification.error({ message: 'Failed to delete role.' });
                }
            },
        });
    };

    const onClickEdit = (item) => {
        setState({
            visibleModal: true,
            roleId: item.id,
            name: item.name,
            description: item.description,
        });
    };

    const onOpenModal = () => {
        setState({ visibleModal: true, roleId: null, name: '', description: '' });
    };

    const onSaveRole = async () => {
        const { name, description, roleId } = state;
        if (!name) {
            notification.error({
                message: 'Validation Error',
                description: 'Role name is required.',
            });
            return;
        }

        const data = { name, description };
        const url = roleId ? `superadmin/role/${roleId}` : 'superadmin/role';
        const method = roleId ? 'put' : 'post';

        try {
            const res = await request(url, method, data);
            if (res) {
                notification.success({
                    message: roleId ? 'Role updated successfully!' : 'Role added successfully!',
                });
                getRoleList(currentPage, pageSize);
                onCloseModal();
            }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            notification.error({ message: roleId ? 'Failed to update role.' : 'Failed to add role.' });
        }
    };

    const onCloseModal = () => {
        setState({
            visibleModal: false,
            roleId: null,
            name: '',
            description: '',
        });
    };

    return (
        <div className="role-page-container p-6 bg-gray-50">
            {loading ? (
                <div className="loader-container flex justify-center items-center min-h-screen">
                    <Atom color="#161074" size="medium" text="" textColor="#e80000" />
                </div>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-4">Role List</h1>
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col xs={24} sm={18}>
                            <Input
                                placeholder="Search by name or description"
                                value={searchTerm}
                                onChange={handleSearch}
                                style={{ width: '100%', maxWidth: '300px' }} // Make it full width and responsive
                            />
                        </Col>
                        <Col xs={24} sm={6} style={{ textAlign: 'right' }}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={onOpenModal}
                                className="bg-blue-500 hover:bg-blue-700 text-white w-full"
                            >
                                Add New Role
                            </Button>
                        </Col>
                    </Row>
                    <Modal
                        open={state.visibleModal}
                        onCancel={onCloseModal}
                        title={state.roleId ? 'Edit Role' : 'Add New Role'}
                        footer={null}
                        centered
                        width="60%"
                        maxWidth="600px" // Maximum width on larger screens
                    >
                        <div className="p-4">
                            <Row gutter={[16, 16]} style={{ paddingBottom: '10px' }}>
                                <Col>
                                    <Input
                                        placeholder="Role Name"
                                        value={state.name}
                                        onChange={(e) => setState({ ...state, name: e.target.value })}
                                        className="mb-4"
                                    />
                                </Col>
                            </Row>
                            <Col style={{ paddingBottom: '10px' }}>
                                <Input.TextArea
                                    placeholder="Description"
                                    value={state.description}
                                    onChange={(e) => setState({ ...state, description: e.target.value })}
                                    className="mb-4"
                                    rows={4}
                                />
                            </Col>
                        </div>
                        <Space className="float-right">
                            <Button onClick={onCloseModal}>Cancel</Button>
                            <Button type="primary" onClick={onSaveRole}>
                                {state.roleId ? 'Update Role' : 'Add Role'}
                            </Button>
                        </Space>
                    </Modal>
                    <Table
                        dataSource={filteredList.map((item) => ({ key: item.id, ...item }))}
                        loading={loading}
                        pagination={false}
                        columns={[
                            { key: 'No', title: 'No', render: (text, record, index) => index + 1 },
                            { key: 'Name', title: 'Role Name', dataIndex: 'name' },
                            { key: 'Description', title: 'Description', dataIndex: 'description' },
                            {
                                key: 'Action',
                                title: 'Action',
                                render: (text, item) => (
                                    <Space>
                                        <Button
                                            icon={<EditOutlined />}
                                            onClick={() => onClickEdit(item)}
                                            className="edit-button"
                                        />
                                        <Button
                                            icon={<DeleteOutlined />}
                                            onClick={() => onClickDelete(item)}
                                            className="delete-button"
                                        />
                                    </Space>
                                ),
                            },
                        ]}
                    />
                    <Pagination
                        style={{ marginTop: '40px', float: 'right' }}
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onChange={handlePageChange}
                        showSizeChanger
                        onShowSizeChange={handlePageChange}
                        pageSizeOptions={['10', '20', '30']}
                    />
                </>
            )}
        </div>
    );
}