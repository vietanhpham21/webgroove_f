import * as Tone from "tone";
import { chorusParams, delayParams, distortionParams, filterParams, reverbParams, bitcrusherParams } from "./stores";
import { get } from "svelte/store";


export function createDistortion(distAmount: number = 0.7, oversampling: "4x" | "2x" | "none" = "none", wet: number = 1): Tone.Distortion {
  const dist = new Tone.Distortion( {
    distortion: distAmount,
    oversample: oversampling,
    wet: wet
  });
  distortionParams.set({
    distortion: distAmount,
    oversample: oversampling,
    wet: wet})
  return dist;
}

export function createReverb(decay: number = 0.3, preDelay: number = 0.01, wet: number = 1): Tone.Reverb {
  const reverb = new Tone.Reverb({
    decay: decay,
    preDelay: preDelay,
    wet: wet
  });
  reverbParams.set({
    decay: decay,
    preDelay: preDelay,
    wet: wet
  })
  return reverb;
}

export function createBitCrusher(bits: number = 8, wet: number = 1): Tone.BitCrusher {
  const bitcrusher = new Tone.BitCrusher({
    bits: bits,
    wet: wet
  });
  bitcrusherParams.set({
    bits: bits,
    wet: wet
  });

  console.log(get(bitcrusherParams));
  return bitcrusher;
}

export function createFeedbackDelay(delayTime: Tone.Unit.Time = "4n", feedback: number = 0.5, wet: number = 1): Tone.FeedbackDelay {
 const delay = new Tone.FeedbackDelay({
    delayTime: delayTime,
    feedback: feedback,
    wet: wet
  });
  delayParams.set({
    delayTime: delayTime,
    feedback: feedback,
    wet: wet
  })
  console.log(get(delayParams))

  return delay;
}

export function createChorus(delayTime: number = 500, depth: number = 0.5, feedback: number = 0.5, frequency: number = 440, spread: number = 180, wet: number = 1): Tone.Chorus {
  const chorus = new Tone.Chorus({
    delayTime: delayTime,
    depth: depth,
    feedback: feedback,
    frequency: frequency,
    spread: spread,
    wet: wet
  });
  chorusParams.set({
    delayTime: delayTime,
    depth: depth,
    feedback: feedback,
    frequency: frequency,
    spread: spread,
    wet: wet
  })
  return chorus;
}

export function createFilter(cutoff: number = 440, resonance: number = 0, gain: number = 0, type: "highpass" | "lowpass" | "allpass"): Tone.Filter {
  const highpass = new Tone.Filter({
    Q: resonance,
    frequency: cutoff,
    gain: gain,
    type: type
  });
  filterParams.set({
    Q: resonance,
    frequency: cutoff,
    gain: gain,
    type: type
  })
  return highpass;
}

