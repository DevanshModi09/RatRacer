import { Router } from 'express';
import { AuthControllers } from '../controllers/authControllers.js';
const router = Router();

router.post('/register', AuthControllers.registerController);
export default router;
