import express from 'express';
import {signup, signin, logout, isAdmin, getAllUsers, banUser} from '../controllers/auth.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);
router.get('/users', isAdmin, getAllUsers);
router.put('/users/:id/ban', isAdmin, banUser);

export default router; 