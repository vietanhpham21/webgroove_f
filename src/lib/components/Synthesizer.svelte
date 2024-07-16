<script lang="ts">
  // @ts-nocheck
  import BpmAnzeiger from "./BpmAnzeiger.svelte";
  import AdsrControl from "./AdsrControl.svelte";
  import Knob from "./UiComponentes/Knob.svelte";
  import { playStore, bpmStore, projectNameStore, projectIsPublic, projectId, drumPatternNameStore, synthVolumeStore, updateSynthVolumeStore, synthPanStore, updateSynthPanStore, synthPitchStore, updateSynthPitchStore, seqPatternIdStore, drumPatternIdStore, showNewProjectDialog, effectSynthStore, addSynthEffect, removeSynthEffect, moveSynthEffectUp, moveSynthEffectDown, wavetableIndexStore, loggedIn, projectIsImportable, readOnlyMode, projectOwnerId, projectOwner } from "$lib/stores";
  import { wavetables } from "$lib/wavetables.ts";
  import * as Tone from "tone";
  import { beatStore, rows } from "$lib/stores";
  import EffectList from "$lib/components/EffectList.svelte";
  import WaveDisplay from "$lib/components/WaveDisplay.svelte";
  import NavBar from "./Navbar/NavBar.svelte";
  import { onMount, onDestroy } from "svelte";
  import { checkForLoginContext } from "$lib/components/Navbar/NavbarLogic";
  import { get } from 'svelte/store';
    import ProjectInfo from "./ProjectInfo.svelte";
    import ScaleComponent from "./ScaleComponent.svelte";
  
    onMount(() => {
        checkForLoginContext();
        if ($loggedIn) {
        switch (true) {
            case $projectNameStore == '': 
                showNewProjectDialog.set(true)
            case $projectNameStore == '' && !$readOnlyMode:
                showNewProjectDialog.set(true);
                break;
            case $readOnlyMode:
                showNewProjectDialog.set(false);
                break;
            case !$readOnlyMode:
                showNewProjectDialog.set(false);
                break;
        }
    }
    });

  let beatcount = 0;
  let timeSignature = "16n";
  let isPlaying = $playStore;

  // ADSR
  let attackValue = 1;
  let decayValue = 1;
  let sustainValue = 1;
  let releaseValue = 1;

// make this somehow reactive


  let synths = [];


  wavetableIndexStore.subscribe((index: number) => {
    synths = Array.from({length: 16}, () => new Tone.Synth({
        oscillator: {
          type: 'custom',
          partials: wavetables[index]
        }
      })
    );

    synths.forEach((synth, index) => {
      synth.disconnect();
      const vol = get(synthVolumeStore);
      const pitch = get(synthPitchStore);
      const pan = get(synthPanStore);

      synth.chain(
        vol,
        pan,
        pitch,
        Tone.Destination
      );
    });

  })

 
    

  let beatIndicator = Array.from({ length: 16 }, (_, i) => i);


  effectSynthStore.subscribe(effectList => {  
    synths.forEach((synth, index) => {
      synth.disconnect();
      const vol = get(synthVolumeStore);
      const pitch = get(synthPitchStore);
      const pan = get(synthPanStore);

      synth.chain(
        vol,
        pan,
        pitch,
        ...effectList,
        Tone.Destination
      );
    });
  });

  // Alle 16tel Schritte, gehe durch die Arrays und schaue, ob note.active
  // der zugewiesene Synthesizer spielt dann den Ton ab
  // der aktuelle Beat wird um 1 inkrementiert und alle 16 Schritte zurückgesetzt
  Tone.Transport.scheduleRepeat((time) => {
    $rows.forEach((row, index) => {
      let synth = synths[index];
      let note = row[$beatStore];
      // console.log("synth: ", beatcount)
      // hier wird der Envelope(ADSR) kontrolliert
      synth.set({
        envelope: {
          attack: attackValue,
          decay: decayValue,
          sustain: sustainValue,
          release: releaseValue,
        },
      });
      if (note.active)
        synth.triggerAttackRelease(note.note, timeSignature, time);
    });
    // beatcount = (beatcount + 1) % 16;
  }, timeSignature);

  // Mouse click und drag events
  let isDragging = false;
  let lastClickedRowIndex = -1;
  let lastClickedNoteIndex = -1;
  let initialActiveState = false; 

  // Funktion zum ändern des zustands des Buttons
  const handleNoteClick = (rowIndex, noteIndex) => {
    $rows[rowIndex][noteIndex].active = !$rows[rowIndex][noteIndex].active;
  };

  // Funktion zum draggen und ändern des zustands
  const handleStartDrag = (rowIndex, noteIndex) => {
    isDragging = true;
    lastClickedRowIndex = rowIndex;
    lastClickedNoteIndex = noteIndex;
    initialActiveState = $rows[rowIndex][noteIndex].active; 
    handleNoteClick(rowIndex, noteIndex); 
  };

  // Funktion zum handeln von mouseover events während des draggen
  const handleDragOver = (rowIndex, noteIndex) => {
    if (isDragging) {
      // Ensure it only toggles between active or inactive based on initial state
      if (initialActiveState === $rows[rowIndex][noteIndex].active) {
        handleNoteClick(rowIndex, noteIndex);
      }
      lastClickedRowIndex = rowIndex;
      lastClickedNoteIndex = noteIndex;
    }
  };

  const handleStopDrag = () => {
    isDragging = false;
  };


  // Event listener to stop dragging on mouseup anywhere on the document
  document.addEventListener('mouseup', handleStopDrag);

  // Starten der Sequenz
  const handlePlayClick = () => {
    // console.log($rows);
    Tone.Transport.bpm.value = $bpmStore;
    Tone.start() 
    Tone.Transport.start();
    playStore.set(true);
  };

  // Stoppen der Sequenz
  const handleStopClick = () => {
    Tone.Transport.stop();
    playStore.set(false);
  };

  const handleClearClick = () => {
    // beatStore.update(() => 0);
    rows.update((rowsValue) => {
      return rowsValue.map((row) =>
        row.map((beat) => ({
          ...beat,
          active: false,
        })),
      );
    });
  };

  //isPlaying = false;
  //Tone.Transport.stop();
  //$beatStore = 0;

  function handleEnvelopeChange(event) {
    if (event.detail.attack) {
      attackValue = event.detail.attack;
    }
    if (event.detail.decay) {
      decayValue = event.detail.decay;
    }
    if (event.detail.sustain) {
      sustainValue = event.detail.sustain;
    }
    if (event.detail.release) {
      releaseValue = event.detail.release;
    }

    // console.log({
    //   attack: attackValue,
    //   decay: decayValue,
    //   sustain: sustainValue,
    //   release: releaseValue,
    // });
  }

  const handleVolume = (event: any) => {
    updateSynthVolumeStore(event.detail.value);
  }

  const handlePitch = (event: any) => {
    updateSynthPitchStore(event.detail.value);
  }

  const handlePan = (event: any) => {
    updateSynthPanStore(event.detail.value);
  }

  // macht ein Ändern der BPM, während die Sequenz abgespielt wird, möglich
  $: if ($playStore) {
    Tone.Transport.bpm.value = $bpmStore;
    // console.log($bpmStore);
  }

  onDestroy(() => {
    // synths.map(synth => {
    //   synth.disconnect();
    //   synth.dispose();
    // });
    Tone.Transport.cancel();
    Tone.Transport.stop();
  });

