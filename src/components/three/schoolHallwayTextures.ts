import * as THREE from 'three';

export interface WorldTextureSet {
  woodFloorMap: THREE.CanvasTexture;
  woodFloorBump: THREE.CanvasTexture;
  plasterWallMap: THREE.CanvasTexture;
  plasterWallBump: THREE.CanvasTexture;
  darkCedarMap: THREE.CanvasTexture;
  darkCedarBump: THREE.CanvasTexture;
  wovenCarpetMap: THREE.CanvasTexture;
  wovenCarpetBump: THREE.CanvasTexture;
  graniteStoneMap: THREE.CanvasTexture;
  graniteStoneBump: THREE.CanvasTexture;
  brushedBrassMap: THREE.CanvasTexture;
  crimsonLacquerMap: THREE.CanvasTexture;
  chalkboardMap: THREE.CanvasTexture;
  washiPaperMap: THREE.CanvasTexture;
  waterRippleMap: THREE.CanvasTexture;
  shojiPaperMap: THREE.CanvasTexture;
  ofudaSealMap: THREE.CanvasTexture;
  contactShadowMap: THREE.CanvasTexture;
  mangaGridMap: THREE.CanvasTexture;
  waxSealMap: THREE.CanvasTexture;
}

function hash01(seed: number): number {
  const s = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
}

function configureTexture(
  canvas: HTMLCanvasElement,
  isAlbedo: boolean,
  maxAnisotropy: number,
  repeatX = 1,
  repeatY = 1,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = isAlbedo ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.anisotropy = maxAnisotropy;
  if (repeatX !== 1 || repeatY !== 1) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
  }
  return tex;
}

