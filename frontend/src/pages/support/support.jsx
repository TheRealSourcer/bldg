import { useState, useEffect } from "react";

// --- Asset Imports (Preserved) ---
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

// --- Data ---
const products = {
  Smoother: {
    id: "1",
    name: "Smoother",
    description:
      "Unleash Your Gaming Potential Without Breaking the Bank! <br>Introducing our latest budget-friendly gaming PC, designed for gamers who demand performance without the hefty price tag.",
    price: 649.99,
    components: {
      Processor: "AMD Ryzen 5 5500 6-Core, 12-Thread",
      Memory: "TEAMGROUP T-Force Vulcan Z DDR4 DRAM 16GB Kit (2x8GB) 3200MHz",
      Storage: "MSI SPATIUM M450 M.2 2280 500GB PCI-Express  4.0",
      "Graphics Card": "ASRock Phantom RX 6500 XT ",
      Motherboard: "ASUS TUF Gaming A520M-PLUS (WiFi)",
      "Processor Cooler": "AMD Wraith Stealth Cooler",
      Case: "Montech AIR 100 ARGB MICRO-ATX",
      "Power Supply": "CORSAIR CX550 80 Plus Bronze 550 Watt Non Modular",
    },
    imageUrl1: SmootherImage1,
    imageUrl2: SmootherImage2,
    imageUrl3: SmootherImage3,
    imageUrl4: SmootherImage4,
    icon: SmootherIcon,
  },
  Beast: {
    id: "2",
    name: "Beast",
    description:
      "Elevate Your Gaming Experience with Our Next-Level Gaming PC! <br>Step up your game with our new gaming PC, crafted for gamers who seek a perfect balance of performance, quality, and affordability.",
    price: 999.99,
    components: {
      Processor: "AMD Ryzen 5 7600X 6-Core, 12-Thread ",
      Memory: "TEAMGROUP T-Force Vulcan Z DDR4 32GB Kit (2x16GB) 3200MHz",
      Storage: "KLEVV CRAS C910 1TB 5000MB/s",
      "Graphics Card": "ASUS Dual GeForce RTX™ 4060 OC ",
      Motherboard: "MSI PRO B650-S WiFi",
      "Processor Cooler":
        "Cooler Master Hyper 212 120 Edge PWM Fan, 4 Copper Heat Pipes",
      Case: "Cooler Master MasterCase H500 ARGB",
      "Power Supply":
        "AGV Series 650W Power Supply, 80 Plus Bronze Certified Non Modular",
    },
    imageUrl1: BeastImage1,
    imageUrl2: BeastImage2,
    imageUrl3: BeastImage3,
    imageUrl4: BeastImage4,
    icon: BeastIcon,
  },
  Terminator: {
    id: "3",
    name: "Terminator",
    description:
      "Enhance Your Gaming Experience with Our Advanced Gaming PC! <br>Take your gaming to new heights with our advanced gaming PC, designed for enthusiasts who seek impressive performance and cutting-edge technology.",
    price: 1599.99,
    components: {
      Processor: "AMD Ryzen 7 7800X3D 8-Core, 16-Thread",
      Memory: "TEAMGROUP T-Force Delta RGB DDR4 32GB (2x16GB) 3600MHz",
      Storage: "118 WD_BLACK 2TB 5150 MB/s",
      "Graphics Card": "RX 7800XT XFX Speedster SWFT210 Radeon 16GB",
      Motherboard: "ASUS TUF Gaming A620M-PLUS(WiFi)",
      "Processor Cooler": "ID-COOLING SE-225-XT 5 Heatpipes 2x120mm 35",
      Case: "Cooler Master MasterCase H500 ARGB",
      "Power Supply": "Thermaltake GF1 ATX 750W Fully Modular",
    },
    imageUrl1: TerminatorImage1,
    imageUrl2: TerminatorImage2,
    imageUrl3: TerminatorImage3,
    imageUrl4: TerminatorImage4,
    icon: TerminatorIcon,
  },
  Spaceship: {
    id: "4",
    name: "Spaceship",
    description:
      "Command the Game with Our Ultimate Gaming PC! <br>Introducing the pinnacle of gaming technology: our Ultimate Gaming PC. Designed for the most demanding gamers and tech enthusiasts.",
    price: 2599.99,
    components: {
      Processor: "AMD Ryzen 7 7800X3D 8-Core, 16-Thread",
      Memory:
        "G.SKILL Trident Z5 RGB Series (Intel XMP 3.0) DDR5 RAM 32GB (2x16GB) 7200MT/s",
      Storage: "Acer Predator GM7000 4TB M.2 7400MB/s",
      "Graphics Card": "RX 7900XTX XFX Speedster MERC310 AMD Radeon 24GB",
      Motherboard: "ASUS ROG Strix B650-A Gaming WiFi 6E",
      "Processor Cooler": "NZXT Kraken Liquid Cooling 240mm",
      Case: "CORSAIR iCUE 4000X RGB",
      "Power Supply":
        "CORSAIR RM850x - 850w - Fully Modular ATX Power Supply - 80 PLUS Gold - Low-Noise Fan - Zero RPM",
    },
    imageUrl1: SpaceshipImage1,
    imageUrl2: SpaceshipImage2,
    imageUrl3: SpaceshipImage3,
    imageUrl4: SpaceshipImage4,
    icon: SpaceshipIcon,
  },
};

