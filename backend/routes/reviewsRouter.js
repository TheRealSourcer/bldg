import express from "express";
import {getReviews,
        createReview,
        createUsefulness,
        createVote
} from "../controllers/reviewsController.js";

const reviewsRouter = express.Router();


// Reviews API routes
reviewsRouter.get('/', getReviews);

reviewsRouter.post('/', createReview);

reviewsRouter.post('/usefulness', createUsefulness);

reviewsRouter.post('/:id/vote', createVote);

export default reviewsRouter;