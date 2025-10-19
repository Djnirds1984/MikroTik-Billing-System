import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import routerRoutes from './routes/routers';

// Load environment variables
dotenv.config({ path: '../.env' });


const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/routers', routerRoutes);


// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!', error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
