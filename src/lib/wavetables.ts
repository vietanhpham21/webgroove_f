import * as Tone from "tone";

const generateFMWavetable = (carrierFreq: number, modFreq: number, modIndex: number, sampleRate: number, lenght: number) : number[] => {
  let wavetable = [];
  const twoPi = Math.PI * 2;

  for (let i = 0; i < lenght; i++) {
    const time = i / sampleRate;
    const modulator = Math.sin(twoPi * modFreq * time) * modIndex;
    wavetable.push(Math.sin(twoPi * carrierFreq * time + modulator));
  }
  return wavetable;
}

const generateSawtooth = (length: number ) : number[] => {
  let wavetable = [];
  for (let i = 1; i <= length; i++) {
    wavetable.push(1 / i);
  }
  return wavetable;
}

const generateSquarewave = (length: number) : number[] => {
  let wavetable = [];
  for (let i = 1; i <= length; i++) {
    wavetable.push(i % 2 === 1 ? 1 / i : 0);
  }
  return wavetable;
}

const generateSinewave = () : number[] => {
  let wavetable = [];
  wavetable.push(1);
  return wavetable;
}

const generateTriwave = (length: number) : number[] => {
  let wavetable = [];
  for (let i = 1; i <= length; i++) {
    if (i % 2 === 1) {
      wavetable.push((i % 4 === 1 ? 1 : -1) / Math.pow(i, 2));
    } else {
      wavetable.push(0);
    }
  }
  return wavetable;
}

const sawtoothwave = generateSawtooth(20);
const fmwave = generateFMWavetable(440, 220, 5, 44100, 1024);
const squarewave = generateSquarewave(20);
const sinewave = generateSinewave();
const triwave = generateTriwave(20);


export const wavetables = [
  sawtoothwave,
  squarewave,
  sinewave,
  triwave,
];
