'use client';

import { use, useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { fetchOrderById } from '@/lib/api';
import { Order } from '@/lib/type';
import './OrderDetails.css';

export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderById(id)
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="details-header-row">
          <Link href="/my-orders">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="orders-title">লোড হচ্ছে...</h1>
        </div>
        <div className="py-20 text-center text-primary-green font-semibold">অর্ডার বিস্তারিত লোড হচ্ছে...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h2 className="text-xl font-bold mb-4">অর্ডারটি পাওয়া যায়নি</h2>
        <Link href="/my-orders" className="px-6 py-2 bg-primary-green text-white rounded-full">অর্ডার তালিকায় ফিরে যান</Link>
      </div>
    );
  }

  const steps = [
    { label: 'অর্ডার প্লেস করা হয়েছে', date: order.date, status: 'pending', icon: <Clock size={14} /> },
    { label: 'প্রক্রিয়াজাতকরণ চলছে', date: 'প্রক্রিয়াধীন', status: 'processing', icon: <Package size={14} /> },
    { label: 'ডেলিভারির জন্য পাঠানো হয়েছে', date: '-', status: 'shipped', icon: <Truck size={14} /> },
    { label: 'ডেলিভারি সম্পন্ন', date: '-', status: 'delivered', icon: <CheckCircle2 size={14} /> },
  ];

  const getStepStatus = (stepStatus: string) => {
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIdx = statusOrder.indexOf(order.status);
    const stepIdx = statusOrder.indexOf(stepStatus);
    return stepIdx <= currentIdx;
  };

  return (
    <div className="order-details-page">
      <div className="details-header-row">
        <Link href="/my-orders">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="orders-title">অর্ডার বিস্তারিত</h1>
      </div>

      {/* Order Status Tracker */}
      <div className="order-detail-card">
        <div className="card-title-row">
          <Clock size={18} />
          <span>অর্ডার ট্র্যাকিং</span>
        </div>
        <div className="status-tracker">
          {steps.map((step, idx) => (
            <div key={idx} className={`status-step ${getStepStatus(step.status) ? 'active' : ''}`}>
              <div className="step-circle">
                {step.icon}
              </div>
              <div className="step-info">
                <div className="step-title">{step.label}</div>
                <div className="step-date">{step.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="order-detail-card">
        <div className="card-title-row">
          <MapPin size={18} />
          <span>ডেলিভারি তথ্য</span>
        </div>
        <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
          <div style={{ fontWeight: '700', color: '#1A1A1A' }}>ব্যবহারকারী</div>
          <div>রাজশাহী, বাংলাদেশ</div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="order-detail-card">
        <div className="card-title-row">
          <CreditCard size={18} />
          <span>পেমেন্ট তথ্য</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#555' }}>পদ্ধতি:</span>
          <span style={{ fontWeight: '700' }}>বিকাশ (সেন্ড মানি)</span>
        </div>
      </div>

      {/* Ordered Items */}
      <div className="order-detail-card">
        <div className="card-title-row">
          <Package size={18} />
          <span>অর্ডারকৃত পণ্যসমূহ</span>
        </div>
        <div className="details-items-list">
          {order.items.map((item, idx) => (
            <div key={idx} className="detail-item-row">
              <img src={item.image} alt={item.name} className="detail-item-img" />
              <div className="detail-item-info">
                <div className="detail-item-name">{item.name}</div>
                <div className="detail-item-price">৳{item.price} x {item.quantity || 1}</div>
              </div>
              <div style={{ fontWeight: '700' }}>৳{item.price * (item.quantity || 1)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bill Summary */}
      <div className="order-detail-card">
        <div className="details-summary-table">
          <div className="summary-item">
            <span>সাবটোটাল</span>
            <span>৳{order.total - 50}</span>
          </div>
          <div className="summary-item">
            <span>ডেলিভারি চার্জ</span>
            <span>৳৫০</span>
          </div>
          <div className="summary-item total">
            <span>সর্বমোট</span>
            <span style={{ color: 'var(--primary-green)' }}>৳{order.total}</span>
          </div>
        </div>
      </div>

      {/* Support Action */}
      <Link href="https://wa.me/8801712972683" target="_blank" className="contact-support">
        <MessageCircle size={20} />
        সাপোর্টের জন্য যোগাযোগ করুন
      </Link>
    </div>
  );
}
