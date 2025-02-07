const express = require('express');
const cors = require('cors');
const colors = require('colors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const { errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter, authLimiter } = require('./middleware/rateLimitMiddleware');
const { developmentLogging, productionLogging } = require('./middleware/loggingMiddleware');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(developmentLogging);
} else {
    app.use(productionLogging);
}

// Security Middleware
app.use(helmet()); // Set security headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks

app.get('/', (req, res) => {
    res.send("All Done Good")
})

// Regular Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// Rate Limiting
// app.use('/api/', apiLimiter);
// app.use('/api/users/login', authLimiter);

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/badges', require('./routes/badgeRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Cannot find ${req.originalUrl} on this server`
    });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting down...'.red.bold);
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...'.red.bold);
    console.log(err.name, err.message);
    process.exit(1);
});
