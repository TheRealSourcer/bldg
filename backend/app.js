import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";

import reviewsRouter from "./routes/reviewsRouter.js";
import ordersRouter from "./routes/ordersRouter.js";

import errorHandler from "./middleware/error.js";
import notFoundHandler from "./middleware/notFound.js";
import { limiter } from "./middleware/rateLimit.js";

import { connectDB } from "./config/mongoConfig.js";
import { sessionConfig } from "./config/sessionConfig.js";
import { corsOptions } from "./config/corsConfig.js";

// Initialize Express and Parsing Middleware
const app = express();
app.use(express.json())

// MongoDB Connection
connectDB();

// Enhanced Security Headers
app.use(helmet());

// API rate limiting
app.use(limiter);

// Session management
app.use(session(sessionConfig));

// CORS configuration
app.use(cors(corsOptions));

// Routers
app.use('/api/orders', ordersRouter);
app.use("/api/reviews", reviewsRouter);
app.get('/api/ping', (req, res) => {
    res.json({ status: 'alive' });
});

// Not found and Error Handling Middleware
app.use(notFoundHandler)
app.use(errorHandler);

export default app;