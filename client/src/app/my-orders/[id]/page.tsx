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
  MessageCircle,
  Hash,
  Phone,
  X
} from 'lucide-react';
import Link from 'next/link';
import { fetchOrderById } from '@/lib/api';
import './OrderDetails.css';

export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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

  // Tracking status logic
  const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered'];
  const steps = [
    { label: 'অর্ডার প্লেস করা হয়েছে', date: order.date, status: 'pending', icon: <Clock size={14} /> },
    { label: 'প্রক্রিয়াজাতকরণ চলছে', date: order.status === 'confirmed' || statusOrder.indexOf(order.status) > 1 ? 'প্রক্রিয়া সম্পন্ন' : 'অপেক্ষমান', status: 'confirmed', icon: <Package size={14} /> },
    { label: 'ডেলিভারির জন্য পাঠানো হয়েছে', date: order.status === 'shipped' || order.status === 'delivered' ? 'পাঠানো হয়েছে' : '-', status: 'shipped', icon: <Truck size={14} /> },
    { label: 'ডেলিভারি সম্পন্ন', date: order.status === 'delivered' ? 'সম্পন্ন' : '-', status: 'delivered', icon: <CheckCircle2 size={14} /> },
  ];

  const getStepStatus = (stepStatus: string) => {
    const currentIdx = statusOrder.indexOf(order.orderStatus || order.status || 'pending');
    const stepIdx = statusOrder.indexOf(stepStatus);
    return stepIdx <= currentIdx && order.status !== 'cancelled';
  };

  const subtotal = order.itemsPrice || order.items?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) || 0;
  const shippingPrice = order.shippingPrice || 0;
  const discountPrice = order.discountPrice || 0;

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
          <span>অর্ডার ট্র্যাকিং ({order.status === 'cancelled' ? 'বাতিল করা হয়েছে' : 'অবস্থা'})</span>
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
          <div style={{ fontWeight: '700', color: '#1A1A1A' }}>{order.shippingAddress?.fullName}</div>
          <div>{order.shippingAddress?.phone}</div>
          <div>{order.shippingAddress?.address}, {order.shippingAddress?.city}</div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="order-detail-card">
        <div className="card-title-row">
          <CreditCard size={18} />
          <span>পেমেন্ট তথ্য</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
          <div className="flex justify-between">
            <span style={{ color: '#555' }}>পদ্ধতি:</span>
            <span style={{ fontWeight: '700' }}>{order.paymentMethod}</span>
          </div>
          {order.trxId && (
            <div className="flex justify-between">
              <span style={{ color: '#555' }}>TrxID:</span>
              <span style={{ fontWeight: '700' }}>{order.trxId}</span>
            </div>
          )}
          {order.senderNumber && (
            <div className="flex justify-between">
              <span style={{ color: '#555' }}>নম্বর:</span>
              <span style={{ fontWeight: '700' }}>{order.senderNumber}</span>
            </div>
          )}
          {order.paymentScreenshot && (
            <div className="payment-screenshot-section">
              <span style={{ color: '#555', fontSize: '14px', display: 'block', marginBottom: '8px' }}>পেমেন্ট স্ক্রিনশট:</span>
              <div className="payment-screenshot-preview" onClick={() => setShowModal(true)}>
                <img src={order.paymentScreenshot} alt="Payment Screenshot" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ordered Items */}
      <div className="order-detail-card">
        <div className="card-title-row">
          <Package size={18} />
          <span>অর্ডারকৃত পণ্যসমূহ</span>
        </div>
        <div className="details-items-list">
          {order.items?.map((item: any, idx: number) => (
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
            <span>৳{subtotal}</span>
          </div>
          <div className="summary-item">
            <span>ডেলিভারি চার্জ</span>
            <span>৳{shippingPrice}</span>
          </div>
          {discountPrice > 0 && (
            <div className="summary-item" style={{ color: '#ff4d4d', fontWeight: '600' }}>
              <span>ডিসকাউন্ট</span>
              <span>-৳{discountPrice}</span>
            </div>
          )}
          <div className="summary-item total">
            <span>সর্বমোট</span>
            <span style={{ color: 'var(--primary-green)' }}>৳{order.totalPrice || order.total}</span>
          </div>
        </div>
      </div>

      {/* Support Action */}
      <Link href="https://wa.me/8801712972683" target="_blank" className="contact-support">
        <MessageCircle size={20} />
        সাপোর্টের জন্য যোগাযোগ করুন
      </Link>

      {/* Image Modal */}
      {showModal && (
        <div className="image-modal-backdrop" onClick={() => setShowModal(false)}>
          <button className="absolute top-6 right-6 text-white hover:scale-110 transition-transform">
            <X size={32} />
          </button>
          <img src={order.paymentScreenshot} alt="Enlarged Payment Screenshot" className="modal-content" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
