require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require('express-session');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);




// Initialize Express
const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import the Review model
const Review = require('./models/Review');

// Update the static file serving middleware
app.use('/Media', express.static(path.join(__dirname, 'Media')));

// Enhanced security headers
app.use(helmet());


app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the successful payment event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Extract relevant information from the session
        const { customer_email, line_items } = session;

        // Call your function to create a FedEx order
        try {
            await createFedExOrder(line_items, customer_email);
        } catch (error) {
            console.error('Error creating FedEx order:', error);
            if (error.response) {
                console.error('Error in FedEx order creation:', error.response.data);
            } else {
                console.error('Error in FedEx order creation:', error.message);
            }
            return res.status(500).send('Internal Server Error');
        }
    }

    res.json({ received: true });
});


// Body parsing middleware
app.use(express.json());

// Middleware to parse plain text bodies
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.json());

// Session management
app.use(session({
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true,
        sameSite: 'strict'
    }
}));

// CORS configuration
const allowedOrigins = [process.env.CLIENT_URL, 'https://checkout.stripe.com'];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// FedEx API configuration
const FEDEX_API_URL = 'https://apis-sandbox.fedex.com';
const FEDEX_CLIENT_ID = process.env.FEDEX_CLIENT_ID;
const FEDEX_CLIENT_SECRET = process.env.FEDEX_CLIENT_SECRET;

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

// FedEx tracking endpoint
app.post('/track', async (req, res) => {
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
});

