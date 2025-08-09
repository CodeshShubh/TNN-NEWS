import './config/config.loadENV.js';
import express from 'express';
import { dB } from './db/db.connection.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/article.routes.js';
const app = express();
app.use(express.json());
app.use('/user', userRoutes);
app.use('/articles', adminRoutes);
// check
app.get('/', (req, res) => {
    res.send(`<h1>Working</h1>`);
});
const URI = process.env.URI || '';
const PORT = parseInt(process.env.PORT, 10) || 4000;
dB(URI);
app.listen(PORT, () => {
    console.log(`Server is Working on http://localhost:${PORT}`);
});
