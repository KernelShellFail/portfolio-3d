import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { WorldTextureSet } from './schoolHallwayTextures';

export interface JapanesePropsMaterials {
  floorMat: THREE.MeshStandardMaterial;
  darkWoodMat: THREE.MeshStandardMaterial;
  warmWallMat: THREE.MeshStandardMaterial;
  brassMat: THREE.MeshStandardMaterial;
  redCordMat: THREE.MeshStandardMaterial;
  creamPaperMat: THREE.MeshStandardMaterial;
  inkTrimMat: THREE.MeshStandardMaterial;
  graniteStoneMat: THREE.MeshStandardMaterial;
  carpetMat: THREE.MeshStandardMaterial;
  chalkboardMat: THREE.MeshStandardMaterial;
  waterSurfaceMat: THREE.MeshStandardMaterial;
  shadowDiscMat: THREE.MeshBasicMaterial;
  invisibleMat: THREE.MeshBasicMaterial;
}

export interface TeruDollRig {
  group: THREE.Group;
  hitProxy: THREE.Mesh;
}

export interface FurinChimeRig {
  group: THREE.Group;
  tanzakuStrip: THREE.Mesh;
  clapper: THREE.Mesh;
  hitProxy: THREE.Mesh;
  baseRotY: number;
  phase: number;
}

export interface DeskLampRig {
  shadeMat: THREE.MeshStandardMaterial;
  bulbMat: THREE.MeshStandardMaterial;
  hitProxy: THREE.Mesh;
}

export interface KitsuneShrineRig {
  group: THREE.Group;
  eyeMat: THREE.MeshStandardMaterial;
  auraRing: THREE.Mesh;
  hitProxy: THREE.Mesh;
}

export interface OrigamiCraneRig {
  group: THREE.Group;
  leftWing: THREE.Mesh;
  rightWing: THREE.Mesh;
  hitProxy: THREE.Mesh;
  basePos: THREE.Vector3;
}

export interface SakuraPetalsRig {
  mesh: THREE.InstancedMesh;
  baseData: Float32Array;
}

export interface SpiritFirefliesRig {
  mesh: THREE.InstancedMesh;
  baseData: Float32Array;
}

export interface MoonShrineAtmosphereRig {
  waterRippleRing: THREE.Mesh;
  moonHalo: THREE.Mesh;
}

/**
 * Adds wooden wainscoting, textured burgundy woven corridor runner carpet, and textured chalkboard + notes.
 */
