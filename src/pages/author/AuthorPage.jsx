import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, Pagination, Row, Space, Table, notification } from 'antd';
import { useEffect, useState } from 'react';
import { Atom } from 'react-loading-indicators';
import '../../assets/css/layout.css';
import '../../Hook/Loader.css';
import useLoading from '../../Hook/useLoading';
import '../../index.css';
import { request } from '../../utils/helper';

export default function AuthorPage() {
    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { loading, startLoading, stopLoading } = useLoading();
    const [state, setState] = useState({
        visibalModal: false,
        auth_id: null,
        auth_name: '',
        auth_address: '',
        auth_phone: '',
        auth_gender: '',
        auth_email: '',
        auth_bio: '',
    });

    useEffect(() => {
        getList(currentPage, pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, pageSize]);

    useEffect(() => {
        const filtered = list.filter(item =>
            item.auth_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredList(filtered);
        setCurrentPage(1);
    }, [searchTerm, list]);

    async function getList(page = 1, size = pageSize) {
        startLoading();
        const res = await request(`author?page=${page}&size=${size}`);
        if (res) {
            setList(res.data);
            setFilteredList(res.data);
            setTotal(res.total);
        }
        stopLoading();
    }

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getList(page, pageSize);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const onclickDelete = (item) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: `Are you sure you want to delete the author "${item.auth_name}"?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                const res = await request(`superadmin/author/${item.auth_id}`, "delete");
                if (res) {
                    getList(currentPage, pageSize);
                    notification.success({ message: 'Author deleted successfully.' });
                } else {
                    notification.error({ message: 'Failed to delete author.' });
                }
            },
        });
    };

    const onClickEdit = (item) => {
        setState({
            visibalModal: true,
            auth_id: item.auth_id,
            auth_name: item.auth_name,
            auth_address: item.auth_address,
            auth_phone: item.auth_phone,
            auth_gender: item.auth_gender,
            auth_email: item.auth_email,
            auth_bio: item.auth_bio,
        });
    };

    const onUpdate = async () => {
        if (!state.auth_name || !state.auth_email || !state.auth_gender) {
            notification.error({
                message: "Validation Error",
                description: "Please fill in all required fields.",
            });
            return;
        }
        const data = {
            auth_name: state.auth_name,
            auth_address: state.auth_address,
            auth_phone: state.auth_phone,
            auth_gender: state.auth_gender,
            auth_email: state.auth_email,
            auth_bio: state.auth_bio,
        };
        const res = await request(`superadmin/author/${state.auth_id}`, "put", data);
        if (res) {
            notification.success({ message: 'Author updated successfully!' });
            getList(currentPage, pageSize);
            onCloseModal();
        } else {
            notification.error({ message: 'Failed to update author.' });
        }
    };

    const onClickAddBtn = () => {
        setState({
            visibalModal: true,
            auth_id: null,
            auth_name: '',
            auth_address: '',
            auth_phone: '',
            auth_gender: '',
            auth_email: '',
            auth_bio: '',
        });
    };

    const onCloseModal = () => {
        setState({ ...state, visibalModal: false });
    };

    const onSave = async () => {
        if (!state.auth_name || !state.auth_email || !state.auth_gender) {
            notification.error({
                message: "Validation Error",
                description: "Please fill in all required fields.",
            });
            return;
        }
        const data = {
            auth_name: state.auth_name,
            auth_address: state.auth_address,
            auth_phone: state.auth_phone,
            auth_gender: state.auth_gender,
            auth_email: state.auth_email,
            auth_bio: state.auth_bio,
        };
        const res = await request("superadmin/author", "post", data);
        if (res) {
            getList(currentPage, pageSize);
            onCloseModal();
            notification.success({ message: 'Author added successfully!' });
        }
    };

    return (
        <div className="author-page-container p-6 bg-gray-50">
            {loading ? (
                <div className="loader-container flex justify-center items-center min-h-screen">
                    <Atom color="#161074" size="medium" text="" textColor="#e80000" />
                </div>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-4">Author List</h1>
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col span={18}>
                            <Input
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={handleSearch}
                                style={{ width: '300px' }}
                            />
                        </Col>
                        <Col span={6} style={{ paddingLeft: '150px' }}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={onClickAddBtn}
                                className="bg-blue-500 hover:bg-blue-700 text-white w-full"
                            >
                                Add New Author
                            </Button>
                        </Col>
                    </Row>
                    <Modal
                        open={state.visibalModal}
                        onCancel={onCloseModal}
                        title={state.auth_id ? "Edit Author" : "Add New Author"}
                        footer={null}
                        centered
                        width="80%"
                        style={{
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            maxWidth: '600px',
                            margin: '0 auto',
                        }}
                        className="modal-animate"
                    >
                        <div className="p-4">
                            <Row gutter={[32, 32]} style={{ paddingBottom: '10px' }}>
                                <Col span={12}>
                                    <Input
                                        placeholder="Name"
                                        value={state.auth_name}
                                        onChange={(e) =>
                                            setState({ ...state, auth_name: e.target.value })
                                        }
                                        className="mb-4"
                                    />
                                </Col>
                                <Col span={12}>
                                    <Input
                                        placeholder="Gender"
                                        value={state.auth_gender}
                                        onChange={(e) =>
                                            setState({ ...state, auth_gender: e.target.value })
                                        }
                                        className="mb-4"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]} style={{ paddingBottom: '10px' }}>
                                <Col span={12}>
                                    <Input
                                        placeholder="Email"
                                        value={state.auth_email}
                                        onChange={(e) =>
                                            setState({ ...state, auth_email: e.target.value })
                                        }
                                        className="mb-4"
                                    />
                                </Col>
                                <Col span={12}>
                                    <Input
                                        placeholder="Phone Number"
                                        value={state.auth_phone}
                                        onChange={(e) =>
                                            setState({ ...state, auth_phone: e.target.value })
                                        }
                                        className="mb-4"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]} style={{ paddingBottom: '10px' }}>
                                <Col span={12}>
                                    <Input
                                        placeholder="Address"
                                        value={state.auth_address}
                                        onChange={(e) =>
                                            setState({ ...state, auth_address: e.target.value })
                                        }
                                        className="mb-4"
                                    />
                                </Col>
                                <Col span={12}>
                                    <Input
                                        placeholder="Bio"
                                        value={state.auth_bio}
                                        onChange={(e) =>
                                            setState({ ...state, auth_bio: e.target.value })
                                        }
                                        className="mb-4"
                                    />
                                </Col>
                            </Row>
                        </div>
                        <Space className='float-right'>
                            <Button onClick={onCloseModal}>Cancel</Button>
                            <Button type="primary" onClick={state.auth_id ? onUpdate : onSave}>
                                {state.auth_id ? "Update" : "Add"}
                            </Button>
                        </Space>
                    </Modal>
                    <Table
                        dataSource={filteredList.map((item) => ({
                            key: item.auth_id,
                            ...item,
                        }))}
                        loading={loading}
                        scroll={{ x: 'max-content' }}
                        pagination={false}
                        columns={[
                            { key: 'No', title: 'No', render: (text, data, index) => index + 1 + ((currentPage - 1) * pageSize) },
                            { key: 'Name', title: 'Name', dataIndex: 'auth_name' },
                            { key: 'Gender', title: 'Gender', dataIndex: 'auth_gender' },
                            { key: 'Contact', title: 'Contact', dataIndex: 'auth_phone' },
                            { key: 'Email', title: 'Email', dataIndex: 'auth_email' },
                            { key: 'Address', title: 'Address', dataIndex: 'auth_address' },
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
                                            onClick={() => onclickDelete(item)}
                                            className="delete-button"
                                        />
                                    </Space>
                                ),
                            },
                        ]}
                    />
                    <Pagination
                        style={{ marginTop: '20px', float: 'right' }}
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredList.length} // Show total of filtered items
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