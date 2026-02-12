'use client';

import { Bell, ExternalLink } from 'lucide-react';

export function NotificationPreview() {
  return (
    <div className="mt-20 max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-4xl font-black mb-6 uppercase text-center">
        ALERT PREVIEW
      </h2>
      <p className="text-center font-bold mb-8 text-muted-foreground">
        Here's what you'll receive when your product is back in stock:
      </p>

      <div className="bg-white border-4 border-[#1a1a1a] brutalist-shadow-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#ff69b4] border-2 border-[#1a1a1a] flex items-center justify-center flex-shrink-0">
            <Bell className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 bg-[#32ff32] text-[#1a1a1a] font-black text-xs border-2 border-[#1a1a1a]">
                🚨 RESTOCK ALERT
              </span>
            </div>
            
            <h3 className="text-xl font-black mb-2">
              Your Sonny Angel is BACK IN STOCK!
            </h3>
            
            <p className="text-sm font-medium mb-4">
              The item you're tracking is now available. Click the link below to purchase before it sells out again!
            </p>
            
            <div className="flex items-center gap-2 p-3 bg-[#e6d5ff] border-2 border-[#1a1a1a] mb-4">
              <img
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=200&q=80"
                alt="Product"
                className="w-16 h-16 object-cover border-2 border-[#1a1a1a]"
              />
              <div className="flex-1">
                <p className="font-bold text-sm mb-1">Example Sonny Angel Series</p>
                <p className="text-xs font-mono text-muted-foreground">example-store.com</p>
              </div>
            </div>
            
            <button className="w-full px-4 py-3 bg-[#ff69b4] text-white font-black text-sm uppercase border-2 border-[#1a1a1a] flex items-center justify-center gap-2 hover:bg-[#ff1493] transition-colors">
              BUY NOW
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t-2 border-[#1a1a1a]">
          <p className="text-xs font-mono text-center text-muted-foreground">
            You're receiving this because you're tracking this product on Sonny Alert
          </p>
        </div>
      </div>
    </div>
  );
}
