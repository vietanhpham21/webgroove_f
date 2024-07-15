  // @ts-nocheck
import { writable, get, readable} from 'svelte/store';
import * as Tone from "tone";


export type FX = Tone.Effect | Tone.Component;

export const loggedIn = writable<boolean>(false)

export const bpmStore = writable<number>(120);
export const playStore = writable<boolean>(false);
export const beatStore = writable<number>(0);
export const gainDrumStore = writable<Tone.Gain[]>(Array.from({ length: 6}, () => new Tone.Gain(0.7)));
export const panDrumStore = writable<Tone.Panner[]>(Array.from({ length: 6}, () => new Tone.Panner(0.0)));
export const activeDrumStore = writable<boolean[][]>(Array.from({ length: 6 }, () => Array.from({ length: 16 }, () => false)));
export const soloDrumStore = writable<boolean[]>(Array.from({ length: 6 }, () => false));
export const muteDrumStore = writable<boolean[]>(Array.from({ length: 6 }, () => false));
export const effectDrumStore = writable<FX[]>([]); 
export const effectSynthStore = writable<FX[]>([]); 

export const synthVolumeStore = writable<Tone.Gain>(new Tone.Gain(0.7));
export const synthPitchStore = writable<Tone.PitchShift>(new Tone.PitchShift(0.0));
export const synthPanStore = writable<Tone.Panner>(new Tone.Panner(0.0));
export const synthAttack = writable<number>(0.5);
export const synthDecay = writable<number>(0.5);
export const synthSustain = writable<number>(0.5);
export const synthRelease = writable<number>(0.5);

export const projectId = writable<number>(-1);
export const projectNameStore = writable<string>('')
export const projectIsPublic = writable<boolean>(false);
export const projectIsImportable = writable<boolean>(false);
export const description = writable<string>('');
export const projectLikes = writable<number>(-1);
export const projectOwner = writable<string>('');
export const projectOwnerId = writable<string>(-1);
export const readOnlyMode = writable<boolean>(false);

export const seqPatternIdStore = writable<number>(-1)
export const seqPatternNameStore = writable<string>('')

export const drumPatternIdStore = writable<number>(-1)
export const drumPatternNameStore = writable<string>('')


export const wavetableIndexStore = writable<number>(0);
export const samplekitIndexStore = writable<number>(0);

export const isPreviewing = writable<boolean>(false);

export const fetchUrl = writable<string>('https://webgroove-82906d5c43b2.herokuapp.com/')
//Navbar

// export const showSaveProjectDialog = writable<boolean>(false);;
// export const showOpenProjectDialog = writable<boolean>(false);
// export const showLogoutDialog = writable<boolean>(false);
export const showNewProjectDialog = writable<boolean>(false);
export const showOpenProjectDialog = writable<boolean>(false);

export function serializeGains(gains) {
  return gains.map(gain => gain.gain.value); 
}

export function serializePans(panners) {
  return panners.map(panner => panner.pan.value); 
}




export function serializeEffects(effects: FX[]): any[] {
  return effects.map(effect => {
    switch (effect.constructor) {
      case Tone.Reverb:
        const reverb = effect as Tone.Reverb;
        return {
          type: '_Reverb',
          params: {
            decay: reverb.decay,
            preDelay: reverb.preDelay,
            wet: reverb.wet.value // Assuming wet is a Tone.Signal or similar
          }
        };
      case Tone.Distortion:
        const distortion = effect as Tone.Distortion;
        return {
          type: '_Distortion',
          params: {
            distortion: distortion.distortion,
            oversample: distortion.oversample,
            wet: distortion.wet.value // Assuming wet is a Tone.Signal or similar
          }
        };
      case Tone.Chorus:
        const chorus = effect as Tone.Chorus;
        return {
          type: '_Chorus',
          params: {
            delayTime: chorus.delayTime,
            depth: chorus.depth,
            feedback: chorus.feedback.value,
            frequency: chorus.frequency.value,
            spread: chorus.spread,
            wet: chorus.wet.value // Assuming wet is a Tone.Signal or similar
          }
        };
      case Tone.FeedbackDelay:
        const delay = effect as Tone.FeedbackDelay;
        return {
          type: '_Delay',
          params: {
            delayTime: delay.delayTime.toSeconds(),
            feedback: delay.feedback.value,
            wet: delay.wet.value // Assuming wet is a Tone.Signal or similar
          }
        };
      case Tone.Filter:
        const filter = effect as Tone.Filter;
        return {
          type: '_Filter',
          params: {
            Q: filter.Q.value, // Assuming Q is a Tone.Signal or similar
            frequency: filter.frequency.value, // Assuming frequency is a Tone.Signal or similar
            gain: filter.gain.value, // Assuming gain is a Tone.Signal or similar
            type: filter.type
          }
        };
      case Tone.BitCrusher:
        const bitcrusher = effect as Tone.BitCrusher;
        return {
          type: '_BitCrusher',
            params: {
              bits: bitcrusher.bits.value,
              wet: bitcrusher.wet.value
            }
        };
      default:
        throw new Error("Unknown effect type: ${effect.constructor.name}");
    }
  });
}

