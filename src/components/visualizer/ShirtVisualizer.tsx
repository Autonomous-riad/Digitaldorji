import React from 'react';
import { StitchingSpecifications } from '../../types/tailor';

interface ShirtVisualizerProps {
  customizations: Record<string, string>;
  stitchingSpecs: StitchingSpecifications;
  baseColor: string;
  stitchColor: string;
  isDarkCloth: boolean;
  viewMode: 'realistic' | 'blueprint';
}

export const ShirtVisualizer: React.FC<ShirtVisualizerProps> = ({
  customizations,
  stitchingSpecs,
  baseColor,
  stitchColor,
  isDarkCloth,
  viewMode,
}) => {
  const collar = customizations['collar_style'] || customizations['collar_type'] || 'pointed_classic';
  const sleeve = customizations['sleeve_length_style'] || customizations['sleeve_style'] || 'full_sleeve_round_cuff';
  const pocket = customizations['pocket_style'] || customizations['pocket_options'] || customizations['pocket_cut'] || 'single_patch_pocket';
  const fit = customizations['fit_style'] || 'smart_slim';
  const buttonType = customizations['button_type'] || 'pearl_white_buttons';
  const placketType = customizations['placket_style'] || 'classic_standard_front';

  const isSlim = fit.includes('slim');
  const isLoose = fit.includes('comfort') || fit.includes('loose');
  const isFrenchCuff = sleeve.includes('french');
  const isHalfSleeve = sleeve.includes('half') || sleeve.includes('short');
  const isConcealed = placketType.includes('concealed') || buttonType.includes('concealed');

  // Torso side curves based on fit
  const leftTorsoX = isSlim ? 150 : isLoose ? 130 : 140;
  const rightTorsoX = isSlim ? 350 : isLoose ? 370 : 360;
  const waistInward = isSlim ? 165 : isLoose ? 135 : 152;
  const waistRightInward = isSlim ? 335 : isLoose ? 365 : 348;

  const buttonFill = buttonType.includes('horn') || buttonType.includes('dark') 
    ? 'url(#hornButtonGrad)' 
    : buttonType.includes('silver') || buttonType.includes('metal')
    ? 'url(#silverButtonGrad)'
    : buttonType.includes('gold')
    ? 'url(#goldButtonGrad)'
    : 'url(#pearlButtonGrad)';

  const buttonStroke = buttonType.includes('horn') ? '#0F172A' : '#94A3B8';

  return (
    <g id="garment-shirt-group">
      {/* 1. Back Under-Collar Shadow */}
      <ellipse cx="250" cy="115" rx="55" ry="18" fill="#000000" opacity="0.3" />
      <path d="M 205 110 C 230 126 270 126 295 110 C 285 125 215 125 205 110 Z" fill="#000000" opacity="0.4" />

      {/* 2. Main Torso Body */}
      <path
        d={`M 175 110 
            L 205 110 
            Q 250 126 295 110 
            L 325 110 
            C 340 120 375 155 365 200 
            L ${rightTorsoX} 200 
            Q ${waistRightInward} 340 ${rightTorsoX} 480 
            Q 250 510 ${leftTorsoX} 480 
            Q ${waistInward} 340 ${leftTorsoX} 200 
            L 135 200 
            C 125 155 160 120 175 110 Z`}
        fill="url(#fabTextureOxford)"
        stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
        strokeWidth={viewMode === 'blueprint' ? '1.5' : '1.2'}
        strokeDasharray={viewMode === 'blueprint' ? 'none' : 'none'}
      />

      {/* Volumetric Shading Overlays (Realistic Mode) */}
      {viewMode === 'realistic' && (
        <>
          <path
            d={`M 175 110 L 205 110 Q 250 126 295 110 L 325 110 C 340 120 375 155 365 200 L ${rightTorsoX} 200 Q ${waistRightInward} 340 ${rightTorsoX} 480 Q 250 510 ${leftTorsoX} 480 Q ${waistInward} 340 ${leftTorsoX} 200 L 135 200 C 125 155 160 120 175 110 Z`}
            fill="url(#bodyShadingHoriz)"
            style={{ mixBlendMode: 'multiply' }}
          />
          <path
            d={`M 175 110 L 205 110 Q 250 126 295 110 L 325 110 C 340 120 375 155 365 200 L ${rightTorsoX} 200 Q ${waistRightInward} 340 ${rightTorsoX} 480 Q 250 510 ${leftTorsoX} 480 Q ${waistInward} 340 ${leftTorsoX} 200 L 135 200 C 125 155 160 120 175 110 Z`}
            fill="url(#bodyShadingVert)"
          />

          {/* Natural Fabric Creases and Waist Drape Lines */}
          <path d="M 175 220 Q 200 240 235 235" stroke="#000000" strokeWidth="1.2" opacity="0.12" fill="none" />
          <path d="M 325 220 Q 300 240 265 235" stroke="#000000" strokeWidth="1.2" opacity="0.12" fill="none" />
          <path d={`M ${leftTorsoX + 5} 330 Q 200 350 235 345`} stroke="#000000" strokeWidth="1.5" opacity="0.15" fill="none" />
          <path d={`M ${rightTorsoX - 5} 330 Q 300 350 265 345`} stroke="#000000" strokeWidth="1.5" opacity="0.15" fill="none" />
          <path d="M 230 460 Q 250 475 270 460" stroke="#000000" strokeWidth="1.2" opacity="0.1" fill="none" />
        </>
      )}

      {/* 3. Sleeves */}
      {isHalfSleeve ? (
        // Half / Short Sleeve
        <g id="shirt-half-sleeves">
          {/* Left Sleeve */}
          <path
            d="M 175 110 L 105 170 L 125 235 L 145 200 Z"
            fill="url(#fabTextureOxford)"
            stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
            strokeWidth="1.2"
          />
          {/* Left Sleeve Hem / Fold */}
          <polygon points="105,170 95,190 120,245 125,235" fill="url(#fabTextureOxford)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1" filter="url(#softLayerShadow)" />
          <line x1="97" y1="192" x2="122" y2="242" stroke={stitchColor} strokeWidth="0.9" strokeDasharray="3 2" />

          {/* Right Sleeve */}
          <path
            d="M 325 110 L 395 170 L 375 235 L 355 200 Z"
            fill="url(#fabTextureOxford)"
            stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
            strokeWidth="1.2"
          />
          {/* Right Sleeve Hem / Fold */}
          <polygon points="395,170 405,190 380,245 375,235" fill="url(#fabTextureOxford)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1" filter="url(#softLayerShadow)" />
          <line x1="403" y1="192" x2="378" y2="242" stroke={stitchColor} strokeWidth="0.9" strokeDasharray="3 2" />
        </g>
      ) : (
        // Full Sleeve
        <g id="shirt-full-sleeves">
          {/* Left Sleeve */}
          <path
            d="M 175 110 L 85 240 L 70 395 L 115 390 L 140 250 L 145 200 Z"
            fill="url(#fabTextureOxford)"
            stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
            strokeWidth="1.2"
          />
          {viewMode === 'realistic' && (
            <path d="M 175 110 L 85 240 L 70 395 L 115 390 L 140 250 L 145 200 Z" fill="url(#sleeveShadingLeft)" />
          )}

          {/* Left Cuff */}
          <g filter="url(#softLayerShadow)">
            <polygon
              points={isFrenchCuff ? "62,392 118,387 115,422 58,427" : "66,393 116,388 114,418 64,422"}
              fill="url(#fabTextureOxford)"
              stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
              strokeWidth="1.2"
            />
            {/* Cuff stitching */}
            <line x1="68" y1="397" x2="114" y2="392" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2.5 1.5" />
            <line x1="66" y1="418" x2="112" y2="414" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2.5 1.5" />
            {isFrenchCuff ? (
              // French Cuff Link
              <g>
                <circle cx="90" cy="407" r="4.5" fill="url(#goldButtonGrad)" stroke="#78350F" strokeWidth="0.8" />
                <rect x="88.5" y="403" width="3" height="8" rx="1.5" fill="#FFFFFF" opacity="0.6" />
              </g>
            ) : (
              // Standard Round Barrel Cuff Button
              <circle cx="90" cy="406" r="3.5" fill={buttonFill} stroke={buttonStroke} strokeWidth="0.7" />
            )}
          </g>

          {/* Right Sleeve */}
          <path
            d="M 325 110 L 415 240 L 430 395 L 385 390 L 360 250 L 355 200 Z"
            fill="url(#fabTextureOxford)"
            stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
            strokeWidth="1.2"
          />
          {viewMode === 'realistic' && (
            <path d="M 325 110 L 415 240 L 430 395 L 385 390 L 360 250 L 355 200 Z" fill="url(#sleeveShadingRight)" />
          )}

          {/* Right Cuff */}
          <g filter="url(#softLayerShadow)">
            <polygon
              points={isFrenchCuff ? "382,387 438,392 442,427 385,422" : "384,388 434,393 436,422 386,418"}
              fill="url(#fabTextureOxford)"
              stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
              strokeWidth="1.2"
            />
            {/* Cuff stitching */}
            <line x1="386" y1="392" x2="432" y2="397" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2.5 1.5" />
            <line x1="388" y1="414" x2="434" y2="418" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2.5 1.5" />
            {isFrenchCuff ? (
              <g>
                <circle cx="410" cy="407" r="4.5" fill="url(#goldButtonGrad)" stroke="#78350F" strokeWidth="0.8" />
                <rect x="408.5" y="403" width="3" height="8" rx="1.5" fill="#FFFFFF" opacity="0.6" />
              </g>
            ) : (
              <circle cx="410" cy="406" r="3.5" fill={buttonFill} stroke={buttonStroke} strokeWidth="0.7" />
            )}
          </g>
        </g>
      )}

      {/* 4. Center Placket & Buttons */}
      <g id="shirt-front-placket">
        {/* Placket Strip */}
        <rect
          x="238"
          y="118"
          width="24"
          height="370"
          fill="url(#fabTextureOxford)"
          stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
          strokeWidth="0.9"
          filter="url(#softLayerShadow)"
        />
        {/* Placket edge stitching */}
        <line x1="240" y1="118" x2="240" y2="488" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="3 2" />
        <line x1="260" y1="118" x2="260" y2="488" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="3 2" />

        {/* Buttons along placket (if not concealed) */}
        {!isConcealed ? (
          [160, 210, 260, 310, 360, 410, 460].map((y, idx) => (
            <g key={`btn-${idx}`} filter="url(#softLayerShadow)">
              {/* Buttonhole stitch */}
              <line x1="250" y1={y - 7} x2="250" y2={y + 7} stroke="#475569" strokeWidth="1" strokeDasharray="1.5 1" />
              {/* Button disc */}
              <circle cx="250" cy={y} r="5.5" fill={buttonFill} stroke={buttonStroke} strokeWidth="0.8" />
              {/* Button 4-holes & cross stitch */}
              <circle cx="248" cy={y - 2} r="0.7" fill="#1E293B" />
              <circle cx="252" cy={y - 2} r="0.7" fill="#1E293B" />
              <circle cx="248" cy={y + 2} r="0.7" fill="#1E293B" />
              <circle cx="252" cy={y + 2} r="0.7" fill="#1E293B" />
              <line x1="248" y1={y - 2} x2="252" y2={y + 2} stroke={stitchColor} strokeWidth="0.6" />
              <line x1="252" y1={y - 2} x2="248" y2={y + 2} stroke={stitchColor} strokeWidth="0.6" />
            </g>
          ))
        ) : (
          // Concealed Placket Indicator
          <g>
            <line x1="249" y1="120" x2="249" y2="488" stroke={stitchColor} strokeWidth="1.2" strokeDasharray="6 3" />
            <text x="250" y="300" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">CONCEALED</text>
          </g>
        )}
      </g>

      {/* 5. Chest Pockets */}
      {pocket !== 'no_pocket_clean' && (
        <g id="shirt-chest-pocket" filter="url(#softLayerShadow)">
          {/* Left Chest Pocket (Viewer's Left = Shirt Left Chest at X ~175) */}
          <g>
            <path
              d={pocket.includes('pointed') || pocket.includes('v_pointed')
                ? "M 165 210 L 220 210 L 220 270 L 192.5 288 L 165 270 Z"
                : "M 165 210 L 220 210 L 220 275 Q 220 282 213 282 L 172 282 Q 165 282 165 275 Z"}
              fill="url(#fabTextureOxford)"
              stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
              strokeWidth="1"
            />
            {/* Pocket top hem & stitch */}
            <line x1="165" y1="218" x2="220" y2="218" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2.5 1.5" />
            <path
              d={pocket.includes('pointed') || pocket.includes('v_pointed')
                ? "M 168 212 L 217 212 L 217 268 L 192.5 284 L 168 268 Z"
                : "M 168 212 L 217 212 L 217 274 Q 217 279 212 279 L 173 279 Q 168 279 168 274 Z"}
              fill="none"
              stroke={stitchColor}
              strokeWidth="0.8"
              strokeDasharray="2.5 1.5"
            />
            {/* Flap & Button if double_pockets_flaps */}
            {pocket.includes('flap') && (
              <g>
                <polygon points="163,205 222,205 222,225 192.5,236 163,225" fill="url(#fabTextureOxford)" stroke="#0F172A" strokeWidth="0.9" />
                <circle cx="192.5" cy="223" r="3.5" fill={buttonFill} stroke={buttonStroke} strokeWidth="0.6" />
              </g>
            )}
          </g>

          {/* Right Chest Pocket (if double pockets) */}
          {(pocket.includes('double') || pocket.includes('two')) && (
            <g>
              <path
                d={pocket.includes('pointed') || pocket.includes('v_pointed')
                  ? "M 280 210 L 335 210 L 335 270 L 307.5 288 L 280 270 Z"
                  : "M 280 210 L 335 210 L 335 275 Q 335 282 328 282 L 287 282 Q 280 282 280 275 Z"}
                fill="url(#fabTextureOxford)"
                stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
                strokeWidth="1"
              />
              <line x1="280" y1="218" x2="335" y2="218" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2.5 1.5" />
              <path
                d={pocket.includes('pointed') || pocket.includes('v_pointed')
                  ? "M 283 212 L 332 212 L 332 268 L 307.5 284 L 283 268 Z"
                  : "M 283 212 L 332 212 L 332 274 Q 332 279 327 279 L 288 279 Q 283 279 283 274 Z"}
                fill="none"
                stroke={stitchColor}
                strokeWidth="0.8"
                strokeDasharray="2.5 1.5"
              />
              {pocket.includes('flap') && (
                <g>
                  <polygon points="278,205 337,205 337,225 307.5,236 278,225" fill="url(#fabTextureOxford)" stroke="#0F172A" strokeWidth="0.9" />
                  <circle cx="307.5" cy="223" r="3.5" fill={buttonFill} stroke={buttonStroke} strokeWidth="0.6" />
                </g>
              )}
            </g>
          )}
        </g>
      )}

      {/* 6. Realistic Collar Variations */}
      <g id="shirt-collar-layer" filter="url(#deepCollarShadow)">
        {collar === 'mandarin_band' || collar.includes('band') ? (
          // Mandarin / Chinese Standing Band Collar
          <g id="collar-mandarin">
            <path
              d="M 195 110 C 215 130 285 130 305 110 L 302 92 C 280 108 220 108 198 92 Z"
              fill="url(#fabTextureOxford)"
              stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'}
              strokeWidth="1.2"
            />
            {/* Topstitch */}
            <path d="M 199 95 C 220 110 280 110 301 95" fill="none" stroke={stitchColor} strokeWidth="0.8" strokeDasharray="2.5 1.5" />
            <circle cx="250" cy="115" r="4" fill={buttonFill} stroke={buttonStroke} strokeWidth="0.7" />
          </g>
        ) : collar === 'spread_wide' ? (
          // Wide Spread European Cutaway Collar
          <g id="collar-spread">
            {/* Left Leaf */}
            <polygon points="205,108 250,126 150,148 190,95" fill="url(#fabTextureOxford)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
            <line x1="192" y1="98" x2="154" y2="146" stroke={stitchColor} strokeWidth="0.9" strokeDasharray="2.5 1.5" />
            <line x1="154" y1="146" x2="246" y2="125" stroke={stitchColor} strokeWidth="0.9" strokeDasharray="2.5 1.5" />

            {/* Right Leaf */}
            <polygon points="295,108 250,126 350,148 310,95" fill="url(#fabTextureOxford)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
            <line x1="308" y1="98" x2="346" y2="146" stroke={stitchColor} strokeWidth="0.9" strokeDasharray="2.5 1.5" />
            <line x1="346" y1="146" x2="254" y2="125" stroke={stitchColor} strokeWidth="0.9" strokeDasharray="2.5 1.5" />
          </g>
        ) : collar === 'button_down' ? (
          // Button-Down Collar with small anchor buttons
          <g id="collar-button-down">
            {/* Left Leaf */}
            <polygon points="205,108 250,126 185,168 190,95" fill="url(#fabTextureOxford)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
            <line x1="192" y1="98" x2="187" y2="164" stroke={stitchColor} strokeWidth="0.9" strokeDasharray="2.5 1.5" />
            <circle cx="192" cy="158" r="3" fill={buttonFill} stroke={buttonStroke} strokeWidth="0.6" />

            {/* Right Leaf */}
            <polygon points="295,108 250,126 315,168 310,95" fill="url(#fabTextureOxford)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
            <line x1="308" y1="98" x2="313" y2="164" stroke={stitchColor} strokeWidth="0.9" strokeDasharray="2.5 1.5" />
            <circle cx="308" cy="158" r="3" fill={buttonFill} stroke={buttonStroke} strokeWidth="0.6" />
          </g>
        ) : collar === 'club_round' ? (
          // Club Round Curved Collar
          <g id="collar-club-round">
            <path d="M 190 95 L 205 108 L 250 126 L 195 155 Q 180 152 182 135 Z" fill="url(#fabTextureOxford)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
            <path d="M 310 95 L 295 108 L 250 126 L 305 155 Q 320 152 318 135 Z" fill="url(#fabTextureOxford)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
          </g>
        ) : (
          // Pointed Classic Standard Collar
          <g id="collar-pointed-classic">
            {/* Left Leaf */}
            <polygon points="205,108 250,126 175,165 190,95" fill="url(#fabTextureOxford)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
            <line x1="192" y1="98" x2="178" y2="162" stroke={stitchColor} strokeWidth="0.9" strokeDasharray="2.5 1.5" />
            <line x1="178" y1="162" x2="246" y2="125" stroke={stitchColor} strokeWidth="0.9" strokeDasharray="2.5 1.5" />

            {/* Right Leaf */}
            <polygon points="295,108 250,126 325,165 310,95" fill="url(#fabTextureOxford)" stroke={viewMode === 'blueprint' ? '#38BDF8' : '#0F172A'} strokeWidth="1.2" />
            <line x1="308" y1="98" x2="322" y2="162" stroke={stitchColor} strokeWidth="0.9" strokeDasharray="2.5 1.5" />
            <line x1="322" y1="162" x2="254" y2="125" stroke={stitchColor} strokeWidth="0.9" strokeDasharray="2.5 1.5" />
          </g>
        )}

        {/* Neck Tie Knot (if present or decorative button) */}
        <circle cx="250" cy="126" r="4.2" fill={buttonFill} stroke={buttonStroke} strokeWidth="0.8" />
      </g>

      {/* 7. Blueprint Technical Overlay (Engineering Mode) */}
      {viewMode === 'blueprint' && (
        <g id="blueprint-shirt-specs">
          {/* Seam Allowance & Specs Callouts */}
          <line x1="130" y1="110" x2="175" y2="110" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x="110" y="105" fill="#F59E0B" fontSize="9" fontWeight="bold">0.5" Shoulder Seam</text>

          <line x1="110" y1="200" x2="140" y2="200" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x="75" y="195" fill="#F59E0B" fontSize="9" fontWeight="bold">Armhole 16 SPI</text>

          <line x1="250" y1="480" x2="250" y2="520" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="250" y="535" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold">1.25" Curved Tail Hem (Twin-Needle)</text>

          {/* Waist suppression callout */}
          <line x1={leftTorsoX} y1="340" x2={leftTorsoX - 30} y2="340" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x={leftTorsoX - 35} y="343" textAnchor="end" fill="#F59E0B" fontSize="9" fontWeight="bold">
            {isSlim ? 'Slim Taper (-2.5")' : isLoose ? 'Relaxed Cut (+3")' : 'Regular Classic'}
          </text>
        </g>
      )}
    </g>
  );
};
