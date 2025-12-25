"use client"

export function TyphoonLogo({ className = "", ...props }: React.ComponentProps<"svg">) {
    return (
        <svg
            viewBox="0 0 250 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <style jsx>{`
        .film-rotate { animation: rotate-film 5s linear infinite; }
        @keyframes rotate-film { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .film-flicker { animation: flicker 0.2s infinite alternate; }
        @keyframes flicker { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }
        .light-beam-animation { animation: beam-pulse 2s infinite alternate; transform-origin: 0% 50%; }
        @keyframes beam-pulse { 0% { opacity: 0.7; transform: scaleX(1); } 50% { opacity: 1; transform: scaleX(1.02); } 100% { opacity: 0.7; transform: scaleX(1); } }
      `}</style>
            <defs>
                <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00E0FF" />
                    <stop offset="100%" stopColor="#FF00E0" />
                </linearGradient>
                <linearGradient id="solidNeonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00BFFF" />
                    <stop offset="100%" stopColor="#FF1493" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <rect x="50" y="50" width="150" height="70" fill="#222" rx="8" ry="8" filter="url(#glow)" />

            <circle cx="75" cy="40" r="30" fill="url(#solidNeonGradient)" opacity="0.9" filter="url(#glow)" className="film-rotate" style={{ transformOrigin: "75px 40px" }} />
            <circle cx="75" cy="40" r="25" fill="#0d0d1a" />
            <line x1="75" y1="10" x2="75" y2="70" stroke="#00E0FF" strokeWidth="2" strokeLinecap="round" className="film-rotate" style={{ transformOrigin: "75px 40px" }} />
            <line x1="53.9" y1="23.9" x2="96.1" y2="56.1" stroke="#FF00E0" strokeWidth="2" strokeLinecap="round" className="film-rotate" style={{ transformOrigin: "75px 40px" }} />
            <line x1="96.1" y1="23.9" x2="53.9" y2="56.1" stroke="#00E0FF" strokeWidth="2" strokeLinecap="round" className="film-rotate" style={{ transformOrigin: "75px 40px" }} />

            <circle cx="175" cy="40" r="30" fill="url(#solidNeonGradient)" opacity="0.9" filter="url(#glow)" className="film-rotate" style={{ transformOrigin: "175px 40px" }} />
            <circle cx="175" cy="40" r="25" fill="#0d0d1a" />
            <line x1="175" y1="10" x2="175" y2="70" stroke="#00E0FF" strokeWidth="2" strokeLinecap="round" className="film-rotate" style={{ transformOrigin: "175px 40px" }} />
            <line x1="153.9" y1="23.9" x2="196.1" y2="56.1" stroke="#FF00E0" strokeWidth="2" strokeLinecap="round" className="film-rotate" style={{ transformOrigin: "175px 40px" }} />
            <line x1="196.1" y1="23.9" x2="153.9" y2="56.1" stroke="#00E0FF" strokeWidth="2" strokeLinecap="round" className="film-rotate" style={{ transformOrigin: "175px 40px" }} />

            <path d="M 75 40 A 30 30 0 0 1 90 20 L 160 20 A 30 30 0 0 1 175 40 A 30 30 0 0 1 160 60 L 90 60 A 30 30 0 0 1 75 40 Z" fill="none" stroke="url(#neonGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" className="film-flicker" />

            <circle cx="95" cy="18" r="1.5" fill="#0d0d1a" />
            <circle cx="105" cy="18" r="1.5" fill="#0d0d1a" />
            <circle cx="115" cy="18" r="1.5" fill="#0d0d1a" />
            <circle cx="125" cy="18" r="1.5" fill="#0d0d1a" />
            <circle cx="135" cy="18" r="1.5" fill="#0d0d1a" />
            <circle cx="145" cy="18" r="1.5" fill="#0d0d1a" />
            <circle cx="95" cy="62" r="1.5" fill="#0d0d1a" />
            <circle cx="105" cy="62" r="1.5" fill="#0d0d1a" />
            <circle cx="115" cy="62" r="1.5" fill="#0d0d1a" />
            <circle cx="125" cy="62" r="1.5" fill="#0d0d1a" />
            <circle cx="135" cy="62" r="1.5" fill="#0d0d1a" />
            <circle cx="145" cy="62" r="1.5" fill="#0d0d1a" />

            <circle cx="65" cy="85" r="25" fill="#333" stroke="url(#neonGradient)" strokeWidth="3" filter="url(#glow)" />
            <circle cx="65" cy="85" r="15" fill="#0d0d1a" />
            <circle cx="65" cy="85" r="8" fill="url(#neonGradient)" opacity="0.7" />

            <path d="M 90 75 L 250 40 L 250 110 L 90 95 Z" fill="url(#neonGradient)" opacity="0.7" className="light-beam-animation" />

            <line x1="75" y1="120" x2="40" y2="180" stroke="#8B4513" strokeWidth="5" strokeLinecap="round" />
            <line x1="125" y1="120" x2="160" y2="180" stroke="#8B4513" strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="120" x2="100" y2="180" stroke="#8B4513" strokeWidth="5" strokeLinecap="round" />
        </svg>
    )
}
