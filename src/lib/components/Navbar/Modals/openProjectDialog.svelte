<script>
    // @ts-nocheck

    import {
        activeDrumStore,
        bpmStore,
        description,
        deserializeEffects,
        deserializeGains,
        deserializePans,
        drumPatternIdStore,
        effectDrumStore,
        effectSynthStore,
        gainDrumStore,
        muteDrumStore,
        panDrumStore,
        projectId,
        projectLikes,
        projectNameStore,
        projectOwner,
        projectOwnerId,
        rows,
        selectedNote,
        seqPatternIdStore,
        soloDrumStore,
        synthPanStore,
        synthPitchStore,
        synthVolumeStore,
        updateSynthAdsr,
        updateSynthPanStore,
        updateSynthPitchStore,
        updateSynthVolumeStore,
        wavetableIndexStore,
        updateSynthScale,
        projectIsPublic,
        projectIsImportable,
        showNewProjectDialog,
    } from "$lib/stores";
    export let cancelSave;
    import { onMount } from "svelte";
    import LoadingIndicator from "../../UiComponentes/loadingIndicator.svelte";
    import { goto } from "$app/navigation";
    import { walk } from "svelte/compiler";

    let projects = [];
    let count = 0;
    let isLoading = false;
    let errorMessage = "";

    // Lädt alle Projekte des Users und gibt sie in das Array "projects"
    async function handleOpenProject() {
        const userId = localStorage.getItem("userId");
        const url = `http://localhost:3999/api/projects/open?userId=${userId}`;

        try {
            isLoading = true;
            const response = await fetch(url, { method: "GET" });

            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Statuscode: ${response.status}`);
            }
            const { openProjects } = await response.json();

            projects = openProjects;
            count = projects.length;
        } catch (error) {
            console.error("Fehler beim Laden der Projekte:", error);
        } finally {
            isLoading = false;
        }
    }

    // Lädt das Synthesizer- und Drummaschinepatten des ausgewählten Projektes aus
    async function loadPatterns() {
        const url = `http://localhost:3999/api/projects/${$projectId}/patterns`;

        try {
            errorMessage = "";
            isLoading = true;
            const response = await fetch(url, { method: "GET" });

            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Statuscode: ${response.status}`);
            }
            const { patterns, owner, ownerId } = await response.json();
            const sequencerPattern = patterns.stepSequence.stepSequence;
            const drumPattern = patterns.drumSequence.drumSequence;

            projectOwner.set(owner)
            projectOwnerId.set(ownerId)
            console.log($projectOwnerId)

            activeDrumStore.update(() => {
                return drumPattern;
            });
            rows.update(() => {
                return sequencerPattern;
            });
            // drum
            // console.log($gainDrumStore[0].gain)
            seqPatternIdStore.set(patterns.stepSequence.id);
            updateSynthVolumeStore(patterns.stepSequence.volume)
            updateSynthPitchStore(patterns.stepSequence.pitch)
            updateSynthPanStore(patterns.stepSequence.pan)
            updateSynthAdsr(patterns.stepSequence.adsr);
            effectSynthStore.set(deserializeEffects(patterns.stepSequence.effectSynth));
            wavetableIndexStore.set(patterns.stepSequence.waveTableIndex)
            updateSynthScale(patterns.stepSequence.scale);

            drumPatternIdStore.set(patterns.drumSequence.id);
            deserializeGains(patterns.drumSequence.gainDrum);

            deserializePans(patterns.drumSequence.panDrum)
            soloDrumStore.set(patterns.drumSequence.soloDrum);
            muteDrumStore.set(patterns.drumSequence.muteDrum);
            effectDrumStore.set(deserializeEffects(patterns.drumSequence.effectDrum))


            //synth
            // console.log(patterns.stepSequence.id)
        } catch (error) {
            // console.error("Fehler beim Laden des Projekts:", error);
            errorMessage = "Fehler beim laden des Projekts";
        } finally {
            isLoading = false;
            cancelSave();
        }
    }

    // wenn openProjectDialog Komponente geladen wird dann -> sende eine Fetch anfrage
    onMount(handleOpenProject);

    // formartiert das von der Datenbank automatisch generierte Datum in lesbare Strings
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    // aktualisiert das im Store gespeicherte Projekt auf das Projekt was der User anklickt in der Liste
    function handleProjectClick(project) {
        isLoading = true;
        projectNameStore.set(project.projectName)
        projectId.set(project.id)
        bpmStore.set(project.bpm)
        projectIsPublic.set(project.visibility)
        projectIsImportable.set(project.isImportable)
        description.set(project.description)
        projectLikes.set(project.likes)
        loadPatterns();
        goto("./synthesizer")
    }

</script>

<div class="dialog-overlay">
    <div class="dialog">
        <button type="button" class="close-button" on:click={cancelSave}
            >×</button
        >
        <h3>Projekt öffnen ({count})</h3>
        {#if isLoading}
        <div><LoadingIndicator /></div>
            
        {:else if projects.length === 0}
            <p>Du hast noch keine Projekte...</p>
        {:else if errorMessage}
            <p>{errorMessage}</p>
        {:else}
            <!-- Deine Tabelle und andere Inhalte hier -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <table class="project-table">
                <thead>
                    <tr>
                        <th class="icon"></th>
                        <th>Projekt Name</th>
                        <th>BPM</th>
                        <th>Beschreibung</th>
                        <th>Öffentlich</th>
                        <th>Erstellt</th>
                        <th>Zuletzt bearbeitet</th>
                    </tr>
                </thead>
                <tbody>
                    {#each projects as project}
                        <tr
                            class="project-row"
                            on:click={() => handleProjectClick(project)}
                        >
                            <td class="icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 48 48"
                                    width="24px"
                                    height="24px"
                                >
                                    <path
                                        d="M 8.5 8 C 6.0324991 8 4 10.032499 4 12.5 L 4 36.40625 L 4.015625 36.40625 C 3.9865145 38.276932 5.5083888 40 7.5019531 40 L 36.546875 40 C 38.416875 40 40.10278 38.832994 40.759766 37.082031 L 45.767578 23.75 L 45.767578 23.746094 C 46.62354 21.501657 44.900814 19 42.498047 19 L 42 19 L 42 17.5 C 42 15.032499 39.967501 13 37.5 13 L 24.042969 13 L 19.574219 9.2753906 A 1.50015 1.50015 0 0 0 19.572266 9.2753906 C 18.584102 8.4521105 17.339162 8 16.052734 8 L 8.5 8 z M 8.5 11 L 16.052734 11 C 16.638307 11 17.202555 11.205358 17.652344 11.580078 L 22.539062 15.652344 A 1.50015 1.50015 0 0 0 23.5 16 L 37.5 16 C 38.346499 16 39 16.653501 39 17.5 L 39 19 L 13.453125 19 C 11.583125 19 9.8972196 20.167006 9.2402344 21.917969 L 7 27.882812 L 7 12.5 C 7 11.653501 7.6535009 11 8.5 11 z M 13.453125 22 L 42.498047 22 C 42.897907 22 43.107444 22.305152 42.964844 22.677734 A 1.50015 1.50015 0 0 0 42.960938 22.6875 L 37.951172 36.027344 C 37.730157 36.616381 37.176875 37 36.546875 37 L 7.5019531 37 C 7.1042373 37 6.8935735 36.697099 7.0332031 36.326172 A 1.50015 1.50015 0 0 0 7.0351562 36.324219 L 12.048828 22.972656 C 12.269843 22.383619 12.823125 22 13.453125 22 z"
                                    />
                                </svg>
                            </td>
                            <td>{project.projectName}</td>
                            <td>{project.bpm}</td>
                            <td>{project.description}</td>
                            <td>{project.visibility ? 'ja' : 'nein' }</td>
                            <td>{formatDate(project.createdAt)}</td>
                            <td>{formatDate(project.updatedAt)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
</div>

<style>
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

    .dialog {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
        background-color: #d9d9d9;
        padding: 2em;
        border-radius: 15px;
        text-align: center;
        padding-bottom: 1em;
        overflow-y: scroll;
        max-height: 80%;
    }

    .close-button {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 1.5em;
        cursor: pointer;
        color: #333;
        transition: color 0.3s ease;
    }

    .close-button:hover {
        color: #e20000;
        transform: scale(1.1);
    }

    .project-table {
        width: 100%;
        border-collapse: collapse;
        font-family: Arial, sans-serif;
    }

    .project-table th,
    .project-table td {
        padding: 1em 7em;
        padding-left: 0.5em;
        text-align: left;
    }

    th:first-of-type,
    td:first-of-type {
        padding: 1em 25px;
    }

    .icon {
        width: 1.5rem;
        visibility: hidden; /* Standardmäßig ausblenden */
        transition: all 0.05s ease-in-out;
    }

    .project-row:hover .icon {
        visibility: visible; /* Einblenden, wenn Listenlement gehovert wird */
        transform: scale(1.1);
    }

    .icon svg {
        fill: rgb(75, 75, 75);
        width: 1.5rem;
        height: 1.5rem;
        transition: all 0.05s ease-in-out;
    }

    .project-row:hover .icon svg {
        fill: rgb(75, 75, 75);
        transform: scale(1.1);
    }

    .project-table th {
        border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
        font-weight: 500;
    }

    .project-table tbody tr:hover {
        background-color: #e6e6e6;
        cursor: pointer;
    }
</style>
