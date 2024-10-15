import { useEffect } from "react"
import React from 'react';
import { useCart } from '../../CartContext';

export default function ShippingInfo() {
    // Get cart items from CartContext
    const { cartItems } = useCart(); // Assuming cartItems is part of the context

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
        <main className="main-shipping-info">
            <h2 className="shipping-title">Shipping address</h2>
            <form className="shipping-form" onSubmit={handleCheckout}>
                <input type="email" placeholder="Email" className="shipping-input" required id="email" autocomplete="email"/>
                <input type="text" placeholder="Full name" className="shipping-input" required id="name" autocomplete="name"/>
                <input type="text" placeholder="Address line 1" className="shipping-input" required id="addressLine1" autocomplete="address-line1"/>
                <input type="text" placeholder="Address line 2" className="shipping-input" id="addressLine2" autocomplete="address-line2"/>
                <div className="city-zip-container">
                    <input type="text" placeholder="City" className="shipping-input fifty-input" required id="city" autocomplete="address-level2"/>
                    <input type="text" placeholder="ZIP" className="shipping-input fifty-input" required id="zip" autocomplete="postal-code"/>
                </div>
                <input type="text" placeholder="State" className="shipping-input" required id="state" autocomplete="address-level1"/>
                <input type="submit" value="CHECKOUT" className="shipping-submit" />
            </form>
        </main>
    );
}