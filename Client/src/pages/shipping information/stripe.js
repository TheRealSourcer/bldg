import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe once and export the promise
export const stripePromise = loadStripe('pk_live_51PbjzsAvZVlzPgF8w5mk6HH9NGomWzU4PcVyO65nDlxH6QmWJdL2mJChhZNpaAwal1Uv4O3KxJFVgIlHDVCtBHfX00abfqQIA3');

export const preloadStripe = () => {
    // Force stripe to load early
    void stripePromise;
};