"use client";

import { useEffect, useState } from "react";
import { fetchCustomerById, fetchAllCustomers } from "@/lib/api";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  ShoppingBag, 
  Heart, 
  LogOut,
  Edit2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import "./profile.css";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demonstration, fetching the first customer
    fetchAllCustomers()
      .then(customers => {
        if (customers.length > 0) {
          setUser(customers[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="py-20 text-center text-primary-green font-semibold">প্রোফাইল লোড হচ্ছে...</div>;

  if (!user) {
    return (
      <div className="py-20 text-center">
        <p>প্রোফাইল পাওয়া যায়নি।</p>
        <Link href="/" className="text-primary-green underline">হোমে ফিরে যান</Link>
      </div>
    );
  }

  return (
    <div className="profile-container animate-in">
      <div className="profile-header">
        <div className="profile-header-top">
          <h1>প্রোফাইল</h1>
          <Link href="/profile/edit" className="edit-icon-btn">
            <Edit2 size={20} />
          </Link>
        </div>

        <div className="user-info-main">
          <div className="avatar-wrapper">
            <Image 
              src={user.image} 
              alt={user.name} 
              fill 
              className="object-cover"
            />
          </div>
          <div className="user-name-role">
            <h2>{user.name}</h2>
            <p>
              <span className="role-tag">{user.role}</span> অ্যাকাউন্ট
            </p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-orders">
          <div className="stat-value">১২</div>
          <div className="stat-label">অর্ডার</div>
        </div>
        <div className="stat-card stat-wishlist">
          <div className="stat-value">৫</div>
          <div className="stat-label">উইশলিস্ট</div>
        </div>
      </div>

      <div className="info-section">
        <h3 className="section-title-small">ব্যক্তিগত তথ্য</h3>
        <div className="info-card">
          <div className="info-item">
            <div className="info-icon-box bg-orange-light">
              <Mail size={20} />
            </div>
            <div className="info-content">
              <p>ইমেইল</p>
              <p>{user.email}</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon-box bg-green-light">
              <Phone size={20} />
            </div>
            <div className="info-content">
              <p>ফোন</p>
              <p>{user.phone || 'N/A'}</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon-box bg-yellow-light">
              <MapPin size={20} />
            </div>
            <div className="info-content">
              <p>ঠিকানা</p>
              <p>{user.address || 'N/A'}</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon-box bg-blue-light">
              <Calendar size={20} />
            </div>
            <div className="info-content">
              <p>জয়েন করেছেন</p>
              <p>{user.joinDate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="logout-btn-container">
        <button className="logout-btn">
          <div className="logout-btn-left">
            <div className="logout-icon-box">
              <LogOut size={20} />
            </div>
            <span className="logout-text">লগআউট</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
