// components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import { getUserRole } from '../../utils/auth'; // This function retrieves the user role from localStorage

const Navigation = () => {
    const userRole = getUserRole(); // Assume this function gets the current user's role

    return (
        <nav>
            <Link to="/home">Home</Link>
            
            {/* Show all options for superadmin */}
            {userRole === 'superadmin' && (
                <>
                    <Link to="/user">User Management</Link>
                    <Link to="/admin/dashboard">Admin Dashboard</Link>
                    <Link to="/superadmin/dashboard">Super Admin Dashboard</Link>
                    {/* Add other options specific to superadmin */}
                </>
            )}

            {/* Options for admin, but hide some options */}
            {userRole === 'admin' && (
                <>
                    <Link to="/admin/dashboard">Admin Dashboard</Link>
                    {/* Other options available to admin, but not user management or superadmin options */}
                </>
            )}

            {/* Add any common links that should be available to all roles */}
        </nav>
    );
};

export default Navigation;