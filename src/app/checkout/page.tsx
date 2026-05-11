'use client';

import { useState } from 'react';
import {
    ArrowLeft,
    MapPin,
    CreditCard,
    Camera,
    Phone,
    User,
    Hash,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import './Checkout.css';

export default function Checkout() {
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isOrdered, setIsOrdered] = useState(false);
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const paymentNumber = "01712-972683";

    const handleCopy = () => {
        navigator.clipboard.writeText(paymentNumber);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const paymentOptions = [
        { id: 'cod', name: 'Cash on Delivery', color: '#1B5E20' },
        { id: 'bkash', name: 'bKash', color: '#D12053' },
        { id: 'nagad', name: 'Nagad', color: '#F44336' },
        { id: 'rocket', name: 'Rocket', color: '#8E24AA' },
    ];

    const handlePlaceOrder = () => {
        // Simple mock success state
        setIsOrdered(true);
    };

    if (isOrdered) {
        return (
            <div className="checkout-page" style={{ textAlign: 'center', paddingTop: '60px' }}>
                <CheckCircle2 size={80} color="#1B5E20" style={{ marginBottom: '20px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>অর্ডার সফল হয়েছে!</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>আপনার অর্ডারটি গ্রহণ করা হয়েছে। শীঘ্রই আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।</p>
                <Link href="/" className="place-order-btn" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '16px 40px' }}>
                    হোম পেজে ফিরে যান
                </Link>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="cart-title">
                <Link href="/cart">
                    <ArrowLeft size={24} />
                </Link>
                <span>চেকআউট</span>
            </div>

            {/* Delivery Address */}
            <div className="checkout-section">
                <h3 className="section-title">
                    <MapPin size={18} style={{ color: 'var(--primary-orange)' }} />
                    ডেলিভারি ঠিকানা
                </h3>

                <div className="form-group">
                    <label className="form-label">পুরো নাম</label>
                    <div style={{ position: 'relative' }}>
                        <User size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#999' }} />
                        <input type="text" className="form-input" placeholder="আপনার নাম লিখুন" style={{ paddingLeft: '38px' }} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">মোবাইল নম্বর</label>
                    <div style={{ position: 'relative' }}>
                        <Phone size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#999' }} />
                        <input type="tel" className="form-input" placeholder="০১৭XXXXXXXX" style={{ paddingLeft: '38px' }} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">বিস্তারিত ঠিকানা</label>
                    <textarea
                        className="form-input"
                        placeholder="বাসা নম্বর, রোড নম্বর, এলাকা..."
                        style={{ minHeight: '80px', resize: 'none' }}
                    ></textarea>
                </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
                <h3 className="section-title">
                    <CreditCard size={18} />
                    পেমেন্ট পদ্ধতি
                </h3>

                <div className="payment-grid">
                    {paymentOptions.map((option) => (
                        <div
                            key={option.id}
                            className={`payment-card ${paymentMethod === option.id ? 'active' : ''}`}
                            onClick={() => setPaymentMethod(option.id)}
                        >
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '8px',
                                    background: option.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: '900',
                                    fontSize: '10px'
                                }}
                            >
                                {option.id.toUpperCase()}
                            </div>
                            <span className="payment-name">{option.name}</span>
                        </div>
                    ))}
                </div>

                {/* Conditional Mobile Banking Details */}
                {paymentMethod !== 'cod' && (
                    <div className="mobile-banking-form">
                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px', background: '#f8f8f8', padding: '10px', borderRadius: '8px', borderLeft: `4px solid ${paymentOptions.find(o => o.id === paymentMethod)?.color}` }}>
                            আমাদের <b>{paymentNumber}</b> নম্বরে সেন্ড মানি করে নিচের তথ্যগুলো পূরণ করুন।
                            <br />
                            <button
                                onClick={handleCopy}
                                style={{
                                    padding: '8px 20px',
                                    background: isCopied ? '#37883aff' : 'var(--primary-green)',
                                    color: 'white',
                                    borderRadius: '4px',
                                    fontWeight: '700',
                                    border: 'none',
                                    fontSize: '12px',
                                    marginTop: '10px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(27, 94, 32, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                {isCopied ? 'কপি হয়েছে!' : 'কপি করুন'}
                            </button>
                        </p>


                        <div className="form-group">
                            <label className="form-label">যে নম্বর থেকে টাকা পাঠিয়েছেন</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#999' }} />
                                <input type="tel" className="form-input" placeholder="০১৭XXXXXXXX" style={{ paddingLeft: '38px' }} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">ট্রানজেকশন আইডি (TrxID)</label>
                            <div style={{ position: 'relative' }}>
                                <Hash size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#999' }} />
                                <input type="text" className="form-input" placeholder="8N7A6S5D4" style={{ paddingLeft: '38px' }} />
                            </div>
                        </div>

                        <div className="upload-box">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                            />
                            {screenshot ? (
                                <div className="file-preview">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>{screenshot.name}</span>
                                    </div>
                                    <img
                                        src={URL.createObjectURL(screenshot)}
                                        alt="Preview"
                                        className="screenshot-preview"
                                    />
                                </div>
                            ) : (
                                <>
                                    <Camera size={24} className="upload-icon" />
                                    <p>পেমেন্ট স্ক্রিনশট আপলোড করুন (ঐচ্ছিক)</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Order Summary */}
            <div className="checkout-section">
                <h3 className="section-title">অর্ডার সামারি</h3>
                <div className="order-summary-mini">
                    <span>সাবটোটাল</span>
                    <span>৳৭৯০</span>
                </div>
                <div className="order-summary-mini">
                    <span>ডেলিভারি চার্জ</span>
                    <span>৳৫০</span>
                </div>
                <div className="order-total-mini">
                    <span>সর্বমোট</span>
                    <span style={{ color: 'var(--primary-green)' }}>৳৮৪০</span>
                </div>
            </div>

            <button className="place-order-btn" onClick={handlePlaceOrder}>
                অর্ডার কনফার্ম করুন
            </button>
        </div>
    );
}