"use client";

import { mockUsers } from "@/lib/data";
import { 
  ChevronLeft, 
  Camera, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "../profile.css";

export default function EditProfilePage() {
  const user = mockUsers[1];
  const router = useRouter();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic would go here
    router.back();
  };

  return (
    <div className="profile-container animate-in">
      {/* Top Header */}
      <div className="edit-header">
        <button 
          onClick={() => router.back()} 
          className="back-btn"
        >
          <ChevronLeft size={20} />
        </button>
        <h1>Edit Profile</h1>
        <div style={{ width: '40px' }} /> {/* Spacer */}
      </div>

      {/* Avatar Edit */}
      <div className="avatar-edit-section">
        <div className="avatar-edit-wrapper">
          <div className="avatar-edit-img">
            <Image 
              src={user.image} 
              alt={user.name} 
              fill 
              className="object-cover"
            />
          </div>
          <button className="camera-btn">
            <Camera size={14} />
          </button>
        </div>
        <p className="avatar-edit-label">Change Profile Picture</p>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="edit-form">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div className="input-wrapper">
            <User className="input-icon" size={18} />
            <input 
              type="text" 
              defaultValue={user.name}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={18} />
            <input 
              type="email" 
              defaultValue={user.email}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <div className="input-wrapper">
            <Phone className="input-icon" size={18} />
            <input 
              type="tel" 
              defaultValue={user.phone}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Shipping Address</label>
          <div className="input-wrapper">
            <MapPin className="input-icon top" size={18} />
            <textarea 
              defaultValue={user.address}
              rows={3}
              className="form-input form-textarea"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="save-btn"
        >
          <Save size={20} />
          Save Changes
        </button>
      </form>
    </div>
  );
}

