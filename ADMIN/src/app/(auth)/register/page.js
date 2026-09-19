'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Phone, Mail, ShieldCheck, CheckCircle2, ArrowRight, Loader2, Eye, EyeOff, ImagePlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const { register, uploadImage } = useAuth();

  const validateForm = () => {
    if (fullName.trim().length < 3) {
      setError('Name must be at least 3 characters long');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!phone.trim() || !/^(\+88)?01[3-9]\d{8}$/.test(phone.trim())) {
      setError('Please enter a valid 11-digit mobile number');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (validateForm()) {
      setIsLoading(true);
      try {
        let imageUrl = '';
        if (image) {
          const uploadRes = await uploadImage(image, 'customers');
          if (uploadRes.success) {
            imageUrl = uploadRes.url || '';
          } else {
            setError(uploadRes.message || 'Profile image upload failed');
            setIsLoading(false);
            return;
          }
        }

        const result = await register(
          fullName.trim(),
          email.trim(),
          phone.trim(),
          password,
          imageUrl || undefined
        );

        setIsLoading(false);
        if (result.success) {
          setIsSuccess(true);
        } else {
          setError(result.message || 'Registration failed');
        }
      } catch (err) {
        setIsLoading(false);
        setError(err.message || 'An error occurred during registration');
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-card/60 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-success/5 to-transparent pointer-events-none"></div>
        <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
        <p className="text-muted-foreground mb-8">
          Your admin account has been created successfully. You can now log in.
        </p>
        <Link href="/login" className="inline-flex items-center justify-center w-full h-12 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-500 max-w-md w-full mx-auto">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>

      <div className="flex flex-col items-center mb-6 relative z-10">
        <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Admin Registration</h1>
        <p className="text-sm text-muted-foreground text-center">
          Create a new administrative account
        </p>
      </div>

      <div className="relative z-10">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-3 mb-4 animate-fade-in">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          {/* Avatar Upload Container */}
          <div className="flex flex-col items-center mb-4">
            <div 
              className="w-20 h-20 rounded-full bg-secondary/50 border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center overflow-hidden cursor-pointer relative transition-all group"
              onClick={() => document.getElementById('profile-image-upload')?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <ImagePlus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </div>
            <label 
              onClick={() => document.getElementById('profile-image-upload')?.click()}
              className="mt-2 text-xs font-medium text-muted-foreground cursor-pointer hover:text-primary transition-colors"
            >
              Add Profile Picture
            </label>
            <input 
              id="profile-image-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                required
                value={fullName} 
                onChange={e => setFullName(e.target.value)}
                placeholder="John Doe" 
                className="w-full h-11 pl-9 pr-4 bg-background/50 backdrop-blur-sm border border-input focus:border-primary focus:ring-primary/20 focus:ring-2 rounded-xl outline-none transition-all text-sm" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="email" 
                required
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com" 
                className="w-full h-11 pl-9 pr-4 bg-background/50 backdrop-blur-sm border border-input focus:border-primary focus:ring-primary/20 focus:ring-2 rounded-xl outline-none transition-all text-sm" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="tel" 
                required
                value={phone} 
                onChange={e => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX" 
                className="w-full h-11 pl-9 pr-4 bg-background/50 backdrop-blur-sm border border-input focus:border-primary focus:ring-primary/20 focus:ring-2 rounded-xl outline-none transition-all text-sm" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">Create Password</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type={showPass ? "text" : "password"} 
                required
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters" 
                className="w-full h-11 pl-9 pr-10 bg-background/50 backdrop-blur-sm border border-input focus:border-primary focus:ring-primary/20 focus:ring-2 rounded-xl outline-none transition-all text-sm" 
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 mt-6 transition-all shadow-lg shadow-primary/25 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Admin Account'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground relative z-10">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
