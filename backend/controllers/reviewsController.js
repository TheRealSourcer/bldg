import Review from "../models/reviewModel.js"

// Get Reviews
export const getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
}

// Create Review
export const createReview = async (req, res, next) => {
    try {
        const { title, content, rating, product } = req.body;
        if (!title || !content || !rating || !product) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newReview = new Review({
            title,
            content,
            rating,
            productName: product,
            reviewType: 'product'
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        console.error('Failed to save review:', err.message);
        res.status(400).json({ error: 'Failed to save review' });
    }
}

// Create Usefullness
export const createUsefulness = async (req, res, next) => {
    const { reviewId, userUUID, type } = req.body;

    if (!userUUID || !type || !['like', 'dislike', 'remove'].includes(type)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const currentVote = review.userVotes.get(userUUID);

        if (type === 'remove') {
            if (!currentVote) {
                return res.status(400).json({ error: 'No vote to remove' });
            }

            if (currentVote === 'like') {
                review.thumbsUp -= 1;
            } else if (currentVote === 'dislike') {
                review.thumbsDown -= 1;
            }

            review.userVotes.delete(userUUID);

        } else if (currentVote) {
            if (currentVote === type) {
                if (type === 'like') {
                    review.thumbsUp -= 1;
                } else if (type === 'dislike') {
                    review.thumbsDown -= 1;
                }

                review.userVotes.delete(userUUID);
            } else {
                if (currentVote === 'like') {
                    review.thumbsUp -= 1;
                } else if (currentVote === 'dislike') {
                    review.thumbsDown -= 1;
                }

                if (type === 'like') {
                    review.thumbsUp += 1;
                } else if (type === 'dislike') {
                    review.thumbsDown += 1;
                }

                review.userVotes.set(userUUID, type);
            }

        } else {
            if (type === 'like') {
                review.thumbsUp += 1;
            } else if (type === 'dislike') {
                review.thumbsDown += 1;
            }

            review.userVotes.set(userUUID, type);
        }

        const updatedReview = await review.save();
        res.json(updatedReview);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update review usefulness' });
    }
}

// Create Vote 
export const createVote = async (req, res, next) => {
    try {
        const { voteType } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (voteType === 'like') {
            review.thumbsUp += 1;
        } else if (voteType === 'dislike') {
            review.thumbsDown += 1;
        } else {
            return res.status(400).json({ error: 'Invalid vote type' });
        }

        await review.save();
        res.json({ thumbsUp: review.thumbsUp, thumbsDown: review.thumbsDown });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update vote' });
    }
}

async function getShippingCost(shippingAddress, packageDetails) {
    const response = await axios.post('https://fedex-api-url.com/rates', {
        // Fill in with appropriate FedEx API request details
        account_number: process.env.FEDEX_ACCOUNT_NUMBER,
        destination: shippingAddress,
        package: packageDetails,
    });

    const shippingCost = response.data.rate; // Adjust according to FedEx API response
    return shippingCost;
}