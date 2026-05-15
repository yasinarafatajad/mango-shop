import express from 'express';
import { signup, login, forgotPassword, changePassword } from '../controllers/auth.js';

const router = express.Router();

router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/change-password', changePassword);

export default router;
