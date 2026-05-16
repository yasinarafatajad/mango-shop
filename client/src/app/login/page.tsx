'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import '../Auth.css';
import { authLogin } from '@/lib/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!email.trim()) {
            setError('সঠিক ইউজারনেম, ইমেইল অথবা মোবাইল নম্বর দিন');
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
        setLoading(true);
        if (validate()) {
            try {
                const response = await authLogin({ email: email.trim(), password });
                if (response.success) {
                    localStorage.setItem('mango_user', JSON.stringify(response.user));
                    localStorage.setItem('mango_token', response.token);
                    window.location.href = '/';
                }
            } catch (err: any) {
                setError(err.message || 'লগইন ব্যর্থ হয়েছে');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-image-section">
                <img src="/auth-login.png" alt="Inspiration" />
                <div className="auth-image-overlay">
                    <h2 className="auth-quote">"প্রকৃতির শ্রেষ্ঠ দান, সরাসরি আপনার দ্বারে।"</h2>
                    <p className="auth-author">— ম্যাঙ্গো শপ</p>
                </div>
            </div>
            <div className="auth-form-section">
                <div className="auth-page">
                    <div className="auth-header">
                        <h1 className="auth-title">স্বাগতম!</h1>
                        <p className="auth-subtitle">আপনার অ্যাকাউন্টে লগইন করুন</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}
                        <div className="form-group">
                            <label className="form-label">ইমেইল বা মোবাইল নম্বর</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="example@mail.com / 017..." 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="flex justify-between items-center mb-1">
                                <label className="form-label mb-0">পাসওয়ার্ড</label>
                            </div>
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
                            <div className="forgot-link-container">
                                <Link href="/forgot-password" title="পাসওয়ার্ড ভুলে গেছেন?" className="forgot-link">
                                    পাসওয়ার্ড ভুলে গেছেন?
                                </Link>
                            </div>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? (
                                <>লগইন হচ্ছে... <Loader2 size={20} className="animate-spin" /></>
                            ) : (
                                <>লগইন করুন <ArrowRight size={20} /></>
                            )}
                        </button>

                        <div className="auth-divider">
                            <span>অথবা</span>
                        </div>

                        <button type="button" className="social-btn">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" />
                            গুগল দিয়ে লগইন করুন
                        </button>
                    </form>

                    <p className="auth-footer">
                        অ্যাকাউন্ট নেই? <Link href="/register">নতুন অ্যাকাউন্ট খুলুন</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
