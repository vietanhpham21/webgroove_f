  <script lang="ts">
    import * as Tone from "tone";
    import Slider from '$lib/components/UiComponentes/Slider.svelte';
    import Knob from '$lib/components/UiComponentes/Knob.svelte';
    import { gainDrumStore, panDrumStore, updateGainDrumStore, soloDrumStore, muteDrumStore, updateSoloDrumStore, updateMuteDrumStore, updatePanDrumStore } from '$lib/stores';

    const handleSolo = (index: number) => {
      updateSoloDrumStore(index, !($soloDrumStore[index]));
    }

    const handleMute = (index: number) => {
      updateMuteDrumStore(index, !($muteDrumStore[index]));
    }

    const handlePan = (event: any, index: number) => {
      updatePanDrumStore(index, event.detail.value);
    }

    const handleGain = (event: any, index: number) => {
      updateGainDrumStore(index, event.detail.value);
    }

    const handleResetGain = (event: any, index: number) => {
      updateGainDrumStore(index, event.detail.value);
    }

    const handleResetPan = (event: any, index: number) => {
      updatePanDrumStore(index, event.detail.value);
    }

    const mixerBuses = [
      { name: 'Kick', id_gain: 'kick-gain', id_pan: 'kick-pan'},
      { name: 'Snare', id_gain: 'snare-gain', id_pan: 'snare-pan'},
      { name: 'Clap', id_gain: 'clap-gain', id_pan: 'clap-pan'},
      { name: 'Hat', id_gain: 'hat-gain', id_pan: 'hat-pan'},
      { name: 'Perc 1', id_gain: 'perc1-gain', id_pan: 'perc1-pan'},
      { name: 'Perc 2', id_gain: 'perc2-gain', id_pan: 'perc2-pan'},
    ];

    function logInfo() {
      console.log("solo", $soloDrumStore)
      console.log("mute", $muteDrumStore)
    }
  </script>

<!-- <button on:click={logInfo}>print</button> -->

  <div class="mixer-container">
    {#each mixerBuses as bus, i}
      <div class="mixer-bus">
        <div class="button-container">
          <button class="{$soloDrumStore[i] ? 'solo-live' : ''}" on:click={() => handleSolo(i)}> S </button>
        </div>
        <div class="button-container">
          <button class="{$muteDrumStore[i] ? 'mute-live' : ''}" on:click={() => handleMute(i)}> M </button>
        </div>
        <div class="pan-knob">
          <Knob min={-1.0} max={1.0} resetVal={0.0} value={$panDrumStore[5 - i].pan.value} steps={0.1} size={40} id={bus.id_pan} polarity={"Bipolar"} on:change={(e) => handlePan(e, mixerBuses.length - 1 - i)} on:reset={(e) => handleResetPan(e, mixerBuses.length - 1 - i)}/>
        </div>
        <div class="gain-slider">
          <Slider min={0.0} max={1.0} resetVal={0.7} value={$gainDrumStore[5 - i].gain.value} steps={0.1} id={bus.id_gain} on:change={(e) => handleGain(e, mixerBuses.length - 1 - i)} on:reset={(e) => handleResetGain(e, mixerBuses.length - 1 - i)}/>
        </div>
        <p class="name"> {bus.name} </p>
      </div>
    {/each} 
  </div>


  <style>

    .mixer-container {
      margin-top: 50px;
      display: flex;
      justify-content: space-around;
      box-sizing: border-box;
      padding: 20px;
      background-color: #D8D8D8;
      border-radius: 20px;
    }

    .mixer-bus {
      border: 2px solid #ccc;
      border-radius: 10px;
      padding-top: 1em;
      padding-right: 4px;
      padding-left: 4px;
      border-top-left-radius: 25px;
      border-top-right-radius: 25px;
      box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.2); /* Hier wird der Schatten hinzugefügt */    }

    .gain-slider {
      background-color: #A8A8A8;
      padding: 10px;
      border-radius: 20px;
    }

    .pan-knob {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 10px;
    }


    .solo-live {
      color: #2BE127;
    }

    .name {
      color: #000000;
      justify-content: center;
      display: flex;
      border-top: 2px solid #ccc;
      padding-top: 20%;
    }

    .mute-live {
      color: #12B4E7;
    }

    .button-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
    }

    .button-container button {
      border-radius: 50%;
      border: none;
      min-width: 2em;
      min-height: 2em;

    }

  </style>