export function deserializeGains(gainValues: number[]): Tone.Gain[] {
  gainDrumStore.update(gains => {
    if (gains.length !== gainValues.length) {
      console.error('Fehler: Länge der Gain-Arrays stimmt nicht überein.');
      return gains;
    }
    gainValues.forEach((value, index) => {
      gains[index].gain.value = value;
    });
    return gains;
  });
}

export function deserializePans(panValues: number[]): Tone.Panner[] {
  panDrumStore.update(pans => {
    if (pans.length !== panValues.length) {
      console.error('Fehler: Länge der Gain-Arrays stimmt nicht überein.');
      return gains;
    }
    panValues.forEach((value, index) => {
      pans[index].pan.value = value;
    });
    return pans;
  });}

export function deserializeEffects(serializedEffects: any[]): FX[] {
  return serializedEffects.map(serializedEffect => {
    switch (serializedEffect.type) {
      case '_Reverb':
        reverbParams.set(serializedEffect.params)
        return new Tone.Reverb({reverbParams});
      case '_Distortion':
        distortionParams.set(serializedEffect.params)
        return new Tone.Distortion(distortionParams);
      case '_Chorus':
        chorusParams.set(serializedEffect.params)
        return new Tone.Chorus(chorusParams);
      case '_Delay':
        delayParams.set(serializedEffect.params)
        return new Tone.FeedbackDelay({
          delayTime: serializedEffect.params.delayTime,
          feedback: serializedEffect.params.feedback,
          wet: serializedEffect.params.wet
        });
      case '_Filter':
        filterParams.set(serializedEffect.params)
        return new Tone.Filter(filterParams);
      case '_BitCrusher':
        bitcrusherParams.set(serializedEffect.params)
        return new Tone.Bitcrusher(bitcrusherParams)
      default:
        throw new Error(`Unknown effect type: ${serializedEffect.type}`);
    }
  });
}
// Reverb Store
export const reverbParams = writable<{
  decay: number,
  preDelay: number,
  wet: number
}>({});


// Distortion Store
export const distortionParams = writable<{
  distortion: number,
  oversample: '4x' | '2x' | 'none',
  wet: number
}>({});

export const bitcrusherParams = writable<{
  bits: number,
    wet: number
}>({});


// Chorus Store
export const chorusParams = writable<{
  delayTime: number,
  depth: number,
  feedback: number,
  frequency: number,
  spread: number,
  wet: number
}>({});


// Delay Store
export const delayParams = writable<{
  delayTime: Tone.Unit.Time,
  feedback: number,
  wet: number
}>({});


// Filter Store
export const filterParams = writable<{
  Q: number,
  frequency: number,
  gain: number,
  type: 'lowpass' | 'highpass' | 'allpass'
}>({});



export function updateDrumState(rowIndex: number, columnIndex: number, value: boolean) {
  activeDrumStore.update(list => {
    const newlist = list.map(row => row.slice());
    newlist[rowIndex][columnIndex] = value;
    return newlist;
  })
}

export function updatePanDrumStore(index: number, value: number) {
  panDrumStore.update(panners => {
    if (panners[index]) {
      panners[index].pan.value = value;
    }
    return panners;
  });
}

export function updateMuteDrumStore(index: number, value: boolean) {
  muteDrumStore.update((mutes) => {
    mutes[index] = value;
    return mutes;
  });
}

