import express from 'express';
import { handleRegistration, handleLogin } from '../handlers/auth';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, phone, password, role } = req.body;
    try {
        const userId = await handleRegistration(name, email, phone, password, role);
        res.status(201).json({ userId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await handleLogin(email, password);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;