import express from 'express';
import { login, registerNormalUser } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.schema.js';

const router = express.Router();

// The validation middleware runs first. If it fails, the controller never executes.
router.post('/register', validate(registerSchema), registerNormalUser);
router.post('/login', validate(loginSchema), login);

export default router;