'use client';

import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    MapPin,
    CreditCard,
    Camera,
    Phone,
    User,
    Hash,
    CheckCircle2,
    Ticket,
    Truck,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createOrder, applyCoupon as applyCouponApi, fetchActiveDeliveryCharges, uploadImage } from '@/lib/api';
import { getCart } from '@/lib/storage';
import './Checkout.css';

export default function Checkout() {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isOrdered, setIsOrdered] = useState(false);
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    // Delivery charge logic
    const [deliveryCharges, setDeliveryCharges] = useState<any[]>([]);
    const [selectedChargeId, setSelectedChargeId] = useState<string>('');
    const [deliveryChargeAmount, setDeliveryChargeAmount] = useState(0);
    
    // Form fields
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [trxId, setTrxId] = useState('');
    const [senderNumber, setSenderNumber] = useState('');

    // Coupon logic
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponStatus, setCouponStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const paymentNumber = "01712-972683";

    useEffect(() => {
        setCartItems(getCart());
        
        fetchActiveDeliveryCharges()
            .then(charges => {
                if (charges && charges.length > 0) {
                    setDeliveryCharges(charges);
                    setSelectedChargeId(charges[0]._id);
                    setDeliveryChargeAmount(charges[0].charge);
                } else {
                    const fallback = [{ _id: 'fallback', name: 'Standard Delivery', charge: 50 }];
                    setDeliveryCharges(fallback);
                    setSelectedChargeId('fallback');
                    setDeliveryChargeAmount(50);
                }
            })
            .catch(err => {
                console.error("Error fetching delivery charges:", err);
                const fallback = [{ _id: 'fallback', name: 'Standard Delivery', charge: 50 }];
                setDeliveryCharges(fallback);
                setSelectedChargeId('fallback');
                setDeliveryChargeAmount(50);
            });
    }, []);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleDeliveryChargeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const chargeId = e.target.value;
        setSelectedChargeId(chargeId);
        const foundCharge = deliveryCharges.find(c => c._id === chargeId);
        if (foundCharge) {
            setDeliveryChargeAmount(foundCharge.charge);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(paymentNumber);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const applyCoupon = async () => {
        if (!couponCode) return;
        setError(null);
        setLoading(true);
        try {
            const data = await applyCouponApi(couponCode, subtotal);
            setDiscount(data.discount);
            setCouponStatus({ type: 'success', message: `${data.discount}৳ ডিসকাউন্ট সফলভাবে যুক্ত হয়েছে!` });
        } catch (err: any) {
            setDiscount(0);
            setCouponStatus({ type: 'error', message: err.message || 'সঠিক কুপন কোড দিন।' });
        } finally {
            setLoading(false);
        }
    };

    const paymentOptions = [
        { id: 'cod', name: 'Cash on Delivery', color: '#1B5E20' },
        { id: 'bkash', name: 'bKash', color: '#D12053' },
        { id: 'nagad', name: 'Nagad', color: '#F44336' },
    ];

    const total = subtotal + deliveryChargeAmount - discount;

    const handlePlaceOrder = async () => {
        setError(null);
        if (!fullName || !phone || !address) {
            setError('দয়া করে সব তথ্য পূরণ করুন।');
            return;
        }

        if (cartItems.length === 0) {
            setError('আপনার কার্ট খালি।');
            return;
        }

        if (paymentMethod !== 'cod') {
            if (!senderNumber) {
                setError('দয়া করে পেমেন্টকৃত নম্বরটি দিন।');
                return;
            }
            if (!trxId && !screenshot) {
                setError('দয়া করে ট্রানজেকশন আইডি অথবা পেমেন্ট স্ক্রিনশট দিন।');
                return;
            }
        }

        setLoading(true);
        try {
            let screenshotUrl = '';
            if (screenshot) {
                const uploadRes = await uploadImage(screenshot);
                screenshotUrl = uploadRes.url;
            }

            const orderItems = cartItems.map(p => ({
                product: p.id,
                name: p.nameBn,
                image: p.image,
                price: p.price,
                quantity: p.quantity
            }));

            const orderData = {
                items: orderItems,
                shippingAddress: {
                    fullName,
                    phone,
                    address,
                    city: 'Rajshahi'
                },
                paymentMethod: paymentMethod === 'cod' ? 'COD' : 
                               paymentMethod === 'bkash' ? 'Bkash' : 
                               paymentMethod === 'nagad' ? 'Nagad' : 'Card',
                itemsPrice: subtotal,
                shippingPrice: deliveryChargeAmount,
                totalPrice: total,
                discountPrice: discount,
                couponCode: couponCode,
                orderStatus: 'pending',
                isPaid: paymentMethod !== 'cod',
                senderNumber: senderNumber,
                trxId: trxId,
                paymentScreenshot: screenshotUrl
            };

            await createOrder(orderData);
            localStorage.removeItem('mango_shop_cart');
            window.dispatchEvent(new Event('cart-updated'));
            setIsOrdered(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'অর্ডার প্লেস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        } finally {
            setLoading(false);
        }
    };

    if (isOrdered) {
        return (
            <div className="checkout-page" style={{ textAlign: 'center', paddingTop: '60px' }}>
                <CheckCircle2 size={80} color="#1B5E20" style={{ margin: '0 auto 10px auto' }} />
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
            <div className="checkout-back">
                <Link href="/cart">
                    <ArrowLeft size={24} />
                </Link>
                <span>চেকআউট</span>
            </div>

            {error && (
                <div className="visual-error">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

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
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="আপনার নাম লিখুন" 
                            style={{ paddingLeft: '38px' }} 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">মোবাইল নম্বর</label>
                    <div style={{ position: 'relative' }}>
                        <Phone size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#999' }} />
                        <input 
                            type="tel" 
                            className="form-input" 
                            placeholder="০১৭XXXXXXXX" 
                            style={{ paddingLeft: '38px' }} 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">বিস্তারিত ঠিকানা</label>
                    <textarea
                        className="form-input"
                        placeholder="বাসা নম্বর, রোড নম্বর, এলাকা..."
                        style={{ minHeight: '80px', resize: 'none' }}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
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
                        <button
                            key={option.id}
                            type="button"
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
                        </button>
                    ))}
                </div>

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
                                <input 
                                    type="tel" 
                                    className="form-input" 
                                    placeholder="০১৭XXXXXXXX" 
                                    style={{ paddingLeft: '38px' }} 
                                    value={senderNumber}
                                    onChange={(e) => setSenderNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">ট্রানজেকশন আইডি (TrxID)</label>
                            <div style={{ position: 'relative' }}>
                                <Hash size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#999' }} />
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="8N7A6S5D4" 
                                    style={{ paddingLeft: '38px' }} 
                                    value={trxId}
                                    onChange={(e) => setTrxId(e.target.value)}
                                />
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

            {/* Delivery Charge Dropdown */}
            <div className="checkout-section">
                <h3 className="section-title">
                    <Truck size={18} />
                    ডেলিভারি চার্জ নির্বাচন করুন
                </h3>
                <div className="form-group">
                    <select 
                        className="form-input" 
                        value={selectedChargeId}
                        onChange={handleDeliveryChargeChange}
                        style={{ appearance: 'auto', paddingRight: '30px' }}
                    >
                        {deliveryCharges.map((charge) => (
                            <option key={charge._id} value={charge._id}>
                                {charge.name} - ৳{charge.charge}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Coupon Section */}
            <div className="checkout-section">
                <h3 className="section-title">
                    <Ticket size={18} />
                    প্রোমো কোড
                </h3>
                <div className="coupon-wrapper">
                    <input 
                        type="text" 
                        placeholder="কুপন কোড দিন" 
                        className="coupon-input"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button 
                        className="coupon-apply-btn" 
                        onClick={applyCoupon}
                        disabled={loading || !couponCode}
                    >
                        {loading ? 'প্রয়োগ হচ্ছে...' : 'প্রয়োগ করুন'}
                    </button>
                </div>
                {couponStatus && (
                    <span className={`coupon-status ${couponStatus.type}`}>
                        {couponStatus.message}
                    </span>
                )}
            </div>

            {/* Order Summary */}
            <div className="checkout-section">
                <h3 className="section-title">অর্ডার সামারি</h3>
                <div className="order-summary-mini">
                    <span>সাবটোটাল</span>
                    <span>৳{subtotal}</span>
                </div>
                <div className="order-summary-mini">
                    <span>ডেলিভারি চার্জ</span>
                    <span>৳{deliveryChargeAmount}</span>
                </div>
                {discount > 0 && (
                    <div className="order-summary-mini discount-row">
                        <span>ডিসকাউন্ট</span>
                        <span>-৳{discount}</span>
                    </div>
                )}
                <div className="order-total-mini">
                    <span>সর্বমোট</span>
                    <span style={{ color: 'var(--primary-green)' }}>৳{total}</span>
                </div>
            </div>

            <button 
                className={`place-order-btn ${loading || cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                onClick={handlePlaceOrder}
                disabled={loading || cartItems.length === 0}
            >
                {loading ? 'অর্ডার হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
            </button>
        </div>
    );
}