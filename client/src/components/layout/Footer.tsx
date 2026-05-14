import Link from "next/link";
import { Leaf, Bubbles  } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="desktop-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <Leaf className="footer-logo-icon" />
            <h2 className="footer-logo-text">MangoShop</h2>
          </Link>
          <p className="footer-desc">রাজশাহীর সুস্বাদু এবং তাজা আম সরাসরি আপনার দ্বারে।</p>
          <div className="footer-socials">
            <a href="#" className="social-icon"><Bubbles  size={20} /></a>
            {/* <a href="#" className="social-icon"><Twitter size={20} /></a> */}
            {/* <a href="#" className="social-icon"><Instagram size={20} /></a> */}
          </div>
        </div>
        
        <div className="footer-links">
          <h3>দ্রুত লিঙ্ক</h3>
          <ul>
            <li><Link href="/">হোম</Link></li>
            <li><Link href="/all-products">সব আম</Link></li>
            <li><Link href="/cart">কার্ট</Link></li>
            <li><Link href="/my-orders">আমার অর্ডার</Link></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h3>যোগাযোগ</h3>
          <p>Email: support@mangoshop.com</p>
          <p>Phone: +880 1234 567890</p>
          <p>Address: রাজশাহী, বাংলাদেশ</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MangoShop. All rights reserved.</p>
      </div>
    </footer>
  );
}
