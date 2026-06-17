import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';

// 1. Verify JWT and attach user to request
export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'You are not logged in. Please log in to get access.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists (in case they were deleted after token was issued)
        const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!currentUser) {
            return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer exists.' });
        }

        // Attach user to request object
        req.user = currentUser;
        next();
    } catch (error) {
        return res.status(401).json({ status: 'fail', message: 'Invalid or expired token.' });
    }
};

// 2. Role-Based Access Control (RBAC)
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // req.user is guaranteed to exist here because `protect` runs first
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                status: 'fail', 
                message: 'You do not have permission to perform this action' 
            });
        }
        next();
    };
};