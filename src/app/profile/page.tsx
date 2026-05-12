"use client";

import { mockUsers } from "@/lib/data";
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
  const user = mockUsers[1]; // Using the customer user

  return (
    <div className="profile-container animate-in">
      {/* Header Profile Section */}
      <div className="profile-header">
        <div className="profile-header-top">
          <h1>Profile</h1>
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
              <span className="role-tag">{user.role}</span> Account
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card stat-orders">
          <div className="stat-value">12</div>
          <div className="stat-label">Orders</div>
        </div>
        <div className="stat-card stat-wishlist">
          <div className="stat-value">5</div>
          <div className="stat-label">Wishlist</div>
        </div>
      </div>

      {/* Info Section */}
      <div className="info-section">
        <h3 className="section-title-small">Personal Information</h3>
        <div className="info-card">
          <div className="info-item">
            <div className="info-icon-box bg-orange-light">
              <Mail size={20} />
            </div>
            <div className="info-content">
              <p>Email</p>
              <p>{user.email}</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon-box bg-green-light">
              <Phone size={20} />
            </div>
            <div className="info-content">
              <p>Phone</p>
              <p>{user.phone}</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon-box bg-yellow-light">
              <MapPin size={20} />
            </div>
            <div className="info-content">
              <p>Address</p>
              <p>{user.address}</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon-box bg-blue-light">
              <Calendar size={20} />
            </div>
            <div className="info-content">
              <p>Joined</p>
              <p>{user.joinDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="logout-btn-container">
        <button className="logout-btn">
          <div className="logout-btn-left">
            <div className="logout-icon-box">
              <LogOut size={20} />
            </div>
            <span className="logout-text">Logout</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}

