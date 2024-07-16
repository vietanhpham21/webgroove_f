<script>
    // @ts-nocheck
    import LoadingIndicator from "$lib/components/UiComponentes/loadingIndicator.svelte";
import {bpmStore,projectNameStore,projectIsPublic,activeDrumStore,rows, projectId, drumPatternIdStore, seqPatternIdStore, description, projectOwner, projectOwnerId, projectIsImportable, effectDrumStore, effectSynthStore} from "$lib/stores";
    import { onMount } from "svelte";
    export let projectName;
    export let isPublic = false;
    export let cancelSave;
    let isLoading = false;
    // let description = "";
    let saveSuccess = false;
    let bpm;

    const userId = localStorage.getItem("userId");

    onMount(async () => {
        projectOwner.set(localStorage.getItem("username"))
        projectOwnerId.set(localStorage.getItem("userId"))
    });

    // neues projekts
    async function handleNewProject() {
        projectOwner.set(localStorage.getItem("username"))
        projectOwnerId.set(localStorage.getItem("userId"))
        projectNameStore.update(() => projectName);
        projectIsPublic.update(() => isPublic);
        // console.log($projectOwner)
        bpmStore.update(() => bpm)
        projectOwner.set(localStorage.getItem("username"))
        if(bpm == undefined) {
            // console.log($bpmStore)
            bpmStore.update(() => 120)
        }


        const data = {
            userId: userId,
            projectName: $projectNameStore,
            isPublic: $projectIsPublic,
            isImportable: $projectIsImportable,
            bpm: $bpmStore,
            description: $description,
            stepSequencePattern: $rows,
            drumSequencePattern: $activeDrumStore
        };

        try {
            isLoading = true;
            const response = await fetch(
                "https://webgroove-82906d5c43b2.herokuapp.com/api/projects/new",
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
                const responseData = await response.json()

                projectId.set(responseData.projectDetails.projectId)
                seqPatternIdStore.set(responseData.projectDetails.seqPatternId)
                drumPatternIdStore.set(responseData.projectDetails.drumPatternId)
                setTimeout(() => {
                    cancelSave();
                }, 1000);
            } else {
                console.error(
                    "Fehler beim Speichern des Projekts:",
                    response.statusText,
                );
            }
        } catch (error) {
            console.error("Fehler beim erstellen des Projekts:", error.message);
        } finally {
            isLoading = false;
        }
    }

    function handleCheckboxIsPublicChange(event) {
        isPublic = event.target.checked;
    }

    
    function handleCheckboxIsImportableChange(event) {
        $projectIsImportable = event.target.checked;
    }
</script>

<div class="dialog-overlay">
    <div class="dialog">
        <h3>neues Projekt erstellen</h3>
        <form on:submit|preventDefault={handleNewProject}>
            <div>
                <label class="label" for="projectName">Projekt Name</label>
                <input
                    type="text"
                    bind:value={projectName}
                    placeholder=""
                    name="projectName"
                    required
                />
            </div>
            <div>
                <label class="label" for="bpm">Tempo</label>
                <input
                    type="number"
                    bind:value={bpm}
                    placeholder="{$bpmStore}"
                    name="bpm"
                />
            </div>
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
            <div class="checkbox">
                <input
                    id="public"
                    type="checkbox"
                    bind:value={isPublic}
                    on:change={handleCheckboxIsPublicChange}
                />
                <label for="public">öffentlich</label>
                <span class="tooltip-container">
                    <span class="tooltip-icon"
                        ><img
                            src="/Icons/Questionmark.svg"
                            alt="questionmark"
                        /></span
                    >
                    <span class="tooltip-text"
                        >Dein Projekt wird für andere Nutzer sichtbar sein</span
                    >
                </span>
            </div>
            <div class="checkbox">
                <input
                    id="isImportable"
                    type="checkbox"
                    bind:value={$projectIsImportable}
                    on:change={handleCheckboxIsImportableChange}
                />
                <label for="isImportable">importierbar</label>
                <span class="tooltip-container">
                    <span class="tooltip-icon"
                        ><img
                            src="/Icons/Questionmark.svg"
                            alt="questionmark"
                        /></span
                    >
                    <span class="tooltip-text"
                        >Dein Projekt kann von anderen User in ihr eigenes Projekt importiert werden</span
                    >
                </span>
            </div>
            <div class="dialog-buttons">
                <button class="formbutton" type="submit">Erstellen</button>
                <button class="formbutton" type="button" on:click={cancelSave}>Cancel</button>
            </div>
        </form>
        <div class="message">
            {#if isLoading} 
                <span class="loading-indicator">
                <LoadingIndicator/>
                </span>
            {/if}
            <p class={saveSuccess ? "visible" : "hidden"}>
                Das Projekt wurde erfolgreich erstellt!
            </p>
        </div>
    </div>
</div>

<style>
    .message {
        max-height: 1em;
    }
    .loading-indicator {
        position: relative;
        bottom: 10px;
        display: flex;
        justify-content: center;
        margin: 0;
        padding: 0;
    }
    .formbutton {
        width: 40%;
    }

    h3 {
        margin: 0;
        margin-bottom: 0.5em;
    }

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

    #description {
        font-family: "Inter", sans-serif;
        font-size: 14px;
    }

    .dialog {
        display: flex;
        flex-flow: column nowrap;
        background-color: #d9d9d9;
        padding: 2em;
        border-radius: 15px;
        text-align: center;
        padding-bottom: 1em;
    }

    .dialog div {
        margin: 0.8rem;
    }


    .message p {
        display: inline;
        color: rgb(0, 0, 0);
        background: rgb(21, 255, 0);
        padding: 0.8em;
        border-radius: 15px;
    }

    form div {
        padding: 5px
    }

    .hidden {
        visibility: hidden;
    }

    .visible {
        visibility: visible;
    }

    input[type="number"],
    input[type="text"],
    textarea {
        width: 90%;
        padding: 0.5rem;
        margin-top: 10px;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        transition: border-color 0.3s;        
        text-align: center;
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
        justify-content: center;
        align-items: center;
        padding-bottom: 0;
    }

    /* Tooltip Css für Fragezeichen */
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
    /* Button-styles */
    .dialog-buttons {
        display: flex;
        justify-content: center;
        /* margin-top: 5rem; */
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

    input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
/* input[type=number] {
  -moz-appearance: textfield;
} */
</style>
