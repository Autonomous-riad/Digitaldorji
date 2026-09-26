import React from 'react';
import { StitchingSpecifications } from '../../types/tailor';

interface PanjabiVisualizerProps {
  customizations: Record<string, string>;
  stitchingSpecs: StitchingSpecifications;
  baseColor: string;
  stitchColor: string;
  isDarkCloth: boolean;
  viewMode: 'realistic' | 'blueprint';
}

export const PanjabiVisualizer: React.FC<PanjabiVisualizerProps> = ({
  customizations,
  stitchingSpecs,
  baseColor,
  stitchColor,
  isDarkCloth,
  viewMode,
}) => {
  const collar = customizations['collar_type'] || customizations['collar_style'] || 'mandarin_stand_collar';
  const placket = customizations['placket_design'] || customizations['placket_style'] || 'concealed_button_placket';
  const sleeve = customizations['sleeve_style'] || customizations['sleeve_length_style'] || 'full_classic_straight';
  const pocket = customizations['pocket_options'] || customizations['pocket_style'] || 'both_side_hidden_pockets';
  const cut = customizations['length_cut'] || 'regular_knee_length';
  const fit = customizations['fit_style'] || 'slim_fit';

  const isShortKurta = cut.includes('short') || cut.includes('hip');
  const isBelowKnee = cut.includes('long') || cut.includes('below');
  const bottomY = isShortKurta ? 430 : isBelowKnee ? 535 : 495;
  const slitStartY = isShortKurta ? 330 : 370;

  const isThreeQuarter = sleeve.includes('three') || sleeve.includes('quarter');
  const isCuffed = sleeve.includes('cuff');
  const isEmbroidered = placket.includes('embroider') || placket.includes('zari');
  const isPiped = placket.includes('piping') || placket.includes('contrast');
  const isConcealed = placket.includes('concealed');

  const buttonFill = 'url(#goldButtonGrad)';

  return (
    <g id="garment-panjabi-group">
      {/* 1. Inner Neck Shadow */}
      <ellipse cx="250" cy="100" rx="42" ry="16" fill="#000000" opacity="0.35" />

      {/* 2. Main Panjabi Body & Side Slits */}
      <path
        d={`M 180 95 
            L 215 95 
            Q 250 110 285 95 
            L 320 95 
            C 340 105 375 145 365 190 
            L 355 190 
            L 358 ${slitStartY} 
            L 368 ${bottomY} 
            L 255 ${bottomY} 
            L 255 ${slitStartY} 
            L 245 ${slitStartY} 
            L 245 ${bottomY} 
            L 132 ${bottomY} 
            L 142 ${slitStartY} 
            L 145 190 
            L 135 190 
            C 125 145 160 105 180 95 Z`}
        fill="url(#fabTextureSilk)"
        stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
        strokeWidth={viewMode === 'blueprint' ? '1.5' : '1.2'}
      />

      {/* Realistic Drape Shading */}
      {viewMode === 'realistic' && (
        <>
          <path
            d={`M 180 95 L 215 95 Q 250 110 285 95 L 320 95 C 340 105 375 145 365 190 L 355 190 L 358 ${slitStartY} L 368 ${bottomY} L 132 ${bottomY} L 142 ${slitStartY} L 145 190 L 135 190 C 125 145 160 105 180 95 Z`}
            fill="url(#bodyShadingHoriz)"
            style={{ mixBlendMode: 'multiply' }}
          />
          <path
            d={`M 180 95 L 215 95 Q 250 110 285 95 L 320 95 C 340 105 375 145 365 190 L 355 190 L 358 ${slitStartY} L 368 ${bottomY} L 132 ${bottomY} L 142 ${slitStartY} L 145 190 L 135 190 C 125 145 160 105 180 95 Z`}
            fill="url(#bodyShadingVert)"
          />
          {/* Vertical Fabric Drape and Chera Slit Shadows */}
          <line x1="142" y1={slitStartY} x2="132" y2={bottomY} stroke="#000000" strokeWidth="2.5" opacity="0.3" />
          <line x1="358" y1={slitStartY} x2="368" y2={bottomY} stroke="#000000" strokeWidth="2.5" opacity="0.3" />
          <path d="M 210 240 Q 250 280 290 240" stroke="#000000" strokeWidth="1.2" opacity="0.1" fill="none" />
          <path d="M 190 350 Q 250 390 310 350" stroke="#000000" strokeWidth="1.5" opacity="0.12" fill="none" />
        </>
      )}

      {/* 3. Sleeves */}
      <g id="panjabi-sleeves">
        {isThreeQuarter ? (
          // 3/4th Sleeve
          <>
            <path d="M 180 95 L 105 190 L 125 310 L 155 300 L 145 190 Z" fill="url(#fabTextureSilk)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
            <polygon points="105,310 155,300 157,315 107,325" fill="url(#fabTextureSilk)" stroke="#0F172A" strokeWidth="1" filter="url(#softLayerShadow)" />
            <path d="M 320 95 L 395 190 L 375 310 L 345 300 L 355 190 Z" fill="url(#fabTextureSilk)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
            <polygon points="345,300 395,310 393,325 343,315" fill="url(#fabTextureSilk)" stroke="#0F172A" strokeWidth="1" filter="url(#softLayerShadow)" />
          </>
        ) : (
          // Full Panjabi Sleeves
          <>
            {/* Left Sleeve */}
            <path d="M 180 95 L 90 230 L 72 410 L 118 405 L 145 240 L 145 190 Z" fill="url(#fabTextureSilk)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
            {viewMode === 'realistic' && <path d="M 180 95 L 90 230 L 72 410 L 118 405 L 145 240 L 145 190 Z" fill="url(#sleeveShadingLeft)" />}
            
            {/* Left Hem/Cuff */}
            {isCuffed ? (
              <g filter="url(#softLayerShadow)">
                <polygon points="68,408 118,403 116,432 66,437" fill="url(#fabTextureSilk)" stroke="#0F172A" strokeWidth="1.1" />
                <circle cx="92" cy="420" r="3.5" fill={buttonFill} stroke="#78350F" strokeWidth="0.7" />
              </g>
            ) : (
              <line x1="72" y1="410" x2="118" y2="405" stroke={stitchColor} strokeWidth="1.2" strokeDasharray="3 2" />
            )}

            {/* Right Sleeve */}
            <path d="M 320 95 L 410 230 L 428 410 L 382 405 L 355 240 L 355 190 Z" fill="url(#fabTextureSilk)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
            {viewMode === 'realistic' && <path d="M 320 95 L 410 230 L 428 410 L 382 405 L 355 240 L 355 190 Z" fill="url(#sleeveShadingRight)" />}
            
            {/* Right Hem/Cuff */}
            {isCuffed ? (
              <g filter="url(#softLayerShadow)">
                <polygon points="382,403 432,408 434,437 384,432" fill="url(#fabTextureSilk)" stroke="#0F172A" strokeWidth="1.1" />
                <circle cx="408" cy="420" r="3.5" fill={buttonFill} stroke="#78350F" strokeWidth="0.7" />
              </g>
            ) : (
              <line x1="382" y1="405" x2="428" y2="410" stroke={stitchColor} strokeWidth="1.2" strokeDasharray="3 2" />
            )}
          </>
        )}
      </g>

      {/* 4. Panjabi Front Placket */}
      <g id="panjabi-placket" filter="url(#softLayerShadow)">
        {/* Placket Panel */}
        <rect
          x="241"
          y="100"
          width="18"
          height="160"
          fill="url(#fabTextureSilk)"
          stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
          strokeWidth="1"
        />

        {/* Contrast Piping along Placket */}
        {isPiped && (
          <>
            <line x1="240" y1="100" x2="240" y2="260" stroke="#D97706" strokeWidth="2" />
            <line x1="260" y1="100" x2="260" y2="260" stroke="#D97706" strokeWidth="2" />
          </>
        )}

        {/* Ornate Zari Embroidery if Selected */}
        {isEmbroidered && (
          <g opacity="0.85">
            <path
              d="M 244 110 Q 250 115 256 110 Q 250 120 244 130 Q 250 140 256 130 Q 250 150 244 160 Q 250 170 256 160 Q 250 180 244 190 Q 250 200 256 190 Q 250 210 244 220 Q 250 230 256 220 Q 250 245 250 258"
              fill="none"
              stroke="#D97706"
              strokeWidth="1.8"
            />
          </g>
        )}

        {/* Panjabi Buttons (Potli / Brass Loop) */}
        {!isConcealed ? (
          [125, 155, 185, 215, 245].map((y, idx) => (
            <g key={`pj-btn-${idx}`}>
              {/* Loop thread */}
              <circle cx="250" cy={y} r="4.2" fill={buttonFill} stroke="#78350F" strokeWidth="0.8" />
              <circle cx="250" cy={y} r="1.5" fill="#FEF08A" />
            </g>
          ))
        ) : (
          <line x1="250" y1="102" x2="250" y2="258" stroke={stitchColor} strokeWidth="1" strokeDasharray="4 2" />
        )}

        {/* Placket Pointed Base Box */}
        <polygon points="241,260 259,260 250,272" fill="url(#fabTextureSilk)" stroke="#0F172A" strokeWidth="1" />
      </g>

      {/* 5. Chest Pocket (if chosen) */}
      {pocket.includes('chest') && (
        <g id="panjabi-chest-pocket" filter="url(#softLayerShadow)">
          <path d="M 180 185 L 222 185 L 222 235 L 201 247 L 180 235 Z" fill="url(#fabTextureSilk)" stroke="#0F172A" strokeWidth="1" />
          <line x1="180" y1="192" x2="222" y2="192" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
      )}

      {/* Hidden Side Pocket Slits */}
      {pocket.includes('side') && (
        <g id="panjabi-side-pockets">
          <line x1="145" y1="280" x2="143" y2="330" stroke="#000000" strokeWidth="2" strokeDasharray="3 2" opacity="0.6" />
          <line x1="355" y1="280" x2="357" y2="330" stroke="#000000" strokeWidth="2" strokeDasharray="3 2" opacity="0.6" />
        </g>
      )}

      {/* 6. Collar Band */}
      <g id="panjabi-collar" filter="url(#deepCollarShadow)">
        {collar.includes('sherwani') ? (
          // High Sherwani Collar
          <path
            d="M 205 98 C 220 114 280 114 295 98 L 292 74 C 275 90 225 90 208 74 Z"
            fill="url(#fabTextureSilk)"
            stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
            strokeWidth="1.3"
          />
        ) : (
          // Classic Mandarin / Stand Collar
          <path
            d="M 210 98 C 225 112 275 112 290 98 L 288 80 C 273 94 227 94 212 80 Z"
            fill="url(#fabTextureSilk)"
            stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
            strokeWidth="1.2"
          />
        )}
        {/* Collar piping / stitch */}
        {isPiped && (
          <path d="M 212 80 C 227 94 273 94 288 80" fill="none" stroke="#D97706" strokeWidth="1.5" />
        )}
        <path d="M 210 98 C 225 112 275 112 290 98" fill="none" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2.5 1.5" />
      </g>

      {/* 7. Bottom Hem & Side Slits */}
      <line x1="132" y1={bottomY} x2="245" y2={bottomY} stroke={stitchColor} strokeWidth="1" strokeDasharray="3 2" />
      <line x1="255" y1={bottomY} x2="368" y2={bottomY} stroke={stitchColor} strokeWidth="1" strokeDasharray="3 2" />

      {/* 8. Blueprint Specs */}
      {viewMode === 'blueprint' && (
        <g id="blueprint-panjabi-specs">
          <line x1="368" y1={slitStartY} x2="420" y2={slitStartY} stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x="425" y={slitStartY + 4} fill="#F59E0B" fontSize="9" fontWeight="bold">Side Slit (Chera) 12"</text>

          <line x1="250" y1={bottomY} x2="250" y2={bottomY + 25} stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="250" y={bottomY + 38} textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold">
            {isBelowKnee ? '44" Calf Length Hem' : isShortKurta ? '36" Short Kurta Hem' : '40" Knee Length Hem'}
          </text>
        </g>
      )}
    </g>
  );
};
