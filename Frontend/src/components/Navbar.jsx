import React from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt, FaMicrophone, FaList } from 'react-icons/fa';

const Navbar = () => {
    const navStyle = {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#333',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0',
        boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
        zIndex: 1000
    };

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        padding: '10px 15px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px', 
    };

    return (
        <nav style={navStyle}>
            <Link to="/create" style={linkStyle}>
                <FaPencilAlt /> Add Task
            </Link>
            <Link to="/voice" style={linkStyle}>
                <FaMicrophone /> Voice Input
            </Link>
            <Link to="/view" style={linkStyle}>
                <FaList /> View Tasks
            </Link>
        </nav>
    );
};

export default Navbar;