import { prisma } from '../db.js';

export const getOwnerDashboard = async (req, res, next) => {
    try {
        // Find the store owned by the currently logged-in user
        const store = await prisma.store.findFirst({
            where: { ownerId: req.user.id },
            include: {
                ratings: {
                    include: {
                        user: { select: { name: true, email: true } } // Get user details for the table
                    }
                }
            }
        });

        if (!store) {
            return res.status(404).json({ status: 'fail', message: 'No store found for this owner.' });
        }

        // Calculate average rating
        const totalScore = store.ratings.reduce((acc, curr) => acc + curr.score, 0);
        const averageRating = store.ratings.length > 0 ? (totalScore / store.ratings.length).toFixed(1) : 0;

        // Format the list of users who rated
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