import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, notification, Row, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import useLoading from '../../Hook/useLoading';
import { request } from '../../utils/helper'; // Your helper for API calls

const DocumentPage = () => {
    const [documents, setDocuments] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [documentForm, setDocumentForm] = useState({
        id: null,
        doc_name: '',
        author_id: '',
        category_id: '',
        doc_title: '',
        doc_color: '',
        doc_size: '',
        doc_page: '',
        doc_created_date: '',
        doc_published_date: '',
        doc_publication_year: '',
        doc_keywords: '',
        doc_photo: null // Change from '' to null for file type
    });

    const { loading, startLoading, stopLoading } = useLoading();

    useEffect(() => {
        fetchDocuments();
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

    const handleAddOrUpdateDocument = async () => {
        try {
            const method = documentForm.id ? 'PUT' : 'POST';
            const endpoint = documentForm.id ? `superadmin/document/${documentForm.id}` : 'superadmin/document';

            const formData = new FormData();
            for (let key in documentForm) {
                if (key === 'doc_photo' && documentForm.doc_photo instanceof File) {
                    const base64Image = await toBase64(documentForm.doc_photo);
                    formData.append('doc_photo', base64Image);
                } else {
                    formData.append(key, documentForm[key]);
                }
            }

            await request(endpoint, method, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            notification.success({ message: 'Document saved successfully!' });
            fetchDocuments();
            handleModalClose();
        } catch (error) {
            notification.error({ message: 'Error saving document.' });
        }
    };

    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleEditDocument = (doc) => {
        setDocumentForm({
            id: doc.id,
            doc_name: doc.doc_name || '',
            author_id: doc.author_id || '',
            category_id: doc.category_id || '',
            doc_title: doc.doc_title || '',
            doc_color: doc.doc_color || '',
            doc_size: doc.doc_size || '',
            doc_page: doc.doc_page || '',
            doc_created_date: doc.doc_created_date || '',
            doc_published_date: doc.doc_published_date || '',
            doc_publication_year: doc.doc_publication_year || '',
            doc_keywords: doc.doc_keywords || '',
            doc_photo: null // Reset photo on edit
        });
        setIsModalVisible(true);
    };

    const handleDeleteDocument = async (id) => {
        try {
            await request(`superadmin/document/${id}`, 'DELETE');
            notification.success({ message: 'Document deleted successfully!' });
            fetchDocuments();
        } catch (error) {
            notification.error({ message: 'Error deleting document.' });
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setDocumentForm({
            id: null,
            doc_name: '',
            author_id: '',
            category_id: '',
            doc_title: '',
            doc_color: '',
            doc_size: '',
            doc_page: '',
            doc_created_date: '',
            doc_published_date: '',
            doc_publication_year: '',
            doc_keywords: '',
            doc_photo: null // Reset to null
        });
    };

    const columns = [
        {
            title: 'Date Created',
            dataIndex: 'doc_created_date',
            key: 'doc_created_date',
        },
        {
            title: 'Document Name',
            dataIndex: 'doc_name',
            key: 'doc_name',
        },
        {
            title: 'Document Title',
            dataIndex: 'doc_title',
            key: 'doc_title',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, doc) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEditDocument(doc)} />
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteDocument(doc.id)} />
                </Space>
            ),
        },
    ];

    return (
        <div className="document-page-container p-6 bg-gray-50">
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
            <Table
                columns={columns}
                dataSource={documents}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
            <Modal
                title={documentForm.id ? 'Edit Document' : 'Add Document'}
                visible={isModalVisible}
                onOk={handleAddOrUpdateDocument}
                onCancel={handleModalClose}
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
                            placeholder="Author ID"
                            type="number"
                            value={documentForm.author_id}
                            onChange={(e) => setDocumentForm({ ...documentForm, author_id: e.target.value })}
                        />
                    </Col>
                    <Col span={12}>
                        <Input
                            placeholder="Category ID"
                            type="number"
                            value={documentForm.category_id}
                            onChange={(e) => setDocumentForm({ ...documentForm, category_id: e.target.value })}
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
                    <Col span={12}>
                        <Input
                            type="file"
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
        </div>
    );
};

export default DocumentPage;