export function createWorldTextures(maxAnisotropy: number): WorldTextureSet {
  // 1. Japanese corridor wood plank albedo & bump
  const woodCanvas = document.createElement('canvas');
  woodCanvas.width = 512;
  woodCanvas.height = 512;
  const wCtx = woodCanvas.getContext('2d')!;
  wCtx.fillStyle = '#5c382c';
  wCtx.fillRect(0, 0, 512, 512);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#888888';
  bCtx.fillRect(0, 0, 512, 512);

  const plankCount = 8;
  const plankWidth = 512 / plankCount;
  for (let i = 0; i < plankCount; i++) {
    const x = i * plankWidth;
    const toneShift = (i % 3) * 8 - 8;
    wCtx.fillStyle = `rgb(${92 + toneShift}, ${56 + Math.floor(toneShift * 0.6)}, ${44 + Math.floor(toneShift * 0.5)})`;
    wCtx.fillRect(x + 2, 0, plankWidth - 4, 512);

    wCtx.strokeStyle = 'rgba(33, 20, 22, 0.28)';
    wCtx.lineWidth = 1.5;
    bCtx.strokeStyle = '#626262';
    bCtx.lineWidth = 1.5;
    for (let g = 0; g < 10; g++) {
      const gx = x + 6 + g * 5.5;
      wCtx.beginPath();
      wCtx.moveTo(gx, 0);
      wCtx.bezierCurveTo(gx + 3, 170, gx - 3, 340, gx, 512);
      wCtx.stroke();

      bCtx.beginPath();
      bCtx.moveTo(gx, 0);
      bCtx.lineTo(gx, 512);
      bCtx.stroke();
    }

    wCtx.fillStyle = '#261419';
    wCtx.fillRect(x, 0, 2, 512);
    bCtx.fillStyle = '#222222';
    bCtx.fillRect(x, 0, 3, 512);
  }

  const woodFloorMap = configureTexture(woodCanvas, true, maxAnisotropy, 2, 24);
  const woodFloorBump = configureTexture(bumpCanvas, false, maxAnisotropy, 2, 24);

  // 2. Plaster Stucco Corridor Wall & Bump (organic hash grain)
  const plasterCanvas = document.createElement('canvas');
  plasterCanvas.width = 256;
  plasterCanvas.height = 256;
  const pCtx = plasterCanvas.getContext('2d')!;
  pCtx.fillStyle = '#53303f';
  pCtx.fillRect(0, 0, 256, 256);

  const plasterBumpCanvas = document.createElement('canvas');
  plasterBumpCanvas.width = 256;
  plasterBumpCanvas.height = 256;
  const pbCtx = plasterBumpCanvas.getContext('2d')!;
  pbCtx.fillStyle = '#808080';
  pbCtx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 950; i++) {
    const px = Math.floor(hash01(i * 3.1 + 1) * 256);
    const py = Math.floor(hash01(i * 7.3 + 2) * 256);
    const r = 1 + (i % 3);
    pCtx.fillStyle = i % 2 === 0 ? 'rgba(232,191,201,0.05)' : 'rgba(33,20,28,0.09)';
    pCtx.fillRect(px, py, r, r);
    pbCtx.fillStyle = i % 2 === 0 ? '#8d8d8d' : '#747474';
    pbCtx.fillRect(px, py, r, r);
  }
  pCtx.fillStyle = 'rgba(33, 20, 28, 0.22)';
  pCtx.fillRect(126, 0, 3, 256);
  pbCtx.fillStyle = '#545454';
  pbCtx.fillRect(126, 0, 3, 256);

  const plasterWallMap = configureTexture(plasterCanvas, true, maxAnisotropy, 24, 2);
  const plasterWallBump = configureTexture(plasterBumpCanvas, false, maxAnisotropy, 24, 2);

  // 3. Dark Japanese Cedar (Pillars, Beams, Ceiling, Doors, Altar)
  const cedarCanvas = document.createElement('canvas');
  cedarCanvas.width = 256;
  cedarCanvas.height = 256;
  const cCtx = cedarCanvas.getContext('2d')!;
  cCtx.fillStyle = '#3f242f';
  cCtx.fillRect(0, 0, 256, 256);

  const cedarBumpCanvas = document.createElement('canvas');
  cedarBumpCanvas.width = 256;
  cedarBumpCanvas.height = 256;
  const cbCtx = cedarBumpCanvas.getContext('2d')!;
  cbCtx.fillStyle = '#808080';
  cbCtx.fillRect(0, 0, 256, 256);

  for (let y = 0; y < 256; y += 6) {
    const delta = ((y / 6) % 3) * 4 - 4;
    cCtx.strokeStyle = `rgba(${32 + delta}, 16, 22, 0.35)`;
    cCtx.lineWidth = 2;
    cCtx.beginPath();
    cCtx.moveTo(0, y);
    cCtx.bezierCurveTo(85, y + 3, 170, y - 3, 256, y);
    cCtx.stroke();

    cbCtx.strokeStyle = y % 12 === 0 ? '#686868' : '#929292';
    cbCtx.lineWidth = 1.5;
    cbCtx.beginPath();
    cbCtx.moveTo(0, y);
    cbCtx.lineTo(256, y);
    cbCtx.stroke();
  }
  const darkCedarMap = configureTexture(cedarCanvas, true, maxAnisotropy, 2, 4);
  const darkCedarBump = configureTexture(cedarBumpCanvas, false, maxAnisotropy, 2, 4);

  // 4. Woven Burgundy Runner Carpet & Bump
  const carpetCanvas = document.createElement('canvas');
  carpetCanvas.width = 256;
  carpetCanvas.height = 256;
  const cpCtx = carpetCanvas.getContext('2d')!;
  cpCtx.fillStyle = '#632d40';
  cpCtx.fillRect(0, 0, 256, 256);

  const carpetBumpCanvas = document.createElement('canvas');
  carpetBumpCanvas.width = 256;
  carpetBumpCanvas.height = 256;
  const cpbCtx = carpetBumpCanvas.getContext('2d')!;
  cpbCtx.fillStyle = '#7c7c7c';
  cpbCtx.fillRect(0, 0, 256, 256);

  for (let y = 0; y < 256; y += 8) {
    for (let x = 0; x < 256; x += 8) {
      const alt = ((x + y) / 8) % 2 === 0;
      cpCtx.fillStyle = alt ? 'rgba(184, 73, 85, 0.22)' : 'rgba(48, 27, 41, 0.25)';
      cpCtx.fillRect(x, y, 4, 4);
      cpbCtx.fillStyle = alt ? '#9e9e9e' : '#646464';
      cpbCtx.fillRect(x, y, 4, 4);
    }
  }
  cpCtx.fillStyle = 'rgba(212, 163, 106, 0.45)';
  for (let y = 8; y < 256; y += 32) {
    cpCtx.fillRect(14, y, 10, 14);
    cpCtx.fillRect(232, y, 10, 14);
  }
  const wovenCarpetMap = configureTexture(carpetCanvas, true, maxAnisotropy, 1, 28);
  const wovenCarpetBump = configureTexture(carpetBumpCanvas, false, maxAnisotropy, 1, 28);

  // 5. Carved Granite Stone & Bump (organic speckled grain)
  const graniteCanvas = document.createElement('canvas');
  graniteCanvas.width = 256;
  graniteCanvas.height = 256;
  const gCtx = graniteCanvas.getContext('2d')!;
  gCtx.fillStyle = '#8b848f';
  gCtx.fillRect(0, 0, 256, 256);

  const graniteBumpCanvas = document.createElement('canvas');
  graniteBumpCanvas.width = 256;
  graniteBumpCanvas.height = 256;
  const gbCtx = graniteBumpCanvas.getContext('2d')!;
  gbCtx.fillStyle = '#808080';
  gbCtx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 1600; i++) {
    const gx = Math.floor(hash01(i * 5.7 + 11) * 256);
    const gy = Math.floor(hash01(i * 9.3 + 23) * 256);
    const sz = 1 + (i % 3);
    gCtx.fillStyle =
      i % 5 === 0
        ? '#5b5460'
        : i % 3 === 0
          ? '#a9a2ad'
          : 'rgba(92, 114, 90, 0.25)';
    gCtx.fillRect(gx, gy, sz, sz);
    gbCtx.fillStyle = i % 2 === 0 ? '#a4a4a4' : '#5e5e5e';
    gbCtx.fillRect(gx, gy, sz, sz);
  }
  const graniteStoneMap = configureTexture(graniteCanvas, true, maxAnisotropy, 2, 2);
  const graniteStoneBump = configureTexture(graniteBumpCanvas, false, maxAnisotropy, 2, 2);

  // 6. Brushed Brass Texture
  const brassCanvas = document.createElement('canvas');
  brassCanvas.width = 256;
  brassCanvas.height = 256;
  const brCtx = brassCanvas.getContext('2d')!;
  const brGrad = brCtx.createLinearGradient(0, 0, 256, 256);
  brGrad.addColorStop(0, '#c79358');
  brGrad.addColorStop(0.5, '#e2b77d');
  brGrad.addColorStop(1, '#b58046');
  brCtx.fillStyle = brGrad;
  brCtx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 3) {
    brCtx.fillStyle = y % 6 === 0 ? 'rgba(255,245,220,0.14)' : 'rgba(90,56,22,0.12)';
    brCtx.fillRect(0, y, 256, 1);
  }
  const brushedBrassMap = configureTexture(brassCanvas, true, maxAnisotropy);

  // 7. Crimson Japanese Lacquer Texture (Torii Gate, Red Cords)
  const lacquerCanvas = document.createElement('canvas');
  lacquerCanvas.width = 256;
  lacquerCanvas.height = 256;
  const lCtx = lacquerCanvas.getContext('2d')!;
  const lGrad = lCtx.createLinearGradient(0, 0, 0, 256);
  lGrad.addColorStop(0, '#c6525f');
  lGrad.addColorStop(0.5, '#b84955');
  lGrad.addColorStop(1, '#983642');
  lCtx.fillStyle = lGrad;
  lCtx.fillRect(0, 0, 256, 256);
  lCtx.strokeStyle = 'rgba(48, 27, 41, 0.2)';
  for (let x = 8; x < 256; x += 24) {
    lCtx.beginPath();
    lCtx.moveTo(x, 0);
    lCtx.lineTo(x + 4, 256);
    lCtx.stroke();
  }
  const crimsonLacquerMap = configureTexture(lacquerCanvas, true, maxAnisotropy);

  // 8. Illustrated Classroom Chalkboard Texture
  const chalkCanvas = document.createElement('canvas');
  chalkCanvas.width = 512;
  chalkCanvas.height = 256;
  const chCtx = chalkCanvas.getContext('2d')!;
  chCtx.fillStyle = '#20352d';
  chCtx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 40; i++) {
    chCtx.fillStyle = 'rgba(255, 249, 241, 0.03)';
    chCtx.beginPath();
    chCtx.ellipse(
      80 + hash01(i * 4.1) * 350,
      45 + hash01(i * 7.9) * 165,
      26,
      12,
      0.2,
      0,
      Math.PI * 2,
    );
    chCtx.fill();
  }
  chCtx.strokeStyle = 'rgba(255, 249, 241, 0.65)';
  chCtx.lineWidth = 2;
  chCtx.beginPath();
  chCtx.arc(385, 118, 46, 0, Math.PI * 2);
  chCtx.stroke();
  chCtx.beginPath();
  chCtx.moveTo(338, 118);
  chCtx.lineTo(432, 118);
  chCtx.moveTo(385, 71);
  chCtx.lineTo(385, 165);
  chCtx.stroke();

  chCtx.fillStyle = 'rgba(255, 249, 241, 0.78)';
  chCtx.font = 'bold 20px monospace';
  chCtx.fillText('CHAPTER 01 // STUDIO', 135, 58);
  chCtx.fillStyle = 'rgba(232, 191, 201, 0.8)';
  chCtx.font = '15px monospace';
  chCtx.fillText('RTMNU BCA · CLASS OF 2026', 135, 90);
  chCtx.fillText('THREE.JS + TYPESCRIPT + REACT', 135, 120);
  chCtx.strokeStyle = 'rgba(232, 191, 201, 0.65)';
  chCtx.beginPath();
  chCtx.moveTo(135, 142);
  chCtx.lineTo(310, 142);
  chCtx.stroke();
  const chalkboardMap = configureTexture(chalkCanvas, true, maxAnisotropy);

  // 9. Mulberry Washi Paper Texture (organic scattered fibers)
  const washiCanvas = document.createElement('canvas');
  washiCanvas.width = 256;
  washiCanvas.height = 256;
  const waCtx = washiCanvas.getContext('2d')!;
  waCtx.fillStyle = '#fff9f1';
  waCtx.fillRect(0, 0, 256, 256);
  waCtx.strokeStyle = 'rgba(218, 196, 178, 0.35)';
  waCtx.lineWidth = 1;
  for (let i = 0; i < 180; i++) {
    const x1 = hash01(i * 3.7 + 5) * 256;
    const y1 = hash01(i * 8.1 + 9) * 256;
    const angle = hash01(i * 11.3 + 2) * Math.PI * 2;
    waCtx.beginPath();
    waCtx.moveTo(x1, y1);
    waCtx.lineTo(x1 + Math.cos(angle) * 14, y1 + Math.sin(angle) * 14);
    waCtx.stroke();
  }
  const washiPaperMap = configureTexture(washiCanvas, true, maxAnisotropy);

  // 10. Concentric Water Ripple Texture for Tsukubai Basin
  const waterCanvas = document.createElement('canvas');
  waterCanvas.width = 256;
  waterCanvas.height = 256;
  const wtCtx = waterCanvas.getContext('2d')!;
  const wtGrad = wtCtx.createRadialGradient(128, 128, 10, 128, 128, 124);
  wtGrad.addColorStop(0, '#c6daef');
  wtGrad.addColorStop(0.55, '#89a7c7');
  wtGrad.addColorStop(1, '#3b516e');
  wtCtx.fillStyle = wtGrad;
  wtCtx.fillRect(0, 0, 256, 256);
  wtCtx.strokeStyle = 'rgba(255, 249, 241, 0.42)';
  wtCtx.lineWidth = 2;
  [30, 58, 86, 112].forEach((r) => {
    wtCtx.beginPath();
    wtCtx.arc(128, 128, r, 0, Math.PI * 2);
    wtCtx.stroke();
  });
  const waterRippleMap = configureTexture(waterCanvas, true, maxAnisotropy);

  // 11. Shoji window translucent sunset lattice
  const shojiCanvas = document.createElement('canvas');
  shojiCanvas.width = 512;
  shojiCanvas.height = 512;
  const sCtx = shojiCanvas.getContext('2d')!;
  const grad = sCtx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#ffd8b8');
  grad.addColorStop(0.55, '#f2a596');
  grad.addColorStop(1, '#c7707a');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 512, 512);

  sCtx.strokeStyle = '#301B29';
  sCtx.lineWidth = 10;
  for (let r = 0; r <= 4; r++) {
    const y = (r / 4) * 512;
    sCtx.beginPath();
    sCtx.moveTo(0, y);
    sCtx.lineTo(512, y);
    sCtx.stroke();
  }
  for (let c = 0; c <= 4; c++) {
    const x = (c / 4) * 512;
    sCtx.beginPath();
    sCtx.moveTo(x, 0);
    sCtx.lineTo(x, 512);
    sCtx.stroke();
  }
  const shojiPaperMap = configureTexture(shojiCanvas, true, maxAnisotropy);

  // 12. Ofuda paper talisman seal texture
  const ofudaCanvas = document.createElement('canvas');
  ofudaCanvas.width = 256;
  ofudaCanvas.height = 512;
  const oCtx = ofudaCanvas.getContext('2d')!;
  oCtx.fillStyle = '#FFF9F1';
  oCtx.fillRect(0, 0, 256, 512);
  oCtx.strokeStyle = '#211E25';
  oCtx.lineWidth = 8;
  oCtx.strokeRect(12, 12, 232, 488);

  oCtx.fillStyle = '#B84955';
  oCtx.fillRect(36, 36, 184, 62);

  oCtx.strokeStyle = '#B84955';
  oCtx.lineWidth = 10;
  oCtx.lineCap = 'round';
  oCtx.beginPath();
  oCtx.moveTo(128, 130);
  oCtx.lineTo(128, 390);
  oCtx.moveTo(76, 175);
  oCtx.lineTo(180, 175);
  oCtx.moveTo(64, 248);
  oCtx.lineTo(192, 248);
  oCtx.moveTo(82, 325);
  oCtx.lineTo(174, 325);
  oCtx.stroke();

  oCtx.strokeStyle = '#632D40';
  oCtx.lineWidth = 5;
  oCtx.beginPath();
  oCtx.arc(128, 435, 22, 0, Math.PI * 2);
  oCtx.stroke();

  const ofudaSealMap = configureTexture(ofudaCanvas, true, maxAnisotropy);

  // 13. Radial soft contact shadow texture
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const shCtx = shadowCanvas.getContext('2d')!;
  const rGrad = shCtx.createRadialGradient(64, 64, 6, 64, 64, 60);
  rGrad.addColorStop(0, 'rgba(33, 30, 37, 0.55)');
  rGrad.addColorStop(1, 'rgba(33, 30, 37, 0)');
  shCtx.fillStyle = rGrad;
  shCtx.fillRect(0, 0, 128, 128);
  const contactShadowMap = new THREE.CanvasTexture(shadowCanvas);

  // 14. Manga Screentone & Comic Grid Texture for 3D floating comic plates
  const mangaCanvas = document.createElement('canvas');
  mangaCanvas.width = 512;
  mangaCanvas.height = 512;
  const mCtx = mangaCanvas.getContext('2d')!;
  mCtx.fillStyle = '#FFF9F1';
  mCtx.fillRect(0, 0, 512, 512);
  mCtx.fillStyle = 'rgba(184, 73, 85, 0.14)';
  for (let y = 16; y < 512; y += 18) {
    for (let x = 16; x < 512; x += 18) {
      mCtx.beginPath();
      mCtx.arc(x, y, 2.2, 0, Math.PI * 2);
      mCtx.fill();
    }
  }
  mCtx.strokeStyle = '#211E25';
  mCtx.lineWidth = 10;
  mCtx.strokeRect(20, 20, 472, 472);
  mCtx.fillStyle = '#632D40';
  mCtx.fillRect(40, 40, 432, 180);
  mCtx.fillStyle = '#E8BFC9';
  mCtx.fillRect(40, 240, 205, 210);
  mCtx.fillStyle = '#F6EBDD';
  mCtx.fillRect(265, 240, 207, 210);
  mCtx.strokeRect(40, 240, 205, 210);
  mCtx.strokeRect(265, 240, 207, 210);

  const mangaGridMap = configureTexture(mangaCanvas, true, maxAnisotropy);

  // 15. Wax Seal Crest Texture
  const sealCanvas = document.createElement('canvas');
  sealCanvas.width = 256;
  sealCanvas.height = 256;
  const wxCtx = sealCanvas.getContext('2d')!;
  wxCtx.fillStyle = '#B84955';
  wxCtx.fillRect(0, 0, 256, 256);
  wxCtx.strokeStyle = '#632D40';
  wxCtx.lineWidth = 14;
  wxCtx.beginPath();
  wxCtx.arc(128, 128, 96, 0, Math.PI * 2);
  wxCtx.stroke();
  wxCtx.strokeStyle = '#FFF9F1';
  wxCtx.lineWidth = 6;
  wxCtx.beginPath();
  wxCtx.arc(128, 128, 62, 0, Math.PI * 2);
  wxCtx.stroke();
  wxCtx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const r = i % 2 === 0 ? 44 : 18;
    const px = 128 + Math.cos(a) * r;
    const py = 128 + Math.sin(a) * r;
    if (i === 0) wxCtx.moveTo(px, py);
    else wxCtx.lineTo(px, py);
  }
  wxCtx.closePath();
  wxCtx.stroke();

  const waxSealMap = configureTexture(sealCanvas, true, maxAnisotropy);

  return {
    woodFloorMap,
    woodFloorBump,
    plasterWallMap,
    plasterWallBump,
    darkCedarMap,
    darkCedarBump,
    wovenCarpetMap,
    wovenCarpetBump,
    graniteStoneMap,
    graniteStoneBump,
    brushedBrassMap,
    crimsonLacquerMap,
    chalkboardMap,
    washiPaperMap,
    waterRippleMap,
    shojiPaperMap,
    ofudaSealMap,
    contactShadowMap,
    mangaGridMap,
    waxSealMap,
  };
}
