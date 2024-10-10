import {NextFunction, Request, Response} from 'express';
import userRoutes from './routes/user';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Start Express App
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
    console.log("base page");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// User Routes (Routing to different pages)
app.use('/api', userRoutes); // This is a sample route
app.use(express.static(path.join(__dirname, '../../client/build')));
app.get('/api/hello', (req: Request, res: Response) => {
    console.log("HELLO");
    res.json({ message: 'Hello from the backend!' });
  });
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });