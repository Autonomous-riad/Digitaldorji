import React from 'react';
import { StitchingSpecifications } from '../../types/tailor';

interface BurkhaVisualizerProps {
  customizations: Record<string, string>;
  stitchingSpecs: StitchingSpecifications;
  baseColor: string;
  stitchColor: string;
  isDarkCloth: boolean;
  viewMode: 'realistic' | 'blueprint';
}

export const BurkhaVisualizer: React.FC<BurkhaVisualizerProps> = ({
  customizations,
  stitchingSpecs,
  baseColor,
  stitchColor,
  isDarkCloth,
  viewMode,
}) => {
  const abayaCut = customizations['burkha_cut'] || 'front_open_cardigan';
  const sleeve = customizations['sleeve_cuff'] || 'elastic_smocked_cuff';
  const pocket = customizations['pocket_option'] || 'dual_concealed_side_pockets';

  const isUmbrella = abayaCut.includes('umbrella');
  const isKaftan = abayaCut.includes('kaftan') || abayaCut.includes('butterfly');
  const isFrontOpen = abayaCut.includes('open') || abayaCut.includes('cardigan');

  const bottomWidthOffset = isUmbrella ? 70 : isKaftan ? 50 : 25;
  const bottomY = 515;

  return (
    <g id="garment-burkha-group">
      {/* 1. Main Abaya Silhouette */}
      <path
        d={isKaftan
          ? `M 200 90 
             L 250 105 
             L 300 90 
             L 435 280 
             L 395 310 
             L ${375 + bottomWidthOffset} ${bottomY} 
             L ${125 - bottomWidthOffset} ${bottomY} 
             L 105 310 
             L 65 280 Z`
          : `M 185 90 
             L 215 90 
             Q 250 105 285 90 
             L 315 90 
             C 335 100 370 135 365 180 
             L 360 180 
             L ${375 + bottomWidthOffset} ${bottomY} 
             L ${125 - bottomWidthOffset} ${bottomY} 
             L 140 180 
             L 135 180 
             C 130 135 165 100 185 90 Z`
        }
        fill="url(#fabTextureSilk)"
        stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
        strokeWidth={viewMode === 'blueprint' ? '1.5' : '1.2'}
      />

      {/* Realistic Deep Fabric Drape Shadows */}
      {viewMode === 'realistic' && (
        <>
          <path
            d={`M 185 90 L 215 90 Q 250 105 285 90 L 315 90 C 335 100 370 135 365 180 L 360 180 L ${375 + bottomWidthOffset} ${bottomY} L ${125 - bottomWidthOffset} ${bottomY} L 140 180 L 135 180 C 130 135 165 100 185 90 Z`}
            fill="url(#bodyShadingHoriz)"
            style={{ mixBlendMode: 'multiply' }}
          />
          <path
            d={`M 185 90 L 215 90 Q 250 105 285 90 L 315 90 C 335 100 370 135 365 180 L 360 180 L ${375 + bottomWidthOffset} ${bottomY} L ${125 - bottomWidthOffset} ${bottomY} L 140 180 L 135 180 C 130 135 165 100 185 90 Z`}
            fill="url(#bodyShadingVert)"
          />
          {/* Flowing Abaya Vertical Folds */}
          <path d={`M 200 180 Q 180 340 ${175 - bottomWidthOffset / 2} ${bottomY}`} stroke="#000000" strokeWidth="2.5" opacity="0.25" fill="none" />
          <path d={`M 300 180 Q 320 340 ${325 + bottomWidthOffset / 2} ${bottomY}`} stroke="#000000" strokeWidth="2.5" opacity="0.25" fill="none" />
          <path d="M 230 220 Q 220 380 220 515" stroke="#000000" strokeWidth="2" opacity="0.2" fill="none" />
          <path d="M 270 220 Q 280 380 280 515" stroke="#000000" strokeWidth="2" opacity="0.2" fill="none" />
        </>
      )}

      {/* 2. Abaya Sleeves (Unless Kaftan) */}
      {!isKaftan && (
        <g id="burkha-sleeves">
          {/* Left Sleeve */}
          <path d="M 185 90 L 95 220 L 75 390 L 125 385 L 140 220 Z" fill="url(#fabTextureSilk)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
          {/* Left Cuff Type */}
          {sleeve.includes('smock') || sleeve.includes('elastic') ? (
            // Smocked Elastic Cuff
            <g filter="url(#softLayerShadow)">
              <polygon points="75,375 125,370 125,395 75,400" fill="url(#fabTextureSilk)" stroke="#0F172A" strokeWidth="1" />
              {[380, 386, 392].map((y, idx) => (
                <line key={`smock-l-${idx}`} x1="75" y1={y} x2="125" y2={y - 5} stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2 1" />
              ))}
            </g>
          ) : sleeve.includes('zipper') ? (
            // Wudu Zipper Cuff
            <g>
              <line x1="100" y1="330" x2="100" y2="390" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 1" />
              <circle cx="100" cy="335" r="2.5" fill="url(#silverButtonGrad)" />
            </g>
          ) : (
            // Lace / Crystal Embroidered Cuff
            <line x1="75" y1="390" x2="125" y2="385" stroke="#D97706" strokeWidth="3" strokeDasharray="3 2" />
          )}

          {/* Right Sleeve */}
          <path d="M 315 90 L 405 220 L 425 390 L 375 385 L 360 220 Z" fill="url(#fabTextureSilk)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
          {/* Right Cuff Type */}
          {sleeve.includes('smock') || sleeve.includes('elastic') ? (
            <g filter="url(#softLayerShadow)">
              <polygon points="375,370 425,375 425,400 375,395" fill="url(#fabTextureSilk)" stroke="#0F172A" strokeWidth="1" />
              {[380, 386, 392].map((y, idx) => (
                <line key={`smock-r-${idx}`} x1="375" y1={y - 5} x2="425" y2={y} stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2 1" />
              ))}
            </g>
          ) : sleeve.includes('zipper') ? (
            <g>
              <line x1="400" y1="330" x2="400" y2="390" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 1" />
              <circle cx="400" cy="335" r="2.5" fill="url(#silverButtonGrad)" />
            </g>
          ) : (
            <line x1="375" y1="385" x2="425" y2="390" stroke="#D97706" strokeWidth="3" strokeDasharray="3 2" />
          )}
        </g>
      )}

      {/* 3. Front Open Cardigan Placket & Satin Edge Trim */}
      {isFrontOpen && (
        <g id="burkha-front-open">
          <line x1="250" y1="95" x2="250" y2={bottomY} stroke="#0F172A" strokeWidth="2.5" />
          <line x1="247" y1="95" x2="247" y2={bottomY} stroke="#D97706" strokeWidth="1.5" />
          <line x1="253" y1="95" x2="253" y2={bottomY} stroke="#D97706" strokeWidth="1.5" />

          {/* Snap Buttons along front */}
          {[140, 200, 260, 320, 380, 440].map((y, idx) => (
            <circle key={`snap-${idx}`} cx="250" cy={y} r="3" fill="url(#silverButtonGrad)" stroke="#334155" strokeWidth="0.6" />
          ))}
        </g>
      )}

      {/* 4. Concealed Hip Pockets */}
      {pocket.includes('concealed') && (
        <g id="burkha-pockets">
          <line x1={155 - bottomWidthOffset / 3} y1="300" x2={152 - bottomWidthOffset / 3} y2="360" stroke="#000000" strokeWidth="2" strokeDasharray="3 2" opacity="0.6" />
          <line x1={345 + bottomWidthOffset / 3} y1="300" x2={348 + bottomWidthOffset / 3} y2="360" stroke="#000000" strokeWidth="2" strokeDasharray="3 2" opacity="0.6" />
        </g>
      )}

      {/* 5. Modest Round High Neck Collar */}
      <g id="burkha-neck" filter="url(#deepCollarShadow)">
        <path d="M 215 90 Q 250 115 285 90" fill="none" stroke="#D97706" strokeWidth="2" />
        <path d="M 215 90 C 225 105 275 105 285 90 L 282 78 C 270 90 230 90 218 78 Z" fill="url(#fabTextureSilk)" stroke="#0F172A" strokeWidth="1.1" />
      </g>

      {/* 6. Floor Length Bottom Hem */}
      <line x1={125 - bottomWidthOffset} y1={bottomY} x2={375 + bottomWidthOffset} y2={bottomY} stroke="#D97706" strokeWidth="3" />

      {/* 7. Blueprint Specs Mode */}
      {viewMode === 'blueprint' && (
        <g id="blueprint-burkha-specs">
          <line x1="250" y1="200" x2="315" y2="200" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x="320" y="204" fill="#F59E0B" fontSize="9" fontWeight="bold">Concealed Snap Placket</text>

          <line x1="250" y1={bottomY} x2="250" y2={bottomY + 25} stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="250" y={bottomY + 38} textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold">
            {isUmbrella ? '120" Full Umbrella Flare Hem' : '56" Floor-Length Modest Silhouette'}
          </text>
        </g>
      )}
    </g>
  );
};