export function updateGainDrumStore(index: number, value: number) {
  gainDrumStore.update(gains => {
    if (gains[index]) {
      gains[index].gain.value = value;
    }
    // console.log(gains[index].gain.value = value)
    return gains;
  });
}

export function updateSynthVolumeStore(value: number) {
  synthVolumeStore.update(vol => {
    vol.gain.value = value;
    return vol;
  });
}

export function updateSynthPitchStore(value: number) {
  synthPitchStore.update(pitch => {
    pitch.pitch = value;
    return pitch;
  });
}

export function updateSynthPanStore(value: number) {
  synthPanStore.update(pan => {
    pan.pan.value = value;
    return pan;
  });
}

export function updateSynthAdsr(adsr) {
  synthAttack.set(adsr.attack);
  synthDecay.set(adsr.decay);
  synthSustain.set(adsr.sustain);
  synthRelease.set(adsr.release);
}

export function updateSynthScale(scale){
  selectedNote.set(scale.selectedNote);
  selectedScale.set(scale.selectedScale);
  selectedOctave.set(scale.selectedOctave)
}

export function updateSoloDrumStore(index: number, value: boolean) {
  soloDrumStore.update(solos => {
    return solos.map((solo, i) => (i === index ? value : false));
  });
}

export function addDrumEffect(effect: Tone.Effect) {
  effectDrumStore.update((effectList) => {
    return [...effectList, effect];
  });
}


export function addSynthEffect(effect: Tone.Effect) {
  effectSynthStore.update((effectList) => {
    return [...effectList, effect];
  });
}

export function removeDrumEffect(index: number) {
  effectDrumStore.update((effectList) => {
    effectList[index].disconnect();
    effectList.splice(index, 1);
    return effectList;
  });
}

export function removeSynthEffect(index: number) {
  effectSynthStore.update((effectList) => {
    effectList[index].disconnect();
    effectList.splice(index, 1);
    return effectList;
  });
}

export function moveDrumEffectUp(index: number) {
  if (index > 0) {
    effectDrumStore.update((effectList) => {
      effectList[index].disconnect();
      effectList[index - 1].disconnect();
      let tmp = effectList[index];
      effectList[index] = effectList[index - 1];
      effectList[index - 1] = tmp;
      return effectList;
    });     
  }
}

export function moveSynthEffectUp(index: number) {
  if (index > 0) {
    effectSynthStore.update((effectList) => {
      effectList[index].disconnect();
      effectList[index - 1].disconnect();
      let tmp = effectList[index];
      effectList[index] = effectList[index - 1];
      effectList[index - 1] = tmp;
      return effectList;
    });     
  }
}

export function moveDrumEffectDown(index: number) {
  effectDrumStore.update((effectList) => {
    if (index < effectList.length - 1) {
      effectList[index].disconnect();
      effectList[index + 1].disconnect();
      let tmp = effectList[index];
      effectList[index] = effectList[index + 1];
      effectList[index + 1] = tmp;
    }
    return effectList;
  });
}

export function moveSynthEffectDown(index: number) {
  effectSynthStore.update((effectList) => {
    if (index < effectList.length - 1) {
      effectList[index].disconnect();
      effectList[index + 1].disconnect();
      let tmp = effectList[index];
      effectList[index] = effectList[index + 1];
      effectList[index + 1] = tmp;
    }
    return effectList;
  });
}

// SynthKomponente
// export const scaleOfNotes = ["D#5","D5","C#5","C5","B4","A#4","A4","G#4","G4","F#4","F4","E4","D#4","D4","C#4","C4",
// ];

// type Note = {
//     note: string;
//     active: boolean;
// };

// type Rows = Note[][];

// export const rows = writable<Rows>(
//   Array.from({ length: 16 }, (_, i) =>
//     Array.from({ length: 16 }, (_, j) => ({
//       note: scaleOfNotes[i],
//       active: false,
//     })),
//   ),
// );

// löschen aller Projekt relevanten Stores
export function resetProject() {
projectId.set(-1);
projectNameStore.set('');
projectIsPublic.set(false);
description.set('');
projectLikes.set(-1)
seqPatternIdStore.set(-1)
drumPatternIdStore.set(-1)
}

// Definieren der noteMaps für jede Root-Note
const noteMap = {
  'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
};

const noteMapReverse = Object.keys(noteMap).reduce((obj, key) => {
  obj[noteMap[key]] = key;
  return obj;
}, {});

