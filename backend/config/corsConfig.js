const allowedOrigins = [
    'https://checkout.stripe.com',
    process.env.CLIENT_URL,
].filter(Boolean);

export const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error(`The CORS configuration for this site does not allow requests from this origin. Origin: ${origin}`, false))
        }
        return callback(null, true);
    },
    credentials: true
};