export function createCorridorArchitecturalDetails(
  mats: JapanesePropsMaterials,
): THREE.Group {
  const detailGroup = new THREE.Group();

  // 1. Burgundy woven runner carpet down the corridor center
  const runnerLength = 98;
  const runnerCenterZ = -42;
  const runner = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.016, runnerLength),
    mats.carpetMat,
  );
  runner.position.set(0, 0.018, runnerCenterZ);
  runner.receiveShadow = true;
  detailGroup.add(runner);

  [-1.08, 1.08].forEach((bx) => {
    const borderStrip = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, 0.018, runnerLength),
      mats.brassMat,
    );
    borderStrip.position.set(bx, 0.019, runnerCenterZ);
    detailGroup.add(borderStrip);
  });

  // 2. Dark cedar wainscoting along left and right corridor walls
  const wainscotLength = 98;
  const wainscotMeshLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 1.05, wainscotLength),
    mats.darkWoodMat,
  );
  wainscotMeshLeft.position.set(-3.52, 0.525, runnerCenterZ);
  detailGroup.add(wainscotMeshLeft);

  const wainscotMeshRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 1.05, wainscotLength),
    mats.darkWoodMat,
  );
  wainscotMeshRight.position.set(3.52, 0.525, runnerCenterZ);
  detailGroup.add(wainscotMeshRight);

  const railTrimGeo = new THREE.BoxGeometry(0.11, 0.07, wainscotLength);
  const leftRailTrim = new THREE.Mesh(railTrimGeo, mats.floorMat);
  leftRailTrim.position.set(-3.5, 1.06, runnerCenterZ);
  const rightRailTrim = new THREE.Mesh(railTrimGeo, mats.floorMat);
  rightRailTrim.position.set(3.5, 1.06, runnerCenterZ);
  detailGroup.add(leftRailTrim, rightRailTrim);

  // 3. Classroom Wall Chalkboard with procedural chalk art & pinned notes at Station 01
  const chalkGroup = new THREE.Group();
  chalkGroup.position.set(3.48, 2.1, -17.6);
  chalkGroup.rotation.y = -Math.PI / 2;

  const boardFrame = new THREE.Mesh(
    new RoundedBoxGeometry(2.85, 1.38, 0.08, 2, 0.02),
    mats.darkWoodMat,
  );
  chalkGroup.add(boardFrame);

  const slateSurface = new THREE.Mesh(new THREE.PlaneGeometry(2.64, 1.18), mats.chalkboardMat);
  slateSurface.position.z = 0.045;
  chalkGroup.add(slateSurface);

  const chalkTray = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.06, 0.14), mats.brassMat);
  chalkTray.position.set(0, -0.68, 0.07);
  chalkGroup.add(chalkTray);

  [-0.5, -0.32, 0.45].forEach((cx) => {
    const chalk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.1, 8),
      mats.creamPaperMat,
    );
    chalk.rotation.z = Math.PI / 2;
    chalk.position.set(cx, -0.64, 0.09);
    chalkGroup.add(chalk);
  });

  // Pinned textured washi pastel paper notes beside chalkboard
  const noteColors = [0xe8bfc9, 0xfff9f1, 0xa9bbcf];
  noteColors.forEach((hex, idx) => {
    const noteMat = mats.creamPaperMat.clone();
    noteMat.color.setHex(hex);
    const note = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.3), noteMat);
    note.position.set(-0.98 + idx * 0.32, 0.3 - (idx % 2) * 0.28, 0.048);
    note.rotation.z = (idx - 1) * 0.08;
    chalkGroup.add(note);
  });

  detailGroup.add(chalkGroup);

  return detailGroup;
}

/**
 * 6-part Hanging Teru Teru Bozu Spirit Doll at Station 00 Prologue (Washi paper texture).
 */
export function createTeruSpiritDoll(mats: JapanesePropsMaterials): TeruDollRig {
  const group = new THREE.Group();

  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.1, 6), mats.redCordMat);
  cord.position.y = 0.65;
  group.add(cord);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 16), mats.creamPaperMat);
  head.position.y = 0.08;
  group.add(head);

  const ribbon = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 10, 24), mats.redCordMat);
  ribbon.rotation.x = Math.PI / 2;
  ribbon.position.y = -0.05;
  group.add(ribbon);

  const robePoints = [
    new THREE.Vector2(0.08, -0.04),
    new THREE.Vector2(0.15, -0.18),
    new THREE.Vector2(0.23, -0.38),
    new THREE.Vector2(0.18, -0.44),
  ];
  const robe = new THREE.Mesh(new THREE.LatheGeometry(robePoints, 20), mats.creamPaperMat);
  group.add(robe);

  [-0.052, 0.052].forEach((ex) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), mats.inkTrimMat);
    eye.position.set(ex, 0.09, 0.148);
    group.add(eye);
  });

  const hitProxy = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.9, 0.65), mats.invisibleMat);
  hitProxy.position.y = -0.1;
  hitProxy.userData = {
    interactType: 'teruDoll',
    label: 'Teru Spirit Charm Doll',
  };
  group.add(hitProxy);

  return { group, hitProxy };
}

/**
 * Interactive Japanese Glass Wind Chime (Furin) with fluttering Tanzaku paper tag.
 */
