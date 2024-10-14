export default function Cancels() {
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
                <input type="submit" value="CHECKOUT" className="shipping-submit"/>
            </form>
        </main>
    )
}