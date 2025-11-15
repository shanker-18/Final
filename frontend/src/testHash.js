import { hashPassword } from './src/utils/passwordUtils';

const testHashing = async () => {
    try {
        const password = 'mySecurePassword';
        const hashed = await hashPassword(password);
        console.log('Hashed Password:', hashed);
    } catch (error) {
        console.error('Error hashing password:', error);
    }
};

testHashing(); 