export function createFurinWindChime(
  id: string,
  mats: JapanesePropsMaterials,
  phase: number,
  baseRotY = 0,
): FurinChimeRig {
  const group = new THREE.Group();
  group.rotation.y = baseRotY;

  const cord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.006, 0.006, 0.65, 6),
    mats.redCordMat,
  );
  cord.position.y = 0.44;
  group.add(cord);

  const glassBellMat = new THREE.MeshStandardMaterial({
    color: 0xe6f2ff,
    emissive: new THREE.Color('#A9BBCF'),
    emissiveIntensity: 0.35,
    roughness: 0.1,
    metalness: 0.25,
    transparent: true,
    opacity: 0.8,
  });
  const bellPts = [
    new THREE.Vector2(0.03, 0.16),
    new THREE.Vector2(0.13, 0.11),
    new THREE.Vector2(0.17, 0.0),
    new THREE.Vector2(0.15, -0.09),
  ];
  const glassDome = new THREE.Mesh(
    new THREE.LatheGeometry(bellPts, 20),
    glassBellMat,
  );
  group.add(glassDome);

  const brassRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.012, 8, 22),
    mats.brassMat,
  );
  brassRim.rotation.x = Math.PI / 2;
  brassRim.position.y = -0.09;
  group.add(brassRim);

  const innerThread = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.005, 0.28, 6),
    mats.redCordMat,
  );
  innerThread.position.y = -0.14;
  group.add(innerThread);

  const clapper = new THREE.Mesh(
    new THREE.SphereGeometry(0.028, 10, 10),
    mats.brassMat,
  );
  clapper.position.y = -0.08;
  group.add(clapper);

  const tanzakuMat = mats.creamPaperMat.clone();
  tanzakuMat.color.setHex(0xffe8ee);
  tanzakuMat.emissive.set('#B84955');
  tanzakuMat.emissiveIntensity = 0.2;
  tanzakuMat.side = THREE.DoubleSide;

  const tanzakuStrip = new THREE.Mesh(
    new THREE.PlaneGeometry(0.09, 0.34),
    tanzakuMat,
  );
  tanzakuStrip.position.y = -0.42;
  group.add(tanzakuStrip);

  const hitProxy = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 0.95, 0.48),
    mats.invisibleMat,
  );
  hitProxy.position.y = -0.15;
  hitProxy.userData = {
    interactType: 'furinChime',
    chimeId: id,
    label: 'Glass Furin Wind Chime',
  };
  group.add(hitProxy);

  return { group, tanzakuStrip, clapper, hitProxy, baseRotY, phase };
}

/**
 * Builds Station 01 Scholar's Desk props (laptop, textured books, ceramic tea cup, interactive Bankers Lamp) & chair.
 */
