  // @ts-nocheck
import {
  bpmStore, playStore, beatStore, gainDrumStore, panDrumStore,
  activeDrumStore, soloDrumStore, muteDrumStore, effectDrumStore,
  projectId, projectNameStore, projectIsPublic, rows, updateDrumState, loggedIn,
  description,
  projectOwner,
  readOnlyMode,
  effectSynthStore,
  synthAttack,
  synthVolumeStore,
  synthPitchStore,
  synthPanStore,
  synthDecay,
  synthSustain,
  synthRelease
} from "../../stores";
import * as Tone from "tone";


export async function resetProjectData() {    
  bpmStore.update(() => 120);
  playStore.update(() => false);
  beatStore.update(() => 0);
  gainDrumStore.update(() => Array.from({ length: 6 }, () => new Tone.Gain(0.7)));
  panDrumStore.update(() => Array.from({ length: 6 }, () => new Tone.Panner(0.0)));
  activeDrumStore.update(() => Array.from({ length: 6 }, () => Array.from({ length: 16 }, () => false)));
  soloDrumStore.update(() => Array.from({ length: 6 }, () => false));
  muteDrumStore.update(() => Array.from({ length: 6 }, () => false));
  effectDrumStore.update(() => []);
  effectDrumStore.set([]);
  effectSynthStore.set([]);
  
  synthVolumeStore.set(new Tone.Gain(0.7));
  synthPitchStore.set(new Tone.PitchShift(0.0));
  synthPanStore.set(new Tone.Panner(0.0));
  synthAttack.set(0.5);
  synthDecay.set(0.5);
  synthSustain.set(0.5);
  synthRelease.set(0.5);

  rows.update((rowsValue) => {
    return rowsValue.map((row) =>
      row.map((beat) => ({
        ...beat,
        active: false,
      })),
    );
  });

  projectId.set(-1)
  projectNameStore.set('');
  projectIsPublic.set(false);
  description.set('')
  

}

//schaut ob User sich schonmal eingeloggt hat und der jwt stimmt
export async function checkForLoginContext() {
  const jwtToken = localStorage.getItem('jwtToken');
  const userId = localStorage.getItem('userId');

  // Überprüfe, ob jwtToken und userId vorhanden sind
  if (!jwtToken && !userId) {
    console.error("Fehlende jwtToken oder userId im localStorage");
    loggedIn.update(() => false);
    return;
  }

  const url = `https://webgroove-82906d5c43b2.herokuapp.com/api/login/auth?userId=${userId}&jwtToken=${jwtToken}`;

  try {
    const response = await fetch(url, { method: "GET" });

    if (response.ok) {
      loggedIn.set(true);  
    } else {
      loggedIn.set(false);  
      localStorage.clear();
      console.error("Authentifizierung fehlgeschlagen:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Konnte Userdaten nicht authentifizieren:", error);
    loggedIn.update(() => false);
  }
}