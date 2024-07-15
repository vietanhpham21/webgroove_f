<script lang="ts">
import * as Tone from 'tone';
import { writable } from 'svelte/store';
import TrashIcon from '$lib/components/icons/TrashIcon.svelte';
import AddIcon from '$lib/components/icons/AddIcon.svelte';
import ArrowUpIcon from '$lib/components/icons/ArrowUpIcon.svelte';
import ArrowDownIcon from '$lib/components/icons/ArrowDownIcon.svelte';
import EffectModal from '$lib/components/EffectModal.svelte';
import { effectDrumStore, addDrumEffect, moveDrumEffectUp, moveDrumEffectDown, removeDrumEffect } from '$lib/stores';
import type { FX } from '$lib/stores';

export let moveEffectUpProp: (id: number) => void;
export let moveEffectDownProp: (id: number) => void;
export let removeEffectProp: (id: number) => void;
export let addEffectProp: (effect: FX) => void;
export let effects: writable<FX[]>; 


let showModal = false;

const handleUp = (id: number) => {
  moveEffectUpProp(id);
}

const handleDown = (id: number) => {
  moveEffectDownProp(id);
}

const handleRemove = (id: number) => {
  removeEffectProp(id);
}

</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<div class="container">
  <div class="wrapper">
    <div class="container-head">
      <div class="title-container">
        <button class="hidden">
          <AddIcon size={20} color={"#FFFFFF"} />
        </button>
        <h3 class="title"> Effects </h3>
        <button class="add-button" on:click={() => (showModal = true)}>
          <AddIcon size={20} color={"#FFFFFF"} />
        </button>
      </div>  
    </div>
  </div>
  <div class="effect-list">
    {#each $effects as effect, id}
      <div class="effect">
        <div class="move-buttons">
            <button class="move-button" on:click={() => handleUp(id)}><i class="fa fa-angle-up"></i></button>
            <button class="move-button" on:click={() => handleDown(id)}> <i class="fa fa-angle-down"></i> </button>
        </div>
      
        {#if effect instanceof Tone.Reverb}
            <p> Reverb </p>          
        {:else if effect instanceof Tone.Distortion}
          <p> Distortion </p>
        {:else if effect instanceof Tone.FeedbackDelay}
          <p> Delay </p>
        {:else if effect instanceof Tone.Chorus}
          <p> Chorus </p>
        {:else if effect instanceof Tone.Filter}
          <p> Filter </p>
        {:else if effect instanceof Tone.BitCrusher}
          <p> Bitcrusher </p>
        {/if}
        <button class="delete-button" on:click={() => handleRemove(id)}>
          <i class="fa fa-trash-o"></i>
        </button>
      </div>
    {/each}
  </div>

  <EffectModal bind:showModal addEffectProp={addEffectProp}/>

</div>

<style>

  
  .hidden { 
    position: relative;
    visibility: hidden;
    left: 1.5em
  }

  i.fa {
    font-size: 1.5em;
    color: rgb(0, 0, 0);
  }

  .fa-angle-down:hover {
  transform: scale(1.3);
  font-size: 1.5em;
  color: #2BE127;
  }

  .fa-angle-up:hover {
    transform: scale(1.3);
    font-size: 1.5em;
    color: #2BE127;
  }
  .container {
    bottom: 15%;
    right: 10%;
    width: 100%;
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

  .move-buttons {
    left: 0;
    padding-left: 20px;
  }

  .delete-button {
    background-color: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    right: 0;
    padding-right: 20px;
  }

  .fa-trash-o:hover {
    transform: scale(1.1);
    /* font-size: 1.5em; */
    color: #ff0000;
  }

  .move-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    justify-content: center;
    align-items: center;
  }

  .add-button {
    position: relative;
    display: flex;
    align-items: center;
    right: 1.5em;
    background-color: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    outline: none;
  }

  .effect-list {
    background-color: #595959;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 10px;
  }

  .effect {
    display: flex;
    justify-content: space-between;
    background-color: #D9D9D9;
    color: rgb(0, 0, 0); 
    margin: 2% 2%;
    z-index: 5;
    align-items: center;
    border-radius: 20px;
    height: 2.5em
  }

  .title-container {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    
  }

  .title {
    margin: 0;
    padding: 0;
    /* line-height: 1;  */
  }

 </style>
