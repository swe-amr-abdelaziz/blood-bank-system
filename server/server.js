const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const dbconnection = require('./core/config/database');
const ApiError = require('./core/utils/apiError');
const globalError = require('./core/middlewares/errorMW');
const { servePendingBloodRequests } = require('./controllers/bloodRequestController');

dotenv.config({ path: '.env' });

// Routes
const authRoute = require('./routes/authRoute');
const cityRoute = require('./routes/cityRoute');
const donationRoute = require('./routes/donationRoute');
const donorRoute = require('./routes/donorRoute');
const fileRoute = require('./routes/fileRoute');
const stockRoute = require('./routes/stockRoute');

// Middlewares
const authenticationMW = require('./core/middlewares/authenticationMW');

// Express app
const app = express();
const server = http.createServer(app);

// Connect to Database
dbconnection();

// Cors middleware
app.use(cors());

// Parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Public routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/file', fileRoute);

// Auth middleware
app.use(authenticationMW);

// Authorized routes
app.use('/api/v1/cities', cityRoute);
app.use('/api/v1/donations', donationRoute);
app.use('/api/v1/donors', donorRoute);
app.use('/api/v1/stock', stockRoute);

// Not found route
app.all('*', (req, res, next) => {
  next(new ApiError('Route not found', 404));
});

// Error middleware
app.use(globalError);

// Server start
const { PORT } = process.env;
server.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});

process.on('unhandledRejection', (error) => {
  console.error(`UnhandledRejection Error ${error}`);
  server.close(() => {
    console.log('shutting down....');
    process.exit(1);
  });
});

// Serve pending blood requests
(function initBloodRequests() {
  servePendingBloodRequests();
}());
