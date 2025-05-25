import express from "express";
import { createCheckout, createFedexTracking, createStripeWebhook } from "../controllers/ordersController.js";
const ordersRouter = express.Router();

// ordersRouter.post("/", );
ordersRouter.post("/track", createFedexTracking);
ordersRouter.post("/checkout", createCheckout);
ordersRouter.post("/webhook/stripe", createStripeWebhook);

export default ordersRouter;