export function getScale(type, rootNote, octave) {
  const rootNoteValue = noteMap[rootNote];
  let intervals;
  let currentOctave = parseInt(octave, 10);

  switch(type) {
    case 'major':
      intervals = [0, 2, 4, 5, 7, 9, 11];
      break;
    case 'minor':
      intervals = [0, 2, 3, 5, 7, 8, 10];
      break;
    case 'harmonicMinor':
      intervals = [0, 2, 3, 5, 7, 8, 11];
      break;
    case 'melodicMinor':
      intervals = [0, 2, 3, 5, 7, 9, 11];
      break;
    case 'blues':
      intervals = [0, 3, 5, 6, 7, 10];
      break;
    case 'chromatic':
      intervals = Array.from({length: 12}, (_, i) => i);
      break;
    case 'wholeTone':
      intervals = [0, 2, 4, 6, 8, 10];
      break;
    case 'dorian':
      intervals = [0, 2, 3, 5, 7, 9, 10];
      break;
    case 'phrygian':
      intervals = [0, 1, 3, 5, 7, 8, 10];
      break;
    case 'lydian':
      intervals = [0, 2, 4, 6, 7, 9, 11];
      break;
    case 'mixolydian':
      intervals = [0, 2, 4, 5, 7, 9, 10];
      break;
    case 'locrian':
      intervals = [0, 1, 3, 5, 6, 8, 10];
      break;
    case 'pentatonic':
      intervals = [0, 2, 4, 7, 9];
      break;
    default:
      intervals = [0, 2, 4, 5, 7, 9, 11];
  }

  let scale = [];
  let lastNoteValue = rootNoteValue;
  
  for (let i = 0; i < 16; i++) {
    const interval = intervals[i % intervals.length];
    const noteValue = (rootNoteValue + interval) % 12;
    
    if (noteValue < lastNoteValue) {
      currentOctave++;
    }

    const note = noteMapReverse[noteValue];
    scale.push(note + currentOctave);
    
    lastNoteValue = noteValue;
  }

  return scale;
}


export let selectedNote = writable<string>('C');
export let selectedScale = writable<string>('major');
export let selectedOctave = writable<string>('4');

// Initialisiere die Skala und Noten
export const scaleOfNotes = writable(getScale('major', 'C', '4'));

export const rows = writable(
  Array.from({ length: 16 }, (_, i) =>
    Array.from({ length: 16 }, (_, j) => ({
      note: get(scaleOfNotes)[i % get(scaleOfNotes).length],
      active: false,
    })),
  ),
);

// Funktion zum Aktualisieren der Skala und Noten basierend auf ausgewählter Note, Skala und Oktave
export function updateScale(selectedNote, selectedScale, selectedOctave) {
  const newScale = getScale(selectedScale, selectedNote, selectedOctave);
  const currentRows = get(rows);

  const updatedRows = currentRows.map((row, i) =>
    row.map((cell, j) => ({
      note: newScale[i % newScale.length],
      active: cell.active,  // Behalte den aktiven Zustand bei
    }))
  );

  scaleOfNotes.set(newScale);
  rows.set(updatedRows);
}


// Funktionen um Base64 Strings korrekt für img element in HTML zu formartieren

export function formatBase64Image(base64String: string): string {
  // Bestimmen des MIME-Typs basierend auf dem Dateikopf
  let mimeType = getMimeType(base64String);
  if (mimeType) {
      return `data:${mimeType};base64,${base64String}`;
  } else {
      console.error('Unbekanntes Bildformat');
      return ''; // Rückgabe eines leeren Strings oder einer Standardbild-URL
  }
}

export function getMimeType(base64String: string): string {
  let header = base64String.slice(0, 30); // Lesen der ersten 30 Zeichen
  if (header.startsWith('/9j/')) {
      return 'image/jpeg';
  } else if (header.startsWith('iVBORw0KGgo=')) {
      return 'image/png';
  } else if (header.startsWith('R0lGODlhAQABAPAA')) {
      return 'image/gif';
  } else if (header.startsWith('<?xml')) {
      return 'image/svg+xml';
  } else if (header.startsWith('UklGR')) {
      return 'image/webp';
  }
  return ''; // Rückgabe eines leeren Strings für unbekannte Formate
}

