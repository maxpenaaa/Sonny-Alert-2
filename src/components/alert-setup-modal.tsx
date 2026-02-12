'use client';

import { useState } from 'react';
import { X, Mail, Phone } from 'lucide-react';

type AlertSetupModalProps = {
  onSetup: (email?: string, phone?: string) => Promise<void>;
  onClose: () => void;
};

export function AlertSetupModal({ onSetup, onClose }: AlertSetupModalProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSetup(email || undefined, phone || undefined);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1a1a]/80">
      <div className="w-full max-w-md bg-white border-4 border-[#1a1a1a] brutalist-shadow-lg">
        <div className="p-6 border-b-4 border-[#1a1a1a] bg-[#ff69b4] flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-black uppercase text-white">
            DON'T MISS YOUR ANGEL!
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white text-[#1a1a1a] flex items-center justify-center border-2 border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <p className="font-bold text-lg">
            We need at least one way to reach you when your product comes back in stock:
          </p>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 mb-2 font-bold text-sm uppercase">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 border-[#1a1a1a] font-mono focus:outline-none focus:ring-2 focus:ring-[#ff69b4]"
              />
            </div>

            <div className="text-center font-black text-lg text-muted-foreground">
              OR
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 font-bold text-sm uppercase">
                <Phone className="w-4 h-4" />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-3 border-2 border-[#1a1a1a] font-mono focus:outline-none focus:ring-2 focus:ring-[#ff69b4]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (!email && !phone)}
            className="w-full px-6 py-4 bg-[#32ff32] text-[#1a1a1a] font-black text-lg uppercase border-4 border-[#1a1a1a] brutalist-shadow hover:bg-[#00ff00] transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'SAVING...' : '✓ SET UP ALERTS'}
          </button>

          <p className="text-xs text-center text-muted-foreground">
            We'll only contact you when your tracked products are back in stock. No spam, promise! 🚨
          </p>
        </form>
      </div>
    </div>
  );
}
