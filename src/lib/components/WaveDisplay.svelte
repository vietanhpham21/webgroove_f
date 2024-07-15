<script lang="ts">
import * as Tone from "tone";
import Saw from "$lib/components/wavetables/Saw.svelte";
import Square from "$lib/components/wavetables/Square.svelte";
import Sine from "$lib/components/wavetables/Sine.svelte";
import Tri from "$lib/components/wavetables/Tri.svelte";
import { wavetableIndexStore } from "$lib/stores";
import { wavetables } from "$lib/wavetables";
import { beforeUpdate, afterUpdate} from 'svelte';


const handleNext = () => {
  wavetableIndexStore.update(() => {return $wavetableIndexStore === wavetables.length - 1 ? 0 : $wavetableIndexStore + 1});
}

const handlePrev = () => {
  wavetableIndexStore.update(() => {return $wavetableIndexStore === 0 ? wavetables.length - 1 : $wavetableIndexStore - 1});
}

const wavenames = ["Saw", "Square", "Sine", "Tri"];


</script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<div class="container">
  <div class="wrapper">
    <div class="container-head">
      <button class="arrow-button" on:click={handlePrev}>
        <!-- <PrevArrowIcon width={20} height={20} color={"#FFFFFF"} /> -->
        <i class= "fa fa-angle-left"></i>
      </button>
      <div class="title-container">
        <h2 class="title"> {wavenames[$wavetableIndexStore]} </h2>
      </div>
      <button class="arrow-button" on:click={handleNext}>
        <!-- <NextArrowIcon width={20} height={20} color={"#FFFFFF"} /> -->
        <i class="fa fa-angle-right"></i>
      </button>
    </div>

    <div id="waveform">
      {#if $wavetableIndexStore === 0} 
        <Saw heightPercentage="80%" widthPercentage="80%"/>
      {:else if $wavetableIndexStore === 1}
        <Square heightPercentage="80%" widthPercentage="80%" />
      {:else if $wavetableIndexStore === 2}
        <Sine heightPercentage="80%" widthPercentage="80%" />
      {:else if $wavetableIndexStore === 3}
        <Tri heightPercentage="50%" widthPercentage="80%" />
      {/if} 
    </div>
  </div>

</div>


<style>
  .fa{
    font-size: 3em;
    color: rgb(255, 255, 255);
  }
  .fa:hover {
    color: #bdbdbd;
  }


  #waveform {
    width: 100%;
    /* height: 295px; */
    height: 100%;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-content: center;
    padding-top: 5%
  }

  .container {
    width: 100%;
    height: 320px;
    box-sizing: border-box;
  }

  .wrapper {
    width: 100%;
    box-sizing: border-box;
  }

  .container-head {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    background: #343434;
    border-radius: 8px;
    height: 3em;
    margin: 0.1em;
    font-size: 1.2em;
    margin-bottom: 1%;
  }

  .title-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
  }

  .title {
    margin: 0;
    padding: 0;
    line-height: 1; 
  }

  .arrow-button {
    display: flex;
    align-items: center;
    margin: 0em .8em;
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
  }



</style>
