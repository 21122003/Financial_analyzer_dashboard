// File: backend/src/routes/authRoutes.ts

import { Router } from 'express';
import { AuthController } from '../controllers/authController'; 
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', AuthController.loginValidation, AuthController.login);
router.get('/profile', authenticateToken, AuthController.getProfile);
router.post('/refresh', authenticateToken, AuthController.refreshToken);

export const authRoutes: Router = router; // ✅ named export
