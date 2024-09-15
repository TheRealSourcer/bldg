import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import HomeVideo from '/Home-Video.mp4';
import VanillaTilt from 'vanilla-tilt';

import Smoother from '../../assets/smoother/smoother1.jpg';
import Beast from '../../assets/beast/beast1.jpg';
import Terminator from '../../assets/terminator/terminator1.jpg';
import Spaceship from '../../assets/spaceship/spaceship1.jpg';

import BeastClaw from '../../assets/beast/beastIco.png';

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
                <div className="background-smoother-image pc product">
                    <div className="smoother pc-info">
                        <h3 className="pc-title">SMOOTHER</h3>
                        <div className='pc-component'>
                            <h4>Graphics card:</h4>
                            <p></p>
                        </div>
                        <div className='pc-component'>
                            <h4>Processor:</h4>
                            <p></p>
                        </div>
                        <div className='pc-component'>
                            <h4>Storage:</h4>
                            <p></p>
                        </div>
                        <div className='pc-component'>
                            <h4>Ram:</h4>
                            <p></p>
                        </div>
                        <img className="img-pc" src={Smoother} alt="Smoother PC" />
                        <div className="buy choose" onClick={() => selectProduct('Smoother')}>BUY</div>
                    </div>
                </div>
                
                <div className="background-beast-image pc product">
                    <div className="beast pc-info">
                        <h3 className="pc-title">BEAST</h3>
                        <div className='pc-icon-and-components'>
                            <img src={BeastClaw} alt="Claw drawing." />
                            <div className='pc-component'>
                            <h4>Graphics card:</h4>
                            <p></p>
                        </div>
                        <div className='pc-component'>
                            <h4>Processor:</h4>
                            <p></p>
                        </div>
                        <div className='pc-component'>
                            <h4>Storage:</h4>
                            <p></p>
                        </div>
                        <div className='pc-component'>
                            <h4>Ram:</h4>
                            <p></p>
                        </div>
                        </div>
                        <img className="img-pc" src={Beast} alt="Beast PC" />
                        <div className="buy choose" onClick={() => selectProduct('Beast')}>BUY</div>
                    </div>
                </div>
        
                <div className="background-terminator-image pc product">
                    <div className="terminator pc-info">
                        <h3 className="pc-title">TERMINATOR</h3>
                            <div className='pc-component'>
                                <h4>Graphics card:</h4>
                                <p></p>
                            </div>
                            <div className='pc-component'>
                                <h4>Processor:</h4>
                                <p></p>
                            </div>
                            <div className='pc-component'>
                                <h4>Storage:</h4>
                                <p></p>
                            </div>
                            <div className='pc-component'>
                                <h4>Ram:</h4>
                                <p></p>
                            </div>
                        <img className="img-pc" src={Terminator} alt="Terminator PC" />
                        <div className="buy choose" onClick={() => selectProduct('Terminator')}>BUY</div>
                    </div>
                </div>
                
                <div className="background-spaceship-image pc product">
                    <div className="spaceship pc-info">
                        <h3 className="pc-title">SPACESHIP</h3>
                            <div className='pc-component'>
                                <h4>Graphics card:</h4>
                                <p></p>
                            </div>
                            <div className='pc-component'>
                                <h4>Processor:</h4>
                                <p></p>
                            </div>
                            <div className='pc-component'>
                                <h4>Storage:</h4>
                                <p></p>
                            </div>
                            <div className='pc-component'>
                                <h4>Ram:</h4>
                                <p></p>
                            </div>
                        <img className="img-pc" src={Spaceship} alt="Spaceship PC" />
                        <div className="buy choose" onClick={() => selectProduct('Spaceship')}>BUY</div>
                    </div>
                </div>
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