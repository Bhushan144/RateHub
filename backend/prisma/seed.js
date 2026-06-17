import 'dotenv/config'; //
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await bcrypt.hash('Admin@123!', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@ratehub.com' },
        update: {},
        create: {
            name: 'System Administrator',
            email: 'admin@ratehub.com',
            password: hashedPassword,
            address: 'RateHub HQ',
            role: 'SYSTEM_ADMIN',
        },
    });

    const owner = await prisma.user.upsert({
        where: { email: 'owner@store.com' },
        update: {},
        create: {
            name: 'Store Owner One',
            email: 'owner@store.com',
            password: hashedPassword,
            address: '123 Market Street',
            role: 'STORE_OWNER',
        },
    });

    const user = await prisma.user.upsert({
        where: { email: 'user@normal.com' },
        update: {},
        create: {
            name: 'Normal User One',
            email: 'user@normal.com',
            password: hashedPassword,
            address: '456 Residential Ave',
            role: 'NORMAL_USER',
        },
    });

    const store = await prisma.store.upsert({
        where: { email: 'contact@superstore.com' },
        update: {},
        create: {
            name: 'Super Store Downtown',
            email: 'contact@superstore.com',
            address: '123 Market Street, Downtown',
            ownerId: owner.id,
        },
    });

    await prisma.rating.upsert({
        where: {
            userId_storeId: {
                userId: user.id,
                storeId: store.id,
            },
        },
        update: {},
        create: {
            score: 5,
            userId: user.id,
            storeId: store.id,
        },
    });

    console.log("Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });