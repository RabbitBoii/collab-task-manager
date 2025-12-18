import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import prisma from './lib/prisma'; // Your working file
import authRoutes from './routes/auth.routes'
import taskRoutes from './routes/task.routes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
// app.use('/api/dashboard', taskRoutes)


// Middleware
app.use(express.json());
app.use(cookieParser()); // Required for HttpOnly Cookies [cite: 12]
app.use(cors({
    origin: "http://localhost:5173", // Vite default
    credentials: true
}));

app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: "ok", database: "connected" });
    } catch (e) {
        res.status(500).json({ status: "error", database: "disconnected" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server locked in on port ${PORT}`);
});