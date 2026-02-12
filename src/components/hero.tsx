import Link from "next/link";
import { Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-[#e6d5ff] border-b-4 border-[#1a1a1a]">
      <div className="relative pt-32 pb-40 sm:pt-40 sm:pb-48">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-6xl mx-auto">
            <div className="inline-block px-6 py-3 bg-[#ffff00] border-4 border-[#1a1a1a] mb-8 brutalist-shadow-sm">
              <span className="font-black text-sm uppercase">🚨 Stop Missing Drops</span>
            </div>

            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black text-[#1a1a1a] mb-8 tracking-tight uppercase leading-none">
              SONNY ANGEL
              <br />
              <span className="text-[#ff69b4]">RESTOCK</span>
              <br />
              ALERTS
            </h1>
            
            <p className="text-xl sm:text-2xl font-bold mb-12 max-w-2xl mx-auto">
              Track product URLs and get instant notifications when sold-out items come back in stock. Never miss a limited drop again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-12 py-6 text-white bg-[#ff69b4] border-4 border-[#1a1a1a] hover:bg-[#ff1493] transition-all duration-200 text-xl font-black uppercase brutalist-shadow-lg active:translate-x-2 active:translate-y-2 active:shadow-none"
              >
                <Sparkles className="w-6 h-6" />
                START TRACKING
              </Link>
              
              <Link
                href="#features"
                className="inline-flex items-center px-12 py-6 text-[#1a1a1a] bg-white border-4 border-[#1a1a1a] hover:bg-[#f5f5f5] transition-all duration-200 text-xl font-black uppercase brutalist-shadow-lg active:translate-x-2 active:translate-y-2 active:shadow-none"
              >
                HOW IT WORKS
              </Link>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm font-bold">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>FREE TO START</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>REAL-TIME ALERTS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>24/7 MONITORING</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
