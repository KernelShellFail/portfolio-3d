let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtor();
  }
  if (sharedAudioCtx.state === 'suspended') {
    void sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

export type ChimeVoice = 'seal' | 'bell' | 'astrolabe' | 'lantern' | 'snap' | 'furin';

const SCALE_FREQS: Record<ChimeVoice, number[]> = {
  seal: [587.33, 880], // D5 -> A5
  bell: [523.25, 659.25, 1046.5], // C5 -> E5 -> C6 temple suzu harmonic
  astrolabe: [440, 587.33, 783.99], // A4 -> D5 -> G5
  lantern: [659.25, 783.99], // E5 -> G5
  snap: [493.88, 587.33], // B4 -> D5 gentle wooden snap
  furin: [1174.66, 1396.91, 1760], // D6 -> F6 -> A6 crystal glass wind chime
};

export function playSpiritChime(voice: ChimeVoice, enabled: boolean): void {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = SCALE_FREQS[voice] ?? SCALE_FREQS.seal;
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = voice === 'bell' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.055);

      const peak = voice === 'furin' ? 0.04 : 0.065;
      const decay = voice === 'furin' ? 0.65 : 0.45;
      gain.gain.setValueAtTime(0.0001, now + idx * 0.055);
      gain.gain.exponentialRampToValueAtTime(peak, now + idx * 0.055 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.055 + decay);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + decay + 0.04);
    });
  } catch {
    // Audio playback cleanly ignored if browser policy blocks context
  }
}

// ============================================================================
// Procedural Ambient Background Music (Twilight School Lo-Fi Koto & Pad)
// ============================================================================
const CHORD_PROGRESSION = [
  [146.83, 220.0, 261.63, 329.63], // Dm9
  [116.54, 174.61, 220.0, 293.66], // Bbmaj7
  [174.61, 261.63, 329.63, 440.0], // Fmaj7
  [110.0, 164.81, 220.0, 261.63], // Am7
];

const KOTO_MELODY = [
  587.33, 659.25, 880.0, 698.46, 523.25, 587.33, 440.0, 523.25,
  698.46, 880.0, 783.99, 659.25, 587.33, 523.25, 440.0, 659.25,
];

let bgmTimerId: number | null = null;
let bgmMasterGain: GainNode | null = null;
let bgmDelayNode: DelayNode | null = null;
let bgmStep = 0;

function ensureBgmBus(ctx: AudioContext): { master: GainNode; delay: DelayNode } {
  if (!bgmMasterGain || !bgmDelayNode) {
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.connect(ctx.destination);

    const delay = ctx.createDelay(1.0);
    delay.delayTime.setValueAtTime(0.36, ctx.currentTime);
    const feedback = ctx.createGain();
    feedback.gain.setValueAtTime(0.28, ctx.currentTime);
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.setValueAtTime(1600, ctx.currentTime);

    delay.connect(delayFilter);
    delayFilter.connect(feedback);
    feedback.connect(delay);
    delayFilter.connect(master);

    bgmMasterGain = master;
    bgmDelayNode = delay;
  }
  return { master: bgmMasterGain, delay: bgmDelayNode };
}

function scheduleAmbientStep(): void {
  const ctx = getAudioContext();
  if (!ctx || !bgmMasterGain || !bgmDelayNode) return;
  const now = ctx.currentTime;

  // Every 4 steps (~3.6s), play a warm low-pass ambient twilight pad chord
  if (bgmStep % 4 === 0) {
    const chord = CHORD_PROGRESSION[Math.floor(bgmStep / 4) % CHORD_PROGRESSION.length];
    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(520, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.032, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.55);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(bgmMasterGain!);
      osc.start(now);
      osc.stop(now + 3.65);
    });
  }

  // Gentle plucked koto / music-box note on each beat
  const noteFreq = KOTO_MELODY[bgmStep % KOTO_MELODY.length];
  const noteOsc = ctx.createOscillator();
  const noteGain = ctx.createGain();
  noteOsc.type = 'sine';
  noteOsc.frequency.setValueAtTime(noteFreq, now);

  noteGain.gain.setValueAtTime(0.0001, now);
  noteGain.gain.linearRampToValueAtTime(0.035, now + 0.025);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

  noteOsc.connect(noteGain);
  noteGain.connect(bgmMasterGain);
  noteGain.connect(bgmDelayNode);
  noteOsc.start(now);
  noteOsc.stop(now + 1.2);

  bgmStep += 1;
}

export function setAmbientMusicActive(active: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (active) {
      const ctx = getAudioContext();
      if (!ctx) return;
      const { master } = ensureBgmBus(ctx);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.75, ctx.currentTime + 0.6);

      if (bgmTimerId === null) {
        scheduleAmbientStep();
        bgmTimerId = window.setInterval(scheduleAmbientStep, 900);
      }
    } else {
      if (bgmTimerId !== null) {
        window.clearInterval(bgmTimerId);
        bgmTimerId = null;
      }
      if (sharedAudioCtx && bgmMasterGain) {
        const now = sharedAudioCtx.currentTime;
        bgmMasterGain.gain.cancelScheduledValues(now);
        bgmMasterGain.gain.setValueAtTime(Math.max(0.0001, bgmMasterGain.gain.value), now);
        bgmMasterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      }
    }
  } catch {
    // Gracefully ignore restricted audio context in automated tests
  }
}
