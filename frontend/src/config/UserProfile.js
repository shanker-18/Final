import React from 'react';
import { FaUser, FaCode, FaSearch } from 'react-icons/fa';
import bcrypt from 'bcryptjs';
 // Make sure to install react-icons

const UserProfile = ({ user, isPhoneVerified }) => {
    const getRoleIcon = () => {
        return user.currentRole === 'developer' ? (
            <FaCode className="role-icon" title="Developer" />
        ) : (
            <FaSearch className="role-icon" title="Project Seeker" />
        );
    };

    return (
        <div className="user-profile">
            <div className="profile-header">
                <div className="user-avatar">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                    ) : (
                        <FaUser className="default-avatar" />
                    )}
                    <div className="role-indicator">
                        {getRoleIcon()}
                        <span className="role-text">
                            {user.currentRole === 'developer' ? 'Developer' : 'Project Seeker'}
                        </span>
                    </div>
                </div>
                <h2>{user.name}</h2>
                <p>{user.bio}</p>
                {isPhoneVerified ? (
                    <span className="verification-status">Phone Verified</span>
                ) : (
                    <span className="verification-status">Phone Not Verified</span>
                )}
                {user.currentRole === 'developer' && (
                    <button className="add-project-button">Add Project</button>
                )}
                {user.currentRole === 'seeker' && (
                    <span className="project-seeker-text">Project Seeker</span>
                )}
            </div>
        </div>
    );
};

export default UserProfile; 