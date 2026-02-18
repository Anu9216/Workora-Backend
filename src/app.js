const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Standard CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'https://workora-frontend.vercel.app',
    process.env.CLIENT_URL // Dynamic origin from env
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const gigRoutes = require('./routes/gigRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Workora API' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message || 'Something went wrong'
    });
});

module.exports = app;
