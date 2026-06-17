import bcrypt from 'bcrypt';
import { prisma } from '../db.js';

export const getOwnerDashboard = async (req, res, next) => {
    try {
        const store = await prisma.store.findFirst({
            where: { ownerId: req.user.id },
            include: {
                ratings: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        });

        if (!store) {
            return res.status(404).json({ status: 'fail', message: 'No store found for this owner.' });
        }

        const totalScore = store.ratings.reduce((acc, curr) => acc + curr.score, 0);
        const averageRating = store.ratings.length > 0 ? (totalScore / store.ratings.length).toFixed(1) : 0;

        const usersWhoRated = store.ratings.map(rating => ({
            name: rating.user.name,
            email: rating.user.email,
            score: rating.score,
            date: rating.updatedAt
        }));

        res.status(200).json({
            status: 'success',
            data: {
                storeName: store.name,
                averageRating: Number(averageRating),
                totalRatings: store.ratings.length,
                ratingsDetails: usersWhoRated
            }
        });
    } catch (error) {
        next(error);
    }
};

// 2. Update Password
export const updateOwnerPassword = async (req, res, next) => {
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

// 3. Logout
export const ownerLogout = (req, res) => {
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};