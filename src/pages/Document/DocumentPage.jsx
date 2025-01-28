import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, notification, Row, Select, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { Atom } from 'react-loading-indicators';
import useLoading from '../../Hook/useLoading';
import { request } from '../../utils/helper'; // Your helper for API calls

const DocumentPage = () => {
    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [documentForm, setDocumentForm] = useState({
        id: null,
        doc_name: '',
        author_id: null,
        category_id: null,
        doc_title: '',
        doc_color: '',
        doc_size: '',
        doc_page: '',
        doc_created_date: '',
        doc_published_date: '',
        doc_publication_year: '',
        doc_keywords: '',
        doc_photo: null,
        doc_file: null
    });

    const { loading, startLoading, stopLoading } = useLoading();

    useEffect(() => {
        fetchDocuments();
        fetchCategories();
        fetchAuthors();
    }, []);

    const fetchDocuments = async () => {
        startLoading();
        try {
            const res = await request('superadmin/document');
            if (res && res.data) {
                setDocuments(res.data);
            } else {
                notification.error({ message: 'Failed to fetch documents.' });
            }
        } catch (error) {
            notification.error({ message: 'Error fetching documents.' });
        } finally {
            stopLoading();
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await request('superadmin/setting/option/category');
            if (res && res.data) {
                setCategories(res.data);
            } else {
                notification.error({ message: 'Failed to fetch categories.' });
            }
        } catch (error) {
            notification.error({ message: 'Error fetching categories.' });
        }
    };

    const fetchAuthors = async () => {
        try {
            const res = await request('superadmin/setting/option/author');
            if (res && res.data) {
                setAuthors(res.data);
            } else {
                notification.error({ message: 'Failed to fetch authors.' });
            }
        } catch (error) {
            notification.error({ message: 'Error fetching authors.' });
        }
    };

    const handleAddOrUpdateDocument = async () => {
        try {
            const { id, doc_name, author_id, category_id, doc_file } = documentForm;

            const method = id ? 'PUT' : 'POST';
            const endpoint = id ? `superadmin/document/${id}` : 'superadmin/document';

            const formData = new FormData();
            Object.keys(documentForm).forEach(key => {
                if (documentForm[key] !== null && documentForm[key] !== undefined) {
                    if (key === 'doc_photo' || key === 'doc_file') {
                        formData.append(key, documentForm[key]); // Append file objects
                    } else if (key !== 'id') {
                        formData.append(key, documentForm[key]); // Append all other fields
                    }
                }
            });

            const response = await request(endpoint, method, formData);
            if (response && response.data) {
                notification.success({ message: 'Document saved successfully!' });
                await fetchDocuments(); // Fetch documents to get updated list
                handleModalClose();
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (error) => {
        console.error('Full error:', error);
        if (error.response) {
            console.error('Server response data:', error.response.data);
            if (error.response.data?.errors) {
                Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                    messages.forEach(message => {
                        notification.error({
                            message: `Error in ${field}`,
                            description: message
                        });
                    });
                });
            } else if (error.response.data?.message) {
                notification.error({
                    message: 'Error',
                    description: error.response.data.message
                });
            }
        } else {
            notification.error({
                message: 'Error saving document',
                description: error.message || 'An unexpected error occurred'
            });
        }
    };

    const handleEditDocument = (doc) => {
        setDocumentForm({
            ...doc,
            doc_photo: null,
            doc_file: null,
        });
        setIsModalVisible(true);
    };

    const handleDeleteDocument = async (doc) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: `Are you sure you want to delete the document "${doc.doc_name || doc.id}"?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await request(`superadmin/document/${doc.id}`, "DELETE");
                    await fetchDocuments();
                    notification.success({ message: 'Document deleted successfully.' });
                } catch (error) {
                    notification.error({ message: 'Error deleting document.' });
                    console.error(error);
                }
            },
        });
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setDocumentForm({
            id: null,
            doc_name: '',
            author_id: null,
            category_id: null,
            doc_title: '',
            doc_color: '',
            doc_size: '',
            doc_page: '',
            doc_created_date: '',
            doc_published_date: '',
            doc_publication_year: '',
            doc_keywords: '',
            doc_photo: null,
            doc_file: null
        });
    };

    const columns = [
        {
            title: 'Date Created',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at) => created_at || 'XXXXX',
        },
        {
            title: 'Document Name',
            dataIndex: 'doc_name',
            key: 'doc_name',
            render: (doc_name) => doc_name || 'XXXXX',
        },
        {
            title: 'Document Title',
            dataIndex: 'doc_title',
            key: 'doc_title',
            render: (doc_title) => doc_title || 'XXXXX',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, doc) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEditDocument(doc)} />
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteDocument(doc)} />
                </Space>
            ),
        },
    ];

    const filteredDocument = documents.filter(doc =>
        doc.doc_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="document-page-container p-6 bg-gray-50" style={{ padding: "20px" }}>
            {loading ? (
                <div className="loader-container flex justify-center items-center min-h-screen">
                    <Atom color="#161074" size="medium" text="" textColor="#e80000" />
                </div>
            ) : (
                <>
                    <Row justify="space-between" style={{ marginBottom: '16px' }}>
                        <Col>
                            <h2>Document Management</h2>
                        </Col>
                        <Col>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                                Add Document
                            </Button>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col xs={24} sm={18}>
                            <Input
                                placeholder="Search documents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '300px' }}
                            />
                        </Col>
                    </Row>
                    <Table
                        columns={columns}
                        dataSource={filteredDocument}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                    />
                    <Modal
                        title={documentForm.id ? 'Edit Document' : 'Add Document'}
                        visible={isModalVisible}
                        onOk={handleAddOrUpdateDocument}
                        onCancel={handleModalClose}
                        width={800}
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Input
                                    placeholder="Document Name"
                                    value={documentForm.doc_name}
                                    onChange={(e) => setDocumentForm({ ...documentForm, doc_name: e.target.value })}
                                />
                            </Col>
                            <Col span={12}>
                                <Input
                                    placeholder="Document Title"
                                    value={documentForm.doc_title}
                                    onChange={(e) => setDocumentForm({ ...documentForm, doc_title: e.target.value })}
                                />
                            </Col>
                            <Col span={12}>
                                <Select
                                    placeholder="Select Author"
                                    value={documentForm.author_id}
                                    onChange={(value) => setDocumentForm({ ...documentForm, author_id: value })}
                                    options={authors.map((author) => ({
                                        label: author.auth_name,
                                        value: author.auth_id,
                                    }))}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col span={12}>
                                <Select
                                    placeholder="Select Category"
                                    value={documentForm.category_id}
                                    onChange={(value) => setDocumentForm({ ...documentForm, category_id: value })}
                                    options={categories.map((category) => ({
                                        label: category.cate_name,
                                        value: category.cate_id,
                                    }))}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col span={12}>
                                <Input
                                    placeholder="Document Color"
                                    value={documentForm.doc_color}
                                    onChange={(e) => setDocumentForm({ ...documentForm, doc_color: e.target.value })}
                                />
                            </Col>
                            <Col span={12}>
                                <Input
                                    placeholder="Document Size"
                                    value={documentForm.doc_size}
                                    onChange={(e) => setDocumentForm({ ...documentForm, doc_size: e.target.value })}
                                />
                            </Col>
                            <Col span={12}>
                                <Input
                                    placeholder="Number of Pages"
                                    type="number"
                                    value={documentForm.doc_page}
                                    onChange={(e) => setDocumentForm({ ...documentForm, doc_page: e.target.value })}
                                />
                            </Col>
                            <Col span={12}>
                                <Input
                                    type="date"
                                    value={documentForm.doc_created_date}
                                    onChange={(e) => setDocumentForm({ ...documentForm, doc_created_date: e.target.value })}
                                />
                            </Col>
                            <Col span={12}>
                                <Input
                                    type="date"
                                    value={documentForm.doc_published_date}
                                    onChange={(e) => setDocumentForm({ ...documentForm, doc_published_date: e.target.value })}
                                />
                            </Col>
                            <Col span={12}>
                                <Input
                                    placeholder="Publication Year"
                                    type="number"
                                    value={documentForm.doc_publication_year}
                                    onChange={(e) => setDocumentForm({ ...documentForm, doc_publication_year: e.target.value })}
                                />
                            </Col>
                            <Col span={12}>
                                <Input
                                    placeholder="Keywords (comma separated)"
                                    value={documentForm.doc_keywords}
                                    onChange={(e) => setDocumentForm({ ...documentForm, doc_keywords: e.target.value })}
                                />
                            </Col>
                            <Col span={24}>
                                <div className="mb-2">Document File * (PDF, DOC, DOCX, max 20MB)</div>
                                <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.size > 20 * 1024 * 1024) {
                                                notification.error({
                                                    message: 'File too large',
                                                    description: 'Please select a file smaller than 20MB'
                                                });
                                                e.target.value = null;
                                                return;
                                            }
                                            setDocumentForm({
                                                ...documentForm,
                                                doc_file: file
                                            });
                                        }
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <div className="mb-2">Document Photo</div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setDocumentForm({
                                            ...documentForm,
                                            doc_photo: file ? file : null
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default DocumentPage;