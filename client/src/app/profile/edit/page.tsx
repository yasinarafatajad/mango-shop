"use client";

import { useEffect, useState } from "react";
import { updateCustomer } from "@/lib/api";
import { UserType } from "@/lib/type";
import { 
  ChevronLeft, 
  Camera, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "../profile.css";

export default function EditProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('mango_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;

    try {
      const response = await updateCustomer(user.id || (user as any)._id, {
        fullName,
        email,
        phone,
        address
      });
      
      if (response.success) {
        localStorage.setItem('mango_user', JSON.stringify(response.customer));
        router.push('/profile');
      }
    } catch (err) {
      console.error(err);
      alert('প্রোফাইল আপডেট করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">লোড হচ্ছে...</div>;

  if (!user) return <div className="empty-state">ব্যবহারকারী পাওয়া যায়নি।</div>;

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
              alt={user.name || ''} 
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
              name="fullName"
              defaultValue={user.name || user.fullName}
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
              name="email"
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
              name="phone"
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
              name="address"
              defaultValue={typeof user.address === 'object' && user.address 
                ? `${user.address.street || ''} ${user.address.city || ''} ${user.address.district || ''}`.trim() 
                : user.address}
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
          {loading ? 'সেভ হচ্ছে...' : 'পরিবর্তন সেভ করুন'}
        </button>
      </form>
    </div>
  );
}
