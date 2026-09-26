import React from 'react';
import { StitchingSpecifications } from '../../types/tailor';

interface PajamaVisualizerProps {
  customizations: Record<string, string>;
  stitchingSpecs: StitchingSpecifications;
  baseColor: string;
  stitchColor: string;
  isDarkCloth: boolean;
  viewMode: 'realistic' | 'blueprint';
}

export const PajamaVisualizer: React.FC<PajamaVisualizerProps> = ({
  customizations,
  stitchingSpecs,
  baseColor,
  stitchColor,
  isDarkCloth,
  viewMode,
}) => {
  const cut = customizations['pajama_style'] || customizations['pajama_cut'] || 'aligarhi_wide_cut';
  const waist = customizations['waist_type'] || 'drawstring_traditional';
  const pocket = customizations['pocket_option'] || 'single_side_zipper_pocket';

  const isChuridar = cut.includes('churidar') || cut.includes('gather');
  const isAligarhi = cut.includes('aligarhi') || cut.includes('wide');
  const isStraightPant = cut.includes('straight') || cut.includes('pant');

  // Hem widths
  const leftOuterHemX = isChuridar ? 180 : isAligarhi ? 120 : 155;
  const leftInnerHemX = isChuridar ? 215 : isAligarhi ? 205 : 215;
  const rightInnerHemX = isChuridar ? 285 : isAligarhi ? 295 : 285;
  const rightOuterHemX = isChuridar ? 320 : isAligarhi ? 380 : 345;

  return (
    <g id="garment-pajama-group">
      {/* 1. Main Pajama Silhouette */}
      <path
        d={`M 130 95 
            L 370 95 
            L 380 180 
            L 370 260 
            L ${rightOuterHemX} 485 
            L ${rightInnerHemX} 485 
            L 255 260 
            L 245 260 
            L ${leftInnerHemX} 485 
            L ${leftOuterHemX} 485 
            L 130 260 
            L 120 180 Z`}
        fill="url(#fabTextureOxford)"
        stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
        strokeWidth={viewMode === 'blueprint' ? '1.5' : '1.2'}
      />

      {/* Realistic Volumetric & Folds Shading */}
      {viewMode === 'realistic' && (
        <>
          <path
            d={`M 130 95 L 250 95 L 250 260 L ${leftInnerHemX} 485 L ${leftOuterHemX} 485 L 130 260 L 120 180 Z`}
            fill="url(#sleeveShadingLeft)"
            opacity="0.5"
          />
          <path
            d={`M 250 95 L 370 95 L 380 180 L 370 260 L ${rightOuterHemX} 485 L ${rightInnerHemX} 485 L 250 260 Z`}
            fill="url(#sleeveShadingRight)"
            opacity="0.5"
          />
          {/* Crotch Inseam Gusset (Miyani) curve */}
          <path d="M 250 230 L 250 270" stroke="#000000" strokeWidth="2" opacity="0.35" />
        </>
      )}

      {/* 2. Churidar Bangle Gathers (if Churidar selected) */}
      {isChuridar && (
        <g id="churidar-gathers" stroke={stitchColor} strokeWidth="1.2" opacity="0.7">
          {[410, 425, 440, 455, 470].map((y, idx) => (
            <g key={`gather-${idx}`}>
              <path d={`M 182 ${y} Q 197 ${y - 4} 213 ${y}`} fill="none" />
              <path d={`M 287 ${y} Q 303 ${y - 4} 318 ${y}`} fill="none" />
            </g>
          ))}
        </g>
      )}

      {/* 3. Waistband Construction & Nala / Drawstring */}
      <g id="pajama-waistband" filter="url(#softLayerShadow)">
        <polygon points="128,93 372,93 375,125 125,125" fill="url(#fabTextureOxford)" stroke="#0F172A" strokeWidth="1.1" />
        <line x1="126" y1="123" x2="374" y2="123" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="3 1.5" />

        {/* Waist Gather Pleats */}
        {[150, 175, 200, 225, 275, 300, 325, 350].map((x, idx) => (
          <line key={`w-pleat-${idx}`} x1={x} y1="95" x2={x + (idx % 2 === 0 ? -2 : 2)} y2="123" stroke={stitchColor} strokeWidth="0.6" strokeDasharray="2 1" />
        ))}

        {/* Drawstring opening & ties */}
        <ellipse cx="250" cy="110" rx="3" ry="4" fill="#0F172A" />
        <path d="M 250 110 Q 242 135 238 150" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 250 110 Q 258 135 262 148" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>

      {/* 4. Side Pocket Zipper */}
      {pocket !== 'no_pocket' && (
        <g id="pajama-zipper-pocket">
          <line x1="362" y1="135" x2="368" y2="195" stroke="#0F172A" strokeWidth="2" />
          <line x1="364" y1="135" x2="370" y2="195" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="363" cy="140" r="2.5" fill="url(#silverButtonGrad)" stroke="#334155" strokeWidth="0.5" />
        </g>
      )}

      {/* 5. Bottom Hem Stitch */}
      <line x1={leftOuterHemX} y1="480" x2={leftInnerHemX} y2="480" stroke={stitchColor} strokeWidth="0.9" strokeDasharray="3 2" />
      <line x1={rightInnerHemX} y1="480" x2={rightOuterHemX} y2="480" stroke={stitchColor} strokeWidth="0.9" strokeDasharray="3 2" />

      {/* 6. Blueprint Technical Specs Mode */}
      {viewMode === 'blueprint' && (
        <g id="blueprint-pajama-specs">
          <line x1="370" y1="110" x2="425" y2="110" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x="430" y="114" fill="#F59E0B" fontSize="9" fontWeight="bold">2" Tunnel Drawstring Casing</text>

          <line x1="250" y1="250" x2="200" y2="250" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x="145" y="254" fill="#F59E0B" fontSize="9" fontWeight="bold">Reinforced Miyani Gusset</text>

          <line x1={leftOuterHemX} y1="485" x2={leftOuterHemX - 30} y2="485" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
          <text x={leftOuterHemX - 35} y="489" textAnchor="end" fill="#38BDF8" fontSize="9" fontWeight="bold">
            {isChuridar ? 'Churidar 10" Fitted Ankle' : isAligarhi ? 'Aligarhi 16" Wide Mohri' : 'Straight 14" Bottom'}
          </text>
        </g>
      )}
    </g>
  );
};