const createFedExOrder = async (lineItems, customerEmail) => {
    const tokenResponse = await axios.post('https://apis.fedex.com/oauth/token', {
        grant_type: 'client_credentials',
        client_id: process.env.FEDEX_CLIENT_ID_REST,
        client_secret: process.env.FEDEX_CLIENT_SECRET_REST,
    });

    const accessToken = tokenResponse.data.access_token;

    const orderDetails = {
        accountNumber: process.env.FEDEX_ACCOUNT_NUMBER,
        requestedShipment: {
            "mergeLabelDocOption": "LABELS_AND_DOCS",
            "requestedShipment": {
              "shipDatestamp": "2019-10-14",
              "totalDeclaredValue": {
                "amount": 12.45,
                "currency": "USD"
              },
              "shipper": {
                "address": {
                  "streetLines": [
                    "10 FedEx Parkway",
                    "Suite 302"
                  ],
                  "city": "Beverly Hills",
                  "stateOrProvinceCode": "CA",
                  "postalCode": "90210",
                  "countryCode": "US",
                  "residential": false
                },
                "contact": {
                  "personName": "John Taylor",
                  "emailAddress": "sample@company.com",
                  "phoneExtension": "91",
                  "phoneNumber": "XXXX567890",
                  "companyName": "Fedex"
                },
                "tins": [
                  {
                    "number": "XXX567",
                    "tinType": "FEDERAL",
                    "usage": "usage",
                    "effectiveDate": "2024-06-13",
                    "expirationDate": "2024-06-13"
                  }
                ]
              },
              "soldTo": {
                "address": {
                  "streetLines": [
                    "10 FedEx Parkway",
                    "Suite 302"
                  ],
                  "city": "Beverly Hills",
                  "stateOrProvinceCode": "CA",
                  "postalCode": "90210",
                  "countryCode": "US",
                  "residential": false
                },
                "contact": {
                  "personName": "John Taylor",
                  "emailAddress": "sample@company.com",
                  "phoneExtension": "91",
                  "phoneNumber": "1234567890",
                  "companyName": "Fedex"
                },
                "tins": [
                  {
                    "number": "123567",
                    "tinType": "FEDERAL",
                    "usage": "usage",
                    "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                    "expirationDate": "2000-01-23T04:56:07.000+00:00"
                  }
                ],
                "accountNumber": {
                  "value": "Your account number"
                }
              },
              "recipients": [
                {
                  "address": {
                    "streetLines": [
                      "10 FedEx Parkway",
                      "Suite 302"
                    ],
                    "city": "Beverly Hills",
                    "stateOrProvinceCode": "CA",
                    "postalCode": "90210",
                    "countryCode": "US",
                    "residential": false
                  },
                  "contact": {
                    "personName": "John Taylor",
                    "emailAddress": "sample@company.com",
                    "phoneExtension": "000",
                    "phoneNumber": "XXXX345671",
                    "companyName": "FedEx"
                  },
                  "tins": [
                    {
                      "number": "123567",
                      "tinType": "FEDERAL",
                      "usage": "usage",
                      "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                      "expirationDate": "2000-01-23T04:56:07.000+00:00"
                    }
                  ],
                  "deliveryInstructions": "Delivery Instructions"
                }
              ],
              "recipientLocationNumber": "1234567",
              "pickupType": "USE_SCHEDULED_PICKUP",
              "serviceType": "PRIORITY_OVERNIGHT",
              "packagingType": "YOUR_PACKAGING",
              "totalWeight": 20.6,
              "origin": {
                "address": {
                  "streetLines": [
                    "10 FedEx Parkway",
                    "Suite 302"
                  ],
                  "city": "Beverly Hills",
                  "stateOrProvinceCode": "CA",
                  "postalCode": "38127",
                  "countryCode": "US",
                  "residential": false
                },
                "contact": {
                  "personName": "person name",
                  "emailAddress": "email address",
                  "phoneNumber": "phone number",
                  "phoneExtension": "phone extension",
                  "companyName": "company name",
                  "faxNumber": "fax number"
                }
              },
              "shippingChargesPayment": {
                "paymentType": "SENDER",
                "payor": {
                  "responsibleParty": {
                    "address": {
                      "streetLines": [
                        "10 FedEx Parkway",
                        "Suite 302"
                      ],
                      "city": "Beverly Hills",
                      "stateOrProvinceCode": "CA",
                      "postalCode": "90210",
                      "countryCode": "US",
                      "residential": false
                    },
                    "contact": {
                      "personName": "John Taylor",
                      "emailAddress": "sample@company.com",
                      "phoneNumber": "XXXX567890",
                      "phoneExtension": "phone extension",
                      "companyName": "Fedex",
                      "faxNumber": "fax number"
                    },
                    "accountNumber": {
                      "value": "Your account number"
                    }
                  }
                }
              },
              "shipmentSpecialServices": {
                "specialServiceTypes": [
                  "THIRD_PARTY_CONSIGNEE",
                  "PROTECTION_FROM_FREEZING"
                ],
                "etdDetail": {
                  "attributes": [
                    "POST_SHIPMENT_UPLOAD_REQUESTED"
                  ],
                  "attachedDocuments": [
                    {
                      "documentType": "PRO_FORMA_INVOICE",
                      "documentReference": "DocumentReference",
                      "description": "PRO FORMA INVOICE",
                      "documentId": "090927d680038c61"
                    }
                  ],
                  "requestedDocumentTypes": [
                    "VICS_BILL_OF_LADING",
                    "GENERAL_AGENCY_AGREEMENT"
                  ]
                },
                "returnShipmentDetail": {
                  "returnEmailDetail": {
                    "merchantPhoneNumber": "19012635656",
                    "allowedSpecialService": [
                      "SATURDAY_DELIVERY"
                    ]
                  },
                  "rma": {
                    "reason": "Wrong Size or Color"
                  },
                  "returnAssociationDetail": {
                    "shipDatestamp": "2019-10-01",
                    "trackingNumber": "123456789"
                  },
                  "returnType": "PRINT_RETURN_LABEL"
                },
                "deliveryOnInvoiceAcceptanceDetail": {
                  "recipient": {
                    "address": {
                      "streetLines": [
                        "23, RUE JOSEPH-DE MA",
                        "Suite 302"
                      ],
                      "city": "Beverly Hills",
                      "stateOrProvinceCode": "CA",
                      "postalCode": "90210",
                      "countryCode": "US",
                      "residential": false
                    },
                    "contact": {
                      "personName": "John Taylor",
                      "emailAddress": "sample@company.com",
                      "phoneExtension": "000",
                      "phoneNumber": "1234567890",
                      "companyName": "Fedex"
                    },
                    "tins": [
                      {
                        "number": "123567",
                        "tinType": "FEDERAL",
                        "usage": "usage",
                        "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                        "expirationDate": "2000-01-23T04:56:07.000+00:00"
                      }
                    ],
                    "deliveryInstructions": "Delivery Instructions"
                  }
                },
                "internationalTrafficInArmsRegulationsDetail": {
                  "licenseOrExemptionNumber": "9871234"
                },
                "pendingShipmentDetail": {
                  "pendingShipmentType": "EMAIL",
                  "processingOptions": {
                    "options": [
                      "ALLOW_MODIFICATIONS"
                    ]
                  },
                  "recommendedDocumentSpecification": {
                    "types": [
                      "ANTIQUE_STATEMENT_EUROPEAN_UNION",
                      "ANTIQUE_STATEMENT_UNITED_STATES"
                    ]
                  },
                  "emailLabelDetail": {
                    "recipients": [
                      {
                        "emailAddress": "nnnnneena@fedex.com",
                        "optionsRequested": {
                          "options": [
                            "PRODUCE_PAPERLESS_SHIPPING_FORMAT",
                            "SUPPRESS_ACCESS_EMAILS"
                          ]
                        },
                        "role": "SHIPMENT_COMPLETOR",
                        "locale": "en_US"
                      }
                    ],
                    "message": "your optional message"
                  },
                  "attachedDocuments": [
                    {
                      "documentType": "PRO_FORMA_INVOICE",
                      "documentReference": "DocumentReference",
                      "description": "PRO FORMA INVOICE",
                      "documentId": "090927d680038c61"
                    }
                  ],
                  "expirationTimeStamp": "2020-01-01"
                },
                "holdAtLocationDetail": {
                  "locationId": "YBZA",
                  "locationContactAndAddress": {
                    "address": {
                      "streetLines": [
                        "10 FedEx Parkway",
                        "Suite 302"
                      ],
                      "city": "Beverly Hills",
                      "stateOrProvinceCode": "CA",
                      "postalCode": "38127",
                      "countryCode": "US",
                      "residential": false
                    },
                    "contact": {
                      "personName": "person name",
                      "emailAddress": "email address",
                      "phoneNumber": "phone number",
                      "phoneExtension": "phone extension",
                      "companyName": "company name",
                      "faxNumber": "fax number"
                    }
                  },
                  "locationType": "FEDEX_ONSITE"
                },
                "shipmentCODDetail": {
                  "addTransportationChargesDetail": {
                    "rateType": "ACCOUNT",
                    "rateLevelType": "BUNDLED_RATE",
                    "chargeLevelType": "CURRENT_PACKAGE",
                    "chargeType": "COD_SURCHARGE"
                  },
                  "codRecipient": {
                    "address": {
                      "streetLines": [
                        "10 FedEx Parkway",
                        "Suite 302"
                      ],
                      "city": "Beverly Hills",
                      "stateOrProvinceCode": "CA",
                      "postalCode": "90210",
                      "countryCode": "US",
                      "residential": false
                    },
                    "contact": {
                      "personName": "John Taylor",
                      "emailAddress": "sample@company.com",
                      "phoneExtension": "000",
                      "phoneNumber": "XXXX345671",
                      "companyName": "Fedex"
                    },
                    "accountNumber": {
                      "value": "Your account number"
                    },
                    "tins": [
                      {
                        "number": "123567",
                        "tinType": "FEDERAL",
                        "usage": "usage",
                        "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                        "expirationDate": "2000-01-23T04:56:07.000+00:00"
                      }
                    ]
                  },
                  "remitToName": "remitToName",
                  "codCollectionType": "CASH",
                  "financialInstitutionContactAndAddress": {
                    "address": {
                      "streetLines": [
                        "10 FedEx Parkway",
                        "Suite 302"
                      ],
                      "city": "Beverly Hills",
                      "stateOrProvinceCode": "CA",
                      "postalCode": "38127",
                      "countryCode": "US",
                      "residential": false
                    },
                    "contact": {
                      "personName": "person name",
                      "emailAddress": "email address",
                      "phoneNumber": "phone number",
                      "phoneExtension": "phone extension",
                      "companyName": "company name",
                      "faxNumber": "fax number"
                    }
                  },
                  "codCollectionAmount": {
                    "amount": 12.45,
                    "currency": "USD"
                  },
                  "returnReferenceIndicatorType": "INVOICE",
                  "shipmentCodAmount": {
                    "amount": 12.45,
                    "currency": "USD"
                  }
                },
                "shipmentDryIceDetail": {
                  "totalWeight": {
                    "units": "LB",
                    "value": 10
                  },
                  "packageCount": 12
                },
                "internationalControlledExportDetail": {
                  "licenseOrPermitExpirationDate": "2019-12-03",
                  "licenseOrPermitNumber": "11",
                  "entryNumber": "125",
                  "foreignTradeZoneCode": "US",
                  "type": "WAREHOUSE_WITHDRAWAL"
                },
                "homeDeliveryPremiumDetail": {
                  "phoneNumber": {
                    "areaCode": "901",
                    "localNumber": "3575012",
                    "extension": "200",
                    "personalIdentificationNumber": "98712345"
                  },
                  "deliveryDate": "2019-06-26",
                  "homedeliveryPremiumType": "APPOINTMENT"
                }
              },
              "emailNotificationDetail": {
                "aggregationType": "PER_PACKAGE",
                "emailNotificationRecipients": [
                  {
                    "name": "Joe Smith",
                    "emailNotificationRecipientType": "SHIPPER",
                    "emailAddress": "jsmith3@aol.com",
                    "notificationFormatType": "TEXT",
                    "notificationType": "EMAIL",
                    "locale": "en_US",
                    "notificationEventType": [
                      "ON_PICKUP_DRIVER_ARRIVED",
                      "ON_SHIPMENT"
                    ]
                  }
                ],
                "personalMessage": "your personal message here"
              },
              "expressFreightDetail": {
                "bookingConfirmationNumber": "123456789812",
                "shippersLoadAndCount": 123,
                "packingListEnclosed": true
              },
              "variableHandlingChargeDetail": {
                "rateType": "PREFERRED_CURRENCY",
                "percentValue": 12.45,
                "rateLevelType": "INDIVIDUAL_PACKAGE_RATE",
                "fixedValue": {
                  "amount": 24.45,
                  "currency": "USD"
                },
                "rateElementBasis": "NET_CHARGE_EXCLUDING_TAXES"
              },
              "customsClearanceDetail": {
                "regulatoryControls": [
                  "NOT_IN_FREE_CIRCULATION",
                  "USMCA"
                ],
                "brokers": [
                  {
                    "broker": {
                      "address": {
                        "streetLines": [
                          "10 FedEx Parkway",
                          "Suite 302"
                        ],
                        "city": "Beverly Hills",
                        "stateOrProvinceCode": "CA",
                        "postalCode": "90210",
                        "countryCode": "US",
                        "residential": false
                      },
                      "contact": {
                        "personName": "John Taylor",
                        "emailAddress": "sample@company.com",
                        "phoneNumber": "1234567890",
                        "phoneExtension": 91,
                        "companyName": "Fedex",
                        "faxNumber": 1234567
                      },
                      "accountNumber": {
                        "value": "Your account number"
                      },
                      "tins": [
                        {
                          "number": "number",
                          "tinType": "FEDERAL",
                          "usage": "usage",
                          "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                          "expirationDate": "2000-01-23T04:56:07.000+00:00"
                        }
                      ],
                      "deliveryInstructions": "deliveryInstructions"
                    },
                    "type": "IMPORT"
                  }
                ],
                "commercialInvoice": {
                  "originatorName": "originator Name",
                  "comments": [
                    "optional comments for the commercial invoice"
                  ],
                  "customerReferences": [
                    {
                      "customerReferenceType": "DEPARTMENT_NUMBER",
                      "value": "3686"
                    }
                  ],
                  "taxesOrMiscellaneousCharge": {
                    "amount": 12.45,
                    "currency": "USD"
                  },
                  "taxesOrMiscellaneousChargeType": "COMMISSIONS",
                  "freightCharge": {
                    "amount": 12.45,
                    "currency": "USD"
                  },
                  "packingCosts": {
                    "amount": 12.45,
                    "currency": "USD"
                  },
                  "handlingCosts": {
                    "amount": 12.45,
                    "currency": "USD"
                  },
                  "declarationStatement": "declarationStatement",
                  "termsOfSale": "FCA",
                  "specialInstructions": "specialInstructions\"",
                  "shipmentPurpose": "REPAIR_AND_RETURN",
                  "emailNotificationDetail": {
                    "emailAddress": "neena@fedex.com",
                    "type": "EMAILED",
                    "recipientType": "SHIPPER"
                  }
                },
                "freightOnValue": "OWN_RISK",
                "dutiesPayment": {
                  "payor": {
                    "responsibleParty": {
                      "address": {
                        "streetLines": [
                          "10 FedEx Parkway",
                          "Suite 302"
                        ],
                        "city": "Beverly Hills",
                        "stateOrProvinceCode": "CA",
                        "postalCode": "38127",
                        "countryCode": "US",
                        "residential": false
                      },
                      "contact": {
                        "personName": "John Taylor",
                        "emailAddress": "sample@company.com",
                        "phoneNumber": "1234567890",
                        "phoneExtension": "phone extension",
                        "companyName": "Fedex",
                        "faxNumber": "fax number"
                      },
                      "accountNumber": {
                        "value": "Your account number"
                      },
                      "tins": [
                        {
                          "number": "number",
                          "tinType": "FEDERAL",
                          "usage": "usage",
                          "effectiveDate": "2024-06-13",
                          "expirationDate": "2024-06-13"
                        },
                        {
                          "number": "number",
                          "tinType": "FEDERAL",
                          "usage": "usage",
                          "effectiveDate": "2024-06-13",
                          "expirationDate": "2024-06-13"
                        }
                      ]
                    }
                  },
                  "billingDetails": {
                    "billingCode": "billingCode",
                    "billingType": "billingType",
                    "aliasId": "aliasId",
                    "accountNickname": "accountNickname",
                    "accountNumber": "Your account number",
                    "accountNumberCountryCode": "US"
                  },
                  "paymentType": "SENDER"
                },
                "commodities": [
                  {
                    "unitPrice": {
                      "amount": 12.45,
                      "currency": "USD"
                    },
                    "additionalMeasures": [
                      {
                        "quantity": 12.45,
                        "units": "KG"
                      }
                    ],
                    "numberOfPieces": 12,
                    "quantity": 125,
                    "quantityUnits": "Ea",
                    "customsValue": {
                      "amount": "1556.25",
                      "currency": "USD"
                    },
                    "countryOfManufacture": "US",
                    "cIMarksAndNumbers": "87123",
                    "harmonizedCode": "0613",
                    "description": "description",
                    "name": "non-threaded rivets",
                    "weight": {
                      "units": "KG",
                      "value": 68
                    },
                    "exportLicenseNumber": "26456",
                    "exportLicenseExpirationDate": "2024-08-25T16:57:08Z",
                    "partNumber": "167",
                    "purpose": "BUSINESS",
                    "usmcaDetail": {
                      "originCriterion": "A"
                    }
                  }
                ],
                "isDocumentOnly": false,
                "recipientCustomsId": {
                  "type": "PASSPORT",
                  "value": "123"
                },
                "customsOption": {
                  "description": "Description",
                  "type": "COURTESY_RETURN_LABEL"
                },
                "importerOfRecord": {
                  "address": {
                    "streetLines": [
                      "10 FedEx Parkway",
                      "Suite 302"
                    ],
                    "city": "Beverly Hills",
                    "stateOrProvinceCode": "CA",
                    "postalCode": "90210",
                    "countryCode": "US",
                    "residential": false
                  },
                  "contact": {
                    "personName": "John Taylor",
                    "emailAddress": "sample@company.com",
                    "phoneExtension": "000",
                    "phoneNumber": "XXXX345671",
                    "companyName": "Fedex"
                  },
                  "accountNumber": {
                    "value": "Your account number"
                  },
                  "tins": [
                    {
                      "number": "123567",
                      "tinType": "FEDERAL",
                      "usage": "usage",
                      "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                      "expirationDate": "2000-01-23T04:56:07.000+00:00"
                    }
                  ]
                },
                "generatedDocumentLocale": "en_US",
                "exportDetail": {
                  "destinationControlDetail": {
                    "endUser": "dest country user",
                    "statementTypes": "DEPARTMENT_OF_COMMERCE",
                    "destinationCountries": [
                      "USA",
                      "India"
                    ]
                  },
                  "b13AFilingOption": "NOT_REQUIRED",
                  "exportComplianceStatement": "12345678901234567",
                  "permitNumber": "12345"
                },
                "totalCustomsValue": {
                  "amount": 12.45,
                  "currency": "USD"
                },
                "partiesToTransactionAreRelated": true,
                "declarationStatementDetail": {
                  "usmcaLowValueStatementDetail": {
                    "countryOfOriginLowValueDocumentRequested": true,
                    "customsRole": "EXPORTER"
                  }
                },
                "insuranceCharge": {
                  "amount": 12.45,
                  "currency": "USD"
                }
              },
              "smartPostInfoDetail": {
                "ancillaryEndorsement": "RETURN_SERVICE",
                "hubId": "5015",
                "indicia": "PRESORTED_STANDARD",
                "specialServices": "USPS_DELIVERY_CONFIRMATION"
              },
              "blockInsightVisibility": true,
              "labelSpecification": {
                "labelFormatType": "COMMON2D",
                "labelOrder": "SHIPPING_LABEL_FIRST",
                "customerSpecifiedDetail": {
                  "maskedData": [
                    "PACKAGE_SEQUENCE_AND_COUNT",
                    "TOTAL_WEIGHT"
                  ],
                  "regulatoryLabels": [
                    {
                      "generationOptions": "CONTENT_ON_SHIPPING_LABEL_ONLY",
                      "type": "ALCOHOL_SHIPMENT_LABEL"
                    }
                  ],
                  "additionalLabels": [
                    {
                      "type": "MANIFEST",
                      "count": 1
                    }
                  ],
                  "docTabContent": {
                    "docTabContentType": "BARCODED",
                    "zone001": {
                      "docTabZoneSpecifications": [
                        {
                          "zoneNumber": 0,
                          "header": "string",
                          "dataField": "string",
                          "literalValue": "string",
                          "justification": "RIGHT"
                        }
                      ]
                    },
                    "barcoded": {
                      "symbology": "UCC128",
                      "specification": {
                        "zoneNumber": 0,
                        "header": "string",
                        "dataField": "string",
                        "literalValue": "string",
                        "justification": "RIGHT"
                      }
                    }
                  }
                },
                "printedLabelOrigin": {
                  "address": {
                    "streetLines": [
                      "10 FedEx Parkway",
                      "Suite 302"
                    ],
                    "city": "Beverly Hills",
                    "stateOrProvinceCode": "CA",
                    "postalCode": "38127",
                    "countryCode": "US",
                    "residential": false
                  },
                  "contact": {
                    "personName": "person name",
                    "emailAddress": "email address",
                    "phoneNumber": "phone number",
                    "phoneExtension": "phone extension",
                    "companyName": "company name",
                    "faxNumber": "fax number"
                  }
                },
                "labelStockType": "PAPER_7X475",
                "labelRotation": "UPSIDE_DOWN",
                "imageType": "PDF",
                "labelPrintingOrientation": "TOP_EDGE_OF_TEXT_FIRST",
                "returnedDispositionDetail": "RETURNED",
                "resolution": 300
              },
              "shippingDocumentSpecification": {
                "generalAgencyAgreementDetail": {
                  "documentFormat": {
                    "provideInstructions": true,
                    "optionsRequested": {
                      "options": [
                        "SUPPRESS_ADDITIONAL_LANGUAGES",
                        "SHIPPING_LABEL_LAST"
                      ]
                    },
                    "stockType": "PAPER_LETTER",
                    "dispositions": [
                      {
                        "eMailDetail": {
                          "eMailRecipients": [
                            {
                              "emailAddress": "email@fedex.com",
                              "recipientType": "THIRD_PARTY"
                            }
                          ],
                          "locale": "en_US",
                          "grouping": "NONE"
                        },
                        "dispositionType": "CONFIRMED"
                      }
                    ],
                    "locale": "en_US",
                    "docType": "PDF"
                  }
                },
                "returnInstructionsDetail": {
                  "customText": "This is additional text printed on Return instr",
                  "documentFormat": {
                    "provideInstructions": true,
                    "optionsRequested": {
                      "options": [
                        "SUPPRESS_ADDITIONAL_LANGUAGES",
                        "SHIPPING_LABEL_LAST"
                      ]
                    },
                    "stockType": "PAPER_LETTER",
                    "dispositions": [
                      {
                        "eMailDetail": {
                          "eMailRecipients": [
                            {
                              "emailAddress": "email@fedex.com",
                              "recipientType": "THIRD_PARTY"
                            }
                          ],
                          "locale": "en_US",
                          "grouping": "NONE"
                        },
                        "dispositionType": "CONFIRMED"
                      }
                    ],
                    "locale": "en_US\"",
                    "docType": "PNG"
                  }
                },
                "op900Detail": {
                  "customerImageUsages": [
                    {
                      "id": "IMAGE_5",
                      "type": "SIGNATURE",
                      "providedImageType": "SIGNATURE"
                    }
                  ],
                  "signatureName": "Signature Name",
                  "documentFormat": {
                    "provideInstructions": true,
                    "optionsRequested": {
                      "options": [
                        "SUPPRESS_ADDITIONAL_LANGUAGES",
                        "SHIPPING_LABEL_LAST"
                      ]
                    },
                    "stockType": "PAPER_LETTER",
                    "dispositions": [
                      {
                        "eMailDetail": {
                          "eMailRecipients": [
                            {
                              "emailAddress": "email@fedex.com",
                              "recipientType": "THIRD_PARTY"
                            }
                          ],
                          "locale": "en_US",
                          "grouping": "NONE"
                        },
                        "dispositionType": "CONFIRMED"
                      }
                    ],
                    "locale": "en_US",
                    "docType": "PDF"
                  }
                },
                "usmcaCertificationOfOriginDetail": {
                  "customerImageUsages": [
                    {
                      "id": "IMAGE_5",
                      "type": "SIGNATURE",
                      "providedImageType": "SIGNATURE"
                    }
                  ],
                  "documentFormat": {
                    "provideInstructions": true,
                    "optionsRequested": {
                      "options": [
                        "SUPPRESS_ADDITIONAL_LANGUAGES",
                        "SHIPPING_LABEL_LAST"
                      ]
                    },
                    "stockType": "PAPER_LETTER",
                    "dispositions": [
                      {
                        "eMailDetail": {
                          "eMailRecipients": [
                            {
                              "emailAddress": "email@fedex.com",
                              "recipientType": "THIRD_PARTY"
                            }
                          ],
                          "locale": "en_US",
                          "grouping": "NONE"
                        },
                        "dispositionType": "CONFIRMED"
                      }
                    ],
                    "locale": "en_US",
                    "docType": "PDF"
                  },
                  "certifierSpecification": "EXPORTER",
                  "importerSpecification": "UNKNOWN",
                  "producerSpecification": "SAME_AS_EXPORTER",
                  "producer": {
                    "address": {
                      "streetLines": [
                        "10 FedEx Parkway",
                        "Suite 302"
                      ],
                      "city": "Beverly Hills",
                      "stateOrProvinceCode": "CA",
                      "postalCode": "90210",
                      "countryCode": "US",
                      "residential": false
                    },
                    "contact": {
                      "personName": "John Taylor",
                      "emailAddress": "sample@company.com",
                      "phoneExtension": "000",
                      "phoneNumber": "XXXX345671",
                      "companyName": "Fedex"
                    },
                    "accountNumber": {
                      "value": "Your account number"
                    },
                    "tins": [
                      {
                        "number": "123567",
                        "tinType": "FEDERAL",
                        "usage": "usage",
                        "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                        "expirationDate": "2000-01-23T04:56:07.000+00:00"
                      }
                    ]
                  },
                  "blanketPeriod": {
                    "begins": "22-01-2020",
                    "ends": "2-01-2020"
                  },
                  "certifierJobTitle": "Manager"
                },
                "usmcaCommercialInvoiceCertificationOfOriginDetail": {
                  "customerImageUsages": [
                    {
                      "id": "IMAGE_5",
                      "type": "SIGNATURE",
                      "providedImageType": "SIGNATURE"
                    }
                  ],
                  "documentFormat": {
                    "provideInstructions": true,
                    "optionsRequested": {
                      "options": [
                        "SUPPRESS_ADDITIONAL_LANGUAGES",
                        "SHIPPING_LABEL_LAST"
                      ]
                    },
                    "stockType": "PAPER_LETTER",
                    "dispositions": [
                      {
                        "eMailDetail": {
                          "eMailRecipients": [
                            {
                              "emailAddress": "email@fedex.com",
                              "recipientType": "THIRD_PARTY"
                            }
                          ],
                          "locale": "en_US",
                          "grouping": "NONE"
                        },
                        "dispositionType": "CONFIRMED"
                      }
                    ],
                    "locale": "en_US",
                    "docType": "PDF"
                  },
                  "certifierSpecification": "EXPORTER",
                  "importerSpecification": "UNKNOWN",
                  "producerSpecification": "SAME_AS_EXPORTER",
                  "producer": {
                    "address": {
                      "streetLines": [
                        "10 FedEx Parkway",
                        "Suite 302"
                      ],
                      "city": "Beverly Hills",
                      "stateOrProvinceCode": "CA",
                      "postalCode": "90210",
                      "countryCode": "US",
                      "residential": false
                    },
                    "contact": {
                      "personName": "John Taylor",
                      "emailAddress": "sample@company.com",
                      "phoneExtension": "000",
                      "phoneNumber": "XXXX345671",
                      "companyName": "Fedex"
                    },
                    "accountNumber": {
                      "value": "Your account number"
                    },
                    "tins": [
                      {
                        "number": "123567",
                        "tinType": "FEDERAL",
                        "usage": "usage",
                        "effectiveDate": "2000-01-23T04:56:07.000+00:00",
                        "expirationDate": "2000-01-23T04:56:07.000+00:00"
                      }
                    ]
                  },
                  "certifierJobTitle": "Manager"
                },
                "shippingDocumentTypes": [
                  "RETURN_INSTRUCTIONS"
                ],
                "certificateOfOrigin": {
                  "customerImageUsages": [
                    {
                      "id": "IMAGE_5",
                      "type": "SIGNATURE",
                      "providedImageType": "SIGNATURE"
                    }
                  ],
                  "documentFormat": {
                    "provideInstructions": true,
                    "optionsRequested": {
                      "options": [
                        "SUPPRESS_ADDITIONAL_LANGUAGES",
                        "SHIPPING_LABEL_LAST"
                      ]
                    },
                    "stockType": "PAPER_LETTER",
                    "dispositions": [
                      {
                        "eMailDetail": {
                          "eMailRecipients": [
                            {
                              "emailAddress": "email@fedex.com",
                              "recipientType": "THIRD_PARTY"
                            }
                          ],
                          "locale": "en_US",
                          "grouping": "NONE"
                        },
                        "dispositionType": "CONFIRMED"
                      }
                    ],
                    "locale": "en_US",
                    "docType": "PDF"
                  }
                },
                "commercialInvoiceDetail": {
                  "customerImageUsages": [
                    {
                      "id": "IMAGE_5",
                      "type": "SIGNATURE",
                      "providedImageType": "SIGNATURE"
                    }
                  ],
                  "documentFormat": {
                    "provideInstructions": true,
                    "optionsRequested": {
                      "options": [
                        "SUPPRESS_ADDITIONAL_LANGUAGES",
                        "SHIPPING_LABEL_LAST"
                      ]
                    },
                    "stockType": "PAPER_LETTER",
                    "dispositions": [
                      {
                        "eMailDetail": {
                          "eMailRecipients": [
                            {
                              "emailAddress": "email@fedex.com",
                              "recipientType": "THIRD_PARTY"
                            }
                          ],
                          "locale": "en_US",
                          "grouping": "NONE"
                        },
                        "dispositionType": "CONFIRMED"
                      }
                    ],
                    "locale": "en_US",
                    "docType": "PDF"
                  }
                }
              },
              "rateRequestType": [
                "LIST",
                "PREFERRED"
              ],
              "preferredCurrency": "USD",
              "totalPackageCount": 25,
              "masterTrackingId": {
                "formId": "0201",
                "trackingIdType": "EXPRESS",
                "uspsApplicationId": "92",
                "trackingNumber": "49092000070120032835"
              },
              "requestedPackageLineItems": [
                {
                  "sequenceNumber": "1",
                  "subPackagingType": "BUCKET",
                  "customerReferences": [
                    {
                      "customerReferenceType": "INVOICE_NUMBER",
                      "value": "3686"
                    }
                  ],
                  "declaredValue": {
                    "amount": 12.45,
                    "currency": "USD"
                  },
                  "weight": {
                    "units": "KG",
                    "value": 68
                  },
                  "dimensions": {
                    "length": 100,
                    "width": 50,
                    "height": 30,
                    "units": "CM"
                  },
                  "groupPackageCount": 2,
                  "itemDescriptionForClearance": "description",
                  "contentRecord": [
                    {
                      "itemNumber": "2876",
                      "receivedQuantity": 256,
                      "description": "Description",
                      "partNumber": "456"
                    }
                  ],
                  "itemDescription": "item description for the package",
                  "variableHandlingChargeDetail": {
                    "rateType": "PREFERRED_CURRENCY",
                    "percentValue": 12.45,
                    "rateLevelType": "INDIVIDUAL_PACKAGE_RATE",
                    "fixedValue": {
                      "amount": 24.45,
                      "currency": "USD"
                    },
                    "rateElementBasis": "NET_CHARGE_EXCLUDING_TAXES"
                  },
                  "packageSpecialServices": {
                    "specialServiceTypes": [
                      "ALCOHOL",
                      "NON_STANDARD_CONTAINER",
                      "DANGEROUS_GOODS",
                      "SIGNATURE_OPTION",
                      "PRIORITY_ALERT"
                    ],
                    "signatureOptionType": "ADULT",
                    "priorityAlertDetail": {
                      "enhancementTypes": [
                        "PRIORITY_ALERT_PLUS"
                      ],
                      "content": [
                        "string"
                      ]
                    },
                    "signatureOptionDetail": {
                      "signatureReleaseNumber": "23456"
                    },
                    "alcoholDetail": {
                      "alcoholRecipientType": "LICENSEE",
                      "shipperAgreementType": "Retailer"
                    },
                    "dangerousGoodsDetail": {
                      "cargoAircraftOnly": false,
                      "accessibility": "INACCESSIBLE",
                      "options": [
                        "LIMITED_QUANTITIES_COMMODITIES",
                        "ORM_D"
                      ]
                    },
                    "packageCODDetail": {
                      "codCollectionAmount": {
                        "amount": 12.45,
                        "currency": "USD"
                      }
                    },
                    "pieceCountVerificationBoxCount": 0,
                    "batteryDetails": [
                      {
                        "batteryPackingType": "CONTAINED_IN_EQUIPMENT",
                        "batteryRegulatoryType": "IATA_SECTION_II",
                        "batteryMaterialType": "LITHIUM_METAL"
                      }
                    ],
                    "dryIceWeight": {
                      "units": "KG",
                      "value": 68
                    },
                    "standaloneBatteryDetails": [
                      {
                        "batteryMaterialType": "LITHIUM_METAL"
                      }
                    ]
                  }
                }
              ]
            },
            "labelResponseOptions": "URL_ONLY",
            "accountNumber": {
              "value": "Your account number"
            },
            "shipAction": "CONFIRM",
            "processingOptionType": "ALLOW_ASYNCHRONOUS",
            "oneLabelAtATime": true
          },
    };

    try {
        const fedexResponse = await axios.post(
            'https://apis.fedex.com/ship/v1/shipments',
            orderDetails,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (fedexResponse.status === 200) {
            console.log('FedEx order created successfully:', fedexResponse.data);
        } else {
            console.error('Failed to create FedEx order:', fedexResponse.data);
        }
    } catch (error) {
        console.error('Error in FedEx order creation:', error.response ? error.response.data : error.message);
    }
};


// API rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

// Reviews API routes
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

app.post('/api/reviews', async (req, res) => {
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
});

app.post('/api/reviews/usefulness', async (req, res) => {
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
});

app.post('/api/reviews/:id/vote', async (req, res) => {
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
});

// Stripe Checkout route
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { items } = req.body;

        // Create a Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100, // Convert dollars to cents
                },
                quantity: item.quantity,
            })),
            automatic_tax: {
                enabled: true,
            },
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/Success`,
            cancel_url: `${process.env.CLIENT_URL}/Cancel`,
        });

        // Send the session ID to the client
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating Checkout Session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An internal error occurred' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
