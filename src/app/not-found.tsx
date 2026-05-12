import Link from 'next/link';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center animate-in">
      <div className="mb-6 relative">
        <SearchX size={120} strokeWidth={1} className="text-gray-200" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="text-6xl font-black text-primary-orange opacity-20">404</span>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-secondary)' }}>
        পেজটি খুঁজে পাওয়া যায়নি!
      </h1>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        দুঃখিত, আপনি যে পেজটি খুঁজছেন তা বর্তমানে আমাদের সার্ভারে নেই অথবা লিঙ্কটি ভুল। 
        দয়া করে আবার চেষ্টা করুন অথবা হোম পেজে ফিরে যান।
      </p>
    </div>
  );
}
