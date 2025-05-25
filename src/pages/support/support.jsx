import { useState } from "react";

import SmootherImage1 from "../../assets/smoother/smoother1.jpg";
import SmootherImage2 from "../../assets/smoother/smoother2.jpg";
import SmootherImage3 from "../../assets/smoother/smoother3.jpg";
import SmootherImage4 from "../../assets/smoother/smoother4.jpg";

import BeastImage1 from "../../assets/beast/beast1.jpg";
import BeastImage2 from "../../assets/beast/beast2.jpg";
import BeastImage3 from "../../assets/beast/beast3.jpeg";
import BeastImage4 from "../../assets/beast/beast4.jpg";

import TerminatorImage1 from "../../assets/terminator/terminator1.jpg";
import TerminatorImage2 from "../../assets/terminator/terminator2.jpg";
import TerminatorImage3 from "../../assets/terminator/terminator3.jpg";
import TerminatorImage4 from "../../assets/terminator/terminator4.jpg";

import SpaceshipImage1 from "../../assets/spaceship/spaceship1.jpg";
import SpaceshipImage2 from "../../assets/spaceship/spaceship2.jpg";
import SpaceshipImage3 from "../../assets/spaceship/spaceship3.jpg";
import SpaceshipImage4 from "../../assets/spaceship/spaceship4.jpg";

import SmootherIcon from "../../assets/smoother/smootherIco.png";
import BeastIcon from "../../assets/beast/beastIco.png";
import TerminatorIcon from "../../assets/terminator/terminatorIco.png";
import SpaceshipIcon from "../../assets/spaceship/spaceshipIco.png";

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

export default function Support() {
    const [searchTerm, setSearchTerm] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredProducts = Object.values(products).filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trackingNumber = document.getElementById('orderNumber').value.trim();
    
        try {
            const response = await fetch('https://server-pc.onrender.com/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ trackingNumber }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch tracking information');
            }
    
            const data = await response.json();
            
            // Extracting the necessary information from the response data
            const trackResult = data?.output?.completeTrackResults?.[0]?.trackResults?.[0];
            
            const status = trackResult?.latestStatusDetail?.description || 'Status not available';
            const estimatedDelivery = trackResult?.dateAndTimes?.find(d => d.type === 'ESTIMATED_DELIVERY')?.dateTime || 'No estimated delivery date available';
            
            setTrackingResult({
                status,
                estimatedDeliveryDate: estimatedDelivery,
            });
    
            setError(null);
        } catch (err) {
            setError('Error fetching tracking information. Please try again.');
            setTrackingResult(null);
            console.error('Tracking error:', err);
        }
    };

    return (
        <main className="support-main">
            <section className="product-search-section">
                <div className="support-image-header">
                    <h1 className="support-title">Support</h1>
                    <p className="support-text">Get help that fits your needs</p>
                    <form id="search-support">
                        <input
                            type="text"
                            id="text-search-support"
                            placeholder="Enter a product name"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <button type="submit" id="enter-search-support" className="fa-solid fa-magnifying-glass"></button>
                    </form>
                </div>
                <div className="products-to-search">
    {filteredProducts.map((product) => (
        <div key={product.id} className="product-card">

            <div className="support-product-image" style={{ backgroundImage: `url(${product.imageUrl1})` }}></div>

            <div className="product-details">
                <h3>{product.name}</h3>
                <div className="links">
                    <a href="mailto:bldgtechnolgics@gmail.com" target="_blank" rel="noopener noreferrer">
                        Contact Us
                    </a>
                    <a href="https://www.rednightconsulting.com/11-common-computer-issues-fix/" target="_blank" rel="noopener noreferrer">
                       Common Solutions
                    </a>
                </div>
            </div>

        </div>
    ))}
</div>

            </section>

            <section className="tracking-section" id="tracking-section">
                <h1 className="tracking-title">Order Tracking</h1>
                <form id="orderForm" onSubmit={handleSubmit}>
                    <input type="text" id="orderNumber" placeholder="Enter tracking number" required />
                    <button type="submit" className="order-button"><i className="fa-solid fa-truck-fast"></i></button>
                </form>
                <div id="result">
                    {error && <p className="error">{error}</p>}
                    {trackingResult && (
                        <div className="success">
                            <h2>Tracking Information</h2>
                            <p>Status: {trackingResult.status}</p>
                            <p>Estimated Delivery: {trackingResult.estimatedDeliveryDate}</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="contact-section">
                <h2 className="contact-section-title">Any questions?</h2>

                <p className="contact-section-text">Feel free to email us at <a href="mailto:bldgtechnolgics@gmail.com" target="_blank" className="contact-section-text-link">bldgtechnolgics@gmail.com</a> or contact us by <a href="tel:+19195203105" target="_blank" className="contact-section-text-link">phone</a></p>

                <div className="icon-container" id="icon-support-container">
                    <a href="https://www.facebook.com/profile.php?id=61560511531799" className="facebookAccount account fa-brands fa-facebook-f fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://x.com/BLDG_Tech" className="xAccount account fa-brands fa-x-twitter fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://www.instagram.com/bldg_build/" className="instagramAccount account fa-brands fa-instagram fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://www.tiktok.com/@bldgtech?lang=en" className="tiktokAccount account fa-brands fa-tiktok fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://www.youtube.com/channel/UCkdwly93IN-U34duTFW_ipA" className="youtubeAccount account fa-brands fa-youtube fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                </div>
                <div className="info-cards-section">
                <div className="info-card info-card-email">
                    <i className="fa-solid fa-envelope info-card-icons"></i>
                    
                    <div className="info-card-body">
                        <h3 className="info-card-title">Email</h3>
                        <p className="info-card-text">If you have a problem and you need assistance, consider sending us an email.</p>
                    </div>
                    <a className="info-card-button" target="_blank" href="mailto: bldgtechnologics@gmail.com" >Email</a>
                </div>

                <div className="info-card info-card-comments-and-reviews">
                    <i className="fa-solid fa-comment info-card-icons"></i>

                    <div className="info-card-body">
                        <h3 className="info-card-title">Comments & Reviews</h3>
                        <p className="info-card-text">Get a reply from us by commenting on our social media, or by leaving a review in our site</p>
                    </div>
                    <a className="info-card-button" href="/Reviews">Comments & Reviews</a>
                </div>

                <div className="info-card info-card-phone">
                    <i className="fa-solid fa-phone info-card-icons"></i>

                    <div className="info-card-body">
                        <h3 className="info-card-title">Phone</h3>
                        <p className="info-card-text">If you would like to call a computer technician that can help you diagnose a problem or if you would like installation for you product, consider calling. (we only offer installation within some areas of NC)</p>
                    </div>
                    <a href="tel:+19193494727" target="_blank" className="info-card-button">Phone</a>
                </div>
                </div>
            </section>
        </main>
    );
}

/*<dotlottie-player src="https://lottie.host/a75d8650-3e32-4c96-9b6c-f232485d8698/6dYIm4J7FU.json" background="transparent" speed="1" style={{width: "750px", height: "75px"}} loop autoplay></dotlottie-player>*/


