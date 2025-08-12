import express from 'express';
import {signupBusiness, signinBusiness, getAllBusinesses, updateBusinessStatus} from '../controllers/business.js';
import {isAdmin} from '../controllers/auth.js';

const router = express.Router();

router.post('/signup', signupBusiness);
router.post('/signin', signinBusiness);
router.get('/businesses', isAdmin, getAllBusinesses);
router.put('/businesses/:id/status', isAdmin, updateBusinessStatus);

export default router; 