import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';

const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

export const registerNormalUser = async (req, res, next) => {
    try {
        const { name, email, password, address } = req.body;

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 'fail', message: 'Email is already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (Role defaults to NORMAL_USER per Prisma schema)
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword, address }
        });

        // Hide password from response
        newUser.password = undefined;

        res.status(201).json({
            status: 'success',
            data: { user: newUser }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }

        // Generate token
        const token = signToken(user.id, user.role);

        // Hide password from response
        user.password = undefined;

        res.status(200).json({
            status: 'success',
            token,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};