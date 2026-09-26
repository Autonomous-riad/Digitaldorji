import React from 'react';
import { StitchingSpecifications } from '../../types/tailor';

interface TrouserVisualizerProps {
  customizations: Record<string, string>;
  stitchingSpecs: StitchingSpecifications;
  baseColor: string;
  stitchColor: string;
  isDarkCloth: boolean;
  viewMode: 'realistic' | 'blueprint';
}

export const TrouserVisualizer: React.FC<TrouserVisualizerProps> = ({
  customizations,
  stitchingSpecs,
  baseColor,
  stitchColor,
  isDarkCloth,
  viewMode,
}) => {
  const pleats = customizations['pleats_style'] || customizations['pleat_style'] || 'flat_front_modern';
  const fit = customizations['fit_profile'] || customizations['fit_style'] || 'slim_tapered';
  const waistband = customizations['waistband_style'] || 'standard_belt_loops';
  const pocket = customizations['pocket_cut'] || 'cross_slant_pockets';
  const hem = customizations['hem_finish'] || 'plain_straight_hem';

  const isSlim = fit.includes('slim');
  const isRelaxed = fit.includes('comfort') || fit.includes('relaxed');
  const isCuffed = hem.includes('cuff') || hem.includes('turn_up');
  const hasPleat = pleats.includes('pleat');
  const isDoublePleat = pleats.includes('double');
  const isGurkha = waistband.includes('gurkha');
  const isSideAdjuster = waistband.includes('buckle') || waistband.includes('side');

  // Pant Leg Taper Coordinates
  const leftOuterHemX = isSlim ? 155 : isRelaxed ? 135 : 145;
  const leftInnerHemX = isSlim ? 220 : isRelaxed ? 210 : 215;
  const rightInnerHemX = isSlim ? 280 : isRelaxed ? 290 : 285;
  const rightOuterHemX = isSlim ? 345 : isRelaxed ? 365 : 355;

  return (
    <g id="garment-trouser-group">
      {/* 1. Main Trouser Pant Silhouette */}
      <path
        d={`M 140 100 
            L 360 100 
            L 370 170 
            L 365 240 
            L ${rightOuterHemX} 485 
            L ${rightInnerHemX} 485 
            L 255 240 
            L 245 240 
            L ${leftInnerHemX} 485 
            L ${leftOuterHemX} 485 
            L 135 240 
            L 130 170 Z`}
        fill="url(#fabTextureSuiting)"
        stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
        strokeWidth={viewMode === 'blueprint' ? '1.5' : '1.2'}
      />

      {/* Realistic Volumetric & Leg Cylinder Shading */}
      {viewMode === 'realistic' && (
        <>
          {/* Left Leg Gradient */}
          <path
            d={`M 140 100 L 250 100 L 250 240 L ${leftInnerHemX} 485 L ${leftOuterHemX} 485 L 135 240 L 130 170 Z`}
            fill="url(#sleeveShadingLeft)"
            opacity="0.6"
          />
          {/* Right Leg Gradient */}
          <path
            d={`M 250 100 L 360 100 L 370 170 L 365 240 L ${rightOuterHemX} 485 L ${rightInnerHemX} 485 L 250 240 Z`}
            fill="url(#sleeveShadingRight)"
            opacity="0.6"
          />
          {/* Crotch & Inseam Shadow */}
          <path d="M 250 210 Q 250 245 250 255" stroke="#000000" strokeWidth="3" opacity="0.4" />
        </>
      )}

      {/* 2. Razor Sharp Ironed Center Creases (Pleats) */}
      <g id="trouser-creases">
        {/* Left Leg Crease */}
        <line
          x1="195"
          y1={hasPleat ? 130 : 160}
          x2={(leftOuterHemX + leftInnerHemX) / 2}
          y2={isCuffed ? 455 : 485}
          stroke={isDarkCloth ? '#FFFFFF' : '#000000'}
          strokeWidth="1.2"
          opacity={isDarkCloth ? 0.35 : 0.25}
        />
        {/* Left Secondary Pleat if Double Pleat */}
        {isDoublePleat && (
          <line x1="175" y1="130" x2="175" y2="200" stroke={isDarkCloth ? '#FFFFFF' : '#000000'} strokeWidth="1" opacity="0.3" />
        )}

        {/* Right Leg Crease */}
        <line
          x1="305"
          y1={hasPleat ? 130 : 160}
          x2={(rightOuterHemX + rightInnerHemX) / 2}
          y2={isCuffed ? 455 : 485}
          stroke={isDarkCloth ? '#FFFFFF' : '#000000'}
          strokeWidth="1.2"
          opacity={isDarkCloth ? 0.35 : 0.25}
        />
        {isDoublePleat && (
          <line x1="325" y1="130" x2="325" y2="200" stroke={isDarkCloth ? '#FFFFFF' : '#000000'} strokeWidth="1" opacity="0.3" />
        )}
      </g>

      {/* 3. Waistband Construction */}
      <g id="trouser-waistband" filter="url(#softLayerShadow)">
        {/* Base Waistband Strip */}
        <polygon
          points="138,98 362,98 365,130 135,130"
          fill="url(#fabTextureSuiting)"
          stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
          strokeWidth="1.2"
        />
        <line x1="137" y1="128" x2="363" y2="128" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2.5 1.5" />

        {isGurkha ? (
          // Extended Gurkha Cross-over Tab
          <g>
            <polygon points="170,102 280,102 295,126 170,126" fill="url(#fabTextureSuiting)" stroke="#0F172A" strokeWidth="1" />
            <rect x="275" y="106" width="14" height="16" rx="2" fill="url(#silverButtonGrad)" stroke="#334155" strokeWidth="0.8" />
            <line x1="282" y1="106" x2="282" y2="122" stroke="#0F172A" strokeWidth="1" />
          </g>
        ) : isSideAdjuster ? (
          // Side Buckle Adjusters on Left & Right
          <g>
            <rect x="132" y="108" width="10" height="14" rx="1.5" fill="url(#silverButtonGrad)" stroke="#334155" strokeWidth="0.8" />
            <rect x="358" y="108" width="10" height="14" rx="1.5" fill="url(#silverButtonGrad)" stroke="#334155" strokeWidth="0.8" />
            <circle cx="250" cy="114" r="3.5" fill="url(#hornButtonGrad)" stroke="#0F172A" strokeWidth="0.6" />
          </g>
        ) : (
          // Standard Belt Loops (5-7 loops)
          <g>
            {[146, 185, 225, 275, 315, 354].map((x, idx) => (
              <g key={`loop-${idx}`}>
                <rect x={x - 2.5} y="96" width="5" height="36" rx="1" fill="url(#fabTextureSuiting)" stroke="#0F172A" strokeWidth="0.8" />
                <line x1={x - 1.5} y1="98" x2={x - 1.5} y2="130" stroke={stitchColor} strokeWidth="0.6" strokeDasharray="2 1" />
                <line x1={x + 1.5} y1="98" x2={x + 1.5} y2="130" stroke={stitchColor} strokeWidth="0.6" strokeDasharray="2 1" />
              </g>
            ))}
            <circle cx="250" cy="114" r="3.5" fill="url(#hornButtonGrad)" stroke="#0F172A" strokeWidth="0.6" />
          </g>
        )}
      </g>

      {/* 4. Fly Front J-Stitch & Closure */}
      <g id="trouser-fly-front">
        <line x1="250" y1="130" x2="250" y2="235" stroke="#0F172A" strokeWidth="1.2" />
        {/* Curved J-Stitch Line */}
        <path
          d="M 258 130 L 258 205 Q 258 225 250 228"
          fill="none"
          stroke={stitchColor}
          strokeWidth="1"
          strokeDasharray="3 1.5"
        />
        {/* Reinforcement Bar-tack */}
        <line x1="247" y1="228" x2="253" y2="228" stroke="#D97706" strokeWidth="2.5" />
      </g>

      {/* 5. Side Pockets (Cross Slant vs Vertical Seam) */}
      <g id="trouser-side-pockets">
        {pocket.includes('slant') || pocket.includes('cross') ? (
          // Classic Slanted Cross Pockets
          <>
            <line x1="148" y1="130" x2="134" y2="200" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="146" y1="130" x2="132" y2="200" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2 1" />
            <line x1="145" y1="132" x2="151" y2="132" stroke="#D97706" strokeWidth="2" />

            <line x1="352" y1="130" x2="366" y2="200" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="354" y1="130" x2="368" y2="200" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2 1" />
            <line x1="349" y1="132" x2="355" y2="132" stroke="#D97706" strokeWidth="2" />
          </>
        ) : (
          // Vertical Side Seam Pockets
          <>
            <line x1="136" y1="140" x2="134" y2="210" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="364" y1="140" x2="366" y2="210" stroke="#0F172A" strokeWidth="1.5" />
          </>
        )}
      </g>

      {/* 6. Hem Finish (Cuffed Turn-up vs Plain Straight) */}
      <g id="trouser-bottom-hems">
        {isCuffed ? (
          // 1.5" Turn-Up Cuff Bands
          <>
            {/* Left Cuff */}
            <polygon
              points={`${leftOuterHemX - 2},455 ${leftInnerHemX + 2},455 ${leftInnerHemX + 1},485 ${leftOuterHemX - 1},485`}
              fill="url(#fabTextureSuiting)"
              stroke="#0F172A"
              strokeWidth="1.1"
              filter="url(#softLayerShadow)"
            />
            <line x1={leftOuterHemX} y1="457" x2={leftInnerHemX} y2="457" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2.5 1.5" />

            {/* Right Cuff */}
            <polygon
              points={`${rightInnerHemX - 2},455 ${rightOuterHemX + 2},455 ${rightOuterHemX + 1},485 ${rightInnerHemX - 1},485`}
              fill="url(#fabTextureSuiting)"
              stroke="#0F172A"
              strokeWidth="1.1"
              filter="url(#softLayerShadow)"
            />
            <line x1={rightInnerHemX} y1="457" x2={rightOuterHemX} y2="457" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2.5 1.5" />
          </>
        ) : (
          // Plain Blind Hem
          <>
            <line x1={leftOuterHemX} y1="475" x2={leftInnerHemX} y2="475" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="3 2" />
            <line x1={rightInnerHemX} y1="475" x2={rightOuterHemX} y2="475" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="3 2" />
          </>
        )}
      </g>

      {/* 7. Blueprint Specs Mode */}
      {viewMode === 'blueprint' && (
        <g id="blueprint-trouser-specs">
          <line x1="365" y1="114" x2="425" y2="114" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x="430" y="118" fill="#F59E0B" fontSize="9" fontWeight="bold">1.5" Fused Waistband</text>

          <line x1="250" y1="230" x2="200" y2="230" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x="145" y="234" fill="#F59E0B" fontSize="9" fontWeight="bold">J-Stitch & Bar-tack</text>

          <line x1="355" y1="485" x2="420" y2="485" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="425" y="489" fill="#38BDF8" fontSize="9" fontWeight="bold">
            {isCuffed ? '1.5" Turn-up Cuff Hem' : '1.75" Blind Hem Allowance'}
          </text>
        </g>
      )}
    </g>
  );
};