export default function Support() {
  const [searchTerm, setSearchTerm] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Animation Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    document
      .querySelectorAll(".fade-in-up")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredProducts = Object.values(products).filter((product) =>
    product.name.toLowerCase().includes(searchTerm),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTrackingResult(null);

    const trackingNumber = document.getElementById("orderNumber").value.trim();

    try {
      const response = await fetch("https://server-pc.onrender.com/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackingNumber }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tracking information");
      }

      const data = await response.json();

      const trackResult =
        data?.output?.completeTrackResults?.[0]?.trackResults?.[0];

      const status =
        trackResult?.latestStatusDetail?.description || "Status not available";
      const estimatedDelivery =
        trackResult?.dateAndTimes?.find((d) => d.type === "ESTIMATED_DELIVERY")
          ?.dateTime || "No estimated delivery date available";

      setTrackingResult({
        status,
        estimatedDeliveryDate: estimatedDelivery,
      });
    } catch (err) {
      setError("Error fetching tracking information. Please try again.");
      console.error("Tracking error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="support-main">
      {/* Animated Background Grid */}
      <div className="bg-grid"></div>

      {/* Hero / Search Section */}
      <header className="support-header">
        <div className="container fade-in-up">
          <h1 className="support-title">Support Center</h1>
          <p className="support-text">
            Get help that fits your needs. Find products, track orders, and get
            support.
          </p>

          <form className="search-form">
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search for a PC build (e.g., Smoother, Beast)..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </form>
        </div>
      </header>

      {/* Products Section */}
      <section className="container products-section">
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <p className="no-results">
              No products found matching &quot;{searchTerm}&quot;.
            </p>
          ) : (
            filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="product-card fade-in-up"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div
                  className="support-product-image"
                  style={{ backgroundImage: `url(${product.imageUrl1})` }}
                ></div>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p
                    className="product-desc"
                    dangerouslySetInnerHTML={{
                      __html: product.description.split("<br>")[0],
                    }}
                  ></p>

                  <div className="product-links">
                    <a
                      href="mailto:bldgtechnolgics@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Contact Us
                    </a>
                    <a
                      href="https://www.rednightconsulting.com/11-common-computer-issues-fix/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      Solutions
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="divider"></div>

      {/* Tracking Section */}
      <section className="container tracking-section fade-in-up">
        <h1 className="tracking-title">Can&apos;t wait? Track your order.</h1>
        <form className="tracking-form" onSubmit={handleSubmit}>
          <div className="tracking-input-wrapper">
            <input
              type="text"
              id="orderNumber"
              placeholder="Enter tracking number"
              required
            />
            <button type="submit" className="track-btn" disabled={isLoading}>
              {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <span>
                  Track <i className="fa-solid fa-truck-fast"></i>
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="tracking-result">
          {error && (
            <div className="error-card">
              <i className="fa-solid fa-circle-exclamation"></i>
              <p>{error}</p>
            </div>
          )}
          {trackingResult && (
            <div className="success-card">
              <h2>
                <i className="fa-solid fa-box-open"></i> Tracking Information
              </h2>
              <p>
                <strong>Status:</strong> {trackingResult.status}
              </p>
              <p>
                <strong>Estimated Delivery:</strong>{" "}
                {trackingResult.estimatedDeliveryDate}
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="divider"></div>

      {/* Contact Section */}
      <section className="container contact-section fade-in-up">
        <div className="contact-header">
          <h2 className="contact-section-title">Any questions?</h2>
          <p className="contact-section-text">
            Feel free to email us at&nbsp;
            <a
              href="mailto:bldgtechnolgics@gmail.com"
              target="_blank"
              className="contact-link"
            >
              bldgtechnolgics@gmail.com
            </a>
            &nbsp;or contact us by&nbsp;
            <a href="tel:+19195203105" target="_blank" className="contact-link">
              phone.
            </a>
          </p>

          <div className="support-social-icons">
            <a
              href="https://www.facebook.com/profile.php?id=61560511531799"
              className="support-social-icon support-facebookAccount"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a
              href="https://x.com/BLDG_Tech"
              className="support-social-icon support-xAccount"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a
              href="https://www.instagram.com/bldg_build/"
              className="support-social-icon support-instagramAccount"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a
              href="https://www.tiktok.com/@bldgtech?lang=en"
              className="support-social-icon support-tiktokAccount"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-tiktok"></i>
            </a>
            <a
              href="https://www.youtube.com/channel/UCkdwly93IN-U34duTFW_ipA"
              className="support-social-icon support-youtubeAccount"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>

        <div className="info-cards-grid">
          {/* Email Card */}
          <div className="info-card">
            <i className="fa-solid fa-envelope info-card-icon"></i>
            <div className="info-card-body">
              <h3>Email</h3>
              <p>
                If you have a problem and need assistance, consider sending us
                an email.
              </p>
            </div>
            <a
              className="info-card-button btn-primary"
              target="_blank"
              href="mailto: bldgtechnologics@gmail.com"
            >
              Email Us
            </a>
          </div>

          {/* Comments Card */}
          <div className="info-card">
            <i className="fa-solid fa-comment info-card-icon"></i>
            <div className="info-card-body">
              <h3>Comments</h3>
              <p>
                Less formal recommendations? Get a reply from us by reaching us
                through social media.
              </p>
            </div>
            <a
              className="info-card-button btn-outline"
              href="https://www.instagram.com/bldg_build/"
            >
              Comments
            </a>
          </div>

          {/* Reviews Card */}
          <div className="info-card">
            <i className="fa-solid fa-star info-card-icon"></i>
            <div className="info-card-body">
              <h3>Reviews</h3>
              <p>
                Get the answers you are looking for by leaving a review on our
                site.
              </p>
            </div>
            <a className="info-card-button btn-outline" href="/Reviews">
              Reviews
            </a>
          </div>

          {/* Phone Card */}
          <div className="info-card">
            <i className="fa-solid fa-phone info-card-icon"></i>
            <div className="info-card-body">
              <h3>Phone</h3>
              <p>
                Call a computer technician to help diagnose a problem or answer
                questions.
              </p>
            </div>
            <a
              href="tel:+19193494727"
              target="_blank"
              className="info-card-button btn-primary"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