export function createScholarDeskProps(
  deskGroup: THREE.Group,
  mats: JapanesePropsMaterials,
  textures: WorldTextureSet,
): DeskLampRig {
  const deskY = 0.86;

  // 1. Open Laptop
  const laptopGroup = new THREE.Group();
  laptopGroup.position.set(-0.18, deskY, 0.06);
  laptopGroup.rotation.y = 0.25;

  const laptopBase = new THREE.Mesh(
    new RoundedBoxGeometry(0.42, 0.022, 0.28, 2, 0.006),
    mats.inkTrimMat,
  );
  laptopGroup.add(laptopBase);

  const laptopScreenPivot = new THREE.Group();
  laptopScreenPivot.position.set(0, 0.012, -0.13);
  laptopScreenPivot.rotation.x = -0.32;

  const lid = new THREE.Mesh(
    new RoundedBoxGeometry(0.42, 0.27, 0.016, 2, 0.005),
    mats.inkTrimMat,
  );
  lid.position.set(0, 0.135, 0);
  laptopScreenPivot.add(lid);

  const displayMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.mangaGridMap,
    emissive: new THREE.Color('#FFB884'),
    emissiveMap: textures.mangaGridMap,
    emissiveIntensity: 0.65,
    roughness: 0.28,
  });
  const display = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.23), displayMat);
  display.position.set(0, 0.135, 0.01);
  laptopScreenPivot.add(display);
  laptopGroup.add(laptopScreenPivot);
  deskGroup.add(laptopGroup);

  // 2. Stacked Textbooks (Washi / cloth textured covers)
  const book1Mat = mats.creamPaperMat.clone();
  book1Mat.color.setHex(0x632d40);
  const book1 = new THREE.Mesh(
    new RoundedBoxGeometry(0.28, 0.05, 0.2, 2, 0.008),
    book1Mat,
  );
  book1.position.set(0.44, deskY + 0.025, 0.14);
  book1.rotation.y = -0.18;
  deskGroup.add(book1);

  const book2Mat = mats.creamPaperMat.clone();
  book2Mat.color.setHex(0xa9bbcf);
  const book2 = new THREE.Mesh(
    new RoundedBoxGeometry(0.25, 0.042, 0.18, 2, 0.008),
    book2Mat,
  );
  book2.position.set(0.43, deskY + 0.072, 0.13);
  book2.rotation.y = 0.22;
  deskGroup.add(book2);

  // 3. Ceramic Tea Cup & Saucer
  const saucer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.048, 0.012, 16),
    mats.creamPaperMat,
  );
  saucer.position.set(0.14, deskY + 0.006, 0.2);
  deskGroup.add(saucer);

  const cup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.042, 0.032, 0.07, 16),
    mats.creamPaperMat,
  );
  cup.position.set(0.14, deskY + 0.045, 0.2);
  deskGroup.add(cup);

  // 4. Interactive Bankers Desk Lamp
  const lampGroup = new THREE.Group();
  lampGroup.position.set(0.42, deskY, -0.2);
  lampGroup.rotation.y = -0.45;

  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.03, 18), mats.brassMat);
  lampBase.position.y = 0.015;
  lampGroup.add(lampBase);

  const armCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.03, 0),
    new THREE.Vector3(0, 0.28, -0.04),
    new THREE.Vector3(0, 0.42, 0.07),
  ]);
  const armMesh = new THREE.Mesh(new THREE.TubeGeometry(armCurve, 16, 0.016, 8, false), mats.brassMat);
  lampGroup.add(armMesh);

  const shadeMat = new THREE.MeshStandardMaterial({
    color: 0xe8bfc9,
    map: textures.washiPaperMap,
    emissive: new THREE.Color('#FFB884'),
    emissiveIntensity: 0.5,
    roughness: 0.3,
    metalness: 0.15,
  });
  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.13, 0.12, 18),
    shadeMat,
  );
  shade.position.set(0, 0.39, 0.1);
  shade.rotation.x = 0.22;
  lampGroup.add(shade);

  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xfff3de,
    emissive: new THREE.Color('#FFC79E'),
    emissiveIntensity: 1.5,
    roughness: 0.2,
  });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), bulbMat);
  bulb.position.set(0, 0.33, 0.11);
  lampGroup.add(bulb);

  const hitProxy = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.55, 0.36), mats.invisibleMat);
  hitProxy.position.set(0, 0.26, 0.04);
  hitProxy.userData = {
    interactType: 'deskLamp',
    label: 'Scholar Desk Lamp',
  };
  lampGroup.add(hitProxy);
  deskGroup.add(lampGroup);

  // 5. School Chair behind desk (grounded on y=0)
  const chairGroup = new THREE.Group();
  chairGroup.position.set(-0.08, 0, 0.62);
  chairGroup.rotation.y = 0.18;

  const seat = new THREE.Mesh(
    new RoundedBoxGeometry(0.48, 0.045, 0.46, 2, 0.012),
    mats.floorMat,
  );
  seat.position.y = 0.46;
  chairGroup.add(seat);

  const backrest = new THREE.Mesh(
    new RoundedBoxGeometry(0.46, 0.24, 0.04, 2, 0.01),
    mats.floorMat,
  );
  backrest.position.set(0, 0.8, 0.21);
  chairGroup.add(backrest);

  const cLegGeo = new THREE.CylinderGeometry(0.016, 0.014, 0.45, 8);
  [
    [-0.19, 0.225, -0.18],
    [0.19, 0.225, -0.18],
    [-0.19, 0.225, 0.18],
    [0.19, 0.225, 0.18],
  ].forEach(([cx, cy, cz]) => {
    const leg = new THREE.Mesh(cLegGeo, mats.inkTrimMat);
    leg.position.set(cx, cy, cz);
    chairGroup.add(leg);
  });

  const postGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.44, 8);
  [-0.18, 0.18].forEach((px) => {
    const post = new THREE.Mesh(postGeo, mats.inkTrimMat);
    post.position.set(px, 0.66, 0.2);
    chairGroup.add(post);
  });

  deskGroup.add(chairGroup);

  return { shadeMat, bulbMat, hitProxy };
}

