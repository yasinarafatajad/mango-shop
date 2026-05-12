'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import '../Auth.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const validate = () => {
        if (!email.includes('@')) {
            setError('সঠিক ইমেইল দিন');
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
            console.log('Login attempt:', { email, password });
            // Handle login logic
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-header">
                <h1 className="auth-title">স্বাগতম!</h1>
                <p className="auth-subtitle">আপনার অ্যাকাউন্টে লগইন করুন</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                
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
                    <label className="form-label">পাসওয়ার্ড</label>
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

                <div className="forgot-link-container">
                    <Link href="/forgot-password" title="পাসওয়ার্ড ভুলে গেছেন?" className="forgot-link">
                        পাসওয়ার্ড ভুলে গেছেন?
                    </Link>
                </div>

                <button type="submit" className="auth-btn">
                    লগইন করুন <ArrowRight size={20} />
                </button>
            </form>

            <p className="auth-footer">
                অ্যাকাউন্ট নেই? <Link href="/register">রেজিস্ট্রেশন করুন</Link>
            </p>
        </div>
    );
}
