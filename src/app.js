import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Mythica Jewels Backend API');
});

export default app;

function GetData() {
    new Promise((resolve,reject)=>{
        fetch('https://api.example.com/data')
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    })
}