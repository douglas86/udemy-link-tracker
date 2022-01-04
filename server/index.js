import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

require('dotenv').config();

// import routes
import authRoutes from './router/auth';

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);

app.get('/api/register', (req, res) => {
    res.json({
        data: 'you hit register endpoint',
    });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
