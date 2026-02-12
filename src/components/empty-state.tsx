'use client';

export function EmptyState() {
  return (
    <div className="mt-20 md:mt-32 flex flex-col items-center justify-center text-center px-4">
      <div className="w-full max-w-md mb-8">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="100" y="80" width="200" height="240" fill="#ffe4f4" stroke="#1a1a1a" strokeWidth="4" />
          
          <circle cx="200" cy="140" r="40" fill="#ffb3d9" stroke="#1a1a1a" strokeWidth="4" />
          
          <circle cx="185" cy="135" r="8" fill="#1a1a1a" />
          <circle cx="215" cy="135" r="8" fill="#1a1a1a" />
          
          <path
            d="M 180 150 Q 200 140 220 150"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          <rect x="160" y="200" width="80" height="100" fill="#ff69b4" stroke="#1a1a1a" strokeWidth="4" />
          
          <line x1="200" y1="220" x2="200" y2="280" stroke="#1a1a1a" strokeWidth="4" />
          <line x1="175" y1="300" x2="165" y2="340" stroke="#1a1a1a" strokeWidth="4" />
          <line x1="225" y1="300" x2="235" y2="340" stroke="#1a1a1a" strokeWidth="4" />
          
          <circle cx="165" cy="340" r="12" fill="#1a1a1a" />
          <circle cx="235" cy="340" r="12" fill="#1a1a1a" />
          
          <path
            d="M 120 180 Q 110 150 130 140"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 280 180 Q 290 150 270 140"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          <text
            x="200"
            y="380"
            textAnchor="middle"
            fontFamily="Syne"
            fontSize="24"
            fontWeight="800"
            fill="#1a1a1a"
          >
            WAITING...
          </text>
        </svg>
      </div>

      <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase">
        NO ANGELS TRACKED YET
      </h2>
      <p className="text-lg md:text-xl max-w-md font-medium text-muted-foreground">
        Paste a Sonny Angel product URL above to start monitoring stock availability
      </p>

      <div className="mt-12 p-6 border-4 border-[#1a1a1a] bg-[#ffe4f4] max-w-lg brutalist-shadow-sm">
        <p className="font-bold text-lg mb-2">💡 PRO TIP</p>
        <p className="text-sm">
          We'll automatically check stock status every few minutes and send you an alert the moment your angel comes back in stock!
        </p>
      </div>
    </div>
  );
}
