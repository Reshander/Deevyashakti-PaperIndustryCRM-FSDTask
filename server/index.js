import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './models/index.js';
import authRoutes from './Routes/authRoutes.js';
import orderRoutes from './Routes/orderRoutes.js';
import invoiceRoutes from './Routes/invoiceRoutes.js';
import queryRoutes from './Routes/queryRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/queries', queryRoutes);

app.get('/', (req, res) => {
    res.send('Deeevyashakti CRM API is running...');
});

// Sync Database and Start Server
if (process.env.NODE_ENV !== 'production') {
    sequelize.sync({ alter: true }).then(() => {
        console.log('Database synced successfully with schema updates');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Error syncing database:', err);
    });
}

export default app;
