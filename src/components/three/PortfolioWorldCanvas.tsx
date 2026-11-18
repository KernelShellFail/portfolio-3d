import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  disposeSceneResources,
  probeWebGLCapabilities,
} from './webglCapabilities';
import { createWorldTextures } from './schoolHallwayTextures';
import { buildWorldChaptersScene } from './worldChaptersBuilder';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { projectsData } from '../../data/projects';
import {
  computeWorldCameraTargetZ,
  getAtmosphereTheme,
} from '../../utils/portfolioLogic';
import { playSpiritChime } from '../../utils/soundEffects';

interface PortfolioWorldCanvasProps {
  scrollProgress: number;
}

// Pre-allocated scratch helpers outside render loop (zero GC)
const _vec3 = new THREE.Vector3();
const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _scale = new THREE.Vector3();
const _pointer = new THREE.Vector2();
const _targetColor = new THREE.Color();
const _targetColor2 = new THREE.Color();
const _targetColor3 = new THREE.Color();

export function PortfolioWorldCanvas({
  scrollProgress,
}: PortfolioWorldCanvasProps) {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [contextLost, setContextLost] = useState(false);

  const introCompleted = usePortfolioStore((s) => s.introCompleted);
  const webglFallbackForced = usePortfolioStore((s) => s.webglFallbackForced);
  const webglSupported = usePortfolioStore((s) => s.webglSupported);
  const setWebglSupported = usePortfolioStore((s) => s.setWebglSupported);
  const atmosphereMood = usePortfolioStore((s) => s.atmosphereMood);
  const explore3DMode = usePortfolioStore((s) => s.explore3DMode);
  const petalsEnabled = usePortfolioStore((s) => s.petalsEnabled);
  const firefliesEnabled = usePortfolioStore((s) => s.firefliesEnabled);
  const autoCameraDrift = usePortfolioStore((s) => s.autoCameraDrift);
  const audioChimesEnabled = usePortfolioStore((s) => s.audioChimesEnabled);
  const deskLampToggled = usePortfolioStore((s) => s.deskLampToggled);
  const foxShrineGlow = usePortfolioStore((s) => s.foxShrineGlow);
  const toggledLanternIds = usePortfolioStore((s) => s.toggledLanternIds);
  const activeSkillCategory = usePortfolioStore((s) => s.activeSkillCategory);
  const hoveredProjectId = usePortfolioStore((s) => s.hoveredProjectId);
  const contactSentSignal = usePortfolioStore((s) => s.contactSentSignal);
  const astrolabeBoostSignal = usePortfolioStore((s) => s.astrolabeBoostSignal);
  const toriiChimeSignal = usePortfolioStore((s) => s.toriiChimeSignal);
  const teruBounceSignal = usePortfolioStore((s) => s.teruBounceSignal);
  const craneBoostSignal = usePortfolioStore((s) => s.craneBoostSignal);
  const furinSignal = usePortfolioStore((s) => s.furinSignal);

  const discoverTalisman = usePortfolioStore((s) => s.discoverTalisman);
  const toggleLantern = usePortfolioStore((s) => s.toggleLantern);
  const setSceneInteractionNote = usePortfolioStore((s) => s.setSceneInteractionNote);
  const setActiveSkillCategory = usePortfolioStore((s) => s.setActiveSkillCategory);
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject);
  const triggerAstrolabeBoost = usePortfolioStore((s) => s.triggerAstrolabeBoost);
  const triggerToriiChime = usePortfolioStore((s) => s.triggerToriiChime);
  const triggerTeruBounce = usePortfolioStore((s) => s.triggerTeruBounce);
  const toggleDeskLamp = usePortfolioStore((s) => s.toggleDeskLamp);
  const toggleFoxShrineGlow = usePortfolioStore((s) => s.toggleFoxShrineGlow);
  const triggerCraneBoost = usePortfolioStore((s) => s.triggerCraneBoost);
  const triggerFurinRing = usePortfolioStore((s) => s.triggerFurinRing);

  // Live refs read inside WebGL animation loop without recreating WebGLRenderer
  const stateRef = useRef({
    introCompleted,
    scrollProgress,
    atmosphereMood,
    explore3DMode,
    petalsEnabled,
    firefliesEnabled,
    autoCameraDrift,
    audioChimesEnabled,
    deskLampToggled,
    foxShrineGlow,
    toggledLanternIds,
    activeSkillCategory,
    hoveredProjectId,
    contactSentSignal,
    astrolabeBoostSignal,
    toriiChimeSignal,
    teruBounceSignal,
    craneBoostSignal,
    furinSignal,
  });
  stateRef.current = {
    introCompleted,
    scrollProgress,
    atmosphereMood,
    explore3DMode,
    petalsEnabled,
    firefliesEnabled,
    autoCameraDrift,
    audioChimesEnabled,
    deskLampToggled,
    foxShrineGlow,
    toggledLanternIds,
    activeSkillCategory,
    hoveredProjectId,
    contactSentSignal,
    astrolabeBoostSignal,
    toriiChimeSignal,
    teruBounceSignal,
    craneBoostSignal,
    furinSignal,
  };

  const actionsRef = useRef({
    discoverTalisman,
    toggleLantern,
    setSceneInteractionNote,
    setActiveSkillCategory,
    setSelectedProject,
    triggerAstrolabeBoost,
    triggerToriiChime,
    triggerTeruBounce,
    toggleDeskLamp,
    toggleFoxShrineGlow,
    triggerCraneBoost,
    triggerFurinRing,
  });
  actionsRef.current = {
    discoverTalisman,
    toggleLantern,
    setSceneInteractionNote,
    setActiveSkillCategory,
    setSelectedProject,
    triggerAstrolabeBoost,
    triggerToriiChime,
    triggerTeruBounce,
    toggleDeskLamp,
    toggleFoxShrineGlow,
    triggerCraneBoost,
    triggerFurinRing,
  };

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container || webglFallbackForced) return;

    const probe = probeWebGLCapabilities();
    if (!probe.supported) {
      setWebglSupported(false);
      return;
    }
    setWebglSupported(true);

    const isSoftwareGl = probe.isSoftwareGl;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: isSoftwareGl,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    renderer.setSize(width, height);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const initialTheme = getAtmosphereTheme(stateRef.current.atmosphereMood);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(initialTheme.bgHex);
    scene.fog = new THREE.FogExp2(initialTheme.fogHex, initialTheme.fogDensity);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 45);
    camera.position.set(
      0,
      1.9,
      computeWorldCameraTargetZ(
        stateRef.current.introCompleted,
        stateRef.current.scrollProgress,
      ),
    );

    const hemiLight = new THREE.HemisphereLight(
      initialTheme.hemiSky,
      initialTheme.hemiGround,
      initialTheme.hemiIntensity,
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(
      initialTheme.keyColor,
      initialTheme.keyIntensity,
    );
    keyLight.position.set(-4.5, 5.5, 4.0);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 35;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Moving warm lantern aura light that travels smoothly with the visitor
    const cameraLanternLight = new THREE.PointLight('#FFC79E', 2.6, 22, 1.35);
    cameraLanternLight.position.set(0, 2.5, camera.position.z - 4);
    scene.add(cameraLanternLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const textures = createWorldTextures(maxAniso);
    let disposed = false;
    const world = buildWorldChaptersScene(textures, isSoftwareGl, () => {
      if (!disposed && reducedMotion) {
        renderer.render(scene, camera);
      }
    });
    scene.add(world.rootGroup);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Interactive Pointer Drag-Look, Keyboard Nudge & Raycasting
    const raycaster = new THREE.Raycaster();
    let pointerNormX = 0;
    let pointerNormY = 0;
    let dragYaw = 0;
    let dragPitch = 0;
    let isDragging = false;
    let dragMoved = false;
    let lastDragX = 0;
    let lastDragY = 0;
    let lastRaycastMs = 0;
    let hoveredProxy: THREE.Mesh | null = null;
    const keysPressed = new Set<string>();
    let exploreOffsetX = 0;
    let exploreOffsetZ = 0;

    // One-shot animation impulses & smoothed scroll
    let smoothedScroll = stateRef.current.scrollProgress;
    let astrolabeBoostVel = 0;
    let prevAstrolabeSignal = stateRef.current.astrolabeBoostSignal;
    let toriiSwingEnergy = 0;
    let prevToriiSignal = stateRef.current.toriiChimeSignal;
    let teruBounceEnergy = 0;
    let prevTeruSignal = stateRef.current.teruBounceSignal;
    let craneBoostVel = 0;
    let prevCraneSignal = stateRef.current.craneBoostSignal;
    let furinSwingEnergy = 0;
    let prevFurinSignal = stateRef.current.furinSignal;
    let envelopeOpenTarget = 0;
    let envelopeFlapAngle = 0;
    let prevContactSignal = stateRef.current.contactSentSignal;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.target !== renderer.domElement) return;
      isDragging = true;
      dragMoved = false;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNormX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNormY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const dx = e.clientX - lastDragX;
        const dy = e.clientY - lastDragY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          dragMoved = true;
        }
        lastDragX = e.clientX;
        lastDragY = e.clientY;
        dragYaw = THREE.MathUtils.clamp(dragYaw - dx * 0.0032, -0.85, 0.85);
        dragPitch = THREE.MathUtils.clamp(dragPitch - dy * 0.0024, -0.45, 0.45);
      }

      const now = performance.now();
      if (now - lastRaycastMs < 65) return;
      lastRaycastMs = now;

      _pointer.set(pointerNormX, pointerNormY);
      raycaster.setFromCamera(_pointer, camera);
      const hits = raycaster.intersectObjects(world.hitProxies, false);
      hoveredProxy = hits.length > 0 ? (hits[0].object as THREE.Mesh) : null;
      renderer.domElement.style.cursor = hoveredProxy ? 'pointer' : isDragging ? 'grabbing' : 'default';
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleCanvasClick = (e: MouseEvent) => {
      if (dragMoved) {
        dragMoved = false;
        return;
      }
      const rect = renderer.domElement.getBoundingClientRect();
      _pointer.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(_pointer, camera);
      const hits = raycaster.intersectObjects(world.hitProxies, false);
      if (hits.length === 0) return;

      const data = hits[0].object.userData as {
        interactType?: string;
        talismanId?: string;
        talismanNote?: string;
        lanternId?: string;
        skillCategory?: string;
        projectId?: string;
        projectTitle?: string;
      };

      const chimesOn = stateRef.current.audioChimesEnabled;

      switch (data.interactType) {
        case 'talisman':
          if (data.talismanId && data.talismanNote) {
            actionsRef.current.discoverTalisman(data.talismanId, data.talismanNote);
            playSpiritChime('seal', chimesOn);
          }
          break;
        case 'lantern':
          if (data.lanternId) {
            actionsRef.current.toggleLantern(data.lanternId);
            actionsRef.current.setSceneInteractionNote(
              `Toggled spirit flame on ${data.lanternId}.`,
            );
            playSpiritChime('lantern', chimesOn);
          }
          break;
        case 'teruDoll':
          actionsRef.current.triggerTeruBounce();
          actionsRef.current.setSceneInteractionNote(
            'Teru Spirit Charm bounced — clear twilight skies invoked.',
          );
          playSpiritChime('lantern', chimesOn);
          break;
        case 'furinChime':
          actionsRef.current.triggerFurinRing();
          actionsRef.current.setSceneInteractionNote(
            'Glass Furin wind chime rang softly in the evening breeze.',
          );
          playSpiritChime('furin', chimesOn);
          break;
        case 'deskLamp':
          actionsRef.current.toggleDeskLamp();
          actionsRef.current.setSceneInteractionNote(
            'Toggled Scholar Desk Lamp study glow in Station 01.',
          );
          playSpiritChime('snap', chimesOn);
          break;
        case 'origamiCrane':
          actionsRef.current.triggerCraneBoost();
          actionsRef.current.setSceneInteractionNote(
            'Origami Crane caught a spirit updraft down the hallway.',
          );
          playSpiritChime('seal', chimesOn);
          break;
        case 'astrolabe':
          actionsRef.current.triggerAstrolabeBoost();
          actionsRef.current.setSceneInteractionNote(
            'Spirit Astrolabe spun — harmonic rings aligned with RTMNU Class of 2026.',
          );
          playSpiritChime('astrolabe', chimesOn);
          break;
        case 'skillRelic':
          if (data.skillCategory) {
            actionsRef.current.setActiveSkillCategory(data.skillCategory as never);
            actionsRef.current.setSceneInteractionNote(
              `Selected 3D Relic: Filtered ability archive to "${data.skillCategory}".`,
            );
            playSpiritChime('seal', chimesOn);
          }
          break;
        case 'projectFrame':
          if (data.projectId) {
            const matched = projectsData.find((p) => p.id === data.projectId);
            if (matched) {
              actionsRef.current.setSelectedProject(matched);
              actionsRef.current.setSceneInteractionNote(
                `Opened 3D Episode Monolith: ${matched.title}.`,
              );
              playSpiritChime('snap', chimesOn);
            }
          }
          break;
        case 'toriiBell':
          actionsRef.current.triggerToriiChime();
          actionsRef.current.setSceneInteractionNote(
            'Torii Shrine Bell rung — red thread of milestones illuminated.',
          );
          playSpiritChime('bell', chimesOn);
          break;
        case 'kitsuneShrine':
          actionsRef.current.toggleFoxShrineGlow();
          actionsRef.current.setSceneInteractionNote(
            'Kitsune Guardian Shrine awakened — sacred eyes & aura pulsed.',
          );
          playSpiritChime('bell', chimesOn);
          break;
        case 'envelope':
          envelopeOpenTarget = envelopeOpenTarget > 0.5 ? 0 : 1;
          actionsRef.current.setSceneInteractionNote(
            envelopeOpenTarget > 0.5
              ? 'Opened 3D Wax-Sealed Letter on the Moon Shrine altar.'
              : 'Resealed 3D Letter Envelope.',
          );
          playSpiritChime('seal', chimesOn);
          break;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      keysPressed.add(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.code);
    };

    const handleResize = () => {
      if (!container || disposed) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('click', handleCanvasClick);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    let frameId = 0;
    const startTimeMs = performance.now();
    let prevTimeMs = startTimeMs;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state =
          sync && gl.getSyncParameter
            ? gl.getSyncParameter(sync, gl.SYNC_STATUS)
            : gl.SIGNALED;
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 16);
        } else {
          if (sync && gl.deleteSync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 65);
        }
      };
      frameId = window.setTimeout(poll, 16);
    }

    function tick() {
      if (disposed) return;
      const nowMs = performance.now();
      const rawDelta = (nowMs - prevTimeMs) * 0.001;
      const delta = Math.min(rawDelta, 0.05);
      const camDelta = Math.min(rawDelta, 0.25);
      const elapsed = (nowMs - startTimeMs) * 0.001;
      prevTimeMs = nowMs;

      const s = stateRef.current;

      // Consume one-shot signals cleanly
      if (s.astrolabeBoostSignal !== prevAstrolabeSignal) {
        prevAstrolabeSignal = s.astrolabeBoostSignal;
        astrolabeBoostVel = 6.5;
      }
      if (s.toriiChimeSignal !== prevToriiSignal) {
        prevToriiSignal = s.toriiChimeSignal;
        toriiSwingEnergy = 0.65;
      }
      if (s.teruBounceSignal !== prevTeruSignal) {
        prevTeruSignal = s.teruBounceSignal;
        teruBounceEnergy = 0.45;
      }
      if (s.craneBoostSignal !== prevCraneSignal) {
        prevCraneSignal = s.craneBoostSignal;
        craneBoostVel = 4.2;
      }
      if (s.furinSignal !== prevFurinSignal) {
        prevFurinSignal = s.furinSignal;
        furinSwingEnergy = 0.55;
      }
      if (s.contactSentSignal !== prevContactSignal) {
        prevContactSignal = s.contactSentSignal;
        envelopeOpenTarget = 1;
      }

      // Smooth atmosphere mood interpolation
      const theme = getAtmosphereTheme(s.atmosphereMood);
      _targetColor.set(theme.bgHex);
      if (scene.background instanceof THREE.Color) {
        scene.background.lerp(_targetColor, 1 - Math.exp(-3 * delta));
      }
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.lerp(_targetColor, 1 - Math.exp(-3 * delta));
        scene.fog.density = THREE.MathUtils.damp(scene.fog.density, theme.fogDensity, 3, delta);
      }
      _targetColor2.set(theme.keyColor);
      keyLight.color.lerp(_targetColor2, 1 - Math.exp(-3 * delta));
      _targetColor3.set(theme.hemiSky);
      hemiLight.color.lerp(_targetColor3, 1 - Math.exp(-3 * delta));

      // Gentle WASD exploration nudge (clamped safely inside corridor)
      if (!reducedMotion) {
        if (keysPressed.has('KeyA') || keysPressed.has('ArrowLeft')) {
          exploreOffsetX = Math.max(-1.35, exploreOffsetX - delta * 2.2);
        }
        if (keysPressed.has('KeyD') || keysPressed.has('ArrowRight')) {
          exploreOffsetX = Math.min(1.35, exploreOffsetX + delta * 2.2);
        }
        if (keysPressed.has('KeyW')) {
          exploreOffsetZ = Math.max(-3.5, exploreOffsetZ - delta * 3.0);
        }
        if (keysPressed.has('KeyS')) {
          exploreOffsetZ = Math.min(2.5, exploreOffsetZ + delta * 3.0);
        }
        if (!isDragging && !s.explore3DMode) {
          dragYaw = THREE.MathUtils.damp(dragYaw, 0, 2.2, delta);
          dragPitch = THREE.MathUtils.damp(dragPitch, 0, 2.2, delta);
          exploreOffsetX = THREE.MathUtils.damp(exploreOffsetX, 0, 1.8, delta);
          exploreOffsetZ = THREE.MathUtils.damp(exploreOffsetZ, 0, 1.8, delta);
        }
      }

      smoothedScroll = THREE.MathUtils.damp(smoothedScroll, s.scrollProgress, 5.5, camDelta);
      const baseZ = computeWorldCameraTargetZ(s.introCompleted, smoothedScroll);
      const breathZ = s.introCompleted ? 0 : -Math.sin(elapsed * 0.25) * 0.4;
      const waveX = s.introCompleted ? Math.sin(smoothedScroll * Math.PI * 3) * 0.45 : 0;
      const driftX = s.autoCameraDrift && !reducedMotion ? Math.sin(elapsed * 0.45) * 0.65 : 0;
      const driftY = s.autoCameraDrift && !reducedMotion ? Math.cos(elapsed * 0.38) * 0.16 : 0;

      const desiredX = waveX + pointerNormX * 0.45 + exploreOffsetX + driftX;
      const desiredY = 1.9 + pointerNormY * 0.2 + driftY;
      const desiredZ = baseZ + breathZ + exploreOffsetZ;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredX, 4.2, camDelta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredY, 4.2, camDelta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredZ, 4.2, camDelta);

      const lookX = camera.position.x + Math.sin(dragYaw) * 6.5;
      const lookY = 1.85 + Math.sin(dragPitch) * 3.8;
      const lookZ = camera.position.z - Math.cos(dragYaw) * 8.5;
      camera.lookAt(lookX, lookY, lookZ);

      // Keep moving lantern fill light paired to camera
      cameraLanternLight.position.set(
        camera.position.x * 0.5,
        2.5,
        camera.position.z - 5.5,
      );
      keyLight.position.set(-4.5, 5.5, camera.position.z + 4.0);

      // Update lantern toggle states (amber vs crimson spirit flame) + flame core shimmer
      for (let i = 0; i < world.lanterns.length; i++) {
        const l = world.lanterns[i];
        const isCrimson = s.toggledLanternIds.includes(l.id);
        const flameHex = isCrimson ? '#FF5277' : theme.lanternColor;
        _targetColor.set(flameHex);
        l.pointLight?.color.lerp(_targetColor, 1 - Math.exp(-6 * delta));
        l.paperMat.emissive.lerp(_targetColor, 1 - Math.exp(-6 * delta));
        const flicker = Math.sin(elapsed * 7.2 + i * 1.9) * 0.08;
        l.paperMat.emissiveIntensity = (isCrimson ? 2.15 : 1.6) + flicker;
        if (!reducedMotion) {
          l.group.rotation.z = Math.sin(elapsed * 0.85 + i * 1.1) * 0.04;
          const fs = 0.92 + Math.sin(elapsed * 6.5 + i * 1.7) * 0.14;
          l.flameCore.scale.set(fs, fs * 1.15, fs);
          l.flameCore.rotation.y += delta * 2.2;
        }
      }

      // Update Scholar Desk Lamp state & Kitsune Guardian Shrine glow
      _targetColor.set(s.deskLampToggled ? '#FF5277' : '#FFB884');
      world.deskLamp.shadeMat.emissive.lerp(_targetColor, 1 - Math.exp(-6 * delta));
      world.deskLamp.bulbMat.emissive.lerp(_targetColor, 1 - Math.exp(-6 * delta));
      world.deskLamp.bulbMat.emissiveIntensity = s.deskLampToggled ? 2.4 : 1.5;

      world.kitsuneShrine.eyeMat.emissiveIntensity = THREE.MathUtils.damp(
        world.kitsuneShrine.eyeMat.emissiveIntensity,
        s.foxShrineGlow ? 2.4 : 0.85,
        5,
        delta,
      );

      // Particle visibility toggles
      world.sakuraPetals.mesh.visible = s.petalsEnabled;
      world.spiritFireflies.mesh.visible = s.firefliesEnabled;

      if (!reducedMotion) {
        // Station 00: Floating Ofuda talismans, Furin Glass Chimes & Teru Doll
        for (let i = 0; i < world.talismans.length; i++) {
          const t = world.talismans[i];
          t.group.position.y = t.baseY + Math.sin(elapsed * 1.15 + t.phase) * 0.08;
          t.group.rotation.z = Math.sin(elapsed * 0.9 + t.phase) * 0.05;
        }
        furinSwingEnergy = THREE.MathUtils.damp(furinSwingEnergy, 0, 1.8, delta);
        for (let i = 0; i < world.furinChimes.length; i++) {
          const fc = world.furinChimes[i];
          const swing =
            Math.sin(elapsed * 1.35 + fc.phase) * 0.06 +
            Math.sin(elapsed * 8.5 + fc.phase) * furinSwingEnergy;
          fc.group.rotation.z = swing;
          fc.clapper.position.x = Math.sin(elapsed * 6.2 + fc.phase) * (0.02 + furinSwingEnergy * 0.06);
          fc.tanzakuStrip.rotation.x = Math.sin(elapsed * 2.8 + fc.phase) * (0.14 + furinSwingEnergy * 0.35);
          fc.tanzakuStrip.rotation.y = fc.baseRotY + Math.cos(elapsed * 1.9 + fc.phase) * 0.25;
        }
        teruBounceEnergy = THREE.MathUtils.damp(teruBounceEnergy, 0, 2.5, delta);
        world.teruDoll.group.position.y =
          2.95 + Math.abs(Math.sin(elapsed * 9)) * teruBounceEnergy + Math.sin(elapsed * 1.1) * 0.05;
        world.teruDoll.group.rotation.z =
          Math.sin(elapsed * 1.2) * 0.08 + Math.sin(elapsed * 8) * teruBounceEnergy * 0.35;

        // Station 01: Orbiting 3D manga plates & Gliding Origami Cranes
        for (let i = 0; i < world.origamiPlates.length; i++) {
          const plate = world.origamiPlates[i];
          const baseY = Number(plate.userData.baseY ?? 2.5);
          const phase = Number(plate.userData.phase ?? 0);
          plate.position.y = baseY + Math.sin(elapsed * 1.05 + phase) * 0.1;
          plate.rotation.z = Math.sin(elapsed * 0.7 + phase) * 0.06;
        }

        craneBoostVel = THREE.MathUtils.damp(craneBoostVel, 0, 1.8, delta);
        const flapSpeed = 3.8 + craneBoostVel * 2.2;
        for (let i = 0; i < world.origamiCranes.length; i++) {
          const crane = world.origamiCranes[i];
          const phase = i * 1.8;
          const flapAngle = Math.sin(elapsed * flapSpeed + phase) * 0.34;
          crane.rightWing.rotation.z = flapAngle;
          crane.leftWing.rotation.z = -flapAngle;
          crane.group.position.x =
            crane.basePos.x + Math.sin(elapsed * (0.6 + craneBoostVel * 0.15) + phase) * 0.45;
          crane.group.position.y =
            crane.basePos.y + Math.cos(elapsed * 1.1 + phase) * 0.14;
          crane.group.rotation.y =
            Math.cos(elapsed * 0.6 + phase) * 0.35;
        }

        // Station 02: Spirit Astrolabe gimbal rotation + orbiting moons
        astrolabeBoostVel = THREE.MathUtils.damp(astrolabeBoostVel, 0, 1.8, delta);
        const astroSpeed = 0.65 + astrolabeBoostVel;
        world.astrolabeRings[0].rotation.y += delta * astroSpeed * 0.8;
        world.astrolabeRings[1].rotation.x += delta * astroSpeed * 1.15;
        world.astrolabeRings[2].rotation.z -= delta * astroSpeed * 1.4;
        world.astrolabeCore.rotation.y += delta * astroSpeed * 1.6;
        world.astrolabeMoons.rotation.y += delta * (0.9 + astrolabeBoostVel * 0.85);
        world.astrolabeGroup.position.y = 2.05 + Math.sin(elapsed * 1.2) * 0.06;

        // Station 03: Skill Relics float & highlight active skill category
        for (let i = 0; i < world.skillRelics.length; i++) {
          const relic = world.skillRelics[i];
          const isMatch =
            s.activeSkillCategory === 'All' || s.activeSkillCategory === relic.category;
          const targetEmissive = isMatch ? 1.15 : 0.2;
          const targetScale =
            s.activeSkillCategory === relic.category ? 1.25 : 1.0;

          relic.coreMat.emissiveIntensity = THREE.MathUtils.damp(
            relic.coreMat.emissiveIntensity,
            targetEmissive,
            5,
            delta,
          );
          const nextS = THREE.MathUtils.damp(relic.group.scale.x, targetScale, 5, delta);
          relic.group.scale.set(nextS, nextS, nextS);

          relic.group.position.y = relic.baseY + Math.sin(elapsed * 1.25 + i) * 0.1;
          relic.coreMesh.rotation.y += delta * (isMatch ? 1.1 : 0.45);
          relic.coreMesh.rotation.x += delta * 0.35;
          relic.ringMesh.rotation.z -= delta * 0.85;
        }

        // Station 04: Project Monoliths float & respond to hover
        for (let i = 0; i < world.projectMonoliths.length; i++) {
          const mono = world.projectMonoliths[i];
          const isHovered = s.hoveredProjectId === mono.projectId;
          const targetY = mono.baseY + (isHovered ? 0.25 : 0) + Math.sin(elapsed * 0.9 + i) * 0.05;
          mono.group.position.y = THREE.MathUtils.damp(mono.group.position.y, targetY, 5, delta);
          mono.frameMat.emissiveIntensity = THREE.MathUtils.damp(
            mono.frameMat.emissiveIntensity,
            isHovered ? 1.1 : 0.2,
            5,
            delta,
          );
        }

        // Station 05: Torii Bell chime, timeline lanterns, & Kitsune shrine aura
        toriiSwingEnergy = THREE.MathUtils.damp(toriiSwingEnergy, 0, 2.2, delta);
        world.toriiBell.rotation.z =
          Math.sin(elapsed * 10) * toriiSwingEnergy + Math.sin(elapsed * 0.9) * 0.03;
        world.kitsuneShrine.auraRing.rotation.z += delta * (s.foxShrineGlow ? 1.6 : 0.4);

        for (let i = 0; i < world.timelineLanterns.length; i++) {
          world.timelineLanterns[i].rotation.y += delta * 0.7;
        }

        // Station 06: Sealed Letter Envelope, Tsukubai water ripples & Moon Halo
        envelopeFlapAngle = THREE.MathUtils.damp(
          envelopeFlapAngle,
          envelopeOpenTarget * 2.15,
          4.2,
          delta,
        );
        world.envelopeFlapPivot.rotation.x = -envelopeFlapAngle;
        world.envelopeGroup.position.y =
          1.55 + (envelopeOpenTarget > 0.5 ? 0.16 : 0) + Math.sin(elapsed * 1.1) * 0.05;
        world.envelopeGroup.rotation.y = Math.sin(elapsed * 0.55) * 0.14;

        const ripplePhase = (elapsed * 0.65) % 1;
        const rippleScale = 0.55 + ripplePhase * 2.15;
        world.waterRippleRing.scale.set(rippleScale, rippleScale, 1);
        const rippleMat = world.waterRippleRing.material as THREE.MeshBasicMaterial;
        rippleMat.opacity = (1 - ripplePhase) * 0.65;

        const haloScale = 1.0 + Math.sin(elapsed * 0.9) * 0.035;
        world.moonHalo.scale.set(haloScale, haloScale, 1);

        // Global Instanced Spirit Dust Motes
        const count = world.dustMotes.count;
        const base = world.dustBasePositions;
        for (let i = 0; i < count; i++) {
          const bx = base[i * 3];
          const by = base[i * 3 + 1];
          const bz = base[i * 3 + 2];
          const sc = 0.7 + (i % 5) * 0.16;
          _vec3.set(
            bx + Math.sin(elapsed * 0.5 + i) * 0.18,
            by + Math.cos(elapsed * 0.45 + i * 0.7) * 0.18,
            bz,
          );
          _scale.set(sc, sc, sc);
          _mat4.compose(_vec3, _quat, _scale);
          world.dustMotes.setMatrixAt(i, _mat4);
        }
        world.dustMotes.instanceMatrix.needsUpdate = true;

        // Global Instanced Sakura Petals
        if (s.petalsEnabled) {
          const pCount = world.sakuraPetals.mesh.count;
          const pBase = world.sakuraPetals.baseData;
          for (let i = 0; i < pCount; i++) {
            const px = pBase[i * 4];
            const py = pBase[i * 4 + 1];
            const pz = pBase[i * 4 + 2];
            const ph = pBase[i * 4 + 3];
            const driftY = ((py - elapsed * 0.22 - ph * 0.1) % 3.6 + 3.6) % 3.6 + 0.35;
            _vec3.set(
              px + Math.sin(elapsed * 0.7 + ph) * 0.32,
              driftY,
              pz + Math.cos(elapsed * 0.4 + ph) * 0.2,
            );
            _euler.set(elapsed * 0.9 + ph, elapsed * 0.6 + ph, Math.sin(elapsed + ph) * 0.8);
            _quat.setFromEuler(_euler);
            _scale.set(1.15, 1.15, 1.15);
            _mat4.compose(_vec3, _quat, _scale);
            world.sakuraPetals.mesh.setMatrixAt(i, _mat4);
          }
          world.sakuraPetals.mesh.instanceMatrix.needsUpdate = true;
        }

        // Global Instanced Luminous Spirit Fireflies (Hotaru)
        if (s.firefliesEnabled) {
          const fCount = world.spiritFireflies.mesh.count;
          const fBase = world.spiritFireflies.baseData;
          for (let i = 0; i < fCount; i++) {
            const fx = fBase[i * 4];
            const fy = fBase[i * 4 + 1];
            const fz = fBase[i * 4 + 2];
            const fph = fBase[i * 4 + 3];
            _vec3.set(
              fx + Math.sin(elapsed * 0.85 + fph) * 0.42,
              fy + Math.sin(elapsed * 1.15 + fph * 1.3) * 0.28,
              fz + Math.cos(elapsed * 0.65 + fph) * 0.35,
            );
            const pulse = 0.6 + Math.abs(Math.sin(elapsed * 2.1 + fph)) * 0.85;
            _scale.set(pulse, pulse, pulse);
            _quat.identity();
            _mat4.compose(_vec3, _quat, _scale);
            world.spiritFireflies.mesh.setMatrixAt(i, _mat4);
          }
          world.spiritFireflies.mesh.instanceMatrix.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);

      if (reducedMotion) {
        return;
      }
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      world.loadedImageTextures.forEach((tex) => tex.dispose());
      envTarget.dispose();
      disposeSceneResources(scene);
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [webglFallbackForced, setWebglSupported]);

  if (!webglSupported || webglFallbackForced || contextLost) {
    return (
      <div
        key="world-2d-fallback"
        data-testid="hallway-2d-fallback"
        className="fixed inset-0 z-0 overflow-hidden bg-[#271522]"
      >
        <img
          src="/src/assets/images/project_episode_hallway_1794977553647.jpg"
          alt="Illustrated twilight Japanese school hallway fallback"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover opacity-90"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#211E25]/50 via-[#301B29]/30 to-[#211E25]/82"
        />
      </div>
    );
  }

  return (
    <div
      key="world-webgl-canvas"
      ref={canvasMountRef}
      data-testid="hallway-webgl-canvas"
      className="fixed inset-0 z-0 h-full w-full"
    />
  );
}
