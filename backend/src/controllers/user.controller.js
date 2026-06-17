import bcrypt from 'bcrypt';
import { prisma } from '../db.js';

// 1. Update Password (For Any Logged-In User)
export const updatePassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword }
        });

        res.status(200).json({ status: 'success', message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};

// 2. Get Stores (For Normal Users - Includes their submitted rating)
export const getStores = async (req, res, next) => {
    try {
        const { search, sortBy = 'name', order = 'asc' } = req.query;

        // Fetch stores matching search, including ALL ratings to calculate average
        const stores = await prisma.store.findMany({
            where: {
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { address: { contains: search, mode: 'insensitive' } }
                    ]
                })
            },
            orderBy: { [sortBy]: order },
            include: {
                ratings: { select: { score: true, userId: true } }
            }
        });

        // Format response exactly as required by the assignment
        const formattedStores = stores.map(store => {
            const totalScore = store.ratings.reduce((acc, curr) => acc + curr.score, 0);
            const averageRating = store.ratings.length > 0 ? (totalScore / store.ratings.length).toFixed(1) : 0;
            
            // Find if the currently logged-in user has rated this store
            const userRatingObj = store.ratings.find(r => r.userId === req.user.id);

            return {
                id: store.id,
                name: store.name,
                address: store.address,
                overallRating: Number(averageRating),
                myRating: userRatingObj ? userRatingObj.score : null // Crucial requirement
            };
        });

        res.status(200).json({ status: 'success', results: formattedStores.length, data: { stores: formattedStores } });
    } catch (error) {
        next(error);
    }
};

// 3. Submit or Modify Rating (Upsert)
export const submitRating = async (req, res, next) => {
    try {
        const { storeId, score } = req.body;

        // Prisma upsert: If rating exists for this User+Store, update it. If not, create it.
        const rating = await prisma.rating.upsert({
            where: {
                userId_storeId: {
                    userId: req.user.id,
                    storeId: storeId
                }
            },
            update: { score },
            create: {
                score,
                userId: req.user.id,
                storeId: storeId
            }
        });

        res.status(200).json({ status: 'success', data: { rating } });
    } catch (error) {
        // Handle case where storeId doesn't exist
        if (error.code === 'P2003') {
            return res.status(404).json({ status: 'fail', message: 'Store not found' });
        }
        next(error);
    }
};