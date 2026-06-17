import bcrypt from 'bcrypt';
import { prisma } from '../db.js';

// 1. Dashboard Metrics
export const getDashboardMetrics = async (req, res, next) => {
    try {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            prisma.user.count(),
            prisma.store.count(),
            prisma.rating.count()
        ]);

        res.status(200).json({
            status: 'success',
            data: { totalUsers, totalStores, totalRatings }
        });
    } catch (error) {
        next(error);
    }
};

// 2. Create User (Admin/Normal/Owner)
export const createUser = async (req, res, next) => {
    try {
        const { name, email, password, address, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ status: 'fail', message: 'Email already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword, address, role },
            select: { id: true, name: true, email: true, role: true } // Don't return password
        });

        res.status(201).json({ status: 'success', data: { user: newUser } });
    } catch (error) {
        next(error);
    }
};

// 3. Create Store
export const createStore = async (req, res, next) => {
    try {
        const { name, email, address, ownerId } = req.body;

        // Verify the owner exists and has the correct role
        const owner = await prisma.user.findUnique({ where: { id: ownerId } });
        if (!owner || owner.role !== 'STORE_OWNER') {
            return res.status(400).json({ status: 'fail', message: 'Invalid owner ID or user is not a STORE_OWNER' });
        }

        const newStore = await prisma.store.create({
            data: { name, email, address, ownerId }
        });

        res.status(201).json({ status: 'success', data: { store: newStore } });
    } catch (error) {
        next(error);
    }
};

// 4. Get All Users (With Filtering & Sorting)
export const getAllUsers = async (req, res, next) => {
    try {
        const { search, role, sortBy = 'createdAt', order = 'desc' } = req.query;

        // Build the query object dynamically based on provided filters
        const query = {
            where: {
                ...(role && { role }),
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { address: { contains: search, mode: 'insensitive' } }
                    ]
                })
            },
            orderBy: { [sortBy]: order },
            select: { id: true, name: true, email: true, address: true, role: true, createdAt: true }
        };

        const users = await prisma.user.findMany(query);
        res.status(200).json({ status: 'success', results: users.length, data: { users } });
    } catch (error) {
        next(error);
    }
};

// 5. Get User Details (Including Store Rating if they are an Owner)
export const getUserDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true, name: true, email: true, address: true, role: true,
                stores: {
                    include: {
                        ratings: { select: { score: true } }
                    }
                }
            }
        });

        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

        // If user is a store owner, calculate their store's average rating
        let storeDetails = null;
        if (user.role === 'STORE_OWNER' && user.stores.length > 0) {
            const store = user.stores[0]; // Assuming 1 store per owner for this challenge
            const totalScore = store.ratings.reduce((acc, curr) => acc + curr.score, 0);
            const averageRating = store.ratings.length > 0 ? (totalScore / store.ratings.length).toFixed(1) : 0;

            storeDetails = {
                storeName: store.name,
                averageRating: Number(averageRating)
            };
        }

        // Clean up the response object
        delete user.stores;

        res.status(200).json({
            status: 'success',
            data: { user, ...(storeDetails && { storeDetails }) }
        });
    } catch (error) {
        next(error);
    }
};

// 6. Get All Stores (With Filtering, Sorting & Calculated Rating)
export const getAllStores = async (req, res, next) => {
    try {
        const { search, sortBy = 'createdAt', order = 'desc' } = req.query;

        const stores = await prisma.store.findMany({
            where: {
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { address: { contains: search, mode: 'insensitive' } }
                    ]
                })
            },
            orderBy: { [sortBy]: order },
            include: { ratings: { select: { score: true } } }
        });

        // Calculate average rating for each store before sending to client
        const formattedStores = stores.map(store => {
            const totalScore = store.ratings.reduce((acc, curr) => acc + curr.score, 0);
            const averageRating = store.ratings.length > 0 ? (totalScore / store.ratings.length).toFixed(1) : 0;
            
            return {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                rating: Number(averageRating)
            };
        });

        res.status(200).json({ status: 'success', results: formattedStores.length, data: { stores: formattedStores } });
    } catch (error) {
        next(error);
    }
};