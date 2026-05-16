'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, ArrowRight, Phone, Eye, EyeOff, ImagePlus, Loader2 } from 'lucide-react';
import '../Auth.css';
import { authSignup, uploadImage } from '@/lib/api';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (name.length < 3) {
            setError('নাম অন্তত ৩ অক্ষরের হতে হবে');
            return false;
        }
        if (!email.includes('@')) {
            setError('সঠিক ইমেইল দিন');
            return false;
        }
        if (!/^(\+88)?01[3-9]\d{8}$/.test(phone)) {
            setError('সঠিক মোবাইল নম্বর দিন (১১ ডিজিট)');
            return false;
        }
        if (password.length < 6) {
            setError('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (validate()) {
            setLoading(true);
            try {
                let imageUrl = '';
                if (image) {
                    const uploadRes = await uploadImage(image, 'customers');
                    imageUrl = uploadRes.url || uploadRes.secure_url || '';
                }
                
                const response = await authSignup({ 
                    fullName: name, 
                    email, 
                    phone, 
                    password,
                    image: imageUrl || undefined
                });
                if (response.success) {
                    localStorage.setItem('mango_user', JSON.stringify(response.user));
                    localStorage.setItem('mango_token', response.token);
                    window.location.href = '/';
                }
            } catch (err: any) {
                setError(err.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-image-section">
                <img src="/auth-register.png" alt="Inspiration" />
                <div className="auth-image-overlay">
                    <h2 className="auth-quote">"সেরা মানের আম, সরাসরি রাজশাহী থেকে আপনার ঘরে।"</h2>
                    <p className="auth-author">— ম্যাঙ্গো শপ</p>
                </div>
            </div>
            <div className="auth-form-section">
                <div className="auth-page">
                    <div className="auth-header">
                        <h1 className="auth-title">নতুন অ্যাকাউন্ট</h1>
                        <p className="auth-subtitle">ম্যাঙ্গো শপে যোগ দিন এবং সেরা আম উপভোগ করুন</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}

                        <div className="image-upload-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div 
                                className="image-preview" 
                                style={{ 
                                    width: '100px', 
                                    height: '100px', 
                                    borderRadius: '50%', 
                                    backgroundColor: '#f3f4f6', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    border: '2px dashed #d1d5db',
                                    position: 'relative'
                                }}
                                onClick={() => document.getElementById('profile-image-upload')?.click()}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <ImagePlus size={32} color="#9ca3af" />
                                )}
                            </div>
                            <label style={{ marginTop: '0.5rem', cursor: 'pointer', color: '#4b5563', fontSize: '0.875rem' }} onClick={() => document.getElementById('profile-image-upload')?.click()}>
                                প্রোফাইল ছবি যোগ করুন
                            </label>
                            <input 
                                id="profile-image-upload" 
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setImage(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">পুরো নাম</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="আপনার নাম লিখুন"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">ইমেইল</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="example@mail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">মোবাইল নম্বর</label>
                            <div className="input-wrapper">
                                <Phone className="input-icon" size={20} />
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="০১৭XXXXXXXX"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">পাসওয়ার্ড সেট করুন</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? (
                                <>প্রসেস হচ্ছে... <Loader2 size={20} className="animate-spin" /></>
                            ) : (
                                <>রেজিস্ট্রেশন সম্পন্ন করুন <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>

                    <p className="auth-footer">
                        ইতিমধ্যেই অ্যাকাউন্ট আছে? <Link href="/login">লগইন করুন</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
