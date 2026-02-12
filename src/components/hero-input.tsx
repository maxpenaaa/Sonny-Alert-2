'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

type HeroInputProps = {
  onAddMonitor: (url: string) => Promise<void>;
  isLoading: boolean;
};

export function HeroInput({ onAddMonitor, isLoading }: HeroInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    await onAddMonitor(url);
    setUrl('');
  };

  return (
    <div className="relative">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black mb-4 md:mb-6 uppercase leading-none">
          NEVER MISS
          <br />
          <span className="text-[#ff69b4]">A DROP</span>
        </h1>
        <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Track your favorite Sonny Angel products and get instant alerts when they're back in stock
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Sonny Angel product URL here..."
              className="w-full px-6 md:px-8 py-6 md:py-8 text-lg md:text-xl font-mono border-4 border-[#1a1a1a] bg-white focus:outline-none focus:ring-0 brutalist-shadow transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 md:px-12 py-6 md:py-8 bg-[#ff69b4] text-white text-lg md:text-xl font-black uppercase border-4 border-[#1a1a1a] brutalist-shadow hover:bg-[#ff1493] transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 whitespace-nowrap"
          >
            {isLoading ? (
              'TRACKING...'
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                TRACK IT
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="mt-4 text-[#ff1493] font-bold text-lg border-4 border-[#1a1a1a] bg-white px-6 py-3 brutalist-shadow-sm">
            ⚠️ {error}
          </p>
        )}
      </form>
    </div>
  );
}
