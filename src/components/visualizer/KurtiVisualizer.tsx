import React from 'react';
import { StitchingSpecifications } from '../../types/tailor';

interface KurtiVisualizerProps {
  customizations: Record<string, string>;
  stitchingSpecs: StitchingSpecifications;
  baseColor: string;
  stitchColor: string;
  isDarkCloth: boolean;
  viewMode: 'realistic' | 'blueprint';
}

export const KurtiVisualizer: React.FC<KurtiVisualizerProps> = ({
  customizations,
  stitchingSpecs,
  baseColor,
  stitchColor,
  isDarkCloth,
  viewMode,
}) => {
  const cut = customizations['kurti_cut'] || 'straight_side_slit';
  const neck = customizations['neck_style'] || 'mandarin_notch_v';
  const pocket = customizations['side_pocket'] || 'one_side_pocket';

  const isALine = cut.includes('a_line');
  const isHighLow = cut.includes('high_low') || cut.includes('asymmetric');
  const flareOffset = isALine ? 35 : 0;
  const bottomY = 465;

  return (
    <g id="garment-kurti-group">
      {/* 1. Main Kurti Body */}
      <path
        d={isHighLow
          ? `M 185 95 
             L 215 95 
             Q 250 110 285 95 
             L 315 95 
             C 335 105 365 140 355 185 
             L 345 185 
             L 355 350 
             L 365 ${bottomY} 
             Q 250 ${bottomY - 35} 135 ${bottomY} 
             L 145 350 
             L 155 185 
             L 145 185 
             C 135 140 165 105 185 95 Z`
          : `M 185 95 
             L 215 95 
             Q 250 110 285 95 
             L 315 95 
             C 335 105 365 140 355 185 
             L 345 185 
             L ${350 + flareOffset} 350 
             L ${355 + flareOffset} ${bottomY} 
             L ${145 - flareOffset} ${bottomY} 
             L ${150 - flareOffset} 350 
             L 155 185 
             L 145 185 
             C 135 140 165 105 185 95 Z`
        }
        fill="url(#fabTextureOxford)"
        stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
        strokeWidth={viewMode === 'blueprint' ? '1.5' : '1.2'}
      />

      {/* Realistic Volumetric & Folds */}
      {viewMode === 'realistic' && (
        <>
          <path
            d={`M 185 95 L 215 95 Q 250 110 285 95 L 315 95 C 335 105 365 140 355 185 L 345 185 L ${350 + flareOffset} 350 L ${355 + flareOffset} ${bottomY} L ${145 - flareOffset} ${bottomY} L ${150 - flareOffset} 350 L 155 185 L 145 185 C 135 140 165 105 185 95 Z`}
            fill="url(#bodyShadingHoriz)"
            style={{ mixBlendMode: 'multiply' }}
          />
          <path
            d={`M 185 95 L 215 95 Q 250 110 285 95 L 315 95 C 335 105 365 140 355 185 L 345 185 L ${350 + flareOffset} 350 L ${355 + flareOffset} ${bottomY} L ${145 - flareOffset} ${bottomY} L ${150 - flareOffset} 350 L 155 185 L 145 185 C 135 140 165 105 185 95 Z`}
            fill="url(#bodyShadingVert)"
          />
        </>
      )}

      {/* 2. Sleeves (Modern 3/4th with fold-over cuff) */}
      <g id="kurti-sleeves">
        {/* Left Sleeve */}
        <path d="M 185 95 L 110 185 L 125 315 L 155 305 L 155 185 Z" fill="url(#fabTextureOxford)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
        <polygon points="120,315 155,305 157,320 122,330" fill="url(#fabTextureOxford)" stroke="#0F172A" strokeWidth="1" filter="url(#softLayerShadow)" />
        <circle cx="140" cy="318" r="3" fill="url(#goldButtonGrad)" stroke="#78350F" strokeWidth="0.5" />

        {/* Right Sleeve */}
        <path d="M 315 95 L 390 185 L 375 315 L 345 305 L 345 185 Z" fill="url(#fabTextureOxford)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
        <polygon points="345,305 380,315 378,330 343,320" fill="url(#fabTextureOxford)" stroke="#0F172A" strokeWidth="1" filter="url(#softLayerShadow)" />
        <circle cx="360" cy="318" r="3" fill="url(#goldButtonGrad)" stroke="#78350F" strokeWidth="0.5" />
      </g>

      {/* 3. Necklines */}
      <g id="kurti-neckline" filter="url(#softLayerShadow)">
        {neck.includes('potli') ? (
          // Round Neck with Potli Placket
          <g>
            <path d="M 215 95 Q 250 145 285 95" fill="#0F172A" opacity="0.3" />
            <path d="M 215 95 Q 250 145 285 95" fill="none" stroke={stitchColor} strokeWidth="2" />
            <line x1="250" y1="120" x2="250" y2="220" stroke="#0F172A" strokeWidth="1" />
            {[135, 155, 175, 195, 215].map((y, idx) => (
              <circle key={`kpotli-${idx}`} cx="250" cy={y} r="3" fill="url(#goldButtonGrad)" stroke="#78350F" strokeWidth="0.5" />
            ))}
          </g>
        ) : neck.includes('boat') ? (
          // Boat Neck
          <g>
            <path d="M 200 95 Q 250 125 300 95" fill="#0F172A" opacity="0.3" />
            <path d="M 200 95 Q 250 125 300 95" fill="none" stroke={stitchColor} strokeWidth="2.5" />
          </g>
        ) : neck.includes('angrakha') ? (
          // Angrakha Wrap
          <g>
            <path d="M 215 95 Q 260 170 335 230" fill="none" stroke="#D97706" strokeWidth="2" />
            <circle cx="335" cy="230" r="4" fill="url(#goldButtonGrad)" stroke="#78350F" strokeWidth="0.7" />
          </g>
        ) : (
          // Mandarin Stand Collar with Notch V-Slit
          <g>
            <path d="M 208 95 C 220 110 280 110 292 95 L 290 78 C 275 92 225 92 210 78 Z" fill="url(#fabTextureOxford)" stroke="#0F172A" strokeWidth="1.2" />
            <polygon points="244,95 256,95 250,145" fill="#0F172A" opacity="0.4" />
            <path d="M 244 95 L 250 145 L 256 95" fill="none" stroke={stitchColor} strokeWidth="1.5" />
          </g>
        )}
      </g>

      {/* 4. Concealed Phone Pocket Indicator */}
      {pocket !== 'no_pocket' && (
        <g id="kurti-phone-pocket">
          <line x1={350 + flareOffset} y1="260" x2={352 + flareOffset} y2="310" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx={351 + flareOffset} cy="260" r="2.5" fill="#D97706" />
          <circle cx={353 + flareOffset} cy="310" r="2.5" fill="#D97706" />
        </g>
      )}

      {/* 5. Bottom Hem Stitch */}
      <path
        d={isHighLow
          ? `M 135 ${bottomY} Q 250 ${bottomY - 35} 365 ${bottomY}`
          : `M ${145 - flareOffset} ${bottomY} L ${355 + flareOffset} ${bottomY}`
        }
        fill="none"
        stroke={stitchColor}
        strokeWidth="1.2"
        strokeDasharray="3 2"
      />

      {/* 6. Blueprint Specs Mode */}
      {viewMode === 'blueprint' && (
        <g id="blueprint-kurti-specs">
          <line x1="355" y1="350" x2="420" y2="350" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x="425" y="354" fill="#F59E0B" fontSize="9" fontWeight="bold">12" Side Slit</text>

          <line x1="250" y1={bottomY} x2="250" y2={bottomY + 25} stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="250" y={bottomY + 38} textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold">
            {isHighLow ? 'High-Low Asymmetrical Hem' : isALine ? 'Flared A-Line Silhouette' : 'Straight 38" Kurti Hem'}
          </text>
        </g>
      )}
    </g>
  );
};
