import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useUserUUID from './hooks/useUserUUID';
import { Link } from "react-router-dom";
import { useCart } from './CartContext';  // Import the Cart context

// Import your images
import SmootherImage1 from "./assets/smoother/smoother1.jpg";
import SmootherImage2 from "./assets/smoother/smoother2.jpg";
import SmootherImage3 from "./assets/smoother/smoother3.jpg";
import SmootherImage4 from "./assets/smoother/smoother4.jpg";

import BeastImage1 from "./assets/beast/beast1.jpg";
import BeastImage2 from "./assets/beast/beast2.jpg";
import BeastImage3 from "./assets/beast/beast3.jpg";
import BeastImage4 from "./assets/beast/beast4.jpg";

import TerminatorImage1 from "./assets/terminator/terminator1.jpg";
import TerminatorImage2 from "./assets/terminator/terminator2.jpg";
import TerminatorImage3 from "./assets/terminator/terminator3.jpg";
import TerminatorImage4 from "./assets/terminator/terminator4.jpg";

import SpaceshipImage1 from "./assets/spaceship/spaceship1.jpg";
import SpaceshipImage2 from "./assets/spaceship/spaceship2.jpg";
import SpaceshipImage3 from "./assets/spaceship/spaceship3.jpg";
import SpaceshipImage4 from "./assets/spaceship/spaceship4.jpg";

import SmootherIcon from "./assets/smoother/smootherIco.png";
import BeastIcon from "./assets/beast/beastIco.png";
import TerminatorIcon from "./assets/terminator/terminatorIco.png";
import SpaceshipIcon from "./assets/spaceship/spaceshipIco.png";

const products = {
    Smoother: {
        id: "1",
        name: "Smoother",
        description: "Unleash Your Gaming Potential Without Breaking the Bank! <br>Introducing our latest budget-friendly gaming PC, designed for gamers who demand performance without the hefty price tag. This low-end gaming powerhouse is perfect for diving into the world of gaming, whether you're exploring vast open worlds, competing in intense multiplayer battles, or embarking on epic quests.",
        price: 649.99,
        components: {
            "Processor": "AMD Ryzen 5 5500 6-Core, 12-Thread",
            "Memory": "TEAMGROUP T-Force Vulcan Z DDR4 DRAM 16GB Kit (2x8GB) 3200MHz",
            "Storage": "MSI SPATIUM M450 M.2 2280 500GB PCI-Express  4.0",
            "Graphics Card": "ASRock Phantom RX 6500 XT ",
            "Motherboard": "ASUS TUF Gaming A520M-PLUS (WiFi)",
            "Processor Cooler": "AMD Wraith Stealth Cooler",
            "Case": "Montech AIR 100 ARGB MICRO-ATX",
            "Power Supply": "CORSAIR CX550 80 Plus Bronze 550 Watt Non Modular"
        },
        imageUrl1: SmootherImage1,
        imageUrl2: SmootherImage2,
        imageUrl3: SmootherImage3,
        imageUrl4: SmootherImage4,
        icon: SmootherIcon
    },
    Beast: {
        id: "2",
        name: "Beast",
        description: "Elevate Your Gaming Experience with Our Next-Level Gaming PC! <br>Step up your game with our new gaming PC, crafted for gamers who seek a perfect balance of performance, quality, and affordability. Whether you're aiming for high scores, exploring new worlds, or streaming your gameplay, this gaming rig is built to deliver an exceptional experience - Take the next step in your gaming journey and secure your system now!",
        price: 999.99,
        components: {
            "Processor": "AMD Ryzen 5 7600X 6-Core, 12-Thread ",
            "Memory": "TEAMGROUP T-Force Vulcan Z DDR4 32GB Kit (2x16GB) 3200MHz",
            "Storage": "KLEVV CRAS C910 1TB 5000MB/s",
            "Graphics Card": "ASUS Dual GeForce RTX™ 4060 OC ",
            "Motherboard": "MSI PRO B650-S WiFi",
            "Processor Cooler": "Cooler Master Hyper 212 120 Edge PWM Fan, 4 Copper Heat Pipes",
            "Case": "Cooler Master MasterCase H500 ARGB",
            "Power Supply": "AGV Series 650W Power Supply, 80 Plus Bronze Certified Non Modular"
        },
        imageUrl1: BeastImage1,
        imageUrl2: BeastImage2,
        imageUrl3: BeastImage3,
        imageUrl4: BeastImage4,
        icon: BeastIcon
    },
    Terminator: {
        id: "3",
        name: "Terminator",
        description: "Enhance Your Gaming Experience with Our Advanced Gaming PC! <br>Take your gaming to new heights with our advanced gaming PC, designed for enthusiasts who seek impressive performance and cutting-edge technology. Whether you're conquering the latest AAA titles, streaming your gameplay, or creating content, this rig delivers the power and precision needed to excel.",
        price: 1599.99,
        components: {
            "Processor": "AMD Ryzen 7 7800X3D 8-Core, 16-Thread",
            "Memory": "TEAMGROUP T-Force Delta RGB DDR4 32GB (2x16GB) 3600MHz",
            "Storage": "118 WD_BLACK 2TB 5150 MB/s",
            "Graphics Card": "RX 7800XT XFX Speedster SWFT210 Radeon 16GB",
            "Motherboard": "ASUS TUF Gaming A620M-PLUS(WiFi)",
            "Processor Cooler": "ID-COOLING SE-225-XT 5 Heatpipes 2x120mm 35",
            "Case": "Cooler Master MasterCase H500 ARGB",
            "Power Supply": "Thermaltake GF1 ATX 750W Fully Modular"
        },
        imageUrl1: TerminatorImage1,
        imageUrl2: TerminatorImage2,
        imageUrl3: TerminatorImage3,
        imageUrl4: TerminatorImage4,
        icon: TerminatorIcon
    },
    Spaceship: {
        id: "4",
        name: "Spaceship",
        description: "Command the Game with Our Ultimate Gaming PC! <br>Introducing the pinnacle of gaming technology: our Ultimate Gaming PC. Designed for the most demanding gamers and tech enthusiasts, this machine combines unrivaled power, cutting-edge components, and exceptional build quality. Whether you're playing the latest AAA titles, streaming in 4K, or creating high-end content, this rig delivers an unparalleled experience.",
        price: 2599.99,
        components: {
            "Processor": "AMD Ryzen 7 7800X3D 8-Core, 16-Thread",
            "Memory": "G.SKILL Trident Z5 RGB Series (Intel XMP 3.0) DDR5 RAM 32GB (2x16GB) 7200MT/s",
            "Storage": "Acer Predator GM7000 4TB M.2 7400MB/s",
            "Graphics Card": "RX 7900XTX XFX Speedster MERC310 AMD Radeon 24GB",
            "Motherboard": "ASUS ROG Strix B650-A Gaming WiFi 6E",
            "Processor Cooler": "NZXT Kraken Liquid Cooling 240mm",
            "Case": "CORSAIR iCUE 4000X RGB",
            "Power Supply": "CORSAIR RM850x - 850w - Fully Modular ATX Power Supply - 80 PLUS Gold - Low-Noise Fan - Zero RPM"
        },
        imageUrl1: SpaceshipImage1,
        imageUrl2: SpaceshipImage2,
        imageUrl3: SpaceshipImage3,
        imageUrl4: SpaceshipImage4,
        icon: SpaceshipIcon
    }
};

