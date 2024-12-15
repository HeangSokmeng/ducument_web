/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Pagination, Space, Table, notification } from 'antd';
import { useEffect, useState } from 'react';
import { Atom } from 'react-loading-indicators';
import '../../Hook/Loader.css';
import useLoading from '../../Hook/useLoading';
import { request } from '../../utils/helper';
import './AuthorPage.css'; // Import custom styles

export default function AuthorPage() {
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
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
        getList();
    }, []);

    async function getList(page = 1, size = pageSize) {
        startLoading();
        const res = await request(`author?page=${page}&size=${size}`);
        if (res) {
            setList(res.data);
            setTotal(res.total);
        }
        stopLoading();
    }

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getList(page, pageSize);
    };

    const onclickDelete = (item) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: `Are you sure you want to delete the author "${item.auth_name}"?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                console.log("Delete item:", item);
                const res = await request(`author/${item.auth_id}`, "delete");
                if (res) {
                    getList(currentPage, pageSize);
                    notification.success({ message: 'Author deleted successfully.' });
                } else {
                    notification.error({ message: 'Failed to delete author.' });
                }

            },
        });
    };
    const onClickEdit = (item, index) => {
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
        // Basic validation
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
        const res = await request(`author/${state.auth_id}`, "put", data);
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
        // Basic validation
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
        }
        const res = await request("author", "post", data);
        if (res) {
            getList(currentPage, pageSize);
            onCloseModal();
            notification.success({ message: 'Author added successfully!' });
        }

    };

    return (
        <div className="author-page-container">
            {loading ? (
                <div className="loader-container">
                    <Atom color="#161074" size="medium" text="" textColor="#e80000" />
                </div>
            ) : (
                <>
                    <h1>Author List</h1>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onClickAddBtn}
                    >
                        Add New Author
                    </Button>
                    <Modal
                        open={state.visibalModal}
                        onCancel={onCloseModal}
                        title="Add New Author"
                        footer={null}
                    >
                        <Input
                            placeholder='Name'
                            value={state.auth_name}
                            onChange={(e) =>
                                setState({
                                    ...state,
                                    auth_name: e.target.value,
                                })}
                        />
                        <Input
                            placeholder='Gender'
                            value={state.auth_gender}
                            onChange={(e) =>
                                setState({
                                    ...state,
                                    auth_gender: e.target.value,
                                })}
                        />
                        <Input
                            placeholder='Email'
                            value={state.auth_email}
                            onChange={(e) =>
                                setState({
                                    ...state,
                                    auth_email: e.target.value,
                                })}
                        />
                        <Input
                            placeholder='Phone Number'
                            value={state.auth_phone}
                            onChange={(e) =>
                                setState({
                                    ...state,
                                    auth_phone: e.target.value,
                                })}
                        />
                        <Input
                            placeholder='Address'
                            value={state.auth_address}
                            onChange={(e) =>
                                setState({
                                    ...state,
                                    auth_address: e.target.value,
                                })}
                        />
                        <Input
                            placeholder='Bio'
                            value={state.auth_bio}
                            onChange={(e) =>
                                setState({
                                    ...state,
                                    auth_bio: e.target.value,
                                })}
                        />
                        <Space>
                            <Button onClick={onCloseModal}>Cancel</Button>
                            <Button type="primary" onClick={state.auth_id ? onUpdate : onSave}>
                                {state.auth_id ? "Update" : "Add"}
                            </Button>
                        </Space>
                    </Modal>
                    <Table
                        dataSource={list.map((item) => ({
                            key: item.auth_id,
                            ...item,
                        }))}
                        loading={loading}
                        scroll={{ x: 'max-content' }}
                        pagination={false}
                        columns={[
                            { key: 'No', title: 'No', render: (item, data, index) => index + 1 },
                            { key: 'Name', title: 'Name', dataIndex: 'auth_name' },
                            { key: 'Gender', title: 'Gender', dataIndex: 'auth_gender' },
                            { key: 'Contact', title: 'Contact', dataIndex: 'auth_phone' },
                            { key: 'Email', title: 'Email', dataIndex: 'auth_email' },
                            { key: 'Address', title: 'Address', dataIndex: 'auth_address' },
                            { key: 'Bio', title: 'Bio', dataIndex: 'auth_bio' },
                            { key: 'UpdatedAt', title: 'Updated At', dataIndex: 'updated_at' },
                            {
                                key: 'Action',
                                title: 'Action',
                                render: (item, data, index) => (
                                    <Space>
                                        <Button
                                            icon={<EditOutlined />}
                                            className="edit-button"
                                            onClick={() => onClickEdit(data, index)}
                                        />
                                        <Button
                                            icon={<DeleteOutlined />}
                                            className="delete-button"
                                            onClick={() => onclickDelete(item)}
                                        />
                                    </Space>
                                ),
                            },
                        ]}
                    />
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onChange={handlePageChange}
                        showSizeChanger
                        pageSizeOptions={[5, 10, 20, 50]}
                    />
                </>
            )}
        </div>
    );
}