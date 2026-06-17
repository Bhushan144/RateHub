import express from 'express';
import { 
    getDashboardMetrics, createUser, createStore, 
    getAllUsers, getUserDetails, getAllStores 
} from '../controllers/admin.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createUserSchema, createStoreSchema } from '../validators/admin.schema.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ALL routes below this line will require a valid JWT AND the SYSTEM_ADMIN role
router.use(protect);
router.use(restrictTo('SYSTEM_ADMIN'));

router.get('/dashboard', getDashboardMetrics);

router.post('/users', validate(createUserSchema), createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);

router.post('/stores', validate(createStoreSchema), createStore);
router.get('/stores', getAllStores);

export default router;