import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { WorldTextureSet } from './schoolHallwayTextures';
import { projectsData } from '../../data/projects';
import { skillCategories, type SkillCategory } from '../../data/skills';
import { personalData } from '../../data/personal';
import {
  createCorridorArchitecturalDetails,
  createFurinWindChime,
  createKitsuneFoxShrine,
  createMoonShrineAtmosphere,
  createOrigamiCrane,
  createSakuraPetals,
  createScholarDeskProps,
  createSpiritFireflies,
  createStoneToroLantern,
  createTeruSpiritDoll,
  type DeskLampRig,
  type FurinChimeRig,
  type JapanesePropsMaterials,
  type KitsuneShrineRig,
  type OrigamiCraneRig,
  type SakuraPetalsRig,
  type SpiritFirefliesRig,
  type TeruDollRig,
} from './japanesePropsBuilder';

export interface InteractiveLantern {
  id: string;
  group: THREE.Group;
  paperMat: THREE.MeshStandardMaterial;
  flameCore: THREE.Mesh;
  pointLight: THREE.PointLight | null;
  hitProxy: THREE.Mesh;
}

export interface InteractiveSkillRelic {
  category: SkillCategory;
  group: THREE.Group;
  coreMesh: THREE.Mesh;
  coreMat: THREE.MeshStandardMaterial;
  ringMesh: THREE.Mesh;
  baseY: number;
  hitProxy: THREE.Mesh;
}

export interface InteractiveProjectMonolith {
  projectId: string;
  title: string;
  group: THREE.Group;
  frameMat: THREE.MeshStandardMaterial;
  baseY: number;
  hitProxy: THREE.Mesh;
}

export interface InteractiveTalisman {
  id: string;
  label: string;
  note: string;
  group: THREE.Group;
  hitProxy: THREE.Mesh;
  baseY: number;
  phase: number;
}

export interface WorldSceneAssets {
  rootGroup: THREE.Group;
  talismans: InteractiveTalisman[];
  lanterns: InteractiveLantern[];
  furinChimes: FurinChimeRig[];
  astrolabeGroup: THREE.Group;
  astrolabeRings: THREE.Mesh[];
  astrolabeCore: THREE.Mesh;
  astrolabeMoons: THREE.Group;
  skillRelics: InteractiveSkillRelic[];
  projectMonoliths: InteractiveProjectMonolith[];
  toriiBell: THREE.Group;
  timelineLanterns: THREE.Mesh[];
  envelopeGroup: THREE.Group;
  envelopeFlapPivot: THREE.Group;
  waxSealMesh: THREE.Mesh;
  origamiPlates: THREE.Group[];
  teruDoll: TeruDollRig;
  deskLamp: DeskLampRig;
  kitsuneShrine: KitsuneShrineRig;
  origamiCranes: OrigamiCraneRig[];
  sakuraPetals: SakuraPetalsRig;
  spiritFireflies: SpiritFirefliesRig;
  waterRippleRing: THREE.Mesh;
  moonHalo: THREE.Mesh;
  hitProxies: THREE.Mesh[];
  dustMotes: THREE.InstancedMesh;
  dustBasePositions: Float32Array;
  loadedImageTextures: THREE.Texture[];
}

const TALISMAN_DATA = [
  {
    id: 'ofuda-01',
    label: 'Charm of Craft',
    note: 'Seal 01: Crafted by Basiturraza Taji — BCA Graduate, RTMNU 2026.',
    pos: [0.42, 2.55, 1.45] as const,
    rotY: -0.22,
  },
  {
    id: 'ofuda-02',
    label: 'Charm of Architecture',
    note: 'Seal 02: Modular TypeScript, React, and real-time Three.js lighting.',
    pos: [1.45, 2.15, -1.1] as const,
    rotY: -0.4,
  },
  {
    id: 'ofuda-03',
    label: 'Charm of Curiosity',
    note: 'Seal 03: Every chapter unfolds in a continuous 3D manga corridor.',
    pos: [0.35, 2.6, -4.1] as const,
    rotY: 0.25,
  },
  {
    id: 'ofuda-04',
    label: 'Charm of Persistence',
    note: 'Seal 04: Built with accessible semantics, clean fallbacks, and zero bloat.',
    pos: [1.1, 1.95, -7.2] as const,
    rotY: -0.3,
  },
];

