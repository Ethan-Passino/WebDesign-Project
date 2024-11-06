import express, { Request, Response } from 'express';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 5000;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../../src/frontend/build')));
// Handle any requests that don't match the API routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../src/frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
