'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Package, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { fetchOrders } from '@/lib/api';
import { Order } from '@/lib/type';
import './MyOrders.css';

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchOrders()
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'অপেক্ষমান';
      case 'processing': return 'প্রক্রিয়াজাতকরণ';
      case 'delivered': return 'ডেলিভারি সম্পন্ন';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={14} />;
      case 'processing': return <Package size={14} />;
      case 'delivered': return <CheckCircle2 size={14} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <h1 className="orders-title">আমার অর্ডারসমূহ</h1>
        </div>
        <div className="py-20 text-center text-primary-green font-semibold">অর্ডারগুলো লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="orders-title">আমার অর্ডারসমূহ</h1>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-orders-icon">📦</div>
          <h3>কোন অর্ডার পাওয়া যায়নি</h3>
          <p>আপনি এখনও কোন অর্ডার করেননি।</p>
          <Link href="/" className="place-order-btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '20px' }}>
            কেনাকাটা শুরু করুন
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link href={`/my-orders/${order.id}`} key={order.id} className="order-card">
              <div className="order-top">
                <div>
                  <div className="order-id">অর্ডার #{order.id.slice(-6)}</div>
                  <div className="order-date">{order.date}</div>
                </div>
                <div className={`order-status status-${order.status} flex items-center gap-1`}>
                  {getStatusIcon(order.status)}
                  {getStatusLabel(order.status)}
                </div>
              </div>

              <div className="order-content">
                <div className="order-thumbs">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <img key={idx} src={item.image} alt={item.name} className="order-thumb" />
                  ))}
                  {order.items.length > 3 && (
                    <div className="order-thumb flex items-center justify-center bg-gray-100 text-xs font-bold">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                <div className="order-info">
                  <div className="order-items-count">{order.items.length}টি আইটেম</div>
                  <div className="order-total">৳{order.total}</div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}