/**
 * 7-part Carved Granite Stone Toro Lantern grounded at y = 0.
 */
export function createStoneToroLantern(
  mats: JapanesePropsMaterials,
  textures: WorldTextureSet,
  isSoftwareGl: boolean,
): THREE.Group {
  const toro = new THREE.Group();

  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.7, 18), mats.shadowDiscMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.016;
  toro.add(shadow);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.48, 0.18, 6), mats.graniteStoneMat);
  base.position.y = 0.09;
  toro.add(base);

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.85, 10), mats.graniteStoneMat);
  shaft.position.y = 0.6;
  toro.add(shaft);

  const lotusCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.18, 0.14, 6), mats.graniteStoneMat);
  lotusCollar.position.y = 1.09;
  toro.add(lotusCollar);

  const firebox = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.34, 6),
    new THREE.MeshStandardMaterial({
      color: 0xfff3de,
      map: textures.shojiPaperMap,
      emissive: new THREE.Color('#FF9E5E'),
      emissiveIntensity: 1.4,
      roughness: 0.6,
    }),
  );
  firebox.position.y = 1.32;
  toro.add(firebox);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.54, 0.28, 6), mats.graniteStoneMat);
  roof.position.y = 1.62;
  toro.add(roof);

  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), mats.brassMat);
  finial.position.y = 1.8;
  toro.add(finial);

  if (!isSoftwareGl) {
    const ember = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.06, 0),
      new THREE.MeshBasicMaterial({ color: 0xffd2a1 }),
    );
    ember.position.y = 1.32;
    toro.add(ember);
  }

  return toro;
}

/**
 * 8-part Kitsune Fox Guardian Shrine Monument with textured granite plinth beside the Crimson Torii Gate.
 */
export function createKitsuneFoxShrine(mats: JapanesePropsMaterials): KitsuneShrineRig {
  const group = new THREE.Group();

  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.75, 18), mats.shadowDiscMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.016;
  group.add(shadow);

  const plinth = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.24, 0.9, 2, 0.03), mats.graniteStoneMat);
  plinth.position.y = 0.12;
  group.add(plinth);

  const pillar = new THREE.Mesh(new RoundedBoxGeometry(0.58, 0.78, 0.58, 2, 0.03), mats.graniteStoneMat);
  pillar.position.y = 0.62;
  group.add(pillar);

  const maskGroup = new THREE.Group();
  maskGroup.position.set(0, 1.32, 0);

  const skull = new THREE.Mesh(
    new THREE.ConeGeometry(0.28, 0.48, 6),
    mats.creamPaperMat,
  );
  skull.rotation.x = Math.PI / 2;
  maskGroup.add(skull);

  [-0.14, 0.14].forEach((ex, i) => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 4), mats.creamPaperMat);
    ear.position.set(ex, 0.24, -0.05);
    ear.rotation.z = i === 0 ? 0.25 : -0.25;
    maskGroup.add(ear);
  });

  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0xb84955,
    emissive: new THREE.Color('#FF5277'),
    emissiveIntensity: 0.85,
    roughness: 0.25,
  });
  [-0.1, 0.1].forEach((ex) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), eyeMat);
    eye.position.set(ex, 0.06, 0.18);
    maskGroup.add(eye);
  });

  const auraRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.4, 0.018, 10, 32),
    mats.redCordMat,
  );
  auraRing.position.z = -0.08;
  maskGroup.add(auraRing);

  group.add(maskGroup);

  const hitProxy = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.75, 0.95), mats.invisibleMat);
  hitProxy.position.y = 0.9;
  hitProxy.userData = {
    interactType: 'kitsuneShrine',
    label: 'Kitsune Guardian Shrine',
  };
  group.add(hitProxy);

  return { group, eyeMat, auraRing, hitProxy };
}

