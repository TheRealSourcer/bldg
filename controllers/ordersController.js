import Stripe from 'stripe';
import products from "../products.json";
import { transporter } from "../config/emailTransporterConfig.js";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = Stripe(STRIPE_SECRET_KEY);

const FEDEX_API_URL = 'https://apis.fedex.com';
const FEDEX_CLIENT_ID = process.env.FEDEX_CLIENT_ID;
const FEDEX_CLIENT_SECRET = process.env.FEDEX_CLIENT_SECRET;
const COMPANY_EMAIL = process.env.COMPANY_EMAIL

// Create Stripe Checkout
export const createCheckout = async (req, res) => {
    try {
        const { items, userUUID, address } = req.body;
        console.log(req.body);
        
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        // Flat shipping rate per item
        const flatShippingRatePerItem = 3250; // e.g., $5 per item in cents
        const totalShippingCost = flatShippingRatePerItem * totalItems;

        // address without name and email:
        const cleanAddress = {
            "addressLine1": address.addressLine1,
            "addressLine2": address.addressLine2 || null,
            "city": address.city,
            "postal_code": address.zip,
            "state": address.state,
            "country": "US"
          }

        console.log(cleanAddress)
        
        const mailUser = {
            from: process.env.EMAIL_USER,
            to: address.email,
            subject: 'There has been an error with your purchase.',
            text: 'There has been an error, we are currently working on fixing it.',
        };

        const mailCompany = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'There has been an error with a purchase.',
            text: `There has been an error. An order for ${items} has been placed. The customer would like the order shipped to ${JSON.stringify(cleanAddress)}. Their email is ${address.email}.`,
        };

        

        try {
            let validShipping = await validateAddressFedEx(cleanAddress);
            if (!validShipping) {
                return res.status(400).json({ error: 'Invalid Shipping Address', details: 'The provided address could not be validated. Please check and try again.' });
            }
        } catch (error) {
            console.error('Error during address validation:', error.message);
            return res.status(500).json({ error: 'Address validation failed', details: 'An error occurred while validating the address. Please try again later.' });
        }

        const customer = await stripe.customers.create({
            email: address.email,
            name: address.name,
            address: {
                line1: address.addressLine1,
                line2: address.addressLine2 || null,
                city: address.city,
                state: address.state,
                postal_code: address.zip,
                country: 'US', // Assuming US, adjust if needed
            },
        });

        // Create a Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer: customer.id,
            line_items: items.map(item => {
                // Look up the product details by ID
                const product = Object.values(products).find(p => p.id === item.id);
                if (!product) {
                    throw new Error(`Product with ID ${item.id} not found`);
                }
        
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.name, // Fetch the product name from the products object
                        },
                        unit_amount: product.price * 100, // Convert price to cents
                    },
                    quantity: item.quantity, // Keep quantity from the frontend
                };
            }),
            mode: 'payment',
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: totalShippingCost, // Dynamically calculate the shipping cost
                            currency: 'usd',
                        },
                        display_name: `Shipping (${totalItems} items)`,
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 7,
                            },
                        },
                    },
                }
            ],
            success_url: `${process.env.CLIENT_URL}/Success`,
            cancel_url: `${process.env.CLIENT_URL}/Cancel`,
            shipping_address_collection: {
                allowed_countries: ['US'], // Add countries as needed
            },
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating Checkout Session:', error);
        mailCompany.text = `Unexpected error creating checkout session. They ordered for ${items}. Address: ${JSON.stringify(cleanAddress)}. Their email is ${address.email}.`;
        mailUser.text = "Unexpected error creating checkout session";

        await transporter.sendMail(mailUser);
        await transporter.sendMail(mailCompany);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createFedexTracking = async (req, res, next) => {
    try {
        const { trackingNumber } = req.body;
        const accessToken = await getFedExAccessToken();
        
        const trackingResponse = await axios.post(`${FEDEX_API_URL}/track/v1/trackingnumbers`, {
            trackingInfo: [
                {
                    trackingNumberInfo: {
                        trackingNumber: trackingNumber
                    }
                }
            ]
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(trackingResponse.data);
    } catch (error) {
        console.error('Error fetching tracking data:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch tracking data' });
    }
};

async function getFedExAccessTokenRest() {
    try {
        const response = await axios.post(`${FEDEX_API_URL}/oauth/token`, 
            `grant_type=client_credentials&client_id=${process.env.FEDEX_CLIENT_ID_REST}&client_secret=${process.env.FEDEX_CLIENT_SECRET_REST}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting FedEx access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}



async function validateAddressFedEx(shippingAddress) {
    const accessToken = await getFedExAccessTokenRest(); // Ensure this function works and returns the token.

    const data = {
        "addressesToValidate": [
            {
                "address": {
                    "streetLines": [
                        shippingAddress.addressLine1,
                        shippingAddress.addressLine2
                    ],
                    "city": shippingAddress.city,
                    "stateOrProvinceCode": shippingAddress.state,
                    "postalCode": shippingAddress.postal_code,
                    "countryCode": "US"
                }
            }
        ]
    };

    try {
        const response = await axios.post('https://apis.fedex.com/address/v1/addresses/resolve', data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Locale': 'en_US',
            }
        });

        // Extract the validation results
        const validationResults = response.data;
        console.log('FedEx API Response:', validationResults);

        // Check if there are resolved addresses
        if (validationResults && validationResults.output && validationResults.output.resolvedAddresses) {
            const resolvedAddress = validationResults.output.resolvedAddresses[0];
            console.log('Resolved Address:', resolvedAddress);

            // Check the key fields that indicate the validity of the address
            const isResolved = resolvedAddress.attributes?.Resolved === 'true';
            const isMatched = resolvedAddress.attributes?.Matched === 'true';
            const isValidDPV = resolvedAddress.attributes?.DPV === 'true';
            const addressClassification = resolvedAddress.classification;
            
            // Log the important attributes
            console.log(`Address Resolved: ${isResolved}`);
            console.log(`Address Matched: ${isMatched}`);
            console.log(`DPV Valid: ${isValidDPV}`);
            console.log(`Classification: ${addressClassification}`);

            // Determine if the address is valid based on various criteria
            if (isResolved && isMatched && isValidDPV) {
                return true;  // The address is considered valid
            } else {
                console.log('Address validation failed: The address could not be fully validated.');
                return false;  // The address is invalid based on the API response
            }
        } else {
            console.log('No resolved addresses were returned.');
            return false;
        }
    } catch (error) {
        console.error('Error validating address with FedEx:', error.response?.data || error.message);
        return false;
    }
}

// Function to get FedEx access token
async function getFedExAccessToken() {
    try {
        const response = await axios.post(`${FEDEX_API_URL}/oauth/token`, 
            `grant_type=client_credentials&client_id=${FEDEX_CLIENT_ID}&client_secret=${FEDEX_CLIENT_SECRET}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting FedEx access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Post Stripe Webhook: // Application/json parsing was removed.
export const createStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Problem with order',
            text: `Webhook signature verification failed: ${err.message}. Please investigate.`,
        });
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const customerEmail = session.customer_details?.email;

        // Ensure the shipping details exist under shipping_details
        const shippingAddress = session.shipping_details?.address;
        console.log(shippingAddress)

        // Dynamically modify the failed email content
        let mailUserFailed = {
            from: process.env.EMAIL_USER,
            to: customerEmail || process.env.EMAIL_USER,  // fallback to admin if no customer email
            subject: 'Something went wrong with your purchase',
            text: 'Unfortunately, something went wrong with your purchase. We are currently working on fixing it.',
        };

        let mailCompanyFailed = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Problem with order',
            text: `An issue occurred with an order. Please investigate.`,
        };

        if (!shippingAddress) {
            console.error('No shipping address found in session');
            mailUserFailed.text = `We could not process your order because no shipping address was found. Please try again or contact support at ${COMPANY_EMAIL}.`;
            mailCompanyFailed.text = `An order for ${session.id} failed: no shipping address was found. Customer email: ${customerEmail}`;
            await transporter.sendMail(mailUserFailed);
            await transporter.sendMail(mailCompanyFailed);
            return res.status(400).send('No shipping address found');
        }

        // Validate the shipping address using FedEx
        try {
            const validShipping = await validateAddressFedEx(shippingAddress);
            if (!validShipping) {
                console.error('Invalid Shipping Address');
                mailUserFailed.text = 'We could not process your order because the shipping address provided was invalid. Please check your address and try again.';
                mailCompanyFailed.text = `Invalid shipping address for order ${session.id}. Shipping address: ${JSON.stringify(shippingAddress)}, Customer email: ${customerEmail}`;
                await transporter.sendMail(mailUserFailed);
                await transporter.sendMail(mailCompanyFailed);
                return res.status(400).send('Invalid Shipping Address');
            }
        } catch (error) {
            console.error('Error during address validation:', error.message);
            mailUserFailed.text = `We encountered an error while validating your shipping address. Please try again later or contact support at ${COMPANY_EMAIL}.`;
            mailCompanyFailed.text = `Address validation error for order ${session.id}. Error: ${error.message}, Customer email: ${customerEmail}`;
            await transporter.sendMail(mailUserFailed);
            await transporter.sendMail(mailCompanyFailed);
            return res.status(500).send('Address validation failed');
        }

        // Retrieve the customer email from customer_details
        if (!customerEmail) {
            console.error('No customer email found in session');
            mailUserFailed.text = `We could not process your order because no email address was found. Please contact support at ${COMPANY_EMAIL}.`;
            mailCompanyFailed.text = `No customer email found for order ${session.id}`;
            await transporter.sendMail(mailUserFailed);
            await transporter.sendMail(mailCompanyFailed);
            return res.status(400).send('No customer email found');
        }

        // Retrieve and format line items
        let line_items;
        try {
            line_items = await stripe.checkout.sessions.listLineItems(session.id);
        } catch (error) {
            console.error('Error retrieving line items:', error);
            mailUserFailed.text = `We encountered an issue while processing your order details. Please contact support at ${COMPANY_EMAIL}.`;
            mailCompanyFailed.text = `Line item retrieval error for order ${session.id}. Error: ${error.message}, Customer email: ${customerEmail}`;
            await transporter.sendMail(mailUserFailed);
            await transporter.sendMail(mailCompanyFailed);
            return res.status(500).send('Internal Server Error');
        }

        const formattedLineItems = line_items.data.map(item => {
            return `${item.quantity} x ${item.description}`; // assuming 'description' holds the item name
        }).join(', ');

        try {
            // Send an email confirmation to the customer
            const mailUser = {
                from: process.env.EMAIL_USER,
                to: customerEmail,
                subject: 'Order Confirmation',
                text: 'Thank you for your order! Your order is being processed.',
            };

            const mailCompany = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: 'Order Confirmation',
                text: `An order for ${formattedLineItems} has been placed. The customer would like the order shipped to ${JSON.stringify(shippingAddress)}. Their email is ${customerEmail}.`,
            };

            await transporter.sendMail(mailUser);
            await transporter.sendMail(mailCompany);
            console.log('Emails sent to:', customerEmail);
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            mailUserFailed.text = 'We encountered an issue while sending your order confirmation email. Please contact support at ${COMPANY_EMAIL}.';
            mailCompanyFailed.text = `Error sending order confirmation email for order ${session.id}. Error: ${error.message}, Customer email: ${customerEmail}`;
            await transporter.sendMail(mailUserFailed);
            await transporter.sendMail(mailCompanyFailed);
            return res.status(500).send('Error sending email');
        }
    }

    res.json({ received: true });
}

