<script lang="ts">
  import { effectDrumStore, addDrumEffect } from '$lib/stores';
  import type { FX } from '$lib/stores';
  import * as Tone from "tone";
  import { createReverb, createChorus, createFeedbackDelay, createDistortion, createFilter, createBitCrusher } from '$lib/effects';
  
  export let showModal: boolean;
  export let addEffectProp: (effect: FX) => void;

  let activeStep: "Reverb" | "Distortion" | "Chorus" | "Delay" | "Filter" | "Bitcrusher" |  null = null;
  let selectedEffect: string | null = null;
  
  let distortion_amount: number = 0.5;
  let distortion_oversampling: '4x' | '2x' | 'none' = 'none';
  let distortion_wet: number = 0.5;

  let reverb_decay: number = 0.5;
  let reverb_predelay: number = 0.1;
  let reverb_wet: number = 0.5;

  let chorus_delaytime: number = 100;
  let chorus_depth: number = 0.5;
  let chorus_feedback: number = 0.5;
  let chorus_frequency: number = 440;
  let chorus_spread: number = 180;
  let chorus_wet: number = 0.5;

  let delay_delaytime = "4n";
  let delay_feedback: number = 0.5;
  let delay_wet: number = 0.5;

  let filter_cutoff: number = 440;
  let filter_resonance: number = 0;
  let filter_gain: number = 0;
  let filter_type: "lowpass" | "highpass" | "allpass";

  let bitcrusher_bits: number = 8;
  let bitcrusher_wet: number = 0.5;

  let dialog: HTMLDialogElement | null;

  $: if (dialog && showModal) dialog.showModal();

  const addEffect = (effectName: String) => {
    if ($effectDrumStore.length >= 5) {
      return;
    }

    if (effectName === "Reverb") {
      let reverb: Tone.Reverb = createReverb(reverb_decay, reverb_predelay, reverb_wet);
      addEffectProp(reverb);
    } else if (effectName === "Distortion") {
      let distortion: Tone.Distortion = createDistortion(distortion_amount, distortion_oversampling, distortion_wet);
      addEffectProp(distortion);
    } else if (effectName === "Delay") {
      let delay: Tone.FeedbackDelay = createFeedbackDelay(delay_delaytime, delay_feedback, delay_wet);
      addEffectProp(delay);
    } else if (effectName === "Chorus") {
      let chorus: Tone.Chorus = createChorus(chorus_delaytime, chorus_depth, chorus_feedback, chorus_frequency, chorus_spread, chorus_wet);
      addEffectProp(chorus);
    } else if (effectName === "Filter") {
      let filter: Tone.Filter = createFilter(filter_cutoff, filter_resonance, filter_gain, filter_type);
      addEffectProp(filter);
    } else if (effectName === "Bitcrusher") {
      let bitcrusher: Tone.BitCrusher = createBitCrusher(bitcrusher_bits, bitcrusher_wet);
      addEffectProp(bitcrusher);
    }
  };

  const handleEffectClick = (effect: string) => {
    selectedEffect = effect;
  };

  const handleStep = () => {
    activeStep = selectedEffect as "Reverb" | "Distortion" | "Chorus" | "Delay" | "Filter" | "Bitcrusher";
  };

  const handleBack = () => {
    activeStep = null;
    selectedEffect = null;
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    addEffect(activeStep);
    activeStep = null;
    selectedEffect = null;
    dialog?.close();
  };
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<dialog bind:this={dialog} on:close={() => (showModal = false)} >
  <form on:submit={handleSubmit}>
    {#if !activeStep}
  
      <fieldset>
        <legend>Choose Effect</legend>
        <div class="effect-card {selectedEffect === 'Reverb' ? 'selected' : ''}" on:click={() => handleEffectClick('Reverb')}>
          Reverb
        </div>
        <div class="effect-card {selectedEffect === 'Chorus' ? 'selected' : ''}" on:click={() => handleEffectClick('Chorus')}>
          Chorus
        </div>
        <div class="effect-card {selectedEffect === 'Delay' ? 'selected' : ''}" on:click={() => handleEffectClick('Delay')}>
          Delay
        </div>
        <div class="effect-card {selectedEffect === 'Distortion' ? 'selected' : ''}" on:click={() => handleEffectClick('Distortion')}>
          Distortion
        </div>
        <div class="effect-card {selectedEffect === 'Filter' ? 'selected' : ''}" on:click={() => handleEffectClick('Filter')}>
          Filter
        </div>
        <div class="effect-card {selectedEffect === 'Bitcrusher' ? 'selected' : ''}" on:click={() => handleEffectClick('Bitcrusher')}>
          Bitcrusher
        </div>
      </fieldset>
      <button type="button" on:click={handleStep} disabled={!selectedEffect}>Next</button>

    {:else if activeStep === "Reverb"}
      <fieldset>
        <legend>Reverb Parameters</legend>
        <label>
          Decay
          <input type="number" name="reverb-decay" max="60" min="0" step="0.1" bind:value={reverb_decay} />
        </label>
        <label>
          Predelay
          <input type="number" name="reverb-predelay" max="10" min="0" step="0.1" bind:value={reverb_predelay} />
        </label>
        <label>
          Wet
          <input type="number" name="reverb-wet" max="1" min="0" step="0.1" bind:value={reverb_wet} />
        </label>
      </fieldset>
      <div class="navigate-buttons">
        <button type="button" on:click={handleBack} disabled={!activeStep}>Back</button>
        <button type="submit">Submit</button>
      </div>    {:else if activeStep === "Distortion"}
      <fieldset>
        <legend>Distortion Parameters</legend>
        <label>
          Amount
          <input type="number" name="distortion-amount" max="1" min="0" step="0.1" bind:value={distortion_amount} />
        </label>
        <label>
          Oversampling
          <select name="distortion-oversampling" bind:value={distortion_oversampling}>
            <option value="none">none</option>
            <option value="2x">2x</option>
            <option value="4x">4x</option>
          </select>
        </label>
        <label>
          Wet
          <input type="number" name="distortion-wet" min="0" max="1" step="0.1" bind:value={distortion_wet} />
        </label>
      </fieldset>
      <div class="navigate-buttons">
        <button type="button" on:click={handleBack} disabled={!activeStep}>Back</button>
        <button type="submit">Submit</button>
      </div>    {:else if activeStep === "Delay"}
      <fieldset>
        <legend>Delay Parameters</legend>
        <label>
          Delay
          <input type="text" name="delay-delaytime" bind:value={delay_delaytime} />
        </label>
        <label>
          Feedback
          <input type="number" name="delay-feedback" min="0" max="1" step="0.1" bind:value={delay_feedback} />
        </label>
        <label>
          Wet
          <input type="number" name="delay-wet" min="0" max="1" step="0.1" bind:value={delay_wet} />
        </label>
      </fieldset>
      <div class="navigate-buttons">
        <button type="button" on:click={handleBack} disabled={!activeStep}>Back</button>
        <button type="submit">Submit</button>
      </div>    {:else if activeStep === "Chorus"}
      <fieldset>
        <legend>Chorus Parameters</legend>
        <label>
          Delay
          <input type="number" name="chorus-delaytime" min="0" max="1000" step="1" bind:value={chorus_delaytime} />
        </label>
        <label>
          Depth
          <input type="number" name="chorus-depth" min="0" max="1" step="0.1" bind:value={chorus_depth} />
        </label>
        <label>
          Feedback
          <input type="number" name="chorus-feedback" min="0" max="1" step="0.1" bind:value={chorus_feedback} />
        </label>
        <label>
          Frequency
          <input type="number" name="chorus-frequency" min="20" max="20000" step="1" bind:value={chorus_frequency} />
        </label>
        <label>
          Spread
          <input type="number" name="chorus-spread" min="0" max="360" step="1" bind:value={chorus_spread} />
        </label>
        <label>
          Wet
          <input type="number" name="chorus-wet" min="0" max="1" step="0.1" bind:value={chorus_wet} />
        </label>
      </fieldset>
      <div class="navigate-buttons">
        <button type="button" on:click={handleBack} disabled={!activeStep}>Back</button>
        <button type="submit">Submit</button>
      </div>    {:else if activeStep === "Filter"}
      <fieldset>
        <legend>Filter Parameters</legend>
        <label>
          Cutoff
          <input type="number" name="filter-cutoff" min="20" max="20000" step="1" bind:value={filter_cutoff} />
        </label>
        <label>
          Q
          <input type="number" name="filter-resonance" min="0" max="5" step="0.1" bind:value={filter_resonance} />
        </label>
        <label>
          Gain
          <input type="number" name="filter-gain" min="0" max="5" step="0.1" bind:value={filter_gain} />
        </label>
        <label>
          Type
          <select name="filter-type" bind:value={filter_type}>
            <option value="lowpass">Lowpass</option>
            <option value="highpass">Highpass</option>
            <option value="allpass">Allpass</option>
          </select>
        </label> 
      </fieldset>
      <div class="navigate-buttons">
        <button type="button" on:click={handleBack} disabled={!activeStep}>Back</button>
        <button type="submit">Submit</button>
      </div> {:else if activeStep === "Bitcrusher"}
      <fieldset>
        <legend>Bitcrusher Parameters </legend>
        <label>
          Bits 
          <input type="number" name="bitcrusher-bits" min="1" max="16" step="1" bind:value={bitcrusher_bits} />
        </label>
        <label>
          Wet 
          <input type="number" name="bitcrusher-wet" min="0" max="1" step="0.1" bind:value={bitcrusher_wet} />
        </label>
      </fieldset>
      <div class="navigate-buttons">
        <button type="button" on:click={handleBack} disabled={!activeStep}>Back</button>
        <button type="submit">Submit</button>
      </div>
    {/if}
  </form>

</dialog>

<style>
.navigate-buttons {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}

fieldset {
  display: flex;
  flex-flow: row wrap;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 1rem;
}

label {
  margin-bottom: 0.5rem;
  flex: 1 1 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

input[type="number"], input[type="text"], select {
  width: calc(100% - 8px); /* Adjust width to fit within label */
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Ensure padding is included in width */
  font-size: 14px; /* Adjust font size as needed */
}

select {
  appearance: none;
  width:60%;
  cursor: pointer; /* Show pointer cursor on hover */
  background-color: #fff;
}

dialog {
  padding: 1rem;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  max-width: 500px;
  margin: auto;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

fieldset {
  display: flex;
  flex-flow: row wrap;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 1rem;
}

label {
  margin-bottom: 0.5rem;
  flex: 1 1 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

input[type="number"], input[type="text"] {
  width: 60%;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.effect-card {
  flex: 1 1 45%;
  margin: 5px;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.effect-card:hover {
  background-color: #e6e6e6;
}

.effect-card.selected {
  background-color: #007bff;
  color: white;
  border-color: #0056b3;
}

button {
  align-self: center;
  padding: 0.5rem 1rem;
  margin: .5em 1em;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  width: 40%;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

</style>
