import React from 'react';
import { StitchingSpecifications } from '../../types/tailor';

interface ThreePieceVisualizerProps {
  customizations: Record<string, string>;
  stitchingSpecs: StitchingSpecifications;
  baseColor: string;
  stitchColor: string;
  isDarkCloth: boolean;
  viewMode: 'realistic' | 'blueprint';
}

export const ThreePieceVisualizer: React.FC<ThreePieceVisualizerProps> = ({
  customizations,
  stitchingSpecs,
  baseColor,
  stitchColor,
  isDarkCloth,
  viewMode,
}) => {
  const kameezCut = customizations['kameez_cut'] || 'kameez_straight_long';
  const neck = customizations['neck_design'] || 'neck_organza_lace_v';
  const sleeve = customizations['sleeve_style'] || 'sleeve_three_quarter_lace';
  const bottom = customizations['bottom_type'] || 'bottom_cigarette_organza';
  const dupatta = customizations['dupatta_finishing'] || 'dupatta_organza_extension';

  const isALine = kameezCut.includes('a_line');
  const isAngrakha = kameezCut.includes('angrakha');
  const isShortKameez = kameezCut.includes('short');
  const bottomKameezY = isShortKameez ? 410 : 470;
  const flareOffset = isALine ? 35 : 0;

  const isBellSleeve = sleeve.includes('bell');
  const isSleeveless = sleeve.includes('sleeveless');
  const isPalazzo = bottom.includes('palazzo') || bottom.includes('wide');
  const isTulip = bottom.includes('tulip') || bottom.includes('dhoti');

  return (
    <g id="garment-three-piece-group">
      {/* 1. Background Salwar/Pant Peek at the bottom */}
      <g id="three-piece-salwar-peek">
        {isPalazzo ? (
          // Wide Flared Palazzo Bottom Peek
          <polygon
            points="140,430 240,430 245,510 130,510"
            fill="#CBD5E1"
            stroke="#0F172A"
            strokeWidth="1"
          />
        ) : (
          // Cigarette Pant / Salwar Bottom Peek
          <>
            <polygon points="175,440 220,440 222,505 170,505" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1" />
            <polygon points="280,440 325,440 330,505 278,505" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1" />
            {/* Organza Lace on Salwar Hem */}
            <line x1="170" y1="495" x2="222" y2="495" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="278" y1="495" x2="330" y2="495" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />
          </>
        )}
      </g>

      {/* 2. Main Kameez Silhouette */}
      <path
        d={isAngrakha
          ? `M 185 95 
             L 215 95 
             Q 250 110 285 95 
             L 315 95 
             C 335 105 365 140 355 185 
             L 345 185 
             L ${355 + flareOffset} 360 
             L ${365 + flareOffset} ${bottomKameezY} 
             L 135 ${bottomKameezY} 
             L 145 360 
             L 155 185 
             L 145 185 
             C 135 140 165 105 185 95 Z`
          : `M 185 95 
             L 215 95 
             Q 250 110 285 95 
             L 315 95 
             C 335 105 365 140 355 185 
             L 345 185 
             L ${350 + flareOffset} 360 
             L ${355 + flareOffset} ${bottomKameezY} 
             L ${145 - flareOffset} ${bottomKameezY} 
             L ${150 - flareOffset} 360 
             L 155 185 
             L 145 185 
             C 135 140 165 105 185 95 Z`
        }
        fill="url(#fabTextureSilk)"
        stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
        strokeWidth={viewMode === 'blueprint' ? '1.5' : '1.2'}
      />

      {/* Realistic Volumetric & Drape Shading */}
      {viewMode === 'realistic' && (
        <>
          <path
            d={`M 185 95 L 215 95 Q 250 110 285 95 L 315 95 C 335 105 365 140 355 185 L 345 185 L ${355 + flareOffset} 360 L ${365 + flareOffset} ${bottomKameezY} L ${135 - flareOffset} ${bottomKameezY} L 145 360 L 155 185 L 145 185 C 135 140 165 105 185 95 Z`}
            fill="url(#bodyShadingHoriz)"
            style={{ mixBlendMode: 'multiply' }}
          />
          <path
            d={`M 185 95 L 215 95 Q 250 110 285 95 L 315 95 C 335 105 365 140 355 185 L 345 185 L ${355 + flareOffset} 360 L ${365 + flareOffset} ${bottomKameezY} L ${135 - flareOffset} ${bottomKameezY} L 145 360 L 155 185 L 145 185 C 135 140 165 105 185 95 Z`}
            fill="url(#bodyShadingVert)"
          />
          {/* Princess Darts / Contouring Lines */}
          <path d="M 195 185 Q 205 280 200 350" stroke="#000000" strokeWidth="1" opacity="0.2" fill="none" />
          <path d="M 305 185 Q 295 280 300 350" stroke="#000000" strokeWidth="1" opacity="0.2" fill="none" />
        </>
      )}

      {/* 3. Kameez Sleeves */}
      {!isSleeveless && (
        <g id="three-piece-sleeves">
          {/* Left Sleeve */}
          <path
            d={isBellSleeve
              ? "M 185 95 L 105 185 L 80 330 L 165 310 L 155 185 Z"
              : "M 185 95 L 110 185 L 125 315 L 155 305 L 155 185 Z"}
            fill="url(#fabTextureSilk)"
            stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
            strokeWidth="1.2"
          />
          {/* Left Lace / Cuff Trim */}
          <line
            x1={isBellSleeve ? "80" : "125"}
            y1={isBellSleeve ? "330" : "315"}
            x2={isBellSleeve ? "165" : "155"}
            y2={isBellSleeve ? "310" : "305"}
            stroke="#D97706"
            strokeWidth="2.5"
            strokeDasharray="3 1.5"
          />

          {/* Right Sleeve */}
          <path
            d={isBellSleeve
              ? "M 315 95 L 395 185 L 420 330 L 335 310 L 345 185 Z"
              : "M 315 95 L 390 185 L 375 315 L 345 305 L 345 185 Z"}
            fill="url(#fabTextureSilk)"
            stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
            strokeWidth="1.2"
          />
          {/* Right Lace / Cuff Trim */}
          <line
            x1={isBellSleeve ? "420" : "375"}
            y1={isBellSleeve ? "330" : "315"}
            x2={isBellSleeve ? "335" : "345"}
            y2={isBellSleeve ? "310" : "305"}
            stroke="#D97706"
            strokeWidth="2.5"
            strokeDasharray="3 1.5"
          />
        </g>
      )}

      {/* 4. Neckline Variations */}
      <g id="three-piece-neckline" filter="url(#softLayerShadow)">
        {neck.includes('potli') ? (
          // Round Neck with Potli Button Row
          <g>
            <path d="M 215 95 Q 250 155 285 95" fill="#0F172A" opacity="0.3" />
            <path d="M 215 95 Q 250 155 285 95" fill="none" stroke="#D97706" strokeWidth="2" />
            <line x1="250" y1="130" x2="250" y2="230" stroke="#0F172A" strokeWidth="1" />
            {[145, 165, 185, 205, 225].map((y, idx) => (
              <circle key={`potli-${idx}`} cx="250" cy={y} r="3.5" fill="url(#goldButtonGrad)" stroke="#78350F" strokeWidth="0.6" />
            ))}
          </g>
        ) : neck.includes('boat') ? (
          // Wide High Boat Neck
          <g>
            <path d="M 200 95 Q 250 120 300 95" fill="#0F172A" opacity="0.3" />
            <path d="M 200 95 Q 250 120 300 95" fill="none" stroke="#D97706" strokeWidth="2.5" />
          </g>
        ) : neck.includes('sweetheart') ? (
          // Sweetheart Neckline
          <g>
            <path d="M 210 95 Q 230 135 250 125 Q 270 135 290 95" fill="#0F172A" opacity="0.3" />
            <path d="M 210 95 Q 230 135 250 125 Q 270 135 290 95" fill="none" stroke="#D97706" strokeWidth="2" />
          </g>
        ) : (
          // Organza Lace V-Neckline with Cutwork / Patch
          <g>
            <polygon points="215,95 285,95 250,165" fill="#FEF08A" opacity="0.25" />
            <path d="M 215 95 L 250 165 L 285 95" fill="none" stroke="#D97706" strokeWidth="2.5" />
            {/* Scalloped lace embroidery lines */}
            <path d="M 218 95 L 250 160 L 282 95" fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="2 2" />
          </g>
        )}

        {/* Angrakha Overlap Flap if chosen */}
        {isAngrakha && (
          <g>
            <path d="M 215 95 Q 260 180 340 250" fill="none" stroke="#D97706" strokeWidth="2" />
            {/* Dori Latkan on Angrakha tie */}
            <circle cx="340" cy="250" r="4.5" fill="url(#goldButtonGrad)" stroke="#78350F" strokeWidth="0.8" />
            <path d="M 340 254 Q 345 275 350 290" stroke="#D97706" strokeWidth="1.5" fill="none" />
            <polygon points="346,290 354,290 350,302" fill="url(#goldButtonGrad)" />
          </g>
        )}
      </g>

      {/* 5. Dupatta Drape Falling over Left Shoulder */}
      <g id="three-piece-dupatta" filter="url(#deepCollarShadow)" opacity="0.9">
        <path
          d="M 170 85 
             C 160 140 130 250 115 370 
             L 155 370 
             C 175 260 200 160 215 95 Z"
          fill="url(#fabTextureSilk)"
          stroke="#0F172A"
          strokeWidth="0.9"
        />
        {/* Dupatta Scalloped Lace / Border Trim */}
        <path
          d="M 170 85 C 160 140 130 250 115 370"
          fill="none"
          stroke="#D97706"
          strokeWidth="2.5"
          strokeDasharray="4 2"
        />
        <line x1="115" y1="370" x2="155" y2="370" stroke="#D97706" strokeWidth="3" />
        {/* Tassel Latkan hanging from Dupatta corner */}
        <circle cx="115" cy="375" r="3.5" fill="url(#goldButtonGrad)" stroke="#78350F" strokeWidth="0.6" />
      </g>

      {/* 6. Kameez Hem & Border Embroidery */}
      <line
        x1={145 - flareOffset}
        y1={bottomKameezY}
        x2={355 + flareOffset}
        y2={bottomKameezY}
        stroke="#D97706"
        strokeWidth="3.5"
      />
      <line
        x1={145 - flareOffset}
        y1={bottomKameezY - 8}
        x2={355 + flareOffset}
        y2={bottomKameezY - 8}
        stroke="#D97706"
        strokeWidth="1.2"
        strokeDasharray="3 2"
      />

      {/* 7. Blueprint Specs */}
      {viewMode === 'blueprint' && (
        <g id="blueprint-three-piece-specs">
          <line x1="250" y1="160" x2="310" y2="160" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x="315" y="164" fill="#F59E0B" fontSize="9" fontWeight="bold">Lace Neck Insert</text>

          <line x1="365" y1="360" x2="425" y2="360" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x="430" y="364" fill="#F59E0B" fontSize="9" fontWeight="bold">14" Side Slit (Chera)</text>

          <line x1="250" y1={bottomKameezY} x2="250" y2={bottomKameezY + 25} stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="250" y={bottomKameezY + 38} textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold">
            {isALine ? 'Flared A-Line Cut' : 'Straight 42" Kameez Hem'}
          </text>
        </g>
      )}
    </g>
  );
};