function printInfo(){
  console.log($synthPitchStore.pitch)
}
</script>

<NavBar></NavBar>
<div class="container">
  <div class="control adsr-control">
    <AdsrControl on:envChange={handleEnvelopeChange} />
  </div>
  <div class="control scale-control"><ScaleComponent/></div>
  <div class="control logo-control"> 
    <ProjectInfo/>
  </div>

  <div class="control waveform-control">
    <WaveDisplay/>
  </div>

      <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="control synth-control">

    <div class="synth-c">
    <div class="vol-control">
      <Knob id={"vol-synth"} size={80} min={0.0} max={1.0} steps={0.1} resetVal={0.7} value={$synthVolumeStore.gain.value} polarity={"Unipolar"} on:change={handleVolume} on:reset={handleVolume}/>
      <label> Vol </label>
    </div>
    <div class="vol-control">
      <Knob id="pitch-synth" size={80} min={-1.0} max={1.0} steps={0.05} value={$synthPitchStore.pitch} polarity={"Bipolar"} on:change={handlePitch} on:reset={handlePitch}/>
      <label> Pitch </label>
    </div>
    <div class="vol-control">
      <Knob id="pan-synth" size={80} min={-1.0} max={1.0} steps={0.1} value={$synthPanStore.pan.value} polarity={"Bipolar"} on:change={handlePan} on:reset={handlePan}/>
      <label> Pan </label>
    </div>
  </div>
  </div>

  <div class="control effects-control"> 
    <EffectList moveEffectUpProp={moveSynthEffectUp}
                moveEffectDownProp={moveSynthEffectDown} 
                removeEffectProp={removeSynthEffect} 
                addEffectProp={addSynthEffect} 
                effects={effectSynthStore} />

  </div>
  <div id="Synth">
    <!-- <p>is importable: {$projectIsImportable}</p>
    <p>is public: {$projectIsPublic}</p> -->

    <div id="Komponente">
      <!-- <div class="timesignature">
      <div><label for="time">Steps: 4n/8n/16n/32n/64n...</label></div>
      <input id="time" bind:value={timeSignature} />
    </div> -->

      <!--
    Zeigt aktuelle Position des Beats an
  -->
      <div class="indicator">
        {#each beatIndicator as beatIndicator, c}
          <div
            class="beat-indicator {c === $beatStore - 1 ? 'live' : ''}"
          ></div>
        {/each}
      </div>

      <!--
    Erstelle für jede Note in row einen eigenen Button
    alle 4 Schritte wird der anfang eines neuen bars deklariert
  -->
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
      <div class="sequencer">
        {#each $rows as row, i}
          {#each row as beat, j}
            <button
            on:mousedown={() => handleStartDrag(i, j)}
            on:mouseover={() => handleDragOver(i, j)}
              class="note {beat.active ? 'active' : ''} {j % 4 === 0
                ? 'first-beat-of-bar'
                : ''} {j === $beatStore - 1 ? 'current' : ''}"
            >
              {#if j === 0}
                {beat.note}
              {/if}</button
            >
          {/each}
        {/each}
      </div>
      <div class="bpm-control">
        <button class="play" on:click={handlePlayClick}
          ><img src="/Icons/Play.svg" alt="Play" /></button
        >
        <button class="stop" on:click={handleStopClick}
          ><img src="/Icons/Stop.svg" alt="Stop" /></button
        >
        <button class="clear" on:click={handleClearClick}>CLEAR</button>
      </div>
    </div>
  </div>
</div>

<style>
  .control {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 1em 0 1em;
    min-height: 100%;
    background: #595959;
    border-radius: 10px;
    box-shadow: 2px 8px 4px rgba(20, 0, 0, 0.5);
  }

  .adsr-control {
    grid-column: 1;
    grid-row: 1/2;
    max-height: 50%;
  }

  .scale-control {
    grid-column: 1;
    grid-row: 2;
    background: none;
    box-shadow: none;
  }

  .logo-control {
    grid-column: 1;
    grid-row: 3;
    align-items: start;
  }

  .waveform-control {
    grid-column: 3;
    grid-row: 1;
  }

  .vol-control {
    color: #2BE127;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* margin-right: 50px; */
  }

  .synth-c {
    display: flex;
    justify-content: center;
    flex-flow: row nowrap;
    gap: 50px
  }

  .synth-control {
    grid-column: 3;
    grid-row: 2;
    background: none;
    box-shadow: none;
  }

  .effects-control {
    grid-column: 3 / 4;
    grid-row: 3;
    align-items: start;
  }
  .container {
    margin-top: 8em;
    margin-bottom: 9em;
    display: grid;
    grid-template-columns: 1fr minmax(0, 800px) 1fr; /* Linke und rechte Spalte kleiner, mittlere Spalte größer */
    grid-template-rows: 320px 100px 320px;
    gap: 1em;
    /* height: 100vh; */
    align-items: center;
  }

  #Synth {
    padding-top: 5rem;
    grid-column: 2/3;
    grid-row: 2;
  }
  .sequencer {
    font-size: 16px;
    display: grid;
    grid-template-columns: repeat(16, 1fr);
    gap: 5px;
    width: 100%;
  }
  .note {
    background: #ccc;
    font-size: 10px !important;
    width: 4em;
    height: 4em;
    border: 1px solid #ccc;
    border-radius: 7px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    padding: 0;
    box-sizing: border-box;
  }

  .note:hover {
    opacity: 0.8;
    cursor: pointer;
  }

  .note.active {
    background: #2be127;
    border: 1px solid #2be127;
  }

  .first-beat-of-bar {
    background: #929292;
    border: 1px solid #ccc;
  }

  .bpm-control {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .bpm-control button {
    background-color: #535353; /* Green background */
    border: 1px solid rgb(43, 43, 43); /* Green border */
    color: white; /* White text */
    padding: 17px 30px; /* Some padding */
    cursor: pointer; /* Pointer/hand icon */
    float: left; /* Float the buttons side by side */
    font-family: "Inter", sans-serif;
  }

  .bpm-control .clear {
    background-color: #ce0505; /* Green background */
  }

  .bpm-control button:not(:last-child) {
    border-right: none; /* Prevent double borders */
  }

  /* Clear floats (clearfix hack) */
  .bpm-control:after {
    content: "";
    clear: both;
    display: table;
  }

  .bpm-control button:hover {
    background-color: #6d6d6d;
  }

  .bpm-control .clear:hover {
    background-color: #f04545;
  }

  .bpm-control button.play {
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
}

.bpm-control button.clear {
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
}


  .indicator {
    font-size: 16px;
    display: grid;
    grid-template-columns: repeat(16, 1fr);
    place-items: center;
    width: 100%;
  }
  .beat-indicator {
    background: #ccc;
    font-size: 10px !important;
    width: 1.5em;
    height: 1.5em;
    border: 1px solid #ccc;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    margin: 0.5em;
  }

  .live {
    background: #2be127;
  }

  .current {
    border: 3px solid rgb(51, 255, 0);
  }

  #Synth {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #272727;
    margin: 0;
    /* display: grid; */
    /* place-items: center; */
    min-width: 320px;
    min-height: 100vh;
  }

  #Komponente {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
</style>
