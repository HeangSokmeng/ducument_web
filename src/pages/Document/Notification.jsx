import React, { useState } from 'react';
// If you are using an external Notification component, import it here 
// import { notification as AntNotification } from 'antd';

// Custom notification component
const CustomNotification = ({ message, description }) => {
    const [visible, setVisible] = useState(true);

    const hideNotification = () => {
        setVisible(false);
    };

    return (
        <div
            className={`notification ${visible ? 'visible' : 'invisible'} ${description ? 'errorDescription' : 'successDescription'}`}
            onClick={hideNotification}
        >
            {message}
        </div>
    );
};

// Example usage of the CustomNotification
const handleAddOrUpdateDocument = async () => {
    try {
        // Your existing code for document handling
        // ... 

        CustomNotification({
            message: 'Document saved successfully!',
        });
    } catch (error) {
        // Handle error
        CustomNotification({
            message: 'Error saving document',
            description: error.message || 'An unexpected error occurred'
        });
    }
};

// Your DocumentPage component code continues here...