/**
 * 6-part Washi Paper Folded Origami Crane gliding in the corridor.
 */
export function createOrigamiCrane(
  mats: JapanesePropsMaterials,
  textures: WorldTextureSet,
  startPos: THREE.Vector3,
): OrigamiCraneRig {
  const group = new THREE.Group();
  group.position.copy(startPos);

  const wingGeo = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    0, 0, -0.14,
    0, 0, 0.14,
    0.42, 0.14, 0.02,
  ]);
  const uvs = new Float32Array([0, 0, 0, 1, 1, 0.5]);
  wingGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  wingGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  wingGeo.computeVertexNormals();

  const cranePaperMat = new THREE.MeshStandardMaterial({
    color: 0xfff9f1,
    map: textures.washiPaperMap,
    emissive: new THREE.Color('#E8BFC9'),
    emissiveIntensity: 0.22,
    roughness: 0.65,
    side: THREE.DoubleSide,
  });

  const body = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.36, 4), cranePaperMat);
  body.rotation.x = Math.PI / 2;
  group.add(body);

  const neck = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.24, 4), mats.redCordMat);
  neck.position.set(0, 0.09, -0.2);
  neck.rotation.x = -Math.PI / 3;
  group.add(neck);

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.22, 4), mats.redCordMat);
  tail.position.set(0, 0.07, 0.2);
  tail.rotation.x = Math.PI / 3;
  group.add(tail);

  const rightWing = new THREE.Mesh(wingGeo, cranePaperMat);
  group.add(rightWing);

  const leftWing = new THREE.Mesh(wingGeo, cranePaperMat);
  leftWing.scale.x = -1;
  group.add(leftWing);

  const hitProxy = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.55, 0.65), mats.invisibleMat);
  hitProxy.userData = {
    interactType: 'origamiCrane',
    label: 'Folded Origami Crane',
  };
  group.add(hitProxy);

  return {
    group,
    leftWing,
    rightWing,
    hitProxy,
    basePos: startPos.clone(),
  };
}

/**
 * Rooftop Tsukubai stone basin with animated ripples, Moon Halo & night star canopy at Station 06.
 */
export function createMoonShrineAtmosphere(
  rooftopGroup: THREE.Group,
  mats: JapanesePropsMaterials,
): MoonShrineAtmosphereRig {
  // 1. Granite Stone Tsukubai Water Basin on left side of rooftop altar
  const basinGroup = new THREE.Group();
  basinGroup.position.set(-2.9, 0, -2.5);

  const basinBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.36, 0.56, 14),
    mats.graniteStoneMat,
  );
  basinBody.position.y = 0.28;
  basinGroup.add(basinBody);

  const waterSurface = new THREE.Mesh(
    new THREE.CircleGeometry(0.32, 20),
    mats.waterSurfaceMat,
  );
  waterSurface.rotation.x = -Math.PI / 2;
  waterSurface.position.y = 0.57;
  basinGroup.add(waterSurface);

  // Expanding concentric spirit water ripple ring
  const waterRippleRing = new THREE.Mesh(
    new THREE.RingGeometry(0.08, 0.11, 24),
    new THREE.MeshBasicMaterial({
      color: 0xeaf4ff,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
    }),
  );
  waterRippleRing.rotation.x = -Math.PI / 2;
  waterRippleRing.position.y = 0.576;
  basinGroup.add(waterRippleRing);

  const bambooMat = new THREE.MeshStandardMaterial({
    color: 0x5d7a57,
    map: mats.darkWoodMat.map,
    roughness: 0.65,
  });
  const bambooPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.9, 10), bambooMat);
  bambooPost.position.set(-0.46, 0.45, 0);
  basinGroup.add(bambooPost);

  const bambooSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.42, 8), bambooMat);
  bambooSpout.rotation.z = Math.PI / 2.4;
  bambooSpout.position.set(-0.28, 0.76, 0);
  basinGroup.add(bambooSpout);

  rooftopGroup.add(basinGroup);

  // 2. Luminous Moon Halo behind Crescent Moon
  const moonHalo = new THREE.Mesh(
    new THREE.RingGeometry(3.35, 3.65, 48),
    new THREE.MeshBasicMaterial({
      color: 0xffd7b5,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      fog: false,
    }),
  );
  moonHalo.position.set(0, 4.8, -17.6);
  rooftopGroup.add(moonHalo);

  // 3. Crisp Night Sky Starfield above Station 06 Moon Shrine
  const starCount = 180;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const sx = Math.sin(i * 78.233) * 16;
    const sy = 2.8 + ((i * 0.417) % 1) * 9.5;
    const sz = -10 - ((i * 0.731) % 1) * 11;
    starPositions[i * 3] = sx;
    starPositions[i * 3 + 1] = sy;
    starPositions[i * 3 + 2] = sz;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xfff3e0,
    size: 0.13,
    sizeAttenuation: true,
    fog: false,
  });
  const stars = new THREE.Points(starGeo, starMat);
  rooftopGroup.add(stars);

  return { waterRippleRing, moonHalo };
}

