import React from 'react';
import { Route, Routes } from "react-router-dom";
import Cursor from "./Cursor.jsx";
import Navbar from "./NavBar.jsx";
import Menu from './Menu.jsx';
import Cart from "./Cart.jsx";
import Footer from "./Footer.jsx";

import AboutUs from "./pages/about/about.jsx";
import Home from "./pages/home/home.jsx";
import Support from "./pages/support/support.jsx";
import TrackOrder from "./pages/track_order/track_order.jsx";
import WhyTheBldg from "./pages/why_bldg/why_bldg.jsx";
import PrivacyPolicy from "./pages/privacy_policy/privacy_policy.jsx";
import RefundPolicy from "./pages/refund_policy/refund_policy.jsx";
import ShippingPolicy from "./pages/shipping_policy/shipping_policy.jsx";
import Reviews from "./pages/reviews/reviews.jsx";
import TermsAndConditions from "./pages/terms_and_conditions/terms_and_conditions.jsx";
import BldgUpgrader from "./pages/upgrader/upgrader.jsx";
import DreamPc from "./pages/personalized_build/personalized_build.jsx";
import Success from './pages/success/success.jsx';
import Cancel from './pages/cancel/cancel.jsx';
import PurchaseHistory from './pages/purchase_history/purchase_history.jsx';
import ShippingInformation from './pages/shipping_form/shipping_form.jsx';

import { preloadStripe } from './pages/shipping_form/stripe.js';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    preloadStripe();
  }, []);
  useEffect(() => {
    // Initial ping when app loads
    fetch('/api/ping');

    // Set up periodic pings
    const intervalId = setInterval(() => {
      fetch('/api/ping');
    }, 4 * 60 * 1000)}); // Ping every 4 minutes
  return (
    <>
      <Cursor />
      <Navbar />
      <Menu />
      <Cart />   
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Support" element={<Support />} />
          <Route path="/About Us" element={<AboutUs />} />
          <Route path="/pc" element={<DreamPc />} />
          <Route path="/Reviews" element={<Reviews />} />
          <Route path="/Why the BLDG" element={<WhyTheBldg />} />
          <Route path="/Track Order" element={<TrackOrder />} />
          <Route path="/BLDG Upgrader" element={<BldgUpgrader />} />
          <Route path="/Terms & Conditions" element={<TermsAndConditions />} />
          <Route path="/Privacy Policy" element={<PrivacyPolicy />} />
          <Route path="/Refund Policy" element={<RefundPolicy />} />
          <Route path="/Shipping Policy" element={<ShippingPolicy />} />
          <Route path="/Success" element={<Success />} />
          <Route path="/Cancel" element={<Cancel />} />
          <Route path="/Purchase History" element={<PurchaseHistory />} />
          <Route path="/Shipping Information" element={<ShippingInformation />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;