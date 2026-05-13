'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, ArrowRight, Phone, Eye, EyeOff } from 'lucide-react';
import '../Auth.css';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (validate()) {
            console.log('Registration attempt:', { name, email, phone, password });
            // Handle registration logic
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-header">
                <h1 className="auth-title">নতুন অ্যাকাউন্ট</h1>
                <p className="auth-subtitle">ম্যাঙ্গো শপে যোগ দিন এবং সেরা আম উপভোগ করুন</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}

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

                <button type="submit" className="auth-btn">
                    রেজিস্ট্রেশন সম্পন্ন করুন <ArrowRight size={20} />
                </button>
            </form>

            <p className="auth-footer">
                ইতিমধ্যেই অ্যাকাউন্ট আছে? <Link href="/login">লগইন করুন</Link>
            </p>
        </div>
    );
}
