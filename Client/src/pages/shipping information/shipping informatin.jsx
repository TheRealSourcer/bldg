import { useEffect } from "react"

export default function ShippingInfo() {

    const handleCheckout = async () => {
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
                    userUUID: '96e68dab-867a-4c3e-9b81-b16fc84e5141' // Replace with actual UUID
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
            <form action="" className="shipping-form">
                <input type="email" name="" id="" placeholder="Email" className="shipping-input"/>
                <input type="text" name="" id="" placeholder="Full name" className="shipping-input"/>
                <input type="text" placeholder="Address line 1" className="shipping-input"/>
                <input type="text" placeholder="Address line 2" className="shipping-input"/>
                <div className="city-zip-container">
                    <input type="text" placeholder="City" className="shipping-input fifty-input"/>
                    <input type="text" placeholder="ZIP" className="shipping-input fifty-input"/>
                </div>
                <input type="text" placeholder="State" className="shipping-input"/>
                <input type="submit" value="CHECKOUT" className="shipping-submit" onClick={handleCheckout}/>
            </form>
        </main>
    )
}