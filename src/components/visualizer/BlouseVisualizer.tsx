import React from 'react';
import { StitchingSpecifications } from '../../types/tailor';

interface BlouseVisualizerProps {
  customizations: Record<string, string>;
  stitchingSpecs: StitchingSpecifications;
  baseColor: string;
  stitchColor: string;
  isDarkCloth: boolean;
  viewMode: 'realistic' | 'blueprint';
}

export const BlouseVisualizer: React.FC<BlouseVisualizerProps> = ({
  customizations,
  stitchingSpecs,
  baseColor,
  stitchColor,
  isDarkCloth,
  viewMode,
}) => {
  const cutPattern = customizations['cut_pattern'] || 'princess_cut';
  const frontNeck = customizations['front_neck_style'] || 'sweetheart_neck';
  const backDesign = customizations['back_design'] || 'back_hook_dori';
  const sleeveStyle = customizations['sleeve_style'] || 'elbow_length';

  const isPrincessCut = cutPattern.includes('princess');
  const isPadded = cutPattern.includes('padded');
  const isSleeveless = sleeveStyle.includes('sleeveless');
  const isElbow = sleeveStyle.includes('elbow');
  const isFullSleeve = sleeveStyle.includes('full');
  const hasDoriTassels = backDesign.includes('dori') || backDesign.includes('latkan');

  return (
    <g id="garment-blouse-group">
      {/* 1. Cropped Blouse Main Body Silhouette */}
      <path
        d="M 185 110 
           L 215 110 
           Q 250 130 285 110 
           L 315 110 
           C 335 125 355 160 345 205 
           L 330 330 
           L 170 330 
           L 155 205 
           C 145 160 165 125 185 110 Z"
        fill="url(#fabTextureSilk)"
        stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
        strokeWidth={viewMode === 'blueprint' ? '1.5' : '1.2'}
      />

      {/* Volumetric Bust Cup & Shading */}
      {viewMode === 'realistic' && (
        <>
          <path
            d="M 185 110 L 215 110 Q 250 130 285 110 L 315 110 C 335 125 355 160 345 205 L 330 330 L 170 330 L 155 205 C 145 160 165 125 185 110 Z"
            fill="url(#bodyShadingHoriz)"
            style={{ mixBlendMode: 'multiply' }}
          />
          {/* Bust 3D Highlights */}
          <ellipse cx="205" cy="225" rx="30" ry="25" fill="#FFFFFF" opacity={isPadded ? "0.18" : "0.10"} />
          <ellipse cx="295" cy="225" rx="30" ry="25" fill="#FFFFFF" opacity={isPadded ? "0.18" : "0.10"} />
        </>
      )}

      {/* 2. Princess Cut Curved Seams vs 4-Dart Construction */}
      <g id="blouse-seam-lines">
        {isPrincessCut ? (
          // Sculpted Curved Princess Cut Seams from Armhole to Waist
          <>
            <path d="M 160 170 Q 200 230 205 330" fill="none" stroke={stitchColor} strokeWidth="1.2" strokeDasharray="3 1.5" />
            <path d="M 340 170 Q 300 230 295 330" fill="none" stroke={stitchColor} strokeWidth="1.2" strokeDasharray="3 1.5" />
          </>
        ) : (
          // Traditional 4-Dart Lines
          <>
            <line x1="205" y1="260" x2="205" y2="330" stroke={stitchColor} strokeWidth="1" strokeDasharray="3 1.5" />
            <line x1="295" y1="260" x2="295" y2="330" stroke={stitchColor} strokeWidth="1" strokeDasharray="3 1.5" />
            <line x1="165" y1="240" x2="195" y2="235" stroke={stitchColor} strokeWidth="1" strokeDasharray="3 1.5" />
            <line x1="335" y1="240" x2="305" y2="235" stroke={stitchColor} strokeWidth="1" strokeDasharray="3 1.5" />
          </>
        )}
      </g>

      {/* 3. Sleeves */}
      {!isSleeveless && (
        <g id="blouse-sleeves">
          {isFullSleeve ? (
            // Full Sheer Sleeve
            <>
              <path d="M 185 110 L 105 210 L 95 390 L 135 385 L 145 220 L 155 205 Z" fill="url(#fabTextureSilk)" stroke="#0F172A" strokeWidth="1.2" opacity="0.85" />
              <line x1="95" y1="390" x2="135" y2="385" stroke="#D97706" strokeWidth="2.5" />
              <path d="M 315 110 L 395 210 L 405 390 L 365 385 L 355 220 L 345 205 Z" fill="url(#fabTextureSilk)" stroke="#0F172A" strokeWidth="1.2" opacity="0.85" />
              <line x1="365" y1="385" x2="405" y2="390" stroke="#D97706" strokeWidth="2.5" />
            </>
          ) : isElbow ? (
            // Elbow Length Modern 10" Sleeve
            <>
              <path d="M 185 110 L 120 185 L 132 280 L 165 270 L 155 205 Z" fill="url(#fabTextureSilk)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
              <line x1="132" y1="280" x2="165" y2="270" stroke="#D97706" strokeWidth="3" />
              <path d="M 315 110 L 380 185 L 368 280 L 335 270 L 345 205 Z" fill="url(#fabTextureSilk)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
              <line x1="335" y1="270" x2="368" y2="280" stroke="#D97706" strokeWidth="3" />
            </>
          ) : (
            // Short Cap Sleeve
            <>
              <path d="M 185 110 L 130 160 L 145 205 Z" fill="url(#fabTextureSilk)" stroke="#0F172A" strokeWidth="1.2" />
              <line x1="130" y1="160" x2="145" y2="205" stroke="#D97706" strokeWidth="2.5" />
              <path d="M 315 110 L 370 160 L 355 205 Z" fill="url(#fabTextureSilk)" stroke="#0F172A" strokeWidth="1.2" />
              <line x1="355" y1="205" x2="370" y2="160" stroke="#D97706" strokeWidth="2.5" />
            </>
          )}
        </g>
      )}

      {/* 4. Front Neckline Shapes */}
      <g id="blouse-front-neck" filter="url(#softLayerShadow)">
        {frontNeck === 'deep_round_neck' ? (
          // Deep Round Neck
          <g>
            <path d="M 215 110 Q 250 195 285 110" fill="#0F172A" opacity="0.4" />
            <path d="M 215 110 Q 250 195 285 110" fill="none" stroke="#D97706" strokeWidth="2.5" />
          </g>
        ) : frontNeck === 'v_shape_neck' ? (
          // Sleek V-Shape Neck
          <g>
            <polygon points="215,110 285,110 250,195" fill="#0F172A" opacity="0.4" />
            <path d="M 215 110 L 250 195 L 285 110" fill="none" stroke="#D97706" strokeWidth="2.5" />
          </g>
        ) : frontNeck === 'boat_neck' ? (
          // High Boat Neck
          <g>
            <path d="M 200 110 Q 250 140 300 110" fill="#0F172A" opacity="0.4" />
            <path d="M 200 110 Q 250 140 300 110" fill="none" stroke="#D97706" strokeWidth="2.5" />
          </g>
        ) : (
          // Classic Sweetheart Neckline
          <g>
            <path d="M 210 110 Q 230 160 250 145 Q 270 160 290 110" fill="#0F172A" opacity="0.4" />
            <path d="M 210 110 Q 230 160 250 145 Q 270 160 290 110" fill="none" stroke="#D97706" strokeWidth="2.5" />
          </g>
        )}
      </g>

      {/* 5. Tassel Dori Latkan Strings (Back Design Feature) */}
      {hasDoriTassels && (
        <g id="blouse-dori-latkan" filter="url(#softLayerShadow)">
          {/* Shoulder bridge dori tie */}
          <path d="M 215 115 Q 250 140 285 115" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="3 1.5" />
          {/* Hanging Left Latkan String & Golden Bell Tassel */}
          <path d="M 245 130 Q 235 180 225 250" stroke="#D97706" strokeWidth="1.8" fill="none" />
          <circle cx="225" cy="252" r="4.5" fill="url(#goldButtonGrad)" stroke="#78350F" strokeWidth="0.8" />
          <polygon points="220,256 230,256 225,272" fill="url(#goldButtonGrad)" stroke="#78350F" strokeWidth="0.6" />

          {/* Hanging Right Latkan String */}
          <path d="M 255 130 Q 265 180 275 250" stroke="#D97706" strokeWidth="1.8" fill="none" />
          <circle cx="275" cy="252" r="4.5" fill="url(#goldButtonGrad)" stroke="#78350F" strokeWidth="0.8" />
          <polygon points="270,256 280,256 275,272" fill="url(#goldButtonGrad)" stroke="#78350F" strokeWidth="0.6" />
        </g>
      )}

      {/* 6. Cropped Underbust Waistband & Gold Trim */}
      <polygon points="168,315 332,315 330,335 170,335" fill="url(#fabTextureSilk)" stroke="#0F172A" strokeWidth="1.1" />
      <line x1="168" y1="315" x2="332" y2="315" stroke="#D97706" strokeWidth="2.5" />
      <line x1="170" y1="335" x2="330" y2="335" stroke="#D97706" strokeWidth="2.5" />

      {/* 7. Blueprint Technical Specs Mode */}
      {viewMode === 'blueprint' && (
        <g id="blueprint-blouse-specs">
          <line x1="250" y1="145" x2="250" y2="80" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x="250" y="72" textAnchor="middle" fill="#F59E0B" fontSize="9" fontWeight="bold">6.5" Front Plunge Neck</text>

          <line x1="170" y1="325" x2="110" y2="325" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x="105" y="329" textAnchor="end" fill="#F59E0B" fontSize="9" fontWeight="bold">
            {isPrincessCut ? 'Princess Cut Contouring' : '4-Dart Waist suppression'}
          </text>

          <line x1="250" y1="335" x2="250" y2="370" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="250" y="382" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold">14.5" Cropped Waistband with Latkan</text>
        </g>
      )}
    </g>
  );
};