function createHangingLantern(
  id: string,
  brassMat: THREE.Material,
  cordMat: THREE.Material,
  washiMap: THREE.Texture,
  isSoftwareGl: boolean,
): InteractiveLantern {
  const group = new THREE.Group();

  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xfff3de,
    map: washiMap,
    emissive: new THREE.Color('#FF9E5E'),
    emissiveIntensity: 1.55,
    roughness: 0.72,
  });

  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.85, 8), cordMat);
  cord.position.y = 0.65;
  group.add(cord);

  const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.07, 16), brassMat);
  topCap.position.y = 0.22;
  group.add(topCap);

  const points = [
    new THREE.Vector2(0.14, -0.2),
    new THREE.Vector2(0.24, -0.1),
    new THREE.Vector2(0.26, 0.0),
    new THREE.Vector2(0.24, 0.1),
    new THREE.Vector2(0.14, 0.2),
  ];
  const body = new THREE.Mesh(new THREE.LatheGeometry(points, 18), paperMat);
  group.add(body);

  const flameCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.065, 0),
    new THREE.MeshBasicMaterial({ color: 0xffe4b8 }),
  );
  flameCore.position.y = 0.0;
  group.add(flameCore);

  const bottomCap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.07, 16), brassMat);
  bottomCap.position.y = -0.22;
  group.add(bottomCap);

  const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.22, 10), cordMat);
  tassel.position.y = -0.35;
  tassel.rotation.x = Math.PI;
  group.add(tassel);

  let pointLight: THREE.PointLight | null = null;
  if (!isSoftwareGl && (id === 'lantern-01' || id === 'lantern-03')) {
    pointLight = new THREE.PointLight('#FFB37B', 2.2, 9, 1.5);
    pointLight.position.set(0, -0.15, 0);
    group.add(pointLight);
  }

  const hitProxy = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.85, 0.75),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  hitProxy.userData = {
    interactType: 'lantern',
    lanternId: id,
    label: `Paper Lantern (${id})`,
  };
  group.add(hitProxy);

  return { id, group, paperMat, flameCore, pointLight, hitProxy };
}

function createShoeLockerBench(
  woodMat: THREE.Material,
  darkTrimMat: THREE.Material,
  shadowMat: THREE.Material,
): THREE.Group {
  const bench = new THREE.Group();

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.5), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  bench.add(shadow);

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 2.2), darkTrimMat);
  plinth.position.y = 0.06;
  bench.add(plinth);

  const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.92, 2.16), woodMat);
  cabinet.position.y = 0.58;
  cabinet.castShadow = true;
  cabinet.receiveShadow = true;
  bench.add(cabinet);

  const top = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 2.26), darkTrimMat);
  top.position.y = 1.07;
  top.castShadow = true;
  bench.add(top);

  return bench;
}

