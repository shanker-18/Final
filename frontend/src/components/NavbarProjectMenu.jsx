import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './NavbarProjectMenu.css';

const NavbarProjectMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddProject = () => {
        setIsOpen(false);
        navigate('/add-project');
    };

    const handleViewProjects = () => {
        setIsOpen(false);
        navigate('/my-projects');
    };

    return (
        <div className="navbar-project-menu" ref={menuRef}>
            <button 
                className="navbar-project-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                Projects
            </button>
            {isOpen && (
                <div className="navbar-dropdown-menu">
                    <button className="navbar-menu-item" onClick={handleAddProject}>
                        <FaPlus /> Add Project
                    </button>
                    <button className="navbar-menu-item" onClick={handleViewProjects}>
                        <FaList /> View My Projects
                    </button>
                </div>
            )}
        </div>
    );
};

export default NavbarProjectMenu; 