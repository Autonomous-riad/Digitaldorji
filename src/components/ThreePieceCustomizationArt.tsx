import React from 'react';
import { CUSTOMIZATION_GUIDES } from '../data/customizationGuides';

interface ThreePieceCustomizationArtProps {
  optionId: string;
  isSelected?: boolean;
  fabricColor?: string;
  className?: string;
}

export const ThreePieceCustomizationArt: React.FC<ThreePieceCustomizationArtProps> = ({
  optionId,
  isSelected = false,
  fabricColor = '#FFFFFF',
  className = 'w-full h-28',
}) => {
  const guide = CUSTOMIZATION_GUIDES[optionId];
  const isDark = fabricColor === '#1E293B' || fabricColor === '#0F172A' || fabricColor === '#4C0519';
  const clothBase = fabricColor || '#FFFFFF';
  const clothShade = isDark ? '#334155' : '#F1F5F9';
  const stroke = isDark ? '#94A3B8' : '#334155';
  const accent = isSelected ? '#DC4D05' : '#94A3B8';

  const renderArt = () => {
    switch (optionId) {
      // ==========================================
      // 1. KAMEEZ SILHOUETTES & CUTS
      // ==========================================
      case 'kameez_straight_long':
      case 'kameez_straight_classic':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_ksl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_ksl)" />
            {/* Long Slim Straight Silhouette (44"-48") */}
            <path d="M74 12 L64 26 L66 102 L134 102 L136 26 L126 12 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* High Side Slits starting from high hip */}
            <line x1="66" y1="56" x2="66" y2="102" stroke="#DC4D05" strokeWidth="2.5" />
            <line x1="134" y1="56" x2="134" y2="102" stroke="#DC4D05" strokeWidth="2.5" />
            <circle cx="66" cy="56" r="2.2" fill="#DC4D05" />
            <circle cx="134" cy="56" r="2.2" fill="#DC4D05" />
            {/* Sheer Organza & Schiffli Lace Patch at Damun Hem */}
            <rect x="66" y="90" width="68" height="12" fill="#F8FAFC" opacity="0.75" stroke="#CBD5E1" strokeWidth="0.8" />
            <line x1="66" y1="90" x2="134" y2="90" stroke="#D97706" strokeWidth="1.2" strokeDasharray="2 1.5" />
            <line x1="66" y1="102" x2="134" y2="102" stroke="#DC4D05" strokeWidth="2" />
            {/* Neckline preview */}
            <path d="M88 12 Q100 24 112 12" fill={clothShade} stroke={stroke} strokeWidth="1.2" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Long Straight Cut (44"-48")
              </text>
            </g>
          </svg>
        );

      case 'kameez_front_slit_layer':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_kfsl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_kfsl)" />
            {/* Base Kameez */}
            <path d="M74 12 L64 26 L66 102 L134 102 L136 26 L126 12 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* Center Front Open Slit Reveal */}
            <path d="M100 52 L90 102 L110 102 Z" fill="#FEF3C7" stroke="#DC4D05" strokeWidth="1.2" />
            <line x1="100" y1="24" x2="100" y2="52" stroke="#DC4D05" strokeWidth="1.5" strokeDasharray="2.5 1.5" />
            {/* Inner Cigarette Pants Peeking Through */}
            <line x1="94" y1="88" x2="106" y2="88" stroke="#D97706" strokeWidth="1.5" strokeDasharray="1.5 1" />
            <path d="M88 12 Q100 24 112 12" fill={clothShade} stroke={stroke} strokeWidth="1.2" />
            <g transform="translate(100, 114)">
              <rect x="-54" y="-9" width="108" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Front Center Open Slit
              </text>
            </g>
          </svg>
        );

      case 'kameez_asymmetric_high_low':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_kahl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_kahl)" />
            {/* Back Longer Draped Hem */}
            <path d="M66 85 Q100 110 134 85 L136 26 L126 12 L74 12 L64 26 Z" fill="#E2E8F0" opacity="0.6" stroke={stroke} strokeWidth="1.2" />
            {/* Front Curved High Hemline */}
            <path d="M74 12 L64 26 L66 88 Q100 78 134 88 L136 26 L126 12 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            <path d="M66 88 Q100 78 134 88" stroke="#DC4D05" strokeWidth="2.5" fill="none" />
            <path d="M88 12 Q100 24 112 12" fill={clothShade} stroke={stroke} strokeWidth="1.2" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                High-Low Asymmetric Cut
              </text>
            </g>
          </svg>
        );

      case 'kameez_coord_boxy_tunic':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_kcbt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_kcbt)" />
            {/* Drop Shoulder Relaxed Boxy Tunic */}
            <path d="M76 12 L56 26 L58 92 L142 92 L144 26 L124 12 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* Minimal Side Vents */}
            <line x1="58" y1="74" x2="58" y2="92" stroke="#DC4D05" strokeWidth="2.5" />
            <line x1="142" y1="74" x2="142" y2="92" stroke="#DC4D05" strokeWidth="2.5" />
            <line x1="58" y1="90" x2="142" y2="90" stroke="#DC4D05" strokeWidth="1.5" />
            <path d="M88 12 Q100 24 112 12" fill={clothShade} stroke={stroke} strokeWidth="1.2" />
            <g transform="translate(100, 114)">
              <rect x="-52" y="-9" width="104" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Boxy Tunic Co-Ord Cut
              </text>
            </g>
          </svg>
        );

      case 'kameez_a_line_flare':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_kalf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_kalf)" />
            {/* Modern Streamlined A-Line Body */}
            <path d="M74 12 L62 26 L48 100 Q100 106 152 100 L138 26 L126 12 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            <path d="M48 100 Q100 106 152 100" stroke="#DC4D05" strokeWidth="2.5" fill="none" />
            <path d="M88 12 Q100 24 112 12" fill={clothShade} stroke={stroke} strokeWidth="1.2" />
            <g transform="translate(100, 114)">
              <rect x="-54" y="-9" width="108" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Modern A-Line Flared Cut
              </text>
            </g>
          </svg>
        );

      // ==========================================
      // 2. MODERN NECKLINES & LACES
      // ==========================================
      case 'neck_organza_lace_v':
      case 'pan_pata_piping':
      case 'deep_pan_cut':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_nolv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_nolv)" />
            <path d="M45 15 L155 15 L155 95 L45 95 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* Sheer Organza Triangle Inset */}
            <polygon points="76,15 100,68 124,15" fill="#F8FAFC" opacity="0.7" stroke="#CBD5E1" strokeWidth="0.8" />
            {/* Sharp V-Notch with Schiffli Ladder Lace Trim */}
            <path d="M72 15 L100 68 L128 15" stroke="#DC4D05" strokeWidth="2.5" fill="none" />
            <line x1="100" y1="68" x2="100" y2="92" stroke="#DC4D05" strokeWidth="1.5" />
            {/* Schiffli Ladder Lace Insertion */}
            <path d="M76 15 L100 62 L124 15" stroke="#F8FAFC" strokeWidth="2.5" strokeDasharray="1.5 1.5" fill="none" />
            {/* Pearl Shank Buttons */}
            <circle cx="100" cy="74" r="2.2" fill="#FFFFFF" stroke="#DC4D05" strokeWidth="0.6" />
            <circle cx="100" cy="84" r="2.2" fill="#FFFFFF" stroke="#DC4D05" strokeWidth="0.6" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                V-Notch + Organza & Lace
              </text>
            </g>
          </svg>
        );

      case 'neck_keyhole_pearl_loop':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_nkpl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_nkpl)" />
            <path d="M45 15 L155 15 L155 95 L45 95 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* High Round Curve */}
            <path d="M76 15 Q100 32 124 15" fill={clothShade} stroke={stroke} strokeWidth="1.8" />
            {/* Teardrop Keyhole Aperture */}
            <path d="M100 32 Q91 52 100 68 Q109 52 100 32 Z" fill={clothShade} stroke="#DC4D05" strokeWidth="2" />
            {/* Hanging Pearl Bead */}
            <circle cx="100" cy="74" r="3.2" fill="#FFFFFF" stroke="#D97706" strokeWidth="1" />
            <g transform="translate(100, 114)">
              <rect x="-54" y="-9" width="108" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Keyhole + Pearl Loop
              </text>
            </g>
          </svg>
        );

      case 'neck_stand_mandarin_zip':
      case 'mandarin_potli':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_nsmz" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_nsmz)" />
            <path d="M45 15 L155 15 L155 95 L45 95 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* Sleek 0.75" Standing Mandarin Collar */}
            <path d="M76 24 C76 14 124 14 124 24" stroke={stroke} strokeWidth="4" fill="none" />
            <line x1="100" y1="24" x2="100" y2="82" stroke="#DC4D05" strokeWidth="1.8" />
            {/* Concealed Minimal Zipper Pull */}
            <rect x="98.5" y="44" width="3" height="8" rx="1.5" fill="#D97706" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Stand Collar + Minimal Slit
              </text>
            </g>
          </svg>
        );

      case 'neck_square_crochet':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_nsc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_nsc)" />
            <path d="M45 15 L155 15 L155 95 L45 95 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* Wide Crisp Square Neckline */}
            <path d="M72 15 L72 58 L128 58 L128 15 Z" fill={clothShade} stroke={stroke} strokeWidth="1.8" />
            {/* Delicate Cotton Crochet Lace Perimeter */}
            <path d="M70 15 L70 60 L130 60 L130 15" stroke="#F8FAFC" strokeWidth="3" strokeDasharray="2 1.5" fill="none" />
            <g transform="translate(100, 114)">
              <rect x="-54" y="-9" width="108" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Square Neck + Crochet Lace
              </text>
            </g>
          </svg>
        );

      case 'neck_sweetheart_sheer':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_nss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_nss)" />
            <path d="M45 15 L155 15 L155 95 L45 95 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* Sheer Organza Yoke Overlay */}
            <path d="M72 15 Q100 24 128 15 L124 64 Q100 76 76 64 Z" fill="#F8FAFC" opacity="0.65" stroke="#CBD5E1" strokeWidth="0.8" />
            {/* Sweetheart Neck Cut */}
            <path d="M76 15 Q76 46 100 66 Q124 46 124 15" stroke="#DC4D05" strokeWidth="2.2" fill="none" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Sweetheart + Sheer Panel
              </text>
            </g>
          </svg>
        );

      case 'neck_overlap_angrakha_modern':
      case 'angrakha_v_dori':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_noam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_noam)" />
            <path d="M45 15 L155 15 L155 95 L45 95 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* Modern Diagonal Overlap Wrap */}
            <path d="M68 15 L132 64 L132 95 L45 95 Z" fill="#FFF7ED" stroke="#DC4D05" strokeWidth="1.8" />
            <line x1="68" y1="15" x2="132" y2="64" stroke="#D97706" strokeWidth="2.2" strokeDasharray="3 1.5" />
            {/* Sleek Fabric Ribbon Tie */}
            <path d="M132 64 Q144 72 138 86" stroke="#DC4D05" strokeWidth="1.6" fill="none" />
            <circle cx="138" cy="86" r="2.2" fill="#D97706" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Modern Overlap Wrap + Tie
              </text>
            </g>
          </svg>
        );

      // ==========================================
      // 3. MODERN SLEEVES & DETAILING
      // ==========================================
      case 'sleeve_organza_pintucks':
      case 'sleeve_three_quarter_border':
      case 'three_quarter_plain':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_sop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_sop)" />
            {/* Sleeve Body */}
            <path d="M76 16 L124 16 L116 64 L84 64 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.6" />
            {/* 3" Sheer Organza Inset Panel */}
            <rect x="80" y="64" width="40" height="24" fill="#F8FAFC" opacity="0.65" stroke="#CBD5E1" strokeWidth="0.8" />
            {/* Ladder Lace & Horizontal Pintucks */}
            <line x1="80" y1="64" x2="120" y2="64" stroke="#D97706" strokeWidth="1.8" strokeDasharray="2 1.5" />
            <line x1="80" y1="72" x2="120" y2="72" stroke="#DC4D05" strokeWidth="1" />
            <line x1="80" y1="78" x2="120" y2="78" stroke="#DC4D05" strokeWidth="1" />
            <line x1="80" y1="88" x2="120" y2="88" stroke="#DC4D05" strokeWidth="2" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Organza Inset + Pintucks
              </text>
            </g>
          </svg>
        );

      case 'sleeve_bishop_smocked':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_sbs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_sbs)" />
            {/* Balloon Bishop Volume */}
            <path d="M78 16 Q52 50 68 76 L132 76 Q148 50 122 16 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.6" />
            {/* Smocked Elastic Gathers Cuff */}
            <rect x="74" y="76" width="52" height="14" rx="2" fill="#FEF3C7" stroke="#DC4D05" strokeWidth="1.2" />
            <line x1="74" y1="80" x2="126" y2="80" stroke="#DC4D05" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
            <line x1="74" y1="85" x2="126" y2="85" stroke="#DC4D05" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Bishop / Smocked Wrist
              </text>
            </g>
          </svg>
        );

      case 'sleeve_pleated_pearl_cuff':
      case 'sleeve_full_potli_cuff':
      case 'full_sleeve_cuff':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_sppc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_sppc)" />
            <path d="M78 16 L122 16 L114 68 L86 68 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.6" />
            {/* Pleated Cuff Band with Pearl Shank Buttons */}
            <rect x="84" y="68" width="32" height="20" rx="2" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
            {/* Knife Pleats */}
            <line x1="88" y1="68" x2="88" y2="88" stroke="#D97706" strokeWidth="0.8" />
            <line x1="94" y1="68" x2="94" y2="88" stroke="#D97706" strokeWidth="0.8" />
            <circle cx="106" cy="74" r="2.2" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.6" />
            <circle cx="106" cy="82" r="2.2" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.6" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Pleated Cuff + Pearl Buttons
              </text>
            </g>
          </svg>
        );

      case 'sleeve_flared_flounce':
      case 'sleeve_flared_bell':
      case 'bell_sleeve':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_sff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_sff)" />
            {/* Upper Sleeve Arm */}
            <path d="M80 16 L120 16 L112 50 L88 50 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.6" />
            {/* Circular Flounce Tier */}
            <path d="M88 50 L56 90 Q100 98 144 90 L112 50 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            <path d="M56 90 Q100 98 144 90" stroke="#F8FAFC" strokeWidth="2.8" strokeDasharray="2.5 1.5" fill="none" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Tiered Flounce / Bell + Lace
              </text>
            </g>
          </svg>
        );

      case 'sleeve_straight_notch_beads':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_ssnb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_ssnb)" />
            <path d="M78 16 L122 16 L116 78 L84 78 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.6" />
            {/* Side Wrist Slit Notch & Pearl Drop */}
            <line x1="84" y1="66" x2="84" y2="78" stroke="#DC4D05" strokeWidth="2" />
            <circle cx="84" cy="66" r="2.2" fill="#FFFFFF" stroke="#DC4D05" strokeWidth="0.6" />
            <line x1="116" y1="66" x2="116" y2="78" stroke="#DC4D05" strokeWidth="2" />
            <circle cx="116" cy="66" r="2.2" fill="#FFFFFF" stroke="#DC4D05" strokeWidth="0.6" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Straight 3/4 + Notch & Pearl
              </text>
            </g>
          </svg>
        );

      case 'sleeve_modern_sleeveless':
      case 'sleeve_sleeveless_piping':
      case 'sleeveless':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_sms" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_sms)" />
            <path d="M60 20 L140 20 L134 85 L66 85 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* Clean Curved Armhole Bias Facing */}
            <path d="M60 20 Q72 52 66 85" stroke="#DC4D05" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M140 20 Q128 52 134 85" stroke="#DC4D05" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Sleeveless + Clean Facing
              </text>
            </g>
          </svg>
        );

      // ==========================================
      // 4. MODERN BOTTOMS & TROUSERS
      // ==========================================
      case 'bottom_cigarette_organza':
      case 'bottom_pant_salwar':
      case 'pant_cut_salwar':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_bco" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_bco)" />
            <rect x="58" y="16" width="84" height="12" rx="2" fill="#FFFFFF" stroke={stroke} strokeWidth="1.4" />
            {/* Slim Straight Cigarette Trouser */}
            <path d="M58 28 L72 94 L88 94 L100 52 L112 94 L128 94 L142 28 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* 3" Sheer Organza Inset & Pintucks at Hem */}
            <rect x="72" y="80" width="16" height="14" fill="#F8FAFC" opacity="0.65" stroke="#CBD5E1" strokeWidth="0.8" />
            <rect x="112" y="80" width="16" height="14" fill="#F8FAFC" opacity="0.65" stroke="#CBD5E1" strokeWidth="0.8" />
            <line x1="72" y1="80" x2="88" y2="80" stroke="#D97706" strokeWidth="1.5" strokeDasharray="1.5 1" />
            <line x1="112" y1="80" x2="128" y2="80" stroke="#D97706" strokeWidth="1.5" strokeDasharray="1.5 1" />
            <line x1="72" y1="86" x2="88" y2="86" stroke="#DC4D05" strokeWidth="0.8" />
            <line x1="112" y1="86" x2="128" y2="86" stroke="#DC4D05" strokeWidth="0.8" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Cigarette Pant + Organza Hem
              </text>
            </g>
          </svg>
        );

      case 'bottom_straight_culottes':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_bscu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_bscu)" />
            <rect x="58" y="16" width="84" height="12" rx="2" fill="#FFFFFF" stroke={stroke} strokeWidth="1.4" />
            {/* Cropped Wide-Leg Culottes */}
            <path d="M58 28 L46 88 L92 88 L100 50 L108 88 L154 88 L142 28 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            <line x1="46" y1="84" x2="92" y2="84" stroke="#DC4D05" strokeWidth="1.2" strokeDasharray="3 2" />
            <line x1="108" y1="84" x2="154" y2="84" stroke="#DC4D05" strokeWidth="1.2" strokeDasharray="3 2" />
            <g transform="translate(100, 114)">
              <rect x="-54" y="-9" width="108" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Cropped Wide Culottes
              </text>
            </g>
          </svg>
        );

      case 'bottom_tulip_pant':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_btp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_btp)" />
            <rect x="58" y="16" width="84" height="12" rx="2" fill="#FFFFFF" stroke={stroke} strokeWidth="1.4" />
            {/* Overlapping Curved Tulip Petals */}
            <path d="M58 28 C48 56 54 82 72 94 L86 94 C92 70 96 46 100 40 C104 46 108 70 114 94 L128 94 C146 82 152 56 142 28 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* Delicate Lace along petal curves */}
            <path d="M52 50 Q74 72 86 94" stroke="#F8FAFC" strokeWidth="2.5" strokeDasharray="2 1.5" fill="none" />
            <path d="M148 50 Q126 72 114 94" stroke="#F8FAFC" strokeWidth="2.5" strokeDasharray="2 1.5" fill="none" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Tulip Pant + Lace Curves
              </text>
            </g>
          </svg>
        );

      case 'bottom_palazzo_lace':
      case 'bottom_flared_palazzo':
      case 'flared_palazzo':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_bpl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_bpl)" />
            <rect x="62" y="16" width="76" height="12" rx="2" fill="#FFFFFF" stroke={stroke} strokeWidth="1.4" />
            {/* Wide Skirt-Like Flared Palazzo with Schiffli Cutwork */}
            <path d="M62 28 L40 94 Q68 98 92 94 L100 50 L108 94 Q132 98 160 94 L138 28 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            {/* Scalloped Schiffli Embroidery Hem */}
            <rect x="40" y="84" width="52" height="10" fill="#FEF3C7" opacity="0.8" stroke="#D97706" strokeWidth="0.8" />
            <rect x="108" y="84" width="52" height="10" fill="#FEF3C7" opacity="0.8" stroke="#D97706" strokeWidth="0.8" />
            <circle cx="50" cy="89" r="1.5" fill="#D97706" />
            <circle cx="66" cy="89" r="1.5" fill="#D97706" />
            <circle cx="82" cy="89" r="1.5" fill="#D97706" />
            <circle cx="118" cy="89" r="1.5" fill="#D97706" />
            <circle cx="134" cy="89" r="1.5" fill="#D97706" />
            <circle cx="150" cy="89" r="1.5" fill="#D97706" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Flared Palazzo + Schiffli Lace
              </text>
            </g>
          </svg>
        );

      case 'bottom_elastic_semi_pant':
      case 'bottom_traditional_salwar':
      case 'traditional_salwar':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_besp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_besp)" />
            {/* Flat front waist with elastic back */}
            <rect x="58" y="16" width="84" height="12" rx="2" fill="#FFFFFF" stroke={stroke} strokeWidth="1.4" />
            <line x1="58" y1="20" x2="80" y2="20" stroke="#DC4D05" strokeWidth="1" strokeDasharray="1.5 1.5" />
            {/* Semi-Pant Silhouette with Side Pocket */}
            <path d="M58 28 L68 94 L88 94 L100 50 L112 94 L132 94 L142 28 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            <path d="M58 36 Q68 44 68 58" stroke="#DC4D05" strokeWidth="1.5" fill="none" />
            <line x1="68" y1="90" x2="88" y2="90" stroke="#DC4D05" strokeWidth="1.5" />
            <line x1="112" y1="90" x2="132" y2="90" stroke="#DC4D05" strokeWidth="1.5" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Comfort Semi-Pant + Pocket
              </text>
            </g>
          </svg>
        );

      // ==========================================
      // 5. DAMUN & SLIT DETAILING
      // ==========================================
      case 'border_organza_schiffli':
      case 'border_gotta_patti':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_bos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_bos)" />
            <path d="M40 20 L160 20 L160 62 L40 62 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.4" />
            {/* Sheer Organza 3" Patch */}
            <rect x="40" y="62" width="120" height="24" fill="#F8FAFC" opacity="0.7" stroke="#CBD5E1" strokeWidth="0.8" />
            {/* Joint Ladder Lace */}
            <line x1="40" y1="62" x2="160" y2="62" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />
            {/* Schiffli Cutout Eyelets */}
            {[52, 72, 92, 112, 132, 152].map((cx, i) => (
              <circle key={i} cx={cx} cy={74} r="2.5" fill="#CBD5E1" stroke="#D97706" strokeWidth="0.8" />
            ))}
            <line x1="40" y1="86" x2="160" y2="86" stroke="#DC4D05" strokeWidth="2.5" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Organza Patch + Schiffli Lace
              </text>
            </g>
          </svg>
        );

      case 'border_multi_pintucks':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_bmp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_bmp)" />
            <path d="M40 20 L160 20 L160 88 L40 88 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.4" />
            {/* Multi-Row Horizontal Pintucks */}
            <line x1="40" y1="46" x2="160" y2="46" stroke="#DC4D05" strokeWidth="1.2" />
            <line x1="40" y1="52" x2="160" y2="52" stroke="#DC4D05" strokeWidth="1.2" />
            <line x1="40" y1="58" x2="160" y2="58" stroke="#DC4D05" strokeWidth="1.2" />
            {/* Ladder Lace insertion */}
            <line x1="40" y1="68" x2="160" y2="68" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="40" y1="76" x2="160" y2="76" stroke="#DC4D05" strokeWidth="1.2" />
            <line x1="40" y1="82" x2="160" y2="82" stroke="#DC4D05" strokeWidth="1.2" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Pintucks + Ladder Lace Joint
              </text>
            </g>
          </svg>
        );

      case 'border_scallop_pearl_drops':
      case 'border_scallop_cutwork':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_bspd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_bspd)" />
            <path d="M40 20 L160 20 L160 70 Q150 80 140 70 Q130 80 120 70 Q110 80 100 70 Q90 80 80 70 Q70 80 60 70 Q50 80 40 70 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            <path d="M40 70 Q50 80 60 70 Q70 80 80 70 Q90 80 100 70 Q110 80 120 70 Q130 80 140 70 Q150 80 160 70" stroke="#DC4D05" strokeWidth="2" fill="none" />
            {/* Hanging Mini Pearl Drops */}
            {[50, 70, 90, 110, 130, 150].map((cx, i) => (
              <g key={i} transform={`translate(${cx}, 78)`}>
                <line x1="0" y1="0" x2="0" y2="6" stroke="#D97706" strokeWidth="1" />
                <circle cx="0" cy="7" r="2.2" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.6" />
              </g>
            ))}
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Scallop + Hanging Pearl Drops
              </text>
            </g>
          </svg>
        );

      case 'border_concealed_facing':
      case 'border_contrast_piping':
      case 'border_clean_torpai':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_bcf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_bcf)" />
            <path d="M40 20 L160 20 L160 85 L40 85 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.4" />
            {/* Clean Seamless Facing Hem */}
            <line x1="40" y1="75" x2="160" y2="75" stroke="#E2E8F0" strokeWidth="1.5" />
            <line x1="100" y1="20" x2="100" y2="85" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
            <text x="100" y="52" textAnchor="middle" fontSize="8.5" fill="#64748B" fontWeight="bold">
              100% Invisible Clean Facing
            </text>
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Seamless Concealed Facing
              </text>
            </g>
          </svg>
        );

      // ==========================================
      // 6. DUPATTA FINISHING & STYLING
      // ==========================================
      case 'dupatta_organza_extension':
      case 'dupatta_pico_interlock':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_doe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_doe)" />
            {/* Main Dupatta Body */}
            <rect x="42" y="20" width="76" height="65" rx="2" fill="#FFF7ED" stroke={stroke} strokeWidth="1.4" />
            {/* Organza Pallu Extension Border */}
            <rect x="118" y="20" width="40" height="65" rx="2" fill="#FEF08A" opacity="0.75" stroke="#D97706" strokeWidth="1" />
            {/* Joint Ladder Lace & Pintucks on Pallu */}
            <line x1="118" y1="20" x2="118" y2="85" stroke="#B45309" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="128" y1="20" x2="128" y2="85" stroke="#B45309" strokeWidth="1" />
            <line x1="136" y1="20" x2="136" y2="85" stroke="#B45309" strokeWidth="1" />
            <line x1="144" y1="20" x2="144" y2="85" stroke="#B45309" strokeWidth="1" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Organza Pallu + Pintucks
              </text>
            </g>
          </svg>
        );

      case 'dupatta_four_side_crochet':
      case 'dupatta_all_around_zari':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_dfsc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_dfsc)" />
            {/* 4-Sided Delicate Crochet Lace Frame */}
            <rect x="42" y="18" width="116" height="68" rx="3" fill="#FFF7ED" stroke="#DC4D05" strokeWidth="3.5" strokeDasharray="3 2" />
            <rect x="48" y="24" width="104" height="56" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <text x="100" y="55" textAnchor="middle" fontSize="8.5" fill="#64748B" fontWeight="bold">
              4-Side Delicate Crochet Lace
            </text>
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                4-Sided Crochet Lace Frame
              </text>
            </g>
          </svg>
        );

      case 'dupatta_handmade_pearl_fringes':
      case 'dupatta_four_corner_latkans':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_dhpf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_dhpf)" />
            <rect x="45" y="20" width="110" height="55" rx="2" fill="#FFF7ED" stroke={stroke} strokeWidth="1.4" />
            {/* Hanging Pearl Drops & Silk Fringes along Pallu ends */}
            {[45, 60, 75, 90, 105, 120, 135, 150].map((x, i) => (
              <g key={i} transform={`translate(${x}, 75)`}>
                <line x1="0" y1="0" x2="0" y2="8" stroke="#D97706" strokeWidth="1" />
                <circle cx="0" cy="8" r="2" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.6" />
                <line x1="0" y1="10" x2="0" y2="15" stroke="#DC4D05" strokeWidth="0.8" />
              </g>
            ))}
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Pearl Drops & Silk Fringes
              </text>
            </g>
          </svg>
        );

      case 'dupatta_minimal_laser_scallop':
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_dmls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_dmls)" />
            {/* Micro Scalloped Laser Sealed Edge */}
            <path d="M45 22 Q100 16 155 22 L152 78 Q100 72 48 78 Z" fill="#FFF7ED" stroke={stroke} strokeWidth="1.2" />
            <path d="M45 22 Q100 16 155 22" stroke="#DC4D05" strokeWidth="2.2" strokeDasharray="3 1.5" fill="none" />
            <path d="M48 78 Q100 72 152 78" stroke="#DC4D05" strokeWidth="2.2" strokeDasharray="3 1.5" fill="none" />
            <g transform="translate(100, 114)">
              <rect x="-56" y="-9" width="112" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">
                Micro Scallop / Laser Cut
              </text>
            </g>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 200 125" className="w-full h-full drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad_tpdef" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={clothBase} />
                <stop offset="100%" stopColor={clothShade} />
              </linearGradient>
            </defs>
            <rect width="200" height="125" rx="8" fill="url(#bgGrad_tpdef)" />
            <path d="M60 20 L140 20 L135 85 L65 85 Z" fill="#FFFFFF" stroke={stroke} strokeWidth="1.5" />
            <line x1="100" y1="20" x2="100" y2="85" stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" />
            <g transform="translate(100, 114)">
              <rect x="-50" y="-9" width="100" height="15" rx="7.5" fill={isSelected ? '#DC4D05' : '#1E293B'} />
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
      {renderArt()}
    </div>
  );
};
