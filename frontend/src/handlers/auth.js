import axios from 'axios';
import { API_URL } from '../config/apiConfig';

export const sendOTP = async () => {
  throw new Error('OTP authentication is disabled in this build');
};

export const verifyOTP = async () => {
  throw new Error('OTP authentication is disabled in this build');
};

export const registerUser = async (name, email, phone, password, role) => {
    const response = await axios.post(`${API_URL}/api/register`, { name, email, phone, password, role });
    return response.data.userId;
};

export const loginUser = async (email, password) => {
    const response = await axios.post(`${API_URL}/api/login`, { email, password });
    return response.data; // Return user data
};

export const sendVerificationEmail = async (user) => {
    try {
        await sendEmailVerification(user);
        console.log("Verification email sent.");
    } catch (error) {   
        console.error('Error sending verification email:', error);
        throw new Error('Email verification failed: ' + error.message);
    }
};

// Function to send OTP to email
export const sendOtpToEmail = async (email) => {
    const response = await axios.post(`${API_URL}/send-otp`, { email });
    if (response.status !== 200) {
        throw new Error('Failed to send OTP to email');
    }
    return response.data; // Return any relevant data if needed
};
