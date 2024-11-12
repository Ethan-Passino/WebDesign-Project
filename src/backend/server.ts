import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db/database';
import authRoutes from './routes/authRoutes';
import dashBoardRoutes from './routes/dashboardRoutes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/dashboards', dashBoardRoutes);

app.use(express.static(path.join(__dirname, '../../src/frontend/build')));

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../src/frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