/* export const createFedExOrder = async (lineItems, customerEmail) => {
    // Fetch the access token
    const tokenResponse = await axios.post(
        'https://apis-sandbox.fedex.com/oauth/token',
        'grant_type=client_credentials' +
        '&client_id=' + encodeURIComponent(process.env.FEDEX_CLIENT_ID_REST) +
        '&client_secret=' + encodeURIComponent(process.env.FEDEX_CLIENT_SECRET_REST),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    const accessToken = tokenResponse.data.access_token;

    // Prepare the order details
    const orderDetails = {
        accountNumber: process.env.FEDEX_ACCOUNT_NUMBER,
        requestedShipment: {
            shipper: {
                contact: {
                    personName: 'John Taylor',
                    phoneNumber: '1234567890',
                    companyName: 'BLDG',
                },
                address: {
                    streetLines: ["10 FedEx Parkway","Suite 302"],
                    city: 'Cary',
                    stateOrProvinceCode: 'NC',
                    postalCode: '90210e',
                    countryCode: 'US',
                },
            },
            recipient: {
                contact: {
                    personName: 'John Taylor',
                    phoneNumber: '0987654321',
                    companyName: 'Loli',
                },
                address: {
                    streetLines: ["10 FedEx Parkway","Suite 302"],
                    city: 'Cary',
                    stateOrProvinceCode: 'NC',
                    postalCode: '90210',
                    countryCode: 'US',
                },
            },
            packages: [
                {
                    weight: {
                        units: 'LB',
                        value: 5.0,
                    },
                    dimensions: {
                        length: 10,
                        width: 10,
                        height: 10,
                        units: 'IN',
                    },
                },
            ],
            serviceType: 'FEDEX_GROUND',
            packagingType: 'FEDEX_ENVELOPE',
        },
    };

    // Convert orderDetails to JSON
    const data = JSON.stringify(orderDetails);

    try {
        const fedexResponse = await axios.post(
            'https://apis-sandbox.fedex.com/ship/v1/shipments',
            orderDetails,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-locale': 'en_US',
                },
            }
        );
    
        if (fedexResponse.status === 200) {
            console.log('FedEx order created successfully:', fedexResponse.data);
        } else {
            console.error('Failed to create FedEx order:', fedexResponse.data);
        }
    } catch (error) {
        if (error.response) {
            console.error('Error in FedEx order creation:', error.response.data);
    
            if (error.response.data.errors) {
                error.response.data.errors.forEach(err => {
                    console.error(`Error Code: ${err.code} - Message: ${err.message}`);
                });
            }
        } else {
            console.error('Error in FedEx order creation:', error.message);
        }
    }
    
}; */