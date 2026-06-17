import bcrypt from 'bcrypt';
import { prisma } from '../db.js';

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

export const getStores = async (req, res, next) => {
    try {
        const { search, sortBy = 'name', order = 'asc' } = req.query;

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

        const formattedStores = stores.map(store => {
            const totalScore = store.ratings.reduce((acc, curr) => acc + curr.score, 0);
            const averageRating = store.ratings.length > 0 ? (totalScore / store.ratings.length).toFixed(1) : 0;
            const userRatingObj = store.ratings.find(r => r.userId === req.user.id);

            return {
                id: store.id,
                name: store.name,
                address: store.address,
                overallRating: Number(averageRating),
                myRating: userRatingObj ? userRatingObj.score : null
            };
        });

        res.status(200).json({ status: 'success', results: formattedStores.length, data: { stores: formattedStores } });
    } catch (error) {
        next(error);
    }
};

export const submitRating = async (req, res, next) => {
    try {
        const { storeId, score } = req.body;

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
        if (error.code === 'P2003') {
            return res.status(404).json({ status: 'fail', message: 'Store not found' });
        }
        next(error);
    }
};

export const userLogout = (req, res) => {
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};