// External OTP via phone is disabled in this build.
export const sendOtpToPhone = async () => {
  throw new Error('Phone OTP is disabled in this build');
};

import { API_URL } from '../config/apiConfig';

// Function to send OTP to email
export const sendOtpToEmail = async (email) => {
    const response = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error('Failed to send OTP to email');
    }

    const data = await response.json();
    return data.otp; // Return the OTP for verification
};

// Function to verify phone OTP
export const verifyPhoneOtp = async (otp) => {
    try {
        const confirmationResult = window.confirmationResult; // Retrieve confirmation result
        const result = await confirmationResult.confirm(otp);
        return result.user; // User is signed in
    } catch (error) {
        console.error('Error verifying phone OTP:', error);
        throw error;
    }
};

// Function to verify email OTP (you'll need to implement this based on your logic)
export const verifyEmailOtp = async (email, otp) => {
    // Implement your email OTP verification logic here
    // This could involve checking the OTP against a database or in-memory store
    // For now, just return true for demonstration purposes
    return true; // Replace with actual verification logic
}; 