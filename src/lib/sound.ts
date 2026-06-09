type SoundKind = "coin" | "success" | "failure" | "daily";

let audioContext: AudioContext | null = null;

function getAudioContext() {
  audioContext ??= new AudioContext();
  return audioContext;
}

function tone(frequency: number, duration: number, delay: number, type: OscillatorType, volume = 0.08) {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, context.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, context.currentTime + delay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + delay + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(context.currentTime + delay);
  oscillator.stop(context.currentTime + delay + duration + 0.02);
}

export function playSound(kind: SoundKind) {
  try {
    if (kind === "coin") {
      tone(540, 0.08, 0, "triangle", 0.035);
      return;
    }

    if (kind === "success") {
      tone(440, 0.11, 0, "sine", 0.08);
      tone(660, 0.13, 0.1, "sine", 0.08);
      tone(990, 0.18, 0.22, "triangle", 0.07);
      return;
    }

    if (kind === "daily") {
      tone(330, 0.1, 0, "triangle", 0.06);
      tone(495, 0.12, 0.1, "triangle", 0.06);
      return;
    }

    tone(180, 0.18, 0, "sawtooth", 0.065);
    tone(110, 0.22, 0.12, "sawtooth", 0.05);
  } catch {
    // Browsers can block audio until user interaction; gameplay continues silently in that case.
  }
}
