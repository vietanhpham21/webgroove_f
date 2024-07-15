<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Slider from '$lib/components/UiComponentes/Slider.svelte';
    import { synthAttack, synthDecay, synthRelease, synthSustain } from "$lib/stores";

    let attackValue = 1;
    let decayValue = 1;
    let sustainValue = 1;
    let releaseValue = 1;

    const dispatch = createEventDispatcher();
    
    function updateAttackValue(event: any) {
        attackValue = event.detail.value;
        synthAttack.set(attackValue);
        dispatch("envChange", { attack: attackValue });
    }

    function updateDecayValue(event: any) {
        decayValue = event.detail.value;
        synthDecay.set(decayValue);
        dispatch("envChange", { decay: decayValue });
    }

    function updateSustainValue(event: any) {
        sustainValue = event.detail.value;
        synthSustain.set(sustainValue);
        dispatch("envChange", { sustain: sustainValue });
    }

    function updateReleaseValue(event: any) {
        releaseValue = event.detail.value;
        synthRelease.set(releaseValue);
        dispatch("envChange", { release: releaseValue });
    }
    

</script>

<div class="adsrComponent">
    <div>
        <Slider min={0} max={2} steps={0.1} resetVal={0.5} value={$synthAttack} id={"attack-slider"} on:change={updateAttackValue} on:reset={updateAttackValue} />
        <label for="attack">attack</label>
    </div>
    <div>
        <Slider min={0} max={2} steps={0.1} resetVal={0.5} value={$synthDecay} id={"decay-slider"} on:change={updateDecayValue} on:reset={updateDecayValue} />
        <label for="decay">decay</label>
    </div>
    <div>
        <Slider min={0} max={1} steps={0.1} resetVal={0.5} value={$synthSustain} id={"sustain-slider"} on:change={updateSustainValue} on:reset={updateSustainValue} />
        <label for="sustain">sustain</label>
    </div>
    <div>
        <Slider min={0} max={5} steps={0.1} resetVal={0.5} value={$synthRelease} id={"release-slider"} on:change={updateReleaseValue} on:reset={updateReleaseValue} />
        <label for="release">release</label>
    </div>
</div>

<style>
    .adsrComponent {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
    }

    .adsrComponent div {
        display: flex;
        flex-flow: column nowrap;
        margin: 30px;
        align-items: center;

    }

    .adsrComponent div label {
        margin-top: 1em;
    }

    #attack-slider {
    }
</style>
