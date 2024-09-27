import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import HomeVideo from '/Home-Video.mp4';
import VanillaTilt from 'vanilla-tilt';

import Smoother from '../../assets/smoother/smoother1.jpg';
import Beast from '../../assets/beast/beast1.jpg';
import Terminator from '../../assets/terminator/terminator1.jpg';
import Spaceship from '../../assets/spaceship/spaceship1.jpg';

import BeastClaw from '../../assets/beast/beastIco.png';

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

const products = {
    Smoother: {
        id: "1",
        name: "Smoother",
        description: "Unleash Your Gaming Potential Without Breaking the Bank! <br>Introducing our latest budget-friendly gaming PC, designed for gamers who demand performance without the hefty price tag. This low-end gaming powerhouse is perfect for diving into the world of gaming, whether you're exploring vast open worlds, competing in intense multiplayer battles, or embarking on epic quests.",
        price: 649.99,
        features: {
            "Processor": "AMD Ryzen 5 5500 6-Core, 12-Thread",
            "Memory": "TEAMGROUP T-Force Vulcan Z DDR4 DRAM 16GB Kit (2x8GB) 3200MHz",
            "Storage": "MSI SPATIUM M450 M.2 2280 500GB PCI-Express 4.0",
            "Graphics Card": "ASRock Phantom RX 6500 XT ",
        },
        imageUrl1: SmootherImage1,
        imageUrl2: SmootherImage2,
        imageUrl3: SmootherImage3,
        imageUrl4: SmootherImage4
    },
    Beast: {
        id: "2",
        name: "Beast",
        description: "Elevate Your Gaming Experience with Our Next-Level Gaming PC! <br>Step up your game with our new gaming PC, crafted for gamers who seek a perfect balance of performance, quality, and affordability. Whether you're aiming for high scores, exploring new worlds, or streaming your gameplay, this gaming rig is built to deliver an exceptional experience - Take the next step in your gaming journey and secure your system now!",
        price: 999.99,
        features: {
            "Processor": "AMD Ryzen 5 7600X 6-Core, 12-Thread ",
            "Memory": "TEAMGROUP T-Force Vulcan Z DDR4 32GB Kit (2x16GB) 3200MHz",
            "Storage": "KLEVV CRAS C910 1TB 5000MB/s",
            "Graphics Card": "ASUS Dual GeForce RTX™ 4060 OC ",
        },
        imageUrl1: BeastImage1,
        imageUrl2: BeastImage2,
        imageUrl3: BeastImage3,
        imageUrl4: BeastImage4
    },
    Terminator: {
        id: "3",
        name: "Terminator",
        description: "Enhance Your Gaming Experience with Our Advanced Gaming PC! <br>Take your gaming to new heights with our advanced gaming PC, designed for enthusiasts who seek impressive performance and cutting-edge technology. Whether you're conquering the latest AAA titles, streaming your gameplay, or creating content, this rig delivers the power and precision needed to excel.",
        price: 1499.99,
        features: {
            "Processor": "AMD Ryzen 7 7800X3D 8-Core, 16-Thread",
            "Memory": "TEAMGROUP T-Force Delta RGB DDR4 32GB (2x16GB) 3600MHz",
            "Storage": "118 WD_BLACK 2TB 5150 MB/s",
            "Graphics Card": "RX 7800XT XFX Speedster SWFT210 Radeon 16GB",
        },
        imageUrl1: TerminatorImage1,
        imageUrl2: TerminatorImage2,
        imageUrl3: TerminatorImage3,
        imageUrl4: TerminatorImage4
    },
    Spaceship: {
        id: "4",
        name: "Spaceship",
        description: "Command the Game with Our Ultimate Gaming PC! <br>Introducing the pinnacle of gaming technology: our Ultimate Gaming PC. Designed for the most demanding gamers and tech enthusiasts, this machine combines unrivaled power, cutting-edge features, and exceptional build quality. Whether you're playing the latest AAA titles, streaming in 4K, or creating high-end content, this rig delivers an unparalleled experience.",
        price: 1999.99,
        features: {
            "Processor": "AMD Ryzen 7 7800X3D 8-Core, 16-Thread",
            "Memory": "G.SKILL Trident Z5 RGB Series (Intel XMP 3.0) DDR5 RAM 32GB (2x16GB) 7200MT/s",
            "Storage": "Acer Predator GM7000 4TB M.2 7400MB/s",
            "Graphics Card": "RX 7900XTX XFX Speedster MERC310 AMD Radeon 24GB",
        },
        imageUrl1: SpaceshipImage1,
        imageUrl2: SpaceshipImage2,
        imageUrl3: SpaceshipImage3,
        imageUrl4: SpaceshipImage4
    }
};