export function buildWorldChaptersScene(
  textures: WorldTextureSet,
  isSoftwareGl: boolean,
  onAsyncTextureLoad?: () => void,
): WorldSceneAssets {
  const rootGroup = new THREE.Group();
  const hitProxies: THREE.Mesh[] = [];
  const loadedImageTextures: THREE.Texture[] = [];
  const texLoader = new THREE.TextureLoader();

  const loadLocalTex = (url: string, fallback: THREE.Texture): THREE.Texture => {
    const tex = texLoader.load(
      url,
      () => onAsyncTextureLoad?.(),
      undefined,
      () => {
        /* graceful procedural fallback remains intact */
      },
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    loadedImageTextures.push(tex);
    return tex ?? fallback;
  };

  // Shared textured calibrated PBR materials (distinct roughness contrast >= 0.25)
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.woodFloorMap,
    bumpMap: textures.woodFloorBump,
    bumpScale: 0.025,
    roughness: 0.44,
    metalness: 0.06,
  });

  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.darkCedarMap,
    bumpMap: textures.darkCedarBump,
    bumpScale: 0.02,
    roughness: 0.72,
    metalness: 0.05,
  });

  const warmWallMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.plasterWallMap,
    bumpMap: textures.plasterWallBump,
    bumpScale: 0.018,
    roughness: 0.88,
    metalness: 0.02,
  });

  const shojiMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.shojiPaperMap,
    emissive: new THREE.Color('#E89A84'),
    emissiveMap: textures.shojiPaperMap,
    emissiveIntensity: 0.68,
    roughness: 0.9,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.brushedBrassMap,
    roughness: 0.22,
    metalness: 0.88,
  });

  const redCordMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.crimsonLacquerMap,
    roughness: 0.52,
    metalness: 0.1,
  });

  const creamPaperMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.washiPaperMap,
    roughness: 0.78,
    metalness: 0.02,
  });

  const inkTrimMat = new THREE.MeshStandardMaterial({
    color: 0x241e28,
    map: textures.darkCedarMap,
    roughness: 0.36,
    metalness: 0.22,
  });

  const graniteStoneMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.graniteStoneMap,
    bumpMap: textures.graniteStoneBump,
    bumpScale: 0.028,
    roughness: 0.9,
    metalness: 0.04,
  });

  const carpetMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.wovenCarpetMap,
    bumpMap: textures.wovenCarpetBump,
    bumpScale: 0.022,
    roughness: 0.92,
    metalness: 0.02,
  });

  const chalkboardMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.chalkboardMap,
    roughness: 0.86,
    metalness: 0.04,
  });

  const waterSurfaceMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.waterRippleMap,
    emissive: new THREE.Color('#2E4668'),
    emissiveIntensity: 0.45,
    roughness: 0.12,
    metalness: 0.78,
  });

  const shadowDiscMat = new THREE.MeshBasicMaterial({
    map: textures.contactShadowMap,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });

  const invisibleMat = new THREE.MeshBasicMaterial({ visible: false });

  const sharedMats: JapanesePropsMaterials = {
    floorMat,
    darkWoodMat,
    warmWallMat,
    brassMat,
    redCordMat,
    creamPaperMat,
    inkTrimMat,
    graniteStoneMat,
    carpetMat,
    chalkboardMat,
    waterSurfaceMat,
    shadowDiscMat,
    invisibleMat,
  };

  // =========================================================================
  // CONTINUOUS CORRIDOR RUNWAY (z = +8 down to z = -96) + ROOFTOP DECK (-96..-120)
  // =========================================================================
  const corridorLength = 106;
  const corridorCenterZ = -45;

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(7.6, corridorLength), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, corridorCenterZ);
  floor.receiveShadow = true;
  rootGroup.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(7.6, corridorLength), darkWoodMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 4.6, corridorCenterZ);
  rootGroup.add(ceiling);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.6, corridorLength), warmWallMat);
  leftWall.position.set(-3.7, 2.3, corridorCenterZ);
  rootGroup.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.6, corridorLength), warmWallMat);
  rightWall.position.set(3.7, 2.3, corridorCenterZ);
  rootGroup.add(rightWall);

  // Architectural bays repeating down the corridor collapsed into 4 InstancedMeshes
  const pillarGeo = new THREE.BoxGeometry(0.28, 4.6, 0.28);
  const beamGeo = new THREE.BoxGeometry(7.4, 0.24, 0.26);
  const shojiGeo = new THREE.PlaneGeometry(3.2, 2.25);
  const doorGeo = new THREE.BoxGeometry(0.12, 2.75, 2.1);

  const bayZs: number[] = [];
  for (let z = 6; z >= -94; z -= 6) {
    bayZs.push(z);
  }
  const innerBayZs = bayZs.filter((z) => z > -92);

  const pillarsInstanced = new THREE.InstancedMesh(pillarGeo, darkWoodMat, bayZs.length * 2);
  const beamsInstanced = new THREE.InstancedMesh(beamGeo, darkWoodMat, bayZs.length);
  const shojiInstanced = new THREE.InstancedMesh(shojiGeo, shojiMat, innerBayZs.length);
  const doorsInstanced = new THREE.InstancedMesh(doorGeo, darkWoodMat, innerBayZs.length);

  const bayMat4 = new THREE.Matrix4();
  const bayQuat = new THREE.Quaternion();
  const bayRotY = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    Math.PI / 2,
  );
  const bayPos = new THREE.Vector3();
  const bayScale = new THREE.Vector3(1, 1, 1);

  bayZs.forEach((z, idx) => {
    bayPos.set(-3.45, 2.3, z);
    bayMat4.compose(bayPos, bayQuat, bayScale);
    pillarsInstanced.setMatrixAt(idx * 2, bayMat4);

    bayPos.set(3.45, 2.3, z);
    bayMat4.compose(bayPos, bayQuat, bayScale);
    pillarsInstanced.setMatrixAt(idx * 2 + 1, bayMat4);

    bayPos.set(0, 4.42, z);
    bayMat4.compose(bayPos, bayQuat, bayScale);
    beamsInstanced.setMatrixAt(idx, bayMat4);
  });

  innerBayZs.forEach((z, idx) => {
    bayPos.set(-3.52, 2.45, z - 3);
    bayMat4.compose(bayPos, bayRotY, bayScale);
    shojiInstanced.setMatrixAt(idx, bayMat4);

    bayPos.set(3.52, 1.38, z - 3);
    bayMat4.compose(bayPos, bayQuat, bayScale);
    doorsInstanced.setMatrixAt(idx, bayMat4);

    if (Math.abs(z) % 12 === 0 && z > -24) {
      const bench = createShoeLockerBench(floorMat, darkWoodMat, shadowDiscMat);
      bench.position.set(-3.05, 0, z - 3);
      rootGroup.add(bench);
    }
  });

  pillarsInstanced.instanceMatrix.needsUpdate = true;
  beamsInstanced.instanceMatrix.needsUpdate = true;
  shojiInstanced.instanceMatrix.needsUpdate = true;
  doorsInstanced.instanceMatrix.needsUpdate = true;
  rootGroup.add(pillarsInstanced, beamsInstanced, shojiInstanced, doorsInstanced);
  rootGroup.add(createCorridorArchitecturalDetails(sharedMats));

  // =========================================================================
  // STATION 00 (z = +5 -> -8): Hanging Lanterns, Teru Spirit Doll & Ofuda Talismans
  // =========================================================================
  const lanterns: InteractiveLantern[] = [];
  const lanternCoords: [string, number, number, number][] = [
    ['lantern-01', 0.95, 3.3, 1.15],
    ['lantern-02', -0.9, 3.4, -4.5],
    ['lantern-03', -1.05, 3.35, -18.5],
    ['lantern-04', 1.05, 3.4, -36.5],
    ['lantern-05', 0.95, 3.35, -70.5],
  ];

  lanternCoords.forEach(([id, x, y, z]) => {
    const lantern = createHangingLantern(id, brassMat, redCordMat, textures.washiPaperMap, isSoftwareGl);
    lantern.group.position.set(x, y, z);
    rootGroup.add(lantern.group);
    lanterns.push(lantern);
    hitProxies.push(lantern.hitProxy);
  });

  const furinChimes: FurinChimeRig[] = [
    createFurinWindChime('furin-01', sharedMats, 0.2, 0.18),
    createFurinWindChime('furin-02', sharedMats, 2.1, -0.22),
  ];
  furinChimes[0].group.position.set(1.62, 3.18, -2.5);
  furinChimes[1].group.position.set(-1.55, 3.18, -14.8);
  furinChimes.forEach((chime) => {
    rootGroup.add(chime.group);
    hitProxies.push(chime.hitProxy);
  });

  const teruDoll = createTeruSpiritDoll(sharedMats);
  teruDoll.group.position.set(-1.32, 2.95, 0.9);
  teruDoll.group.rotation.y = 0.25;
  rootGroup.add(teruDoll.group);
  hitProxies.push(teruDoll.hitProxy);

  const ofudaGeo = new THREE.PlaneGeometry(0.42, 0.84);
  const ofudaMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.ofudaSealMap,
    emissive: new THREE.Color('#FFE2CC'),
    emissiveIntensity: 0.24,
    roughness: 0.72,
    side: THREE.DoubleSide,
  });
  const hitGeo = new THREE.BoxGeometry(0.75, 1.15, 0.45);

  const talismans: InteractiveTalisman[] = [];
  TALISMAN_DATA.forEach((item, index) => {
    const group = new THREE.Group();
    group.position.set(item.pos[0], item.pos[1], item.pos[2]);
    group.rotation.y = item.rotY;

    group.add(new THREE.Mesh(ofudaGeo, ofudaMat));

    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 0.04), redCordMat);
    clip.position.y = 0.42;
    group.add(clip);

    const thread = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 1.8, 6), redCordMat);
    thread.position.y = 1.3;
    group.add(thread);

    const hitProxy = new THREE.Mesh(hitGeo, invisibleMat);
    hitProxy.userData = {
      interactType: 'talisman',
      talismanId: item.id,
      talismanLabel: item.label,
      talismanNote: item.note,
    };
    group.add(hitProxy);
    hitProxies.push(hitProxy);

    rootGroup.add(group);
    talismans.push({
      id: item.id,
      label: item.label,
      note: item.note,
      group,
      hitProxy,
      baseY: item.pos[1],
      phase: index * 1.4,
    });
  });

  // =========================================================================
  // STATION 01 (z = -14 -> -21): Classroom Desk, 3D Portrait Frame & Origami Plates
  // =========================================================================
  const homeGroup = new THREE.Group();
  homeGroup.position.set(0, 0, -19.5);
  rootGroup.add(homeGroup);

  // Wooden scholar's desk (composite 5-part group)
  const deskGroup = new THREE.Group();
  deskGroup.position.set(-1.55, 0, 0.4);
  const deskShadow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), shadowDiscMat);
  deskShadow.rotation.x = -Math.PI / 2;
  deskShadow.position.y = 0.015;
  deskGroup.add(deskShadow);

  const deskTop = new THREE.Mesh(new RoundedBoxGeometry(1.35, 0.08, 0.78, 2, 0.02), floorMat);
  deskTop.position.y = 0.82;
  deskGroup.add(deskTop);

  const legGeo = new THREE.CylinderGeometry(0.028, 0.024, 0.8, 10);
  [
    [-0.58, 0.4, -0.3],
    [0.58, 0.4, -0.3],
    [-0.58, 0.4, 0.3],
    [0.58, 0.4, 0.3],
  ].forEach(([lx, ly, lz]) => {
    const leg = new THREE.Mesh(legGeo, inkTrimMat);
    leg.position.set(lx, ly, lz);
    deskGroup.add(leg);
  });
  const deskLamp = createScholarDeskProps(deskGroup, sharedMats, textures);
  hitProxies.push(deskLamp.hitProxy);
  homeGroup.add(deskGroup);

  // Folded Origami Cranes gliding through the corridor
  const origamiCranes: OrigamiCraneRig[] = [
    createOrigamiCrane(sharedMats, textures, new THREE.Vector3(-0.3, 2.45, -16.8)),
    createOrigamiCrane(sharedMats, textures, new THREE.Vector3(1.25, 2.55, -70.6)),
  ];
  origamiCranes.forEach((crane) => {
    rootGroup.add(crane.group);
    hitProxies.push(crane.hitProxy);
  });

  // 3D Floating Portrait Shrine Frame on right side
  const portraitGroup = new THREE.Group();
  portraitGroup.position.set(1.65, 1.75, -0.4);
  portraitGroup.rotation.y = -0.36;

  const portraitBacking = new THREE.Mesh(
    new RoundedBoxGeometry(1.38, 1.82, 0.1, 2, 0.03),
    inkTrimMat,
  );
  portraitGroup.add(portraitBacking);

  const portraitTex = loadLocalTex(personalData.portraitUrl, textures.mangaGridMap);
  const portraitArtMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: portraitTex,
    roughness: 0.55,
  });
  const portraitArt = new THREE.Mesh(new THREE.PlaneGeometry(1.22, 1.64), portraitArtMat);
  portraitArt.position.z = 0.056;
  portraitGroup.add(portraitArt);

  const portraitBrassTrim = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.06, 0.12), brassMat);
  portraitBrassTrim.position.y = 0.92;
  portraitGroup.add(portraitBrassTrim);
  homeGroup.add(portraitGroup);

  // Orbiting 3D comic panel plates
  const origamiPlates: THREE.Group[] = [];
  const comicMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.mangaGridMap,
    roughness: 0.72,
    side: THREE.DoubleSide,
  });
  [
    { x: -1.8, y: 2.55, z: -1.4, rot: 0.25 },
    { x: 0.1, y: 3.0, z: -2.2, rot: -0.15 },
    { x: 2.0, y: 2.75, z: -2.0, rot: -0.3 },
  ].forEach((cfg, idx) => {
    const plate = new THREE.Group();
    plate.position.set(cfg.x, cfg.y, cfg.z);
    plate.rotation.y = cfg.rot;
    plate.userData = { baseY: cfg.y, phase: idx * 1.3 };

    const board = new THREE.Mesh(new RoundedBoxGeometry(0.75, 0.95, 0.04, 2, 0.015), inkTrimMat);
    plate.add(board);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.88), comicMat);
    face.position.z = 0.024;
    plate.add(face);

    homeGroup.add(plate);
    origamiPlates.push(plate);
  });

  // =========================================================================
  // STATION 02 (z = -37): Rotating Spirit Astrolabe & Codex Shrine (About Me)
  // =========================================================================
  const aboutAnchor = new THREE.Group();
  aboutAnchor.position.set(0, 0, -37.5);
  rootGroup.add(aboutAnchor);

  const astrolabeShadow = new THREE.Mesh(new THREE.CircleGeometry(1.1, 24), shadowDiscMat);
  astrolabeShadow.rotation.x = -Math.PI / 2;
  astrolabeShadow.position.y = 0.015;
  aboutAnchor.add(astrolabeShadow);

  const pedestalBase = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.74, 0.22, 20), inkTrimMat);
  pedestalBase.position.y = 0.11;
  aboutAnchor.add(pedestalBase);

  const pedestalColumn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.42, 0.9, 18),
    darkWoodMat,
  );
  pedestalColumn.position.y = 0.66;
  aboutAnchor.add(pedestalColumn);

  const pedestalCap = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.34, 0.12, 18), brassMat);
  pedestalCap.position.y = 1.15;
  aboutAnchor.add(pedestalCap);

  const astrolabeGroup = new THREE.Group();
  astrolabeGroup.position.set(0, 2.05, 0);
  aboutAnchor.add(astrolabeGroup);

  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.045, 14, 48), brassMat);
  const midRing = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.04, 14, 42), redCordMat);
  midRing.rotation.x = Math.PI / 3;
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.032, 12, 36), brassMat);
  innerRing.rotation.y = Math.PI / 3;

  const astrolabeCoreMat = new THREE.MeshStandardMaterial({
    color: 0xe8bfc9,
    emissive: new THREE.Color('#B84955'),
    emissiveIntensity: 0.9,
    roughness: 0.2,
    metalness: 0.65,
  });
  const astrolabeCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), astrolabeCoreMat);

  astrolabeGroup.add(outerRing, midRing, innerRing, astrolabeCore);

  const astrolabeMoons = new THREE.Group();
  [
    { r: 0.92, y: 0.14, color: 0xe8bfc9, size: 0.065 },
    { r: -0.92, y: -0.14, color: 0xa9bbcf, size: 0.055 },
    { r: 0.65, y: 0.35, color: 0xd4a36a, size: 0.048 },
  ].forEach((m, idx) => {
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(m.size, 12, 12),
      new THREE.MeshStandardMaterial({
        color: m.color,
        emissive: new THREE.Color(m.color),
        emissiveIntensity: 0.45,
        roughness: 0.25,
        metalness: 0.6,
      }),
    );
    moon.position.set(m.r, m.y, idx === 2 ? 0.5 : 0);
    astrolabeMoons.add(moon);
  });
  astrolabeGroup.add(astrolabeMoons);

  const astrolabeHit = new THREE.Mesh(new THREE.SphereGeometry(0.85, 12, 12), invisibleMat);
  astrolabeHit.userData = {
    interactType: 'astrolabe',
    label: 'Spirit Astrolabe',
  };
  astrolabeGroup.add(astrolabeHit);
  hitProxies.push(astrolabeHit);

  // =========================================================================
  // STATION 03 (z = -55): 6 Interactive 3D Skill Category Relics
  // =========================================================================
  const skillRelics: InteractiveSkillRelic[] = [];
  const relicGeos = [
    new THREE.OctahedronGeometry(0.28, 0),
    new THREE.IcosahedronGeometry(0.28, 0),
    new THREE.TorusKnotGeometry(0.2, 0.06, 48, 10),
    new THREE.DodecahedronGeometry(0.27, 0),
    new THREE.ConeGeometry(0.26, 0.5, 6),
    new THREE.BoxGeometry(0.36, 0.36, 0.36),
  ];

  skillCategories.forEach((cat, idx) => {
    const side = idx % 2 === 0 ? -1 : 1;
    const row = Math.floor(idx / 2);
    const rx = side * (1.85 + (row % 2) * 0.35);
    const ry = 1.65 + (row === 1 ? 0.45 : 0.15);
    const rz = -52.5 - row * 2.8;

    const group = new THREE.Group();
    group.position.set(rx, ry, rz);

    // Pedestal shadow below at y=0.015
    const rShadow = new THREE.Mesh(new THREE.CircleGeometry(0.55, 16), shadowDiscMat);
    rShadow.rotation.x = -Math.PI / 2;
    rShadow.position.set(rx, 0.015, rz);
    rootGroup.add(rShadow);

    const coreMat = new THREE.MeshStandardMaterial({
      color: idx % 2 === 0 ? 0xe8bfc9 : 0xfff9f1,
      map: textures.washiPaperMap,
      emissive: new THREE.Color(idx % 2 === 0 ? '#B84955' : '#632D40'),
      emissiveIntensity: 0.45,
      roughness: 0.18,
      metalness: 0.72,
    });
    const coreMesh = new THREE.Mesh(relicGeos[idx % relicGeos.length], coreMat);
    group.add(coreMesh);

    const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.022, 10, 32), brassMat);
    ringMesh.rotation.x = Math.PI / 2.4;
    group.add(ringMesh);

    const hitProxy = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 10), invisibleMat);
    hitProxy.userData = {
      interactType: 'skillRelic',
      skillCategory: cat,
      label: cat,
    };
    group.add(hitProxy);
    hitProxies.push(hitProxy);

    rootGroup.add(group);
    skillRelics.push({
      category: cat,
      group,
      coreMesh,
      coreMat,
      ringMesh,
      baseY: ry,
      hitProxy,
    });
  });

  // =========================================================================
  // STATION 04 (z = -73): 3 Interactive 3D Project Episode Monoliths
  // =========================================================================
  const projectMonoliths: InteractiveProjectMonolith[] = [];
  const monolithCoords: [number, number, number, number][] = [
    [-2.05, 1.55, -72.5, 0.28],
    [0, 1.85, -74.5, 0],
    [2.05, 1.55, -72.5, -0.28],
  ];

  projectsData.slice(0, 3).forEach((proj, idx) => {
    const [mx, my, mz, rotY] = monolithCoords[idx];
    const group = new THREE.Group();
    group.position.set(mx, my, mz);
    group.rotation.y = rotY;

    const pShadow = new THREE.Mesh(new THREE.CircleGeometry(0.85, 20), shadowDiscMat);
    pShadow.rotation.x = -Math.PI / 2;
    pShadow.position.set(mx, 0.015, mz);
    rootGroup.add(pShadow);

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x211e25,
      emissive: new THREE.Color('#301B29'),
      emissiveIntensity: 0.2,
      roughness: 0.32,
      metalness: 0.35,
    });
    const slab = new THREE.Mesh(new RoundedBoxGeometry(1.55, 1.18, 0.12, 2, 0.03), frameMat);
    group.add(slab);

    const artTex = loadLocalTex(proj.previewImage, textures.mangaGridMap);
    const artMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: artTex,
      roughness: 0.6,
    });
    const artPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.38, 1.0), artMat);
    artPlane.position.z = 0.068;
    group.add(artPlane);

    const crestBar = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.07, 0.14), brassMat);
    crestBar.position.y = 0.62;
    group.add(crestBar);

    const hitProxy = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.35, 0.4), invisibleMat);
    hitProxy.userData = {
      interactType: 'projectFrame',
      projectId: proj.id,
      projectTitle: proj.title,
    };
    group.add(hitProxy);
    hitProxies.push(hitProxy);

    rootGroup.add(group);
    projectMonoliths.push({
      projectId: proj.id,
      title: proj.title,
      group,
      frameMat,
      baseY: my,
      hitProxy,
    });
  });

  // =========================================================================
  // STATION 05 (z = -91): Crimson Torii Gate & Winding Red Thread of Fate
  // =========================================================================
  const toriiGroup = new THREE.Group();
  toriiGroup.position.set(0, 0, -91.5);
  rootGroup.add(toriiGroup);

  const toriiMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.crimsonLacquerMap,
    roughness: 0.44,
    metalness: 0.08,
  });

  const leftCol = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.8, 16), toriiMat);
  leftCol.position.set(-1.7, 1.9, 0);
  const rightCol = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.8, 16), toriiMat);
  rightCol.position.set(1.7, 1.9, 0);
  const leftShoe = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.35, 16), inkTrimMat);
  leftShoe.position.set(-1.7, 0.175, 0);
  const rightShoe = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.35, 16), inkTrimMat);
  rightShoe.position.set(1.7, 0.175, 0);

  const kasagiTop = new THREE.Mesh(new RoundedBoxGeometry(4.8, 0.26, 0.38, 2, 0.04), inkTrimMat);
  kasagiTop.position.set(0, 3.88, 0);
  const kasagiRed = new THREE.Mesh(new RoundedBoxGeometry(4.5, 0.2, 0.32, 2, 0.03), toriiMat);
  kasagiRed.position.set(0, 3.68, 0);
  const nukiBeam = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.18, 0.22), toriiMat);
  nukiBeam.position.set(0, 3.05, 0);
  const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.56, 0.26), brassMat);
  plaque.position.set(0, 3.36, 0);

  toriiGroup.add(leftCol, rightCol, leftShoe, rightShoe, kasagiTop, kasagiRed, nukiBeam, plaque);

  const toriiBell = new THREE.Group();
  toriiBell.position.set(0, 2.95, 0.12);
  const bellRope = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8), creamPaperMat);
  bellRope.position.y = -0.35;
  const bellSphere = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), brassMat);
  bellSphere.position.y = -0.18;
  const bellHit = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.0, 0.75), invisibleMat);
  bellHit.position.y = -0.35;
  bellHit.userData = {
    interactType: 'toriiBell',
    label: 'Torii Shrine Bell',
  };
  toriiBell.add(bellRope, bellSphere, bellHit);
  hitProxies.push(bellHit);
  toriiGroup.add(toriiBell);

  // Winding 3D Red String connecting timeline milestone lanterns
  const stringCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.8, 0.9, -86.5),
    new THREE.Vector3(1.6, 1.35, -89.0),
    new THREE.Vector3(-1.4, 1.15, -93.8),
    new THREE.Vector3(1.5, 1.45, -96.5),
  ]);
  const stringMesh = new THREE.Mesh(new THREE.TubeGeometry(stringCurve, 44, 0.025, 8, false), redCordMat);
  rootGroup.add(stringMesh);

  const timelineLanterns: THREE.Mesh[] = [];
  [
    new THREE.Vector3(-1.8, 0.9, -86.5),
    new THREE.Vector3(1.6, 1.35, -89.0),
    new THREE.Vector3(-1.4, 1.15, -93.8),
  ].forEach((pt) => {
    const stoneOrb = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.2, 0),
      new THREE.MeshStandardMaterial({
        color: 0xfff3de,
        emissive: new THREE.Color('#FF9E5E'),
        emissiveIntensity: 1.1,
        roughness: 0.4,
      }),
    );
    stoneOrb.position.copy(pt);
    rootGroup.add(stoneOrb);
    timelineLanterns.push(stoneOrb);
  });

  // Carved Stone Toro Lanterns & Kitsune Guardian Shrine flanking Crimson Torii Gate
  [
    [-2.55, 0, -89.8],
    [2.55, 0, -89.8],
    [2.75, 0, -104.5],
  ].forEach(([tx, ty, tz]) => {
    const toro = createStoneToroLantern(sharedMats, textures, isSoftwareGl);
    toro.position.set(tx, ty, tz);
    rootGroup.add(toro);
  });

  const kitsuneShrine = createKitsuneFoxShrine(sharedMats);
  kitsuneShrine.group.position.set(2.15, 0, -87.4);
  kitsuneShrine.group.rotation.y = -0.5;
  rootGroup.add(kitsuneShrine.group);
  hitProxies.push(kitsuneShrine.hitProxy);

  // =========================================================================
  // STATION 06 (z = -109): Open Rooftop Moon Shrine & 3D Wax-Sealed Letter
  // =========================================================================
  const rooftopGroup = new THREE.Group();
  rooftopGroup.position.set(0, 0, -109);
  rootGroup.add(rooftopGroup);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 22), floorMat);
  deck.position.set(0, -0.15, 0);
  rooftopGroup.add(deck);

  // Rooftop perimeter railing
  const railMat = inkTrimMat;
  [-5.6, 5.6].forEach((rx) => {
    const sideRail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.95, 21), railMat);
    sideRail.position.set(rx, 0.48, 0);
    rooftopGroup.add(sideRail);
  });
  const backRail = new THREE.Mesh(new THREE.BoxGeometry(11.3, 0.95, 0.1), railMat);
  backRail.position.set(0, 0.48, -10.5);
  rooftopGroup.add(backRail);

  // Luminous Crescent Moon Backdrop
  const moonDisc = new THREE.Mesh(
    new THREE.CircleGeometry(3.2, 36),
    new THREE.MeshBasicMaterial({ color: 0xffe4cc, fog: false }),
  );
  moonDisc.position.set(0, 4.8, -17.5);
  rooftopGroup.add(moonDisc);

  const moonShadowCut = new THREE.Mesh(
    new THREE.CircleGeometry(2.65, 36),
    new THREE.MeshBasicMaterial({ color: 0x271522, fog: false }),
  );
  moonShadowCut.position.set(1.1, 5.2, -17.35);
  rooftopGroup.add(moonShadowCut);

  // Stone Altar & Composite 3D Wax-Sealed Letter Envelope
  const altarShadow = new THREE.Mesh(new THREE.CircleGeometry(1.25, 22), shadowDiscMat);
  altarShadow.rotation.x = -Math.PI / 2;
  altarShadow.position.y = 0.015;
  rooftopGroup.add(altarShadow);

  const altar = new THREE.Mesh(new RoundedBoxGeometry(1.8, 0.85, 1.1, 2, 0.04), darkWoodMat);
  altar.position.set(0, 0.425, 0);
  rooftopGroup.add(altar);

  const envelopeGroup = new THREE.Group();
  envelopeGroup.position.set(0, 1.55, 0);
  envelopeGroup.rotation.x = -0.25;
  rooftopGroup.add(envelopeGroup);

  const envBody = new THREE.Mesh(new RoundedBoxGeometry(1.45, 0.92, 0.08, 2, 0.02), creamPaperMat);
  envelopeGroup.add(envBody);

  const envBorder = new THREE.Mesh(new THREE.BoxGeometry(1.49, 0.96, 0.04), inkTrimMat);
  envBorder.position.z = -0.01;
  envelopeGroup.add(envBorder);

  // Hinged top triangular flap
  const flapShape = new THREE.Shape();
  flapShape.moveTo(-0.7, 0);
  flapShape.lineTo(0.7, 0);
  flapShape.lineTo(0, -0.48);
  flapShape.closePath();

  const flapGeo = new THREE.ExtrudeGeometry(flapShape, {
    depth: 0.02,
    bevelEnabled: false,
  });
  const envelopeFlapPivot = new THREE.Group();
  envelopeFlapPivot.position.set(0, 0.45, 0.05);
  const flapMesh = new THREE.Mesh(flapGeo, creamPaperMat);
  envelopeFlapPivot.add(flapMesh);
  envelopeGroup.add(envelopeFlapPivot);

  // Crimson Wax Seal Medallion
  const waxSealMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.waxSealMap,
    emissive: new THREE.Color('#B84955'),
    emissiveIntensity: 0.35,
    roughness: 0.32,
    metalness: 0.15,
  });
  const waxSealMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24), waxSealMat);
  waxSealMesh.rotation.x = Math.PI / 2;
  waxSealMesh.position.set(0, -0.44, 0.035);
  envelopeFlapPivot.add(waxSealMesh);

  const envHit = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.2, 0.5), invisibleMat);
  envHit.userData = {
    interactType: 'envelope',
    label: 'Sealed Letter Envelope',
  };
  envelopeGroup.add(envHit);
  hitProxies.push(envHit);

  const moonRig = createMoonShrineAtmosphere(rooftopGroup, sharedMats);

  const sakuraPetals = createSakuraPetals();
  rootGroup.add(sakuraPetals.mesh);

  const spiritFireflies = createSpiritFireflies();
  rootGroup.add(spiritFireflies.mesh);

  // =========================================================================
  // GLOBAL INSTANCED SPIRIT & DUST MOTES (140 instances spanning 128m path)
  // =========================================================================
  const moteCount = 140;
  const moteGeo = new THREE.OctahedronGeometry(0.036, 0);
  const moteMat = new THREE.MeshBasicMaterial({
    color: 0xffe6cc,
    transparent: true,
    opacity: 0.78,
  });
  const dustMotes = new THREE.InstancedMesh(moteGeo, moteMat, moteCount);
  dustMotes.frustumCulled = false;

  const dustBasePositions = new Float32Array(moteCount * 3);
  const dummyMat = new THREE.Matrix4();
  const dummyPos = new THREE.Vector3();
  const dummyQuat = new THREE.Quaternion();
  const dummyScale = new THREE.Vector3();

  for (let i = 0; i < moteCount; i++) {
    const rx = Math.sin(i * 12.9898) * 3.0;
    const ry = 0.45 + ((i * 0.6180339) % 1) * 3.6;
    const rz = 6.0 - ((i * 0.381966) % 1) * 124.0;

    dustBasePositions[i * 3] = rx;
    dustBasePositions[i * 3 + 1] = ry;
    dustBasePositions[i * 3 + 2] = rz;

    const s = 0.7 + (i % 5) * 0.16;
    dummyPos.set(rx, ry, rz);
    dummyScale.set(s, s, s);
    dummyMat.compose(dummyPos, dummyQuat, dummyScale);
    dustMotes.setMatrixAt(i, dummyMat);
  }
  dustMotes.instanceMatrix.needsUpdate = true;
  dustMotes.computeBoundingSphere();
  rootGroup.add(dustMotes);

  return {
    rootGroup,
    talismans,
    lanterns,
    furinChimes,
    astrolabeGroup,
    astrolabeRings: [outerRing, midRing, innerRing],
    astrolabeCore,
    astrolabeMoons,
    skillRelics,
    projectMonoliths,
    toriiBell,
    timelineLanterns,
    envelopeGroup,
    envelopeFlapPivot,
    waxSealMesh,
    origamiPlates,
    teruDoll,
    deskLamp,
    kitsuneShrine,
    origamiCranes,
    sakuraPetals,
    spiritFireflies,
    waterRippleRing: moonRig.waterRippleRing,
    moonHalo: moonRig.moonHalo,
    hitProxies,
    dustMotes,
    dustBasePositions,
    loadedImageTextures,
  };
}
