import bannerImg from "@/assets/hero-section/hero-banner-bg.png";
import Image from "next/image";
import './hero.css';

;

export default function Hero() {
  return (
    <section className="hero-section">
      {/* Background */}
      <div className="hero-bg">
        <Image
          src={bannerImg}
          alt="Nature's Bounty Banner"
          fill
          priority
          className="hero-img"
        />

        <div className="hero-overlay" />
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-text">
          <h1></h1>

          <h2>সেরা আম সরাসরি বাগান থেকে!</h2>

          <p>এখনই অর্ডার করুন সেরা অফারে ।</p>
        </div>
      </div>
    </section>
  );
}