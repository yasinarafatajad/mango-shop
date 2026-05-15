'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff, Search, User as UserIcon, MessageCircle } from 'lucide-react';
import '../Auth.css';
import { authSearchCustomer, authForgotPassword, authResetPassword, authVerifyOtp } from '@/lib/api';

type Step = 'search' | 'select-account' | 'select-method' | 'otp' | 'new-password' | 'success' | 'error';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>('search');
    
    const [query, setQuery] = useState('');
    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [selectedMethod, setSelectedMethod] = useState<'email' | 'whatsapp' | null>(null);
    
    const [otp, setOtp] = useState(['', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!query.trim()) {
            setError('সঠিক ইউজারনেম, ইমেইল অথবা মোবাইল নম্বর দিন');
            return;
        }
        
        try {
            const response = await authSearchCustomer(query.trim());
            if (response.success && response.customers.length > 0) {
                setCustomers(response.customers);
                setStep('select-account');
            } else {
                setError('কোনো অ্যাকাউন্ট পাওয়া যায়নি');
            }
        } catch (err: any) {
            setError(err.message || 'সার্চ ব্যর্থ হয়েছে');
        }
    };

    const handleSelectAccount = (customer: any) => {
        setSelectedCustomer(customer);
        setStep('select-method');
    };

    const handleMethodSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!selectedMethod) {
            setError('একটি মাধ্যম নির্বাচন করুন');
            return;
        }
        
        try {
            const response = await authForgotPassword(selectedCustomer.id, selectedMethod);
            if (response.success) {
                setStep('otp');
                setTimer(30);
            }
        } catch (err: any) {
            setError(err.message || 'OTP পাঠাতে ব্যর্থ হয়েছে');
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setError('');
        try {
            const response = await authForgotPassword(selectedCustomer.id, selectedMethod!);
            if (response.success) {
                setTimer(30);
                setOtp(['', '', '', '']);
            }
        } catch (err: any) {
            setError(err.message || 'OTP পুনরায় পাঠাতে ব্যর্থ হয়েছে');
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (otp.join('').length < 4) {
            setError('সঠিক OTP দিন');
            return;
        }
        
        try {
            const response = await authVerifyOtp({
                customerId: selectedCustomer.id,
                otp: otp.join('')
            });
            if (response.success) {
                setStep('new-password');
            }
        } catch (err: any) {
            setError(err.message || 'OTP যাচাই ব্যর্থ হয়েছে');
        }
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
            const response = await authResetPassword({ 
                customerId: selectedCustomer.id, 
                otp: otp.join(''), 
                newPassword 
            });
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
                {step === 'search' && (
                    <>
                        <h1 className="auth-title">অ্যাকাউন্ট খুঁজুন</h1>
                        <p className="auth-subtitle">পাসওয়ার্ড রিসেট করতে আপনার ইউজারনেম, ইমেইল বা ফোন নম্বর দিন</p>
                    </>
                )}
                {step === 'select-account' && (
                    <>
                        <h1 className="auth-title">অ্যাকাউন্ট নির্বাচন করুন</h1>
                        <p className="auth-subtitle">নিচের তালিকা থেকে আপনার অ্যাকাউন্টটি বেছে নিন</p>
                    </>
                )}
                {step === 'select-method' && (
                    <>
                        <h1 className="auth-title">ভেরিফিকেশন মাধ্যম</h1>
                        <p className="auth-subtitle">OTP পাওয়ার জন্য মাধ্যম নির্বাচন করুন</p>
                    </>
                )}
                {step === 'otp' && (
                    <>
                        <h1 className="auth-title">OTP যাচাইকরণ</h1>
                        <p className="auth-subtitle">আপনার নির্বাচিত মাধ্যমে পাঠানো ৪ সংখ্যার কোডটি দিন</p>
                    </>
                )}
                {step === 'new-password' && (
                    <>
                        <h1 className="auth-title">নতুন পাসওয়ার্ড</h1>
                        <p className="auth-subtitle">আপনার নতুন পাসওয়ার্ড সেট করুন</p>
                    </>
                )}
            </div>

            {step === 'search' && (
                <form className="auth-form" onSubmit={handleSearchSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label className="form-label">ইমেইল / মোবাইল / নাম</label>
                        <div className="input-wrapper">
                            <Search className="input-icon" size={20} />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="আপনার ইউজারনেম"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="auth-btn">
                        খুঁজুন <ArrowRight size={20} />
                    </button>
                </form>
            )}

            {step === 'select-account' && (
                <div className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {customers.map((customer) => (
                        <div 
                            key={customer.id} 
                            onClick={() => handleSelectAccount(customer)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '1rem', 
                                border: '1px solid #e5e7eb', 
                                borderRadius: '0.5rem', 
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', marginRight: '1rem', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {customer.image ? (
                                    <img src={customer.image} alt={customer.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <UserIcon size={20} color="#9ca3af" />
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: '#1f2937' }}>{customer.fullName}</div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                    {customer.email && <div>{customer.email}</div>}
                                    {customer.phone && <div>{customer.phone}</div>}
                                </div>
                            </div>
                            <ArrowRight size={20} color="#9ca3af" />
                        </div>
                    ))}
                    <button onClick={() => setStep('search')} className="text-btn" style={{ marginTop: '1rem', textAlign: 'center' }}>
                        অন্য অ্যাকাউন্ট খুঁজুন
                    </button>
                </div>
            )}

            {step === 'select-method' && (
                <form className="auth-form" onSubmit={handleMethodSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        {selectedCustomer.hasEmail && (
                            <label style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: `2px solid ${selectedMethod === 'email' ? '#4ade80' : '#e5e7eb'}`, borderRadius: '0.5rem', cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="method" 
                                    value="email" 
                                    checked={selectedMethod === 'email'} 
                                    onChange={() => setSelectedMethod('email')}
                                    style={{ marginRight: '1rem' }}
                                />
                                <Mail size={20} style={{ marginRight: '0.5rem', color: selectedMethod === 'email' ? '#4ade80' : '#9ca3af' }} />
                                <span style={{ flex: 1 }}>ইমেইল</span>
                            </label>
                        )}
                        {selectedCustomer.hasPhone && (
                            <label style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: `2px solid ${selectedMethod === 'whatsapp' ? '#4ade80' : '#e5e7eb'}`, borderRadius: '0.5rem', cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="method" 
                                    value="whatsapp" 
                                    checked={selectedMethod === 'whatsapp'} 
                                    onChange={() => setSelectedMethod('whatsapp')}
                                    style={{ marginRight: '1rem' }}
                                />
                                <MessageCircle size={20} style={{ marginRight: '0.5rem', color: selectedMethod === 'whatsapp' ? '#4ade80' : '#9ca3af' }} />
                                <span style={{ flex: 1 }}>হোয়াটসঅ্যাপ</span>
                            </label>
                        )}
                    </div>
                    <button type="submit" className="auth-btn">
                        OTP পাঠান <ArrowRight size={20} />
                    </button>
                    <button type="button" onClick={() => setStep('select-account')} className="text-btn" style={{ marginTop: '1rem', display: 'block', width: '100%', textAlign: 'center' }}>
                        ফিরে যান
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
                                    value={otp[i]}
                                    onChange={(e) => {
                                        const newOtp = [...otp];
                                        newOtp[i] = e.target.value;
                                        setOtp(newOtp);
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

                    <div className="otp-footer" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        {timer > 0 ? (
                            <p style={{ color: '#6b7280' }}>আবার পাঠান ({timer}s)</p>
                        ) : (
                            <button 
                                type="button" 
                                onClick={handleResend} 
                                className="resend-link"
                                style={{ color: 'var(--primary-green)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}
                            >
                                OTP আবার পাঠান
                            </button>
                        )}
                        
                        <div style={{ marginTop: '1rem' }}>
                            <button 
                                type="button" 
                                onClick={() => setStep('select-method')}
                                style={{ color: '#6b7280', fontSize: '0.85rem', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}
                            >
                                অন্য মাধ্যমে চেষ্টা করুন
                            </button>
                        </div>
                    </div>
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
                    <button onClick={() => setStep('search')} className="auth-btn">
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
