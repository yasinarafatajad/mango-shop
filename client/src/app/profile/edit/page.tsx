"use client";

import { useEffect, useState } from "react";
import { fetchAllCustomers } from "@/lib/api";
import { User as UserType } from "@/lib/type";
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
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would call an API to update the profile
    console.log("Saving profile changes...");
    router.back();
  };

  if (loading) return <div className="py-20 text-center text-primary-green font-semibold">লোড হচ্ছে...</div>;

  if (!user) return <div className="py-20 text-center">ব্যবহারকারী পাওয়া যায়নি।</div>;

  return (
    <div className="profile-container animate-in">
      <div className="edit-header">
        <button 
          onClick={() => router.back()} 
          className="back-btn"
        >
          <ChevronLeft size={20} />
        </button>
        <h1>প্রোফাইল এডিট</h1>
        <div style={{ width: '40px' }} />
      </div>

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
        <p className="avatar-edit-label">প্রোফাইল ছবি পরিবর্তন করুন</p>
      </div>

      <form onSubmit={handleSave} className="edit-form">
        <div className="form-group">
          <label className="form-label">পুরো নাম</label>
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
          <label className="form-label">ইমেইল ঠিকানা</label>
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
          <label className="form-label">ফোন নম্বর</label>
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
          <label className="form-label">ডেলিভারি ঠিকানা</label>
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
          পরিবর্তন সেভ করুন
        </button>
      </form>
    </div>
  );
}
