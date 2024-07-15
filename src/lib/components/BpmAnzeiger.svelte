<script lang="ts">
    import { bpmStore } from "$lib/stores";
  import { createEventDispatcher } from "svelte";

  let bpm = $bpmStore; // Startwert für BPM
  const dispatch = createEventDispatcher();

  function updateBPM(event: any) {
    bpm = event.target.value;
    dispatch("bpmChange", bpm); // Wir senden das neue BPM über ein Custom Event
  }
</script>

<div class="bpm-control">
  <label for="BPM">BPM</label>
  <input id="BPM" type="number" bind:value={$bpmStore} on:input={updateBPM} />
</div>

<style>
  input[type="number"] {
    border-radius: 5px;
    width: 65px;
    height: 2rem;
    font-size: 18pt;
    background: #D9D9D9;
    margin-left: 5px;
  }

  .bpm-control {
    margin: 5px;
  }


</style>