/**
 * 76 Instanced Cherry Blossom (Sakura) Petals drifting through the entire corridor.
 */
export function createSakuraPetals(): SakuraPetalsRig {
  const petalShape = new THREE.Shape();
  petalShape.moveTo(0, -0.045);
  petalShape.quadraticCurveTo(0.045, 0, 0.015, 0.055);
  petalShape.lineTo(0, 0.032);
  petalShape.lineTo(-0.015, 0.055);
  petalShape.quadraticCurveTo(-0.045, 0, 0, -0.045);

  const petalGeo = new THREE.ShapeGeometry(petalShape);
  const petalMat = new THREE.MeshBasicMaterial({
    color: 0xf7cbd7,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.88,
  });

  const count = 76;
  const mesh = new THREE.InstancedMesh(petalGeo, petalMat, count);
  mesh.frustumCulled = false;

  const baseData = new Float32Array(count * 4);
  const dummyMat = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const scale = new THREE.Vector3(1, 1, 1);

  for (let i = 0; i < count; i++) {
    const x = Math.sin(i * 31.415) * 2.85;
    const y = 0.5 + ((i * 0.61803) % 1) * 3.5;
    const z = 5.5 - ((i * 0.2718) % 1) * 122.0;
    const phase = i * 0.85;

    baseData[i * 4] = x;
    baseData[i * 4 + 1] = y;
    baseData[i * 4 + 2] = z;
    baseData[i * 4 + 3] = phase;

    pos.set(x, y, z);
    dummyMat.compose(pos, quat, scale);
    mesh.setMatrixAt(i, dummyMat);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.computeBoundingSphere();

  return { mesh, baseData };
}

/**
 * 68 Instanced Luminous Spirit Fireflies (Hotaru) with subtle color variation spanning the corridor.
 */
export function createSpiritFireflies(): SpiritFirefliesRig {
  const geo = new THREE.SphereGeometry(0.045, 8, 8);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
  });

  const count = 68;
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.frustumCulled = false;

  const baseData = new Float32Array(count * 4);
  const dummyMat = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const scale = new THREE.Vector3(1, 1, 1);
  const palette = [
    new THREE.Color('#FFD29D'),
    new THREE.Color('#F4A7BB'),
    new THREE.Color('#A9BBCF'),
  ];

  for (let i = 0; i < count; i++) {
    const x = Math.cos(i * 19.37) * 2.75;
    const y = 0.55 + ((i * 0.4317) % 1) * 3.1;
    const z = 5.0 - ((i * 0.1931) % 1) * 120.0;
    const phase = i * 1.17;

    baseData[i * 4] = x;
    baseData[i * 4 + 1] = y;
    baseData[i * 4 + 2] = z;
    baseData[i * 4 + 3] = phase;

    pos.set(x, y, z);
    dummyMat.compose(pos, quat, scale);
    mesh.setMatrixAt(i, dummyMat);
    mesh.setColorAt(i, palette[i % palette.length]);
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.computeBoundingSphere();

  return { mesh, baseData };
}
