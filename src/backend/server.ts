import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db/database';
import authRoutes from './routes/authRoutes';
import dashBoardRoutes from './routes/dashboardRoutes';
import pointsRoutes from './routes/pointsRoutes';
import panelRoutes from './routes/panelRoutes';
import taskRoutes from './routes/taskRoutes';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(bodyParser.json());


// Routes
app.use('/auth', authRoutes);
app.use('/dashboards', dashBoardRoutes);
app.use('/points', pointsRoutes);
app.use('/panels', panelRoutes);
app.use('/tasks', taskRoutes);

app.use(express.static(path.join(__dirname, '../../src/frontend/build')));

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../src/frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
