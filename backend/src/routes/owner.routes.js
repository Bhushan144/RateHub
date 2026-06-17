import express from 'express';
import { getOwnerDashboard } from '../controllers/owner.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ONLY Store Owners can access this dashboard
router.use(protect);
router.use(restrictTo('STORE_OWNER'));

router.get('/dashboard', getOwnerDashboard);

export default router;