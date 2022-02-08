import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

require('dotenv').config();

// import routes
import authRoutes from './router/auth';
import userRoutes from './router/user';
import categoryRoutes from './router/category';

const app = express();

// middlewares
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);

// app.get('/api/register', (req, res) => {
//     res.json({
//         data: 'you hit register endpoint',
//     });
// });

const PORT = process.env.PORT;

mongoose
    .connect(process.env.DATABASE_CLOUD)
    .then(() => console.log('DB connected'))
    .catch((err) => console.log(err));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
