<script>
  import { getScale, selectedNote, selectedOctave, selectedScale, updateScale } from "$lib/stores";
  import { onMount } from "svelte";
  import { get } from 'svelte/store';


  onMount(() => {
    updateScale($selectedNote, $selectedScale, $selectedOctave);
  });

  function handleUpdate() {
    updateScale($selectedNote, $selectedScale, $selectedOctave);
  }

  function increaseOctave() {
    selectedOctave.set((parseInt($selectedOctave, 10) + 1).toString());
    updateScale($selectedNote, $selectedScale, $selectedOctave);
  }

  function decreaseOctave() {
    selectedOctave.set((parseInt($selectedOctave, 10) - 1).toString());
    updateScale($selectedNote, $selectedScale, $selectedOctave);
  }

  // function printOctaves() {
  //   ['major', 'minor', 'pentatonic', 'harmonicMinor', 'melodicMinor', 'blues', 'chromatic', 'wholeTone', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'].forEach(type => {
  //     console.log(`\n${type.toUpperCase()} Scales:`);
  //     ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].forEach(rootNote => {
  //       for (let octave = 1; octave <= 6; octave++) {
  //         const scale = getScale(type, rootNote, octave);
  //         console.log(`${rootNote}${octave}: ${scale}`);
  //       }
  //     });
  //   });
  // }
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<div class="body">
  <div class="container">
    <!-- <button on:click={printOctaves}>Print Octaves</button> -->
    <label for="note-select">Note:</label>
    <select id="note-select" bind:value="{$selectedNote}" on:change="{handleUpdate}">
      <option value="C">C</option>
      <option value="C#">C#</option>
      <option value="D">D</option>
      <option value="D#">D#</option>
      <option value="E">E</option>
      <option value="F">F</option>
      <option value="F#">F#</option>
      <option value="G">G</option>
      <option value="G#">G#</option>
      <option value="A">A</option>
      <option value="A#">A#</option>
      <option value="B">B</option>
    </select>

    <label for="scale-select">Scale:</label>
    <select id="scale-select" bind:value="{$selectedScale}" on:change="{handleUpdate}">
      <option value="major">Major</option>
      <option value="minor">Minor</option>
      <option value="pentatonic">Pentatonic</option>
      <option value="harmonicMinor">Harmonic Minor</option>
      <option value="melodicMinor">Melodic Minor</option>
      <option value="blues">Blues</option>
      <option value="chromatic">Chromatic</option>
      <option value="wholeTone">Whole Tone</option>
      <option value="dorian">Dorian</option>
      <option value="phrygian">Phrygian</option>
      <option value="lydian">Lydian</option>
      <option value="mixolydian">Mixolydian</option>
      <option value="locrian">Locrian</option>
    </select>

    <div class="octave-control">
      <p>Octave:</p>
      <span>{$selectedOctave}</span>

      <button on:click="{increaseOctave}" aria-label="Increase Octave">
        <i class="fa fa-caret-up"></i>
      </button>
      <button on:click="{decreaseOctave}" aria-label="Decrease Octave">
        <i class="fa fa-caret-down"></i>
      </button>
    </div>
  </div>
</div>

<style>
  .body {
    font-family: Arial, sans-serif;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    margin: 0;
  }
  .container {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
  label {
    margin-right: 10px;
    font-weight: bold;
  }
  select {
    margin-right: 20px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 14px;
  }
  .octave-control {
    display: flex;
    align-items: center;
  }
  button {
    padding: 8px;
    border: none;
    background: #535353;
    color: white;
    cursor: pointer;
    border-radius: 3px;
    margin-left: 10px;
    transition: background 0.3s ease;
  }
  button:hover {
      background-color: #6d6d6d;
  }
  button:focus {
    outline: none;
  }
  i.fa {
    font-size: 1.5em;
  }
  span {
    margin: 0 10px;
    font-weight: bold;
    font-size: 16px;
  }
</style>
