import React from 'react';
import { CUSTOMIZATION_GUIDES } from '../data/customizationGuides';
import { ThreePieceCustomizationArt } from './ThreePieceCustomizationArt';

interface CustomizationArtProps {
  optionId: string;
  groupId?: string;
  labelEn?: string;
  className?: string;
  isSelected?: boolean;
}

/**
 * Realistic Bespoke Garment Component Illustrations
 * Designed with realistic 3D fabric folds, textile gradients, pearlescent 4-hole buttons,
 * AMF pick stitching, drop shadows, and visual indicators.
 */
export const CustomizationOptionArt: React.FC<CustomizationArtProps> = ({
  optionId,
  className = 'w-full h-32',
  isSelected = false,
}) => {
  const guide = CUSTOMIZATION_GUIDES[optionId];

  // Palette definitions
  const isDarkFabric = false;
  const clothBase = isSelected ? '#FDF8F3' : '#F8FAFC';
  const clothShade = isSelected ? '#FDE6D2' : '#E2E8F0';
  const clothDeep = isSelected ? '#FBCBA8' : '#CBD5E1';
  const stroke = isSelected ? '#9A3412' : '#334155';
  const accent = isSelected ? '#DC4D05' : '#64748B';
  const stitch = isSelected ? '#C2410C' : '#475569';
  const highlight = '#FFFFFF';
  const pearlButton = '#F8FAFC';
  const buttonBorder = isSelected ? '#9A3412' : '#64748B';

  const renderComponent = () => {
    switch (optionId) {
      // ====================================================
      // 1. COLLARS (Realistic 3D Roll, Collarband & Buttons)
      // ====================================================
      case 'pointed_classic':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_pc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
              <linearGradient id="collarGrad_pc" x1="0" y1="0" x2="0.8" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothDeep} />
              </linearGradient>
              <filter id="shadow_pc" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.18" />
              </filter>
            </defs>
            {/* Background Canvas & Grid */}
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_pc)" />
            
            {/* Shirt Body & Chest Placket */}
            <path d="M40 120 L40 60 L68 35 L100 42 L132 35 L160 60 L160 120 Z" fill="#E2E8F0" opacity="0.4" />
            <path d="M86 42 L86 125 L114 125 L114 42 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1" />
            {/* Placket edge stitching */}
            <line x1="90" y1="42" x2="90" y2="125" stroke={stitch} strokeWidth="0.8" strokeDasharray="2 1.5" />
            <line x1="110" y1="42" x2="110" y2="125" stroke={stitch} strokeWidth="0.8" strokeDasharray="2 1.5" />

            {/* Pearlescent 4-hole Placket Buttons with cross thread */}
            <g transform="translate(100, 68)">
              <circle cx="0" cy="0" r="4.5" fill={pearlButton} stroke={buttonBorder} strokeWidth="1.2" />
              <circle cx="-1.5" cy="-1.5" r="0.7" fill={stroke} />
              <circle cx="1.5" cy="-1.5" r="0.7" fill={stroke} />
              <circle cx="-1.5" cy="1.5" r="0.7" fill={stitch} />
              <circle cx="1.5" cy="1.5" r="0.7" fill={stitch} />
              <path d="M-1.5 -1.5 L1.5 1.5 M-1.5 1.5 L1.5 -1.5" stroke={accent} strokeWidth="0.6" />
            </g>
            <g transform="translate(100, 102)">
              <circle cx="0" cy="0" r="4.5" fill={pearlButton} stroke={buttonBorder} strokeWidth="1.2" />
              <circle cx="-1.5" cy="-1.5" r="0.7" fill={stroke} />
              <circle cx="1.5" cy="-1.5" r="0.7" fill={stroke} />
              <circle cx="-1.5" cy="1.5" r="0.7" fill={stitch} />
              <circle cx="1.5" cy="1.5" r="0.7" fill={stitch} />
              <path d="M-1.5 -1.5 L1.5 1.5 M-1.5 1.5 L1.5 -1.5" stroke={accent} strokeWidth="0.6" />
            </g>

            {/* Inner Neck Collarband */}
            <path d="M72 32 Q100 24 128 32 L100 48 Z" fill="#CBD5E1" stroke={stroke} strokeWidth="1.2" />
            <line x1="100" y1="36" x2="100" y2="44" stroke="#94A3B8" strokeWidth="1" strokeDasharray="1.5 1" />

            {/* Realistic 3D Pointed Collar Leaves */}
            {/* Left Collar Leaf */}
            <path
              d="M72 30 Q88 28 100 42 L80 68 L60 40 Z"
              fill="url(#collarGrad_pc)"
              stroke={stroke}
              strokeWidth="1.6"
              strokeLinejoin="round"
              filter="url(#shadow_pc)"
            />
            {/* Left Edge Topstitch */}
            <path d="M74 33 Q88 31 98 42 L80 64 L63 41" stroke={stitch} strokeWidth="0.75" strokeDasharray="2 1.5" fill="none" />

            {/* Right Collar Leaf */}
            <path
              d="M128 30 Q112 28 100 42 L120 68 L140 40 Z"
              fill="url(#collarGrad_pc)"
              stroke={stroke}
              strokeWidth="1.6"
              strokeLinejoin="round"
              filter="url(#shadow_pc)"
            />
            {/* Right Edge Topstitch */}
            <path d="M126 33 Q112 31 102 42 L120 64 L137 41" stroke={stitch} strokeWidth="0.75" strokeDasharray="2 1.5" fill="none" />

            {/* Collar Point Angle Indicator Badge */}
            <g transform="translate(100, 114)">
              <rect x="-42" y="-9" width="84" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Pointed 2.75" Tips
              </text>
            </g>
          </svg>
        );

      case 'spread_wide':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_sw" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
              <linearGradient id="collarGrad_sw" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothDeep} />
              </linearGradient>
              <filter id="shadow_sw" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.18" />
              </filter>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_sw)" />

            {/* Shirt Body & Placket */}
            <path d="M40 120 L40 60 L68 35 L100 42 L132 35 L160 60 L160 120 Z" fill="#E2E8F0" opacity="0.4" />
            <path d="M86 40 L86 125 L114 125 L114 40 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1" />
            <line x1="90" y1="40" x2="90" y2="125" stroke={stitch} strokeWidth="0.8" strokeDasharray="2 1.5" />
            <line x1="110" y1="40" x2="110" y2="125" stroke={stitch} strokeWidth="0.8" strokeDasharray="2 1.5" />

            {/* Neck opening tie-space */}
            <path d="M72 32 Q100 24 128 32 L100 42 Z" fill="#94A3B8" stroke={stroke} strokeWidth="1.2" />

            {/* Button */}
            <circle cx="100" cy="72" r="4.5" fill={pearlButton} stroke={buttonBorder} strokeWidth="1.2" />
            <circle cx="98.5" cy="70.5" r="0.7" fill={stroke} />
            <circle cx="101.5" cy="70.5" r="0.7" fill={stroke} />
            <circle cx="98.5" cy="73.5" r="0.7" fill={stitch} />
            <circle cx="101.5" cy="73.5" r="0.7" fill={stitch} />

            {/* Wide Spread Cutaway Leaves angled strongly to the sides */}
            {/* Left Leaf (Angled Outward) */}
            <path
              d="M74 30 Q90 28 100 38 L54 52 L54 36 Z"
              fill="url(#collarGrad_sw)"
              stroke={stroke}
              strokeWidth="1.6"
              strokeLinejoin="round"
              filter="url(#shadow_sw)"
            />
            <path d="M76 33 Q88 31 96 38 L58 49 L58 38" stroke={stitch} strokeWidth="0.75" strokeDasharray="2 1.5" fill="none" />

            {/* Right Leaf (Angled Outward) */}
            <path
              d="M126 30 Q110 28 100 38 L146 52 L146 36 Z"
              fill="url(#collarGrad_sw)"
              stroke={stroke}
              strokeWidth="1.6"
              strokeLinejoin="round"
              filter="url(#shadow_sw)"
            />
            <path d="M124 33 Q112 31 104 38 L142 49 L142 38" stroke={stitch} strokeWidth="0.75" strokeDasharray="2 1.5" fill="none" />

            {/* Spread Angle Arc Indicator */}
            <path d="M68 48 Q100 38 132 48" stroke={accent} strokeWidth="1.2" strokeDasharray="2 2" fill="none" />
            
            <g transform="translate(100, 114)">
              <rect x="-48" y="-9" width="96" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                120° Wide Cutaway
              </text>
            </g>
          </svg>
        );

      case 'band_mandarin':
      case 'standard_standing':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_bm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
              <linearGradient id="bandGrad_bm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothDeep} />
              </linearGradient>
              <filter id="shadow_bm" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.15" />
              </filter>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_bm)" />

            {/* Shirt Body & Center Placket */}
            <path d="M45 120 L45 60 L70 38 L130 38 L155 60 L155 120 Z" fill="#E2E8F0" opacity="0.3" />
            <path d="M88 40 L88 125 L112 125 L112 40 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1" />
            <line x1="92" y1="40" x2="92" y2="125" stroke={stitch} strokeWidth="0.8" strokeDasharray="2 1.5" />
            <line x1="108" y1="40" x2="108" y2="125" stroke={stitch} strokeWidth="0.8" strokeDasharray="2 1.5" />

            {/* Standing Mandarin / Nehru Band Collar */}
            <path
              d="M68 40 C68 22 132 22 132 40 C132 46 124 48 114 48 L86 48 C76 48 68 46 68 40 Z"
              fill="url(#bandGrad_bm)"
              stroke={stroke}
              strokeWidth="1.8"
              filter="url(#shadow_bm)"
            />
            {/* Topstitch along band curve */}
            <path
              d="M72 38 C72 26 128 26 128 38"
              stroke={stitch}
              strokeWidth="0.8"
              strokeDasharray="2 1.5"
              fill="none"
            />
            {/* Band collar button & buttonhole */}
            <circle cx="100" cy="38" r="3.2" fill={pearlButton} stroke={buttonBorder} strokeWidth="1" />
            <circle cx="99" cy="37" r="0.5" fill={stroke} />
            <circle cx="101" cy="37" r="0.5" fill={stroke} />
            <circle cx="99" cy="39" r="0.5" fill={stroke} />
            <circle cx="101" cy="39" r="0.5" fill={stroke} />

            {/* Placket button */}
            <circle cx="100" cy="72" r="4.2" fill={pearlButton} stroke={buttonBorder} strokeWidth="1" />
            <circle cx="100" cy="100" r="4.2" fill={pearlButton} stroke={buttonBorder} strokeWidth="1" />

            <g transform="translate(100, 114)">
              <rect x="-44" y="-9" width="88" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                1.25" Standing Band
              </text>
            </g>
          </svg>
        );

      case 'button_down':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_bd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
              <linearGradient id="collarGrad_bd" x1="0" y1="0" x2="0.8" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothDeep} />
              </linearGradient>
              <filter id="shadow_bd" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.18" />
              </filter>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_bd)" />

            {/* Placket */}
            <path d="M86 42 L86 125 L114 125 L114 42 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1" />
            <line x1="90" y1="42" x2="90" y2="125" stroke={stitch} strokeWidth="0.8" strokeDasharray="2 1.5" />
            <line x1="110" y1="42" x2="110" y2="125" stroke={stitch} strokeWidth="0.8" strokeDasharray="2 1.5" />

            {/* Collar Leaves */}
            <path
              d="M72 30 Q88 28 100 42 L84 66 L64 38 Z"
              fill="url(#collarGrad_bd)"
              stroke={stroke}
              strokeWidth="1.6"
              strokeLinejoin="round"
              filter="url(#shadow_bd)"
            />
            <path
              d="M128 30 Q112 28 100 42 L116 66 L136 38 Z"
              fill="url(#collarGrad_bd)"
              stroke={stroke}
              strokeWidth="1.6"
              strokeLinejoin="round"
              filter="url(#shadow_bd)"
            />

            {/* Tiny mother-of-pearl buttons anchoring the collar tips */}
            <g transform="translate(83, 62)">
              <circle cx="0" cy="0" r="3.2" fill={pearlButton} stroke={buttonBorder} strokeWidth="1" />
              <line x1="-1" y1="-1" x2="1" y2="1" stroke={stroke} strokeWidth="0.6" />
              <line x1="-1" y1="1" x2="1" y2="-1" stroke={stroke} strokeWidth="0.6" />
            </g>
            <g transform="translate(117, 62)">
              <circle cx="0" cy="0" r="3.2" fill={pearlButton} stroke={buttonBorder} strokeWidth="1" />
              <line x1="-1" y1="-1" x2="1" y2="1" stroke={stroke} strokeWidth="0.6" />
              <line x1="-1" y1="1" x2="1" y2="-1" stroke={stroke} strokeWidth="0.6" />
            </g>

            {/* Placket Button */}
            <circle cx="100" cy="74" r="4.2" fill={pearlButton} stroke={buttonBorder} strokeWidth="1.2" />

            <g transform="translate(100, 114)">
              <rect x="-48" y="-9" width="96" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Anchored Tip Buttons
              </text>
            </g>
          </svg>
        );

      case 'club_round':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_cr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
              <linearGradient id="collarGrad_cr" x1="0" y1="0" x2="0.8" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothDeep} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_cr)" />
            <path d="M86 42 L86 125 L114 125 L114 42 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1" />

            {/* Rounded Club Collar Points */}
            <path
              d="M74 30 Q90 28 100 42 L84 56 C74 58 64 48 64 36 Z"
              fill="url(#collarGrad_cr)"
              stroke={stroke}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M126 30 Q110 28 100 42 L116 56 C126 58 136 48 136 36 Z"
              fill="url(#collarGrad_cr)"
              stroke={stroke}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />

            <circle cx="100" cy="74" r="4.2" fill={pearlButton} stroke={buttonBorder} strokeWidth="1.2" />

            <g transform="translate(100, 114)">
              <rect x="-48" y="-9" width="96" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Smooth Rounded Tips
              </text>
            </g>
          </svg>
        );

      case 'wingtip_tux':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_wt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_wt)" />
            {/* Tuxedo Neckband */}
            <rect x="70" y="30" width="60" height="20" rx="3" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            
            {/* Wingtip Downward Triangular Flaps */}
            <polygon points="72,34 88,34 76,50" fill="#E2E8F0" stroke={stroke} strokeWidth="1.5" />
            <polygon points="128,34 112,34 124,50" fill="#E2E8F0" stroke={stroke} strokeWidth="1.5" />

            {/* Black Bowtie Silhouette */}
            <g transform="translate(100, 48)">
              <polygon points="0,0 -18,-7 -18,7" fill="#0F172A" />
              <polygon points="0,0 18,-7 18,7" fill="#0F172A" />
              <rect x="-3.5" y="-5" width="7" height="10" rx="2" fill="#1E293B" />
            </g>

            {/* Pleated tuxedo front bib */}
            <line x1="88" y1="62" x2="88" y2="105" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="94" y1="62" x2="94" y2="105" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="106" y1="62" x2="106" y2="105" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="112" y1="62" x2="112" y2="105" stroke="#CBD5E1" strokeWidth="1" />
            <circle cx="100" cy="74" r="3" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1" />

            <g transform="translate(100, 114)">
              <rect x="-46" y="-9" width="92" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Tuxedo Wingtip
              </text>
            </g>
          </svg>
        );

      // ====================================================
      // 2. SLEEVES & CUFFS (Realistic Barrel, French & Tabs)
      // ====================================================
      case 'full_sleeve_round_cuff':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_rc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
              <linearGradient id="cuffGrad_rc" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothDeep} />
              </linearGradient>
              <filter id="shadow_rc" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.15" />
              </filter>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_rc)" />

            {/* Forearm Sleeve Cloth */}
            <path d="M78 12 L70 65 L130 65 L122 12 Z" fill="#E2E8F0" opacity="0.4" stroke={stroke} strokeWidth="1" />
            {/* Sleeve Placket Slit with gauntlet button */}
            <path d="M96 22 L96 65 L104 65 L104 22 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="0.8" />
            <circle cx="100" cy="42" r="2.5" fill={pearlButton} stroke={buttonBorder} strokeWidth="0.8" />

            {/* 3D Round Barrel Cuff */}
            <path
              d="M66 65 L134 65 C134 82 126 90 112 90 L88 90 C74 90 66 82 66 65 Z"
              fill="url(#cuffGrad_rc)"
              stroke={stroke}
              strokeWidth="1.6"
              filter="url(#shadow_rc)"
            />
            {/* Edge Topstitching */}
            <path
              d="M70 69 L130 69 C130 80 124 86 110 86 L90 86 C76 86 70 80 70 69 Z"
              stroke={stitch}
              strokeWidth="0.75"
              strokeDasharray="2 1.5"
              fill="none"
            />

            {/* Mother-of-pearl Cuff Button with 4 holes */}
            <g transform="translate(118, 77)">
              <circle cx="0" cy="0" r="4.2" fill={pearlButton} stroke={buttonBorder} strokeWidth="1.2" />
              <circle cx="-1.2" cy="-1.2" r="0.6" fill={stroke} />
              <circle cx="1.2" cy="-1.2" r="0.6" fill={stroke} />
              <circle cx="-1.2" cy="1.2" r="0.6" fill={stroke} />
              <circle cx="1.2" cy="1.2" r="0.6" fill={stroke} />
            </g>

            {/* Buttonhole */}
            <line x1="80" y1="77" x2="88" y2="77" stroke={stitch} strokeWidth="1.4" strokeLinecap="round" />

            <g transform="translate(100, 114)">
              <rect x="-50" y="-9" width="100" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                1-Button Round Barrel
              </text>
            </g>
          </svg>
        );

      case 'full_sleeve_angled_cuff':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_ac" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
              <linearGradient id="cuffGrad_ac" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothDeep} />
              </linearGradient>
              <filter id="shadow_ac" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.15" />
              </filter>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_ac)" />

            <path d="M78 12 L70 62 L130 62 L122 12 Z" fill="#E2E8F0" opacity="0.4" stroke={stroke} strokeWidth="1" />
            <path d="M96 22 L96 62 L104 62 L104 22 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="0.8" />
            <circle cx="100" cy="40" r="2.5" fill={pearlButton} stroke={buttonBorder} strokeWidth="0.8" />

            {/* Angled / Mitered Cut 45-degree cuff corners */}
            <polygon
              points="66,62 134,62 134,78 124,90 76,90 66,78"
              fill="url(#cuffGrad_ac)"
              stroke={stroke}
              strokeWidth="1.6"
              filter="url(#shadow_ac)"
            />
            {/* Topstitch */}
            <polygon
              points="70,65 130,65 130,76 122,86 78,86 70,76"
              stroke={stitch}
              strokeWidth="0.75"
              strokeDasharray="2 1.5"
              fill="none"
            />

            {/* Stacked 2 Buttons */}
            <circle cx="118" cy="71" r="3.8" fill={pearlButton} stroke={buttonBorder} strokeWidth="1.2" />
            <circle cx="118" cy="81" r="3.8" fill={pearlButton} stroke={buttonBorder} strokeWidth="1.2" />

            <g transform="translate(100, 114)">
              <rect x="-52" y="-9" width="104" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                45° Angled 2-Button
              </text>
            </g>
          </svg>
        );

      case 'full_sleeve_french_cuff':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_fc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
              <linearGradient id="goldCufflink" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
              <filter id="shadow_fc" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.15" />
              </filter>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_fc)" />

            <path d="M78 12 L70 52 L130 52 L122 12 Z" fill="#E2E8F0" opacity="0.4" stroke={stroke} strokeWidth="1" />

            {/* Double Length French Cuff Foldback Layer */}
            <rect x="62" y="52" width="76" height="38" rx="2" fill="#FFFFFF" stroke={stroke} strokeWidth="1.6" filter="url(#shadow_fc)" />
            {/* Fold crease */}
            <line x1="62" y1="71" x2="138" y2="71" stroke={stitch} strokeWidth="1.5" />
            <line x1="66" y1="56" x2="134" y2="56" stroke={stitch} strokeWidth="0.75" strokeDasharray="2 1.5" />
            <line x1="66" y1="86" x2="134" y2="86" stroke={stitch} strokeWidth="0.75" strokeDasharray="2 1.5" />

            {/* Gold Bespoke Cufflink Link Inserted */}
            <g transform="translate(100, 71)">
              <circle cx="0" cy="0" r="5.5" fill="url(#goldCufflink)" stroke="#78350F" strokeWidth="1" />
              <circle cx="0" cy="0" r="3" fill="#1E293B" />
              <rect x="-1" y="-5.5" width="2" height="11" fill="#FFFFFF" opacity="0.6" />
            </g>

            <g transform="translate(100, 114)">
              <rect x="-54" y="-9" width="108" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                French Double Fold + Link
              </text>
            </g>
          </svg>
        );

      case 'half_sleeve_folded':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_hs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_hs)" />

            {/* Half sleeve bicep cloth */}
            <path d="M60 20 L55 72 L145 72 L140 20 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* Clean folded hem band */}
            <rect x="54" y="70" width="92" height="18" rx="2" fill="#E2E8F0" stroke={stroke} strokeWidth="1.5" />
            <line x1="56" y1="78" x2="144" y2="78" stroke={stitch} strokeWidth="0.8" strokeDasharray="2 1.5" />

            <g transform="translate(100, 114)">
              <rect x="-50" y="-9" width="100" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                1" Clean Folded Hem
              </text>
            </g>
          </svg>
        );

      case 'rollup_tab_sleeve':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_rt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_rt)" />

            <path d="M65 15 L60 55 L140 55 L135 15 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* Rolled up fabric bundle */}
            <rect x="56" y="52" width="88" height="20" rx="5" fill="#E2E8F0" stroke={stroke} strokeWidth="1.6" />
            {/* Button Tab Strap */}
            <rect x="94" y="32" width="12" height="34" rx="2" fill="#CBD5E1" stroke={stroke} strokeWidth="1.2" />
            <circle cx="100" cy="42" r="3.5" fill={pearlButton} stroke={buttonBorder} strokeWidth="1" />

            <g transform="translate(100, 114)">
              <rect x="-50" y="-9" width="100" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Roll-Up Button Tab
              </text>
            </g>
          </svg>
        );

      // ====================================================
      // 3. POCKETS (Realistic 3D Patch, Welt & Flap)
      // ====================================================
      case 'single_patch_pocket':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_pp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
              <filter id="shadow_pp" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.15" />
              </filter>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_pp)" />

            {/* Shirt Chest Fabric Grid Texture */}
            <line x1="30" y1="20" x2="170" y2="20" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="30" y1="50" x2="170" y2="50" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="30" y1="80" x2="170" y2="80" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="3 3" />

            {/* 3D Patch Pocket with angled V-hem bottom */}
            <path
              d="M70 28 L130 28 L130 75 L100 92 L70 75 Z"
              fill="#FFFFFF"
              stroke={stroke}
              strokeWidth="1.6"
              filter="url(#shadow_pp)"
            />
            {/* Top hem fold */}
            <line x1="70" y1="36" x2="130" y2="36" stroke={stitch} strokeWidth="1" />
            {/* Perimeter Topstitching */}
            <path
              d="M74 38 L74 73 L100 88 L126 73 L126 38"
              stroke={stitch}
              strokeWidth="0.8"
              strokeDasharray="2 1.5"
              fill="none"
            />
            {/* Reinforced corner bar-tacks */}
            <line x1="68" y1="28" x2="72" y2="28" stroke="#DC2626" strokeWidth="2.5" />
            <line x1="128" y1="28" x2="132" y2="28" stroke="#DC2626" strokeWidth="2.5" />

            <g transform="translate(100, 114)">
              <rect x="-46" y="-9" width="92" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Classic Patch Pocket
              </text>
            </g>
          </svg>
        );

      case 'welt_pocket':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_wp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_wp)" />

            {/* Internal hidden pocket pouch indicator (dashed) */}
            <rect x="70" y="50" width="60" height="42" rx="3" fill="#E2E8F0" opacity="0.6" stroke={stitch} strokeWidth="1" strokeDasharray="3 2" />

            {/* Clean Inset Slit Welt Lip */}
            <rect x="62" y="44" width="76" height="12" rx="2" fill="#FFFFFF" stroke={stroke} strokeWidth="1.6" />
            <line x1="64" y1="47" x2="136" y2="47" stroke={stitch} strokeWidth="0.8" strokeDasharray="2 1.5" />
            <line x1="64" y1="53" x2="136" y2="53" stroke={stitch} strokeWidth="0.8" strokeDasharray="2 1.5" />

            {/* Clean slit opening line */}
            <line x1="62" y1="50" x2="138" y2="50" stroke={stroke} strokeWidth="1.2" />

            <g transform="translate(100, 114)">
              <rect x="-48" y="-9" width="96" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Clean Inset Welt Slit
              </text>
            </g>
          </svg>
        );

      case 'jetted_flap_pocket':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_jfp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
              <filter id="shadow_jfp" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.2" />
              </filter>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_jfp)" />

            {/* Pocket Body Below */}
            <path d="M68 40 L132 40 L132 85 L68 85 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />

            {/* 3D Folded Pocket Flap Cover */}
            <path
              d="M62 38 L138 38 L138 60 L100 70 L62 60 Z"
              fill="#FFFFFF"
              stroke={stroke}
              strokeWidth="1.6"
              filter="url(#shadow_jfp)"
            />
            {/* Topstitching along flap perimeter */}
            <path
              d="M66 41 L134 41 L134 58 L100 66 L66 58 Z"
              stroke={stitch}
              strokeWidth="0.8"
              strokeDasharray="2 1.5"
              fill="none"
            />
            {/* Button */}
            <circle cx="100" cy="54" r="3.2" fill={pearlButton} stroke={buttonBorder} strokeWidth="1" />

            <g transform="translate(100, 114)">
              <rect x="-48" y="-9" width="96" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Tailored Flap Cover
              </text>
            </g>
          </svg>
        );

      case 'double_utility_flaps':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_du" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_du)" />

            {/* Left Safari Flap Pocket */}
            <g transform="translate(30, 24)">
              <rect x="0" y="0" width="56" height="58" rx="3" fill="#FFFFFF" stroke={stroke} strokeWidth="1.4" />
              <line x1="28" y1="0" x2="28" y2="58" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M-2 0 L58 0 L58 18 L28 26 L-2 18 Z" fill="#E2E8F0" stroke={stroke} strokeWidth="1.4" />
              <circle cx="28" cy="14" r="2.8" fill={pearlButton} stroke={buttonBorder} strokeWidth="0.8" />
            </g>

            {/* Center Shirt Placket */}
            <line x1="100" y1="10" x2="100" y2="100" stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Right Safari Flap Pocket */}
            <g transform="translate(114, 24)">
              <rect x="0" y="0" width="56" height="58" rx="3" fill="#FFFFFF" stroke={stroke} strokeWidth="1.4" />
              <line x1="28" y1="0" x2="28" y2="58" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M-2 0 L58 0 L58 18 L28 26 L-2 18 Z" fill="#E2E8F0" stroke={stroke} strokeWidth="1.4" />
              <circle cx="28" cy="14" r="2.8" fill={pearlButton} stroke={buttonBorder} strokeWidth="0.8" />
            </g>

            <g transform="translate(100, 114)">
              <rect x="-52" y="-9" width="104" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Dual Safari Flap Pockets
              </text>
            </g>
          </svg>
        );

      case 'no_pocket_clean':
      case 'no_pocket':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_np" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_np)" />

            {/* Smooth Unbroken Chest Silhouette */}
            <path d="M50 20 Q100 15 150 20 L150 95 Q100 100 50 95 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            <line x1="100" y1="20" x2="100" y2="95" stroke={accent} strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="100" cy="45" r="3.5" fill={pearlButton} stroke={buttonBorder} strokeWidth="1" />
            <circle cx="100" cy="72" r="3.5" fill={pearlButton} stroke={buttonBorder} strokeWidth="1" />

            <g transform="translate(100, 114)">
              <rect x="-48" y="-9" width="96" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Clean Seamless Front
              </text>
            </g>
          </svg>
        );

      // ====================================================
      // 4. STITCHING & THREAD DETAILS (Microscope Detail Views)
      // ====================================================
      case 'standard_single_stitch':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_sss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_sss)" />

            {/* Fine Fabric Weave Threads in Navy */}
            <line x1="20" y1="35" x2="180" y2="35" stroke="#334155" strokeWidth="1" />
            <line x1="20" y1="50" x2="180" y2="50" stroke="#334155" strokeWidth="1" />
            <line x1="20" y1="65" x2="180" y2="65" stroke="#334155" strokeWidth="1" />
            <line x1="20" y1="80" x2="180" y2="80" stroke="#334155" strokeWidth="1" />

            {/* Ultra Crisp Single-Needle Stitch Line */}
            <line x1="20" y1="58" x2="180" y2="58" stroke={isSelected ? '#FDBA74' : '#E2E8F0'} strokeWidth="3" strokeDasharray="7 3.5" strokeLinecap="round" />
            
            {/* Precision Ruler Annotation */}
            <line x1="40" y1="42" x2="160" y2="42" stroke={accent} strokeWidth="0.8" />
            <text x="100" y="38" textAnchor="middle" fontSize="8" fill="#94A3B8" fontFamily="monospace">
              18 Stitches Per Inch (SPI)
            </text>

            <g transform="translate(100, 114)">
              <rect x="-52" y="-9" width="104" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#334155'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Single Needle 18-SPI
              </text>
            </g>
          </svg>
        );

      case 'double_stitching':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_ds" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_ds)" />

            {/* Twin Parallel Heavy-Duty Topstitch Lines */}
            <line x1="20" y1="48" x2="180" y2="48" stroke={isSelected ? '#FDBA74' : '#F59E0B'} strokeWidth="2.8" strokeDasharray="8 4" strokeLinecap="round" />
            <line x1="20" y1="62" x2="180" y2="62" stroke={isSelected ? '#FDBA74' : '#F59E0B'} strokeWidth="2.8" strokeDasharray="8 4" strokeLinecap="round" />

            <g transform="translate(100, 114)">
              <rect x="-54" y="-9" width="108" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#334155'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Reinforced Twin Stitch
              </text>
            </g>
          </svg>
        );

      case 'amf_pick_stitching':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_amf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_amf)" />

            {/* Suit Lapel Outer Edge */}
            <path d="M40 20 L160 20 L160 85 L40 85 Z" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
            
            {/* AMF Pick Stitching 2mm from edge */}
            <path
              d="M48 28 L152 28 L152 77 L48 77 Z"
              stroke={isSelected ? '#FDBA74' : '#FFFFFF'}
              strokeWidth="2.2"
              strokeDasharray="2 5"
              strokeLinecap="round"
              fill="none"
            />

            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#334155'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Hand-Pick Sartorial AMF
              </text>
            </g>
          </svg>
        );

      case 'french_enclosed_seams':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_fes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_fes)" />

            {/* Folded Over Encapsulated Inner Seam cross-section */}
            <path d="M30 45 C70 45 70 65 110 65 C150 65 150 45 170 45" stroke={stroke} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M30 55 C70 55 70 75 110 75 C150 75 150 55 170 55" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Concealed inner stitch needle point */}
            <circle cx="110" cy="70" r="3" fill="#DC2626" />
            <text x="100" y="32" textAnchor="middle" fontSize="8" fill="#475569" fontWeight="bold">
              100% Enclosed Zero-Fray Inside
            </text>

            <g transform="translate(100, 114)">
              <rect x="-52" y="-9" width="104" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                French Enclosed Seams
              </text>
            </g>
          </svg>
        );

      // ====================================================
      // 5. SUITS, LAPELS & VENTS
      // ====================================================
      case 'notch_lapel':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_nl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_nl)" />

            {/* Suit Collar and Step Notch */}
            <path d="M70 15 L100 15 L95 42 L65 42 Z" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
            {/* Notch V Step */}
            <polygon points="65,42 95,42 90,52 60,78 50,78 65,42" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
            {/* Step notch angle callout */}
            <circle cx="65" cy="42" r="3" fill="#DC4D05" />

            <g transform="translate(100, 114)">
              <rect x="-48" y="-9" width="96" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#334155'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                75° Step Notch Lapel
              </text>
            </g>
          </svg>
        );

      case 'peak_lapel':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_pl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_pl)" />

            {/* Peak Lapel Pointing Upward */}
            <polygon points="65,18 95,18 92,44 48,34 52,78 88,44" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="48" cy="34" r="3" fill="#DC4D05" />

            <g transform="translate(100, 114)">
              <rect x="-52" y="-9" width="104" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#334155'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Upward Peak Arrow Lapel
              </text>
            </g>
          </svg>
        );

      case 'shawl_lapel':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="satinGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="#0F172A" />

            {/* Smooth Continuous Satin Roll */}
            <path
              d="M70 18 Q100 15 130 18 Q125 50 100 80 Q75 50 70 18 Z"
              fill="url(#satinGrad)"
              stroke="#94A3B8"
              strokeWidth="1.6"
            />

            <g transform="translate(100, 114)">
              <rect x="-50" y="-9" width="100" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#334155'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Continuous Shawl Satin
              </text>
            </g>
          </svg>
        );

      // ====================================================
      // 6. PANTS & BOTTOMS (Flat, Pleats, Pockets)
      // ====================================================
      case 'flat_front':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_ff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_ff)" />

            {/* Waistband */}
            <rect x="50" y="18" width="100" height="16" rx="2" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            <circle cx="100" cy="26" r="3" fill={pearlButton} stroke={buttonBorder} strokeWidth="0.8" />
            {/* Belt Loops */}
            <line x1="65" y1="18" x2="65" y2="34" stroke={stroke} strokeWidth="2.5" />
            <line x1="135" y1="18" x2="135" y2="34" stroke={stroke} strokeWidth="2.5" />

            {/* Pant Trouser Front with Sharp Center Crease */}
            <path d="M50 34 L62 95 L95 95 L100 55 L105 95 L138 95 L150 34 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* Sharp Ironed Center Creases */}
            <line x1="78" y1="34" x2="78" y2="95" stroke={accent} strokeWidth="1.2" />
            <line x1="122" y1="34" x2="122" y2="95" stroke={accent} strokeWidth="1.2" />

            <g transform="translate(100, 114)">
              <rect x="-48" y="-9" width="96" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Flat Front (No Pleats)
              </text>
            </g>
          </svg>
        );

      case 'single_pleat':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_sp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_sp)" />

            <rect x="50" y="18" width="100" height="16" rx="2" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            <path d="M50 34 L60 95 L95 95 L100 55 L105 95 L140 95 L150 34 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />

            {/* Single Forward Fold Pleats */}
            <path d="M78 34 C76 45 74 60 76 95" stroke={stroke} strokeWidth="1.8" fill="none" />
            <path d="M122 34 C124 45 126 60 124 95" stroke={stroke} strokeWidth="1.8" fill="none" />

            <g transform="translate(100, 114)">
              <rect x="-50" y="-9" width="100" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                1 Forward Comfort Pleat
              </text>
            </g>
          </svg>
        );

      case 'double_pleat':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_dp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_dp)" />

            <rect x="50" y="18" width="100" height="16" rx="2" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            <path d="M50 34 L58 95 L95 95 L100 55 L105 95 L142 95 L150 34 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />

            {/* Dual forward pleats on both legs */}
            <line x1="72" y1="34" x2="70" y2="95" stroke={stroke} strokeWidth="1.8" />
            <line x1="82" y1="34" x2="80" y2="70" stroke={accent} strokeWidth="1.4" />
            <line x1="128" y1="34" x2="130" y2="95" stroke={stroke} strokeWidth="1.8" />
            <line x1="118" y1="34" x2="120" y2="70" stroke={accent} strokeWidth="1.4" />

            <g transform="translate(100, 114)">
              <rect x="-52" y="-9" width="104" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Dual Sartorial Pleats
              </text>
            </g>
          </svg>
        );

      // ====================================================
      // 7. WOMEN'S NECKLINES & CUTS
      // ====================================================
      case 'sweetheart_piping':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_shp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_shp)" />

            <path d="M45 15 L155 15 L155 95 L45 95 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />

            {/* Sweetheart Neck Cutout */}
            <path
              d="M75 15 C85 40 90 48 100 58 C110 48 115 40 125 15"
              fill={clothShade}
              stroke={stroke}
              strokeWidth="2"
            />
            {/* Contrast Color Piping Ribbon */}
            <path
              d="M75 15 C85 40 90 48 100 58 C110 48 115 40 125 15"
              stroke="#DC4D05"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            <g transform="translate(100, 114)">
              <rect x="-52" y="-9" width="104" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Sweetheart Piped Neck
              </text>
            </g>
          </svg>
        );

      case 'chinese_collar_v':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_ccv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_ccv)" />

            <path d="M45 15 L155 15 L155 95 L45 95 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />

            {/* Standing Band */}
            <path d="M70 28 C70 16 130 16 130 28" stroke={stroke} strokeWidth="4" fill="none" />
            {/* 3" V-Slit */}
            <polygon points="90,28 110,28 100,58" fill={clothShade} stroke={stroke} strokeWidth="1.6" />

            <g transform="translate(100, 114)">
              <rect x="-50" y="-9" width="100" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Stand Collar + V-Slit
              </text>
            </g>
          </svg>
        );

      case 'deep_u_latkan':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_dul" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
              <linearGradient id="goldTassel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_dul)" />

            {/* Blouse Back Cutout */}
            <path d="M45 15 L155 15 L155 85 L45 85 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            <path d="M75 15 C75 60 125 60 125 15 Z" fill={clothShade} stroke={stroke} strokeWidth="2" />

            {/* Cross Tie Strings with Dangling Gold Latkan Tassels */}
            <path d="M76 22 Q100 32 94 48" stroke="#D97706" strokeWidth="1.5" fill="none" />
            <path d="M124 22 Q100 32 106 48" stroke="#D97706" strokeWidth="1.5" fill="none" />
            
            {/* Left Tassel */}
            <polygon points="94,48 90,62 98,62" fill="url(#goldTassel)" stroke="#78350F" strokeWidth="0.8" />
            <circle cx="94" cy="48" r="2.5" fill="#FDE047" />

            {/* Right Tassel */}
            <polygon points="106,48 102,62 110,62" fill="url(#goldTassel)" stroke="#78350F" strokeWidth="0.8" />
            <circle cx="106" cy="48" r="2.5" fill="#FDE047" />

            <g transform="translate(100, 114)">
              <rect x="-52" y="-9" width="104" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Deep U-Back with Latkans
              </text>
            </g>
          </svg>
        );

      case 'princess_cut':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_pr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_pr)" />

            {/* Blouse Body */}
            <path d="M50 20 L150 20 L145 85 L55 85 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            
            {/* Seamless 3D Princess Curves from armhole down over bust */}
            <path d="M60 25 Q78 52 82 85" stroke="#DC4D05" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M140 25 Q122 52 118 85" stroke="#DC4D05" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            
            <g transform="translate(100, 114)">
              <rect x="-54" y="-9" width="108" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Seamless Princess 3D Fit
              </text>
            </g>
          </svg>
        );

      // ====================================================
      // 8. SALWAR KAMEEZ & THREE-PIECE MODERN BOUTIQUE ARTWORK
      // ====================================================
      case 'kameez_straight_long':
      case 'kameez_straight_classic':
      case 'kameez_front_slit_layer':
      case 'kameez_asymmetric_high_low':
      case 'kameez_coord_boxy_tunic':
      case 'kameez_a_line_flare':
      case 'kameez_angrakha_wrap':
      case 'kameez_anarkali_kalidar':
      case 'kameez_short_kurti':
      case 'neck_organza_lace_v':
      case 'pan_pata_piping':
      case 'deep_pan_cut':
      case 'neck_keyhole_pearl_loop':
      case 'neck_stand_mandarin_zip':
      case 'mandarin_potli':
      case 'neck_square_crochet':
      case 'neck_sweetheart_sheer':
      case 'neck_overlap_angrakha_modern':
      case 'angrakha_v_dori':
      case 'boat_neck_pearl':
      case 'boat_neck':
      case 'round_gotta_patti':
      case 'round_potli':
      case 'sleeve_organza_pintucks':
      case 'sleeve_three_quarter_border':
      case 'three_quarter_plain':
      case 'sleeve_bishop_smocked':
      case 'sleeve_pleated_pearl_cuff':
      case 'sleeve_full_potli_cuff':
      case 'full_sleeve_cuff':
      case 'sleeve_flared_flounce':
      case 'sleeve_flared_bell':
      case 'bell_sleeve':
      case 'sleeve_straight_notch_beads':
      case 'sleeve_modern_sleeveless':
      case 'sleeve_sleeveless_piping':
      case 'sleeve_churidar_gathers':
      case 'sleeve_tulip_petal':
      case 'bottom_cigarette_organza':
      case 'bottom_straight_culottes':
      case 'bottom_tulip_pant':
      case 'bottom_palazzo_lace':
      case 'bottom_elastic_semi_pant':
      case 'bottom_traditional_salwar':
      case 'traditional_salwar':
      case 'bottom_patiala_pleated':
      case 'bottom_pant_salwar':
      case 'pant_cut_salwar':
      case 'bottom_flared_palazzo':
      case 'flared_palazzo':
      case 'bottom_dhoti_salwar':
      case 'dhoti_salwar':
      case 'bottom_churidar_tight':
      case 'border_organza_schiffli':
      case 'border_multi_pintucks':
      case 'border_scallop_pearl_drops':
      case 'border_concealed_facing':
      case 'border_contrast_piping':
      case 'border_gotta_patti':
      case 'border_scallop_cutwork':
      case 'border_clean_torpai':
      case 'dupatta_organza_extension':
      case 'dupatta_four_side_crochet':
      case 'dupatta_handmade_pearl_fringes':
      case 'dupatta_minimal_laser_scallop':
      case 'dupatta_pico_interlock':
      case 'dupatta_four_corner_latkans':
      case 'dupatta_all_around_zari':
        return (
          <ThreePieceCustomizationArt
            optionId={optionId}
            isSelected={isSelected}
            className="w-full h-full"
          />
        );

      // Astra / Linings
      case 'astra_soft_malmal':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_asm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_asm)" />
            {/* Outer Georgette Layer */}
            <path d="M50 25 L150 25 L150 85 L50 85 Z" fill="#FDE68A" opacity="0.5" stroke="#F59E0B" strokeWidth="1.5" />
            {/* Inner Malmal Cotton Layer */}
            <path d="M56 31 L144 31 L144 79 L56 79 Z" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x="100" y="58" textAnchor="middle" fontSize="9" fill="#0369A1" fontWeight="bold">
              100% Breathable Malmal
            </text>
            <g transform="translate(100, 114)">
              <rect x="-52" y="-9" width="104" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Soft Malmal Cotton Astra
              </text>
            </g>
          </svg>
        );

      case 'astra_butter_silk':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_abs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_abs)" />
            <path d="M50 25 L150 25 L150 85 L50 85 Z" fill="#FCE7F3" opacity="0.6" stroke="#EC4899" strokeWidth="1.5" />
            {/* Butter Silk Sheen Layer */}
            <path d="M56 31 L144 31 L144 79 L56 79 Z" fill="#FFF1F2" stroke="#E11D48" strokeWidth="1.5" />
            <path d="M60 40 Q100 55 140 40" stroke="#FB7185" strokeWidth="2" fill="none" />
            <text x="100" y="62" textAnchor="middle" fontSize="9" fill="#9F1239" fontWeight="bold">
              Heavy Butter Silk Satin
            </text>
            <g transform="translate(100, 114)">
              <rect x="-52" y="-9" width="104" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Butter Silk Satin Astra
              </text>
            </g>
          </svg>
        );

      case 'astra_customer_provided':
      case 'astra_no_lining':
      case 'no_lining':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_anl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_anl)" />
            <path d="M50 25 L150 25 L150 85 L50 85 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.6" />
            <line x1="50" y1="55" x2="150" y2="55" stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="100" y="50" textAnchor="middle" fontSize="8.5" fill="#64748B" fontWeight="bold">
              {optionId === 'astra_customer_provided' ? 'Customer Cloth Provided' : 'Single Layer Opaque'}
            </text>
            <g transform="translate(100, 114)">
              <rect x="-48" y="-9" width="96" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                {optionId === 'astra_customer_provided' ? 'Customer Astra' : 'No Extra Lining'}
              </text>
            </g>
          </svg>
        );

      // Default Fallback: Detailed Technical Silhouette
      default:
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_def" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_def)" />

            <path d="M55 25 L145 25 L140 85 L60 85 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.6" />
            <line x1="100" y1="25" x2="100" y2="85" stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="100" cy="55" r="4.5" fill={pearlButton} stroke={buttonBorder} strokeWidth="1.2" />

            <g transform="translate(100, 114)">
              <rect x="-48" y="-9" width="96" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                {guide?.badge || optionId.replace(/_/g, ' ')}
              </text>
            </g>
          </svg>
        );
    }
  };

  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {renderComponent()}
    </div>
  );
};
