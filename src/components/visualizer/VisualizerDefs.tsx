import React from 'react';

interface VisualizerDefsProps {
  baseColor: string;
  stitchColor: string;
  fabricType?: string;
}

export const VisualizerDefs: React.FC<VisualizerDefsProps> = ({
  baseColor,
  stitchColor,
  fabricType = 'cotton',
}) => {
  return (
    <defs>
      {/* 1. Micro-Woven Oxford / Twill Fabric Texture Pattern */}
      <pattern id="fabTextureOxford" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill={baseColor} />
        <path d="M0 3 L3 0 L6 3 L3 6 Z" fill="rgba(0,0,0,0.035)" />
        <circle cx="3" cy="3" r="0.9" fill="rgba(255,255,255,0.06)" />
        <line x1="0" y1="0" x2="6" y2="6" stroke="rgba(0,0,0,0.02)" strokeWidth="0.5" />
      </pattern>

      {/* 2. Fine Silk / Premium Sheen Texture Pattern */}
      <pattern id="fabTextureSilk" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill={baseColor} />
        <path d="M0 0 L8 8 M8 0 L0 8" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <circle cx="4" cy="4" r="1.2" fill="rgba(255,255,255,0.09)" />
      </pattern>

      {/* 3. Wool Flannel / Textured Suiting Pattern */}
      <pattern id="fabTextureSuiting" width="5" height="5" patternUnits="userSpaceOnUse">
        <rect width="5" height="5" fill={baseColor} />
        <path d="M0 0 L5 5 M0 5 L5 0" stroke="rgba(0,0,0,0.05)" strokeWidth="0.6" />
        <circle cx="2.5" cy="2.5" r="0.8" fill="rgba(0,0,0,0.04)" />
      </pattern>

      {/* 4. Blueprint Engineering Grid */}
      <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56,189,248,0.08)" strokeWidth="0.5" />
        <circle cx="0" cy="0" r="1" fill="rgba(56,189,248,0.2)" />
      </pattern>

      {/* Volumetric Body Lighting Gradients */}
      <linearGradient id="bodyShadingHoriz" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.32" />
        <stop offset="12%" stopColor="#000000" stopOpacity="0.10" />
        <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.14" />
        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.22" />
        <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.14" />
        <stop offset="88%" stopColor="#000000" stopOpacity="0.10" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.32" />
      </linearGradient>

      <linearGradient id="bodyShadingVert" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
        <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.04" />
        <stop offset="85%" stopColor="#000000" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
      </linearGradient>

      {/* Sleeve Cylinder Gradients */}
      <linearGradient id="sleeveShadingLeft" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
        <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
      </linearGradient>

      <linearGradient id="sleeveShadingRight" x1="100%" y1="0%" x2="0%" y2="50%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
        <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
      </linearGradient>

      {/* Collar & Lapel Depth Gradients */}
      <linearGradient id="collarLeafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
        <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
      </linearGradient>

      <linearGradient id="foldCreaseShadow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
      </linearGradient>

      {/* Metallic & Horn Button Gradients */}
      <radialGradient id="pearlButtonGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </radialGradient>

      <radialGradient id="hornButtonGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="70%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </radialGradient>

      <radialGradient id="goldButtonGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#854D0E" />
      </radialGradient>

      <radialGradient id="silverButtonGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#475569" />
      </radialGradient>

      {/* Soft Drop Shadow Filter for Layered Floating Parts */}
      <filter id="softLayerShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.38" />
      </filter>

      <filter id="deepCollarShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#000000" floodOpacity="0.45" />
      </filter>
    </defs>
  );
};
