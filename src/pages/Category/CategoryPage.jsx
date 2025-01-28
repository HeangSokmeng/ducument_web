import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, notification, Row, Space, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { Atom } from 'react-loading-indicators';
import useLoading from '../../Hook/useLoading'; // Custom hook for loading states
import { request } from '../../utils/helper'; // Helper for API calls

const CategoryPage = () => {
    const [categories, setCategories] = useState([]); // State for categories
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [categoryForm, setCategoryForm] = useState({ id: null, name: '', description: '' });
    const { loading, startLoading, stopLoading } = useLoading();

    useEffect(() => {
        fetchCategories(); // Fetch categories on component mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCategories = async () => {
        startLoading();
        try {
            const res = await request('superadmin/category'); // Fetch category list
            if (res && res.data) {
                setCategories(res.data);
            } else {
                notification.error({ message: 'Failed to fetch categories.' });
            }
        } catch (error) {
            notification.error({ message: 'Error fetching categories.' });
        }
        stopLoading();
    };

    const handleAddOrEditCategory = async () => {
        try {
            const { id, name, description } = categoryForm;
            if (id) {
                // Update category
                await request(`superadmin/category/${id}`, 'PUT', {
                    cate_name: name,
                    cate_description: description,
                });
            } else {
                // Create new category
                await request('superadmin/category', 'POST', {
                    cate_name: name,
                    cate_description: description,
                });
            }
            notification.success({ message: 'Category saved successfully!' });
            fetchCategories(); // Refresh categories list
            handleModalClose();
        } catch (error) {
            notification.error({ message: 'Error saving category.' });
        }
    };

    const handleEditCategory = (category) => {
        setCategoryForm({
            id: category.cate_id, // Use cate_id from API
            name: category.cate_name,
            description: category.cate_description,
        });
        setIsModalVisible(true);
    };

    const handleDeleteCategory = async (id) => {
        if (!id) {
            notification.error({ message: 'Invalid category ID.' });
            return;
        }
        try {
            await request(`superadmin/category/${id}`, 'DELETE');
            notification.success({ message: 'Category deleted successfully!' });
            fetchCategories(); // Refresh categories list
        } catch (error) {
            notification.error({ message: 'Error deleting category.' });
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setCategoryForm({ id: null, name: '', description: '' }); // Reset form
    };

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category.cate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.cate_description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: 'Category Name',
            dataIndex: 'cate_name', // Matches the API key
            key: 'cate_name',
        },
        {
            title: 'Description',
            dataIndex: 'cate_description', // Matches the API key
            key: 'cate_description',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, category) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEditCategory(category)} />
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteCategory(category.cate_id)} // Use cate_id here
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="author-page-container p-6 bg-gray-50">
            {loading ? (
                <div className="loader-container flex justify-center items-center min-h-screen">
                    <Atom color="#161074" size="medium" text="" textColor="#e80000" />
                </div>
            ) : (
                <>
                    <Row justify="space-between" style={{ marginBottom: '16px' }}>
                        <Col>
                            <h2>Category Management</h2>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col xs={24} sm={18}>
                            <Input
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '300px' }}
                            />
                        </Col>
                        <Col xs={24} sm={6} style={{ textAlign: 'right' }}>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                                Add Category
                            </Button>
                        </Col>
                    </Row>
                    <Table
                        columns={columns}
                        dataSource={filteredCategories} // Use the filtered categories
                        rowKey="cate_id" // Matches the primary key in the API response
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                    />
                    <Modal
                        title={categoryForm.id ? 'Edit Category' : 'Add Category'}
                        open={isModalVisible} // Change 'visible' to 'open'
                        onOk={handleAddOrEditCategory}
                        onCancel={handleModalClose}
                    >
                        <Input
                            placeholder="Category Name"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        />
                        <TextArea
                            placeholder="Description"
                            value={categoryForm.description}
                            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                            style={{ marginTop: '8px' }}
                        />
                    </Modal>
                </>
            )}
        </div>
    );
};

export default CategoryPage;