export default function Cart() {
    const [searchParams] = useSearchParams();
    const [product, setProduct] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const { cartItems, addToCart, updateQuantity, removeItem } = useCart();  // Destructure the cart context

    useEffect(() => {
        const productName = searchParams.get('product');
        if (productName && products[productName]) {
            setProduct(products[productName]);
        } else {
            console.error('No valid product specified');
        }
    }, [searchParams]);

    useEffect(() => {
        const handleCartButtonClick = () => {
            if (product) {
                addToCart(product);  // Use the addToCart function from context
            }
        };

        const cartButton = document.querySelector('.cart-button');
        if (cartButton) {
            cartButton.addEventListener('click', handleCartButtonClick);
        }

        return () => {
            if (cartButton) {
                cartButton.removeEventListener('click', handleCartButtonClick);
            }
        };
    }, [product, addToCart]);

    useEffect(() => {
        const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setSubtotal(total);
    }, [cartItems]);

    const handleCheckout = async (e) => {
        e.preventDefault(); // Prevent form submission
    
        // Fetch form values
        const email = document.getElementById("email").value;
        const name = document.getElementById("name").value;
        const addressLine1 = document.getElementById("addressLine1").value;
        const addressLine2 = document.getElementById("addressLine2").value;
        const city = document.getElementById("city").value;
        const zip = document.getElementById("zip").value;
        const state = document.getElementById("state").value;
    
        // Create address object
        const address = {
            email,       // Ensure values are being assigned correctly
            name,
            addressLine1,
            addressLine2,
            city,
            zip,
            state
        };

        console.log(address)
    
        try {
            const response = await fetch('https://server-pc.onrender.com/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        id: item.id,
                        quantity: item.quantity
                    })),
                    userUUID: '96e68dab-867a-4c3e-9b81-b16fc84e5141', // Replace with actual UUID
                    address, // Include the address in the request body
                }),
            });
    
            const data = await response.json();
            if (response.ok) {
                // Redirect to Stripe Checkout
                const stripe = window.Stripe('pk_test_51PbjzsAvZVlzPgF8Wtv9GAhGKbDJYS26DUOXtqEJ8MeM7fU5jQYuIS4G2BevkamozcYBOOYjbWCFmNqSDJGoFcGp00LaSzm6UA'); // Replace with your Stripe public key
                stripe.redirectToCheckout({ sessionId: data.id });
            } else {
                console.error('Error during checkout:', data.error);
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <div className="cart">
            <h1 className="cart-title">Shopping Cart</h1>
            <div className="products">
                {cartItems.map(item => (
                    <div key={item.id} className="product-on-cart">
                        <img className="cart-item-image" src={item.imageUrl1} alt={item.name} />
                        <div>
                            <h2>{item.name}</h2>
                            <p>Price: ${item.price.toFixed(2)}</p>
                            <button className="remove-button" onClick={() => removeItem(item.id)}>Remove</button>
                        </div>
                        <button className="subtract-from-cart" onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}>-</button>
                        <input
                            id="quantity"
                            type="number"
                            value={item.quantity}
                            onChange={e => updateQuantity(item.id, Math.max(0, parseInt(e.target.value) || 0))}
                        />
                        <button className="add-to-cart" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                ))}
            </div>
            <div className="buying-info">
                <p className="info">Subtotal: ${subtotal.toFixed(2)}</p>
                <p className="info">Shipping: Calculated at Checkout</p>
                <p className="info">Tax: Calculated at Checkout</p>
                <button className="checkout-button" onClick={handleCheckout}>Proceed to Checkout</button>
                <Link to="/Shipping Information">Shipping Information</Link>
            </div>
        </div>
    );
}