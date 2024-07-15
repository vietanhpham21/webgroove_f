<script>
    // @ts-nocheck
    import {bpmStore,projectNameStore,projectIsPublic,activeDrumStore,rows, projectId, description, gainDrumStore, panDrumStore, soloDrumStore, effectDrumStore, serializeGains, serializePans, serializeEffects, muteDrumStore, synthVolumeStore, synthPitchStore, synthPanStore, synthAttack, synthDecay, synthSustain, synthRelease, effectSynthStore, wavetableIndexStore, selectedNote, selectedScale, selectedOctave, projectIsImportable } from "$lib/stores";
    import { onMount } from "svelte";
    import { effect } from "zod";
    export let isPublic = false;
    export let cancelSave;
    // let description = "";
    let saveSuccess = false;
    let isLoading = false;

    const userId = localStorage.getItem("userId");



    async function handleSaveProject() {
        const data = {
            userId: userId,
            projectId: $projectId,
            projectName: $projectNameStore,
            isPublic: $projectIsPublic,
            isImportable: $projectIsImportable,
            bpm: $bpmStore,
            description: $description,

            activeSynths: $rows,
            synthVol: $synthVolumeStore.gain.value,
            synthPitch: $synthPitchStore.pitch,
            synthPan: $synthPanStore.pan.value,
            adsr: {
                attack: $synthAttack,
                decay: $synthDecay,
                sustain: $synthSustain,
                release: $synthRelease,
            },
            effectSynth: serializeEffects($effectSynthStore),
            waveTableIndex: $wavetableIndexStore,
            scale: {
                selectedNote: $selectedNote,
                selectedScale: $selectedScale,
                selectedOctave: $selectedOctave,
            },

            activeDrums: $activeDrumStore,
            gainDrum: serializeGains($gainDrumStore),
            panDrum: serializePans($panDrumStore),
            soloDrum: $soloDrumStore,
            muteDrum: $muteDrumStore,
            effectDrum: serializeEffects($effectDrumStore),
        };

        
        
        try {
            isLoading = true;

            const response = await fetch(
                "http://localhost:3999/api/projects/save",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                },
            );

            if (response.ok) {
                saveSuccess = true;
                setTimeout(() => {
                    cancelSave();
                }, 800); // Schließe das Dialogfeld nach 2 Sekunden
            } else {
                console.error(
                    "Fehler beim Speichern des Projekts:",
                    response.statusText,
                );
            }
        } catch (error) {
            console.error("Fehler beim Speichern des Projekts:", error.message);
        } finally {
            isLoading = false
        }
    }

    function handleCheckboxChange(event) {
        isPublic = event.target.checked;
    }

    onMount(() => {
        handleSaveProject()
    })
</script>

<div class="dialog-overlay">
    <div class="dialog">
        <!-- <h3>Projekt speichern</h3> -->
        <!-- <form on:submit|preventDefault={handleSaveProject}>
            <div>
                <textarea
                    id="description"
                    name="description"
                    rows="3"
                    cols="35"
                    placeholder="Gib hier eine Beschreibung deines Projekts ein..."
                    bind:value={$description}
                ></textarea>
            </div>
            <div class="dialog-buttons">
                <button type="submit">Save</button>
                <button type="button" on:click={cancelSave}>Cancel</button>
            </div>
        </form> -->
        <div class="message">
            {#if isLoading} <isLoading/>{/if}
            <p class={saveSuccess ? "visible" : "hidden"}>
                Das Projekt wurde erfolgreich gespeichert!
            </p>
        </div>
    </div>
</div>

<style>
    /* h3 {
        margin: 0;
        margin-bottom: 0.5em;
    } */
    /* .dialog-buttons {
        padding-top: 1em;
    } */
    .dialog-overlay {
        position: fixed;
        top: 4.5rem; /* Höhe der Navigationsleiste */
        left: 0;
        width: 100%;
        height: calc(
            100% - 4.5rem
        ); /* Die Höhe des Viewports abzüglich der Navigationsleiste */
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(8px); /* Hintergrund verschwimmen */
        z-index: 101;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgb(0, 0, 0);
    }

    /* #description {
        font-family: "Inter", sans-serif;
        font-size: 14px;
    } */

    .dialog {
        display: flex;
        flex-flow: column nowrap;
        background-color: #d9d9d9;
        padding: 2em;
        border-radius: 15px;
        text-align: center;
        padding: 1em;
    }

    .dialog div {
        margin: 0.8rem;
    }

    .message p {
        display: inline;
        color: rgb(0, 0, 0);
        /* background: rgb(255, 255, 255); */
        padding: 0.8em;
        border-radius: 15px;
    }

    .hidden {
        visibility: hidden;
    }

    .visible {
        visibility: visible;
    }

/*
    input[type="text"],
    input[type="checkbox"],
    textarea {
        width: 100%;
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        transition: border-color 0.3s;
    }

    input[type="text"] {
        text-align: center;
    }

    input[type="text"]:focus,
    input[type="checkbox"]:focus,
    textarea:focus {
        outline: none;
        border-color: #4b4b4b;
    }

    textarea {
        resize: vertical;
    }

    .checkbox {
        display: inline-flex;
    }

    .tooltip-container {
        position: relative;
        display: inline-block;
        cursor: pointer;
        margin-left: 0.3rem;
    }

    .tooltip-icon {
        position: relative;
        bottom: -2px;
        display: inline-block;
        width: 1rem;
        height: 1rem;
        background: #d9d9d9;
        color: #000;
        text-align: center;
        border-radius: 50%;
    }

    .tooltip-text {
        font-size: smaller;
        font-weight: 300;
        visibility: hidden;
        width: 200px;
        background-color: #555;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 0.5rem;
        position: absolute;
        z-index: 1;
        top: 125%;
        left: 50%;
        margin-left: -100px;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .tooltip-container:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
    }

    .tooltip-container:hover .tooltip-icon {
        background-color: #555;
        color: #fff;
    }
    .dialog-buttons {
        display: flex;
        justify-content: center;
        margin-top: 1.5rem;
    }

    button {
        margin: 0.5rem;
        padding: 0.5rem 1rem;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        transition:
            background-color 0.3s,
            transform 0.2s;
    }

    button[type="submit"] {
        background-color: #4b4b4b;
        color: white;
    }

    button[type="submit"]:hover {
        background-color: #2c2c2c;
        transform: scale(1.05);
    }

    button[type="button"] {
        background-color: #f44336;
        color: white;
    }

    button[type="button"]:hover {
        background-color: #da190b;
        transform: scale(1.05);
    }

*/
</style>
