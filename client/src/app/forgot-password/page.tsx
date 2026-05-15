'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import '../Auth.css';
import { authForgotPassword } from '@/lib/api';

type Step = 'email' | 'otp' | 'new-password' | 'success' | 'error';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email.includes('@')) {
            setError('সঠিক ইমেইল দিন');
            return;
        }
        setStep('otp');
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('new-password');
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword.length < 6) {
            setError('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('পাসওয়ার্ড দুটি মেলেনি');
            return;
        }
        
        try {
            const response = await authForgotPassword(email, newPassword);
            if (response.success) {
                setStep('success');
            }
        } catch (err: any) {
            setError(err.message || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে');
            setStep('error');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-header">
                {step === 'email' && (
                    <>
                        <h1 className="auth-title">পাসওয়ার্ড রিসেট</h1>
                        <p className="auth-subtitle">আপনার ইমেইল দিন, আমরা একটি OTP পাঠাবো</p>
                    </>
                )}
                {step === 'otp' && (
                    <>
                        <h1 className="auth-title">OTP যাচাইকরণ</h1>
                        <p className="auth-subtitle">আপনার ইমেইলে পাঠানো ৪ সংখ্যার কোডটি দিন</p>
                    </>
                )}
                {step === 'new-password' && (
                    <>
                        <h1 className="auth-title">নতুন পাসওয়ার্ড</h1>
                        <p className="auth-subtitle">আপনার নতুন পাসওয়ার্ড সেট করুন</p>
                    </>
                )}
            </div>

            {step === 'email' && (
            <form className="auth-form" onSubmit={handleEmailSubmit}>
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
                <button type="submit" className="auth-btn">
                    OTP পাঠান <ArrowRight size={20} />
                </button>
            </form>
        )}

        {step === 'otp' && (
            <form className="auth-form" onSubmit={handleOtpSubmit}>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label className="form-label">OTP কোড</label>
                    <div className="otp-input-container">
                        {[0, 1, 2, 3].map((i) => (
                            <input
                                key={i}
                                type="tel"
                                maxLength={1}
                                className="otp-field"
                                required
                                onChange={(e) => {
                                    if (e.target.value && i < 3) {
                                        (e.target.parentElement?.children[i + 1] as HTMLInputElement)?.focus();
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Backspace' && !otp[i] && i > 0) {
                                        (e.currentTarget.parentElement?.children[i - 1] as HTMLInputElement)?.focus();
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
                <button type="submit" className="auth-btn">
                    ভেরিফাই করুন <ShieldCheck size={20} />
                </button>
                <p className="resend-text">কোড পাননি? <button type="button" className="text-btn">পুনরায় পাঠান</button></p>
            </form>
        )}

        {step === 'new-password' && (
            <form className="auth-form" onSubmit={handlePasswordSubmit}>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label className="form-label">নতুন পাসওয়ার্ড</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-input"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                <div className="form-group">
                    <label className="form-label">পাসওয়ার্ড নিশ্চিত করুন</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-input"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="auth-btn">
                    পাসওয়ার্ড আপডেট করুন <CheckCircle2 size={20} />
                </button>
            </form>
            )}

            {step === 'success' && (
                <div className="status-container success">
                    <CheckCircle2 size={80} className="status-icon" />
                    <h2 className="status-title">সফল হয়েছে!</h2>
                    <p className="status-text">আপনার পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে। এখন আপনি নতুন পাসওয়ার্ড দিয়ে লগইন করতে পারেন।</p>
                    <Link href="/login" className="auth-btn">
                        লগইন পেজে যান <ArrowRight size={20} />
                    </Link>
                </div>
            )}

            {step === 'error' && (
                <div className="status-container error">
                    <AlertCircle size={80} className="status-icon" />
                    <h2 className="status-title">ব্যর্থ হয়েছে!</h2>
                    <p className="status-text">দুঃখিত, পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।</p>
                    <button onClick={() => setStep('email')} className="auth-btn">
                        আবার চেষ্টা করুন
                    </button>
                </div>
            )}

            {step !== 'success' && step !== 'error' && (
                <p className="auth-footer">
                    মনে পড়েছে? <Link href="/login">লগইন করুন</Link>
                </p>
            )}
        </div>
    );
}
