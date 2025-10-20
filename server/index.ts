import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import routerRoutes from './routes/routers';
import setupDatabase from './setupDb'; // Import setup script

// Load environment variables
dotenv.config({ path: '../.env' });

const startServer = async () => {
    try {
        console.log('Initializing database setup check...');
        await setupDatabase();
        console.log('Database setup check complete.');

        const app = express();
        const port = process.env.PORT || 4000;

        // Middleware
        app.use(cors());
        app.use(express.json());

        // API Routes
        app.use('/api/auth', authRoutes);
        app.use('/api/routers', routerRoutes);


        // Global error handler
        // Fix: Use explicitly imported types for Express middleware to ensure correct type resolution.
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack);
            res.status(500).send({ message: 'Something broke!', error: err.message });
        });

        app.listen(port, () => {
          console.log(`Server is running on http://localhost:${port}`);
        });

    } catch (error) {
        console.error("Failed to start server due to database setup error:", error);
        process.exit(1);
    }
}

startServer();