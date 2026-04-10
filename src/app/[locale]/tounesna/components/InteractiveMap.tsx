import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { mapPaths } from "./SvgPaths";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveMapProps {
  onGovernorateClick?: (gov: string) => void;
  photosByGov?: Record<string, string>; // Map of govId (e.g. 'TN-AR') to photo URL
  activeGov?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
}

const ID_TO_NAME: Record<string, string> = {
  "TN-AR": "Ariana", "TN-BE": "Beja", "TN-BA": "Ben Arous", "TN-BI": "Bizerte",
  "TN-GB": "Gabes", "TN-GF": "Gafsa", "TN-JN": "Jendouba", "TN-KR": "Kairouan",
  "TN-KS": "Kasserine", "TN-KE": "Kebili", "TN-KF": "Kef", "TN-MH": "Mahdia",
  "TN-MN": "Manouba", "TN-MD": "Medenine", "TN-MS": "Monastir", "TN-NA": "Nabeul",
  "TN-SF": "Sfax", "TN-SB": "Sidi Bouzid", "TN-SI": "Siliana", "TN-SO": "Sousse",
  "TN-TT": "Tataouine", "TN-TZ": "Tozeur", "TN-TN": "Tunis", "TN-ZG": "Zaghouan"
};

export function InteractiveMap({ 
  onGovernorateClick, 
  photosByGov = {}, 
  activeGov,
  primaryColor = "#6a0d2e",
  secondaryColor = "#ffcc1a"
}: InteractiveMapProps) {
  const mapRef = useRef<SVGSVGElement>(null);
  const [hoveredGov, setHoveredGov] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!mapRef.current) return;
    
    // Smooth, cascading fade-in animation
    const paths = mapRef.current.querySelectorAll("path");
    gsap.fromTo(
      paths,
      { opacity: 0, scale: 0.95, transformOrigin: "center" },
      { 
        opacity: 1, 
        scale: 1,
        duration: 0.8, 
        stagger: 0.03, 
        ease: "power2.out",
        delay: 0.2
      }
    );
  }, []);

  const handleMouseEnter = (id: string, e: React.MouseEvent) => {
    setHoveredGov(id);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredGov) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredGov(null);
  };

  return (
    <div 
      className="relative w-full h-full min-h-[600px] flex items-center justify-center bg-transparent overflow-hidden group"
      onMouseMove={handleMouseMove}
    >
      {/* Background Texture - Deep Maroon with subtle golden grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at center, ${primaryColor} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} 
      />

      {/* Map Content */}
      <div className="relative z-10 w-full h-full max-w-lg flex items-center justify-center p-8">
        <svg 
          ref={mapRef} 
          width="100%" 
          height="100%" 
          viewBox="0 0 445 500" 
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: `drop-shadow(0 20px 50px ${primaryColor}14)` }}
          className="transition-transform duration-700 hover:scale-[1.02]"
        >
          <defs>
            {Object.entries(photosByGov).map(([id, url]) => (
              <pattern
                key={`pattern-${id}`}
                id={`img-${id}`}
                patternUnits="objectBoundingBox"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                {/* 
                  To preserve the artistic feel and not just drop generic images into the shapes, 
                  we add a maroon tint over the pattern image.
                */}
                <image 
                  href={url} 
                  x="0" 
                  y="0" 
                  width="1" 
                  height="1" 
                  preserveAspectRatio="xMidYMid slice" 
                />
                <rect width="1" height="1" fill={primaryColor} opacity="0.1" />
              </pattern>
            ))}
          </defs>

          <g transform="scale(0.4751215862437178) translate(96.25393699649992, 0)">
            {mapPaths.map((path) => {
              const isHovered = hoveredGov === path.id;
              const isActive = activeGov === path.id;
              const hasPhoto = !!photosByGov[path.id];

              let fillStyle = `${primaryColor}ff`; // Soft cream base instead of stark white
              let strokeStyle = secondaryColor;
              let strokeOpacity = "2";
              
              if (isActive) {
                 fillStyle = hasPhoto ? `url(#img-${path.id})` : primaryColor;
                 strokeStyle = secondaryColor; // Bold maroon stroke when active
                 strokeOpacity = "2";
              } else if (isHovered) {
                if (hasPhoto) {
                  fillStyle = `url(#img-${path.id})`;
                } else {
                  fillStyle = `${primaryColor}1a`; // Soft maroon indicator
                }
                strokeStyle = `${primaryColor}66`;
                strokeOpacity = "1";
              }

              return (
                <path
                  key={path.id}
                  id={path.id}
                  d={path.d}
                  stroke={strokeStyle}
                  strokeWidth={isActive ? "3.5" : "2"}
                  strokeOpacity={strokeOpacity}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-500 cursor-pointer outline-none hover:drop-shadow-[0_0_20px_rgba(106,13,46,0.25)]"
                  style={{ fill: fillStyle }}
                  onMouseEnter={(e) => handleMouseEnter(path.id, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => onGovernorateClick?.(path.id)}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Floating Tooltip */}
      <AnimatePresence>
        {hoveredGov && ID_TO_NAME[hoveredGov] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed pointer-events-none z-[100] px-5 py-3 rounded-2xl backdrop-blur-xl border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.15)] flex items-center gap-3"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.75)",
              left: mousePos.x + 15,
              top: mousePos.y + 15,
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: secondaryColor }} />
            <span className="font-serif font-bold text-xl drop-shadow-sm tracking-wide" style={{ color: primaryColor }}>
              {ID_TO_NAME[hoveredGov]}
            </span>
            {photosByGov[hoveredGov] && (
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ml-2" style={{ backgroundColor: `${primaryColor}1a`, color: primaryColor }}>
                Collection
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
