import { Card, Col, Row, Spin, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DocumentDisplay = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Fetch the documents from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/web/doc');
                setDocuments(response.data);
            } catch (err) {
                message.error('Failed to load documents. Please try again later.');
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            {loading ? (
                <div style={{ textAlign: 'center' }}>
                    <Spin size="large" />
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center' }}>Error loading documents</div>
            ) : (
                <Row gutter={16}>
                    {documents.map((doc) => (
                        <Col span={8} key={doc.id}>
                            <Card
                                title={doc.doc_title}
                                bordered={true}
                                style={{ marginBottom: '20px' }}
                                extra={<span>{doc.doc_created_date}</span>}
                            >
                                <p><strong>Document Name:</strong> {doc.doc_name}</p>
                                <p><strong>Pages:</strong> {doc.doc_page}</p>
                                <p><strong>Created Date:</strong> {doc.doc_created_date}</p>
                                <p><strong>Published Date:</strong> {doc.doc_published_date}</p>
                                <p><strong>Keywords:</strong> {doc.doc_keywords}</p>
                                <img
                                    src={`http://127.0.0.1:8000/DocumentPhotos/${doc.doc_photo}`} // Updated path to serve image
                                    alt={doc.doc_name}
                                    style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
                                />
                                <div>
                                    {/* <iframe
                                        src={`http://127.0.0.1:8000/DocumentFiles/${doc.doc_file}`} // Updated to embed doc_file
                                        title={doc.doc_name}
                                        style={{
                                            width: '100%',
                                            height: '300px',
                                            border: '1px solid #ddd',
                                            marginBottom: '10px',
                                        }}
                                    >
                                    </iframe> */}
                                    <p>Open a PDF file <a href={`http://127.0.0.1:8000/DocumentPhotos/${doc.doc_file}`}>example</a>.</p>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default DocumentDisplay;
