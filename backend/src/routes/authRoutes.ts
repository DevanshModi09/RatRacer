import { Router } from 'express';
import { AuthControllers } from '../controllers/authControllers.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
const router = Router();

router.post('/register', AuthControllers.registerController);
router.post('/login', AuthControllers.loginController);
router.get('/logout', AuthControllers.logoutController);
router.get('/check', authenticateUser, AuthControllers.checkAuth);
export default router;