export default function Home() {
    const iconContainerRef = useRef(null);
    const pcContainerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const accounts = document.querySelectorAll(".account-link");
        accounts.forEach(account => {
            account.addEventListener("mouseover", () => {
                account.classList.add("fa-bounce");
            });

            account.addEventListener("mouseleave", () => {
                account.classList.remove("fa-bounce");
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                } else {
                    entry.target.classList.remove("show");
                }
            });
        });

        if (iconContainerRef.current) {
            observer.observe(iconContainerRef.current);
        }

        // Set isLoaded to true after a short delay
        const loadTimeout = setTimeout(() => setIsLoaded(true), 100);

        return () => {
            accounts.forEach(account => {
                account.removeEventListener("mouseover", () => {});
                account.removeEventListener("mouseleave", () => {});
            });
            observer.disconnect();
            clearTimeout(loadTimeout);
        };
    }, []);

    useEffect(() => {
        if (isLoaded && pcContainerRef.current) {
            const products = pcContainerRef.current.querySelectorAll(".product");
            VanillaTilt.init(products, {
                max: 25,
                speed: 400,
                glare: true,
                "max-glare": 0.1,
                axis: "x",
            });

            return () => {
                products.forEach(product => {
                    if (product.vanillaTilt) {
                        product.vanillaTilt.destroy();
                    }
                });
            };
        }
    }, [isLoaded]);

    const selectProduct = (product) => {
        navigate(`/pc?product=${product}`);
    };

    return (
        <main>
            <video id="background-video" className="intro" autoPlay loop muted>
                <source src={HomeVideo} type="video/mp4" />
            </video>
            <div className="text-wrapper">
                <p className="text">
                    Built For Gamers 
                    <br />
                    <span className="by">
                        By Gamers
                    </span>
                </p>
            </div>
            
            <div className="pc-container" id="pc-container" ref={pcContainerRef}>
            {Object.entries(products).map(([productKey, product]) => (
                    <div key={productKey} className={`background-${productKey.toLowerCase()}-image pc product`}>
                        <div className={`${productKey.toLowerCase()} pc-info`}>
                            <h3 className="pc-title">{product.name.toUpperCase()}</h3>
                            <div className='pc-icon-and-components'>
                                <img src={BeastClaw} alt="Claw drawing." />
                                <ul className='components-list'>
                                    {Object.entries(product.features).map(([key, value], index) => (
                                        <li key={index}>
                                            <h5 className='component-type'>{key}</h5>:
                                            <br />
                                            <p className='component-name'>{value}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <img className="img-pc" src={product.imageUrl1} alt={`${product.name} PC`} />
                            <div className="buy choose" onClick={() => selectProduct(product.name)}>BUY</div>
                        </div>
                    </div>
                ))}
            </div>
        
            <div className="follow">
                <p className="follow-text">FOLLOW THE <a className="follow-link" href="https://www.instagram.com/bldg_build/" target="_blank" rel="noopener noreferrer">@BLDG</a></p>
                <div ref={iconContainerRef} className="icon-container icon-follow-section-container hidden">
                    <a href="https://www.facebook.com/profile.php?id=61560511531799" className="facebookAccount fa-brands fa-facebook-f fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://x.com/BLDG_Tech" className="xAccount fa-brands fa-x-twitter fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://www.instagram.com/bldg_build/" className="instagramAccount fa-brands fa-instagram fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://www.tiktok.com/@bldgtech?lang=en" className="tiktokAccount fa-brands fa-tiktok fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                    <a href="https://www.youtube.com/channel/UCkdwly93IN-U34duTFW_ipA" className="youtubeAccount fa-brands fa-youtube fa-xl account-link" target="_blank" rel="noopener noreferrer"></a>
                </div>
            </div>
        </main>
    );
}