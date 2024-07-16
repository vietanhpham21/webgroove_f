<script>
    // @ts-nocheck
    import { getFlagEmoji } from "./getFlagEmoji.js";
    import {
        activeDrumStore,
        beatStore,
        bpmStore,
        description,
        deserializeEffects,
        deserializeGains,
        deserializePans,
        drumPatternIdStore,
        effectDrumStore,
        effectSynthStore,
        formatBase64Image,
        isPreviewing,
        muteDrumStore,
        projectId,
        projectIsImportable,
        projectIsPublic,
        projectLikes,
        projectNameStore,
        projectOwner,
        projectOwnerId,
        readOnlyMode,
        rows,
        seqPatternIdStore,
        showNewProjectDialog,
        soloDrumStore,
        updateSynthAdsr,
        updateSynthPanStore,
        updateSynthPitchStore,
        updateSynthScale,
        updateSynthVolumeStore,
        wavetableIndexStore,
    } from "$lib/stores";
    import { onMount } from "svelte";
    import LoadingIndicator from "./UiComponentes/loadingIndicator.svelte";
    import { goto } from "$app/navigation";
    import * as Tone from "tone";

    let projects = [];
    let loadingProjectId = null; // ID des Projekts, das aktuell geladen wird
    let errorMessage = "";
    let showSortMenu = false;
    let previewIsPlaying = {}; // Objekt für den Spielstatus jedes Projekts
    let searchQuery = ""; // Suchanfrage des Benutzers
    let filteredProjects = [];
    let isLoading = false;
    let userId = localStorage.getItem("userId");
    
    onMount(async () => {
        isLoading = true
        await getPublicProjects();
        isLoading = false
    });

   async function getPublicProjects() {
    const url = `https://webgroove-82906d5c43b2.herokuapp.com/api/projects/public`;

    try {
        const response = await fetch(url, { method: "GET" });

        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Statuscode: ${response.status}`);
        }
        const { publicProjects } = await response.json();

        projects = await Promise.all(
            publicProjects.map(async (project) => {
                const profilePictureUrl = await loadProfilePicture(project);

                // Prüfen, ob der Benutzer das Projekt geliked hat
                let likedByCurrentUser = false;
                try {
                    const likedByResponse = await fetch(`https://webgroove-82906d5c43b2.herokuapp.com/api/projects/${project.id}/likedby`);
                    const likedByData = await likedByResponse.json();
                    likedByCurrentUser = likedByData.users.find(user => user.id === parseInt(localStorage.getItem("userId")));
                    if (currentUser) {
                        likedByCurrentUser = true;
                    } else {
                        likedByCurrentUser = false;
                    }
                } catch (error) {
                    // console.log("Fehler beim Abrufen der Likes:", error);
                }

                return {
                    ...project,
                    User: {
                        ...project.User,
                        country: getFlagEmoji(project.User.country),
                    },
                    profilePictureUrl,
                    likedByCurrentUser,
                };
            })
        );
        filteredProjects = projects;
    } catch (error) {
        console.error("Fehler beim Laden der Projekte:", error);
    }
}

    async function loadPatterns(projectId) {
        const url = `https://webgroove-82906d5c43b2.herokuapp.com/api/projects/${projectId}/patterns`;

        try {
            errorMessage = "";
            loadingProjectId = projectId; // Setze die ID des Projekts, das geladen wird
            const response = await fetch(url, { method: "GET" });

            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Statuscode: ${response.status}`);
            }
            const { patterns, owner, ownerId } = await response.json();
            const sequencerPattern = patterns.stepSequence.stepSequence;
            const drumPattern = patterns.drumSequence.drumSequence;

            projectOwner.set(owner);
            projectOwnerId.set(ownerId);

            activeDrumStore.update(() => drumPattern);
            rows.update(() => sequencerPattern);

            seqPatternIdStore.set(patterns.stepSequence.id);
            updateSynthVolumeStore(patterns.stepSequence.volume);
            updateSynthPitchStore(patterns.stepSequence.pitch);
            updateSynthPanStore(patterns.stepSequence.pan);
            updateSynthAdsr(patterns.stepSequence.adsr);
            effectSynthStore.set(deserializeEffects(patterns.stepSequence.effectSynth));
            wavetableIndexStore.set(patterns.stepSequence.waveTableIndex);
            updateSynthScale(patterns.stepSequence.scale);

            drumPatternIdStore.set(patterns.drumSequence.id);
            deserializeGains(patterns.drumSequence.gainDrum);
            deserializePans(patterns.drumSequence.panDrum);
            soloDrumStore.set(patterns.drumSequence.soloDrum);
            muteDrumStore.set(patterns.drumSequence.muteDrum);
            effectDrumStore.set(deserializeEffects(patterns.drumSequence.effectDrum),
            );
        } catch (error) {
            // console.error("Fehler beim Laden des Projekts:", error);
            errorMessage = "Fehler beim laden des Projekts";
        } finally {
            loadingProjectId = null; // Ladeindikator zurücksetzen
        }
    }

    // Logik zum previewen eines Songs
    const handlePlayClick = async (project) => {
    try {
        // Clear and stop the transport
        Tone.Transport.stop();
        Tone.Transport.clear();

        // Start transport and set up playback
        for (let key in previewIsPlaying) {
            previewIsPlaying[key] = false;
        }
        previewIsPlaying[project.id] = true;

        beatStore.set(0);
        bpmStore.set(project.bpm);
        await loadPatterns(project.id);

        Tone.Transport.bpm.value = $bpmStore;

        setTimeout(() => {
            Tone.Transport.start();
        }, 100); // Delay of 100ms (adjust as needed)
        
    } catch (error) {
        console.error("Fehler beim Abspielen des Projekts:", error);
    }
};


    const handleStopClick = (project) => {
        Tone.Transport.stop();
        Tone.Transport.clear();

        previewIsPlaying = { ...previewIsPlaying, [project.id]: false };
    };

    // Logik zum öffnen eines Songs
    function handleProjectClick(project) {
        loadingProjectId = project.id;
        projectNameStore.set(project.projectName);
        projectId.set(project.id);
        bpmStore.set(project.bpm);
        projectLikes.set(parseInt(project.likeCount));
        description.set(project.description);
        projectIsPublic.set(project.visibility);
        loadPatterns(project.id);
        readOnlyMode.set(true);
        // isPreviewing.set(true);
        goto("./synthesizer");
    }

    function handleImportProjectClick(project) {
        resetProjectData()
        loadingProjectId = project.id;
        bpmStore.set(project.bpm);
        loadPatterns(project.id);
        readOnlyMode.set(false);
        projectOwner.set(localStorage.getItem("username"));
        projectOwnerId.set(localStorage.getItem("userId"));
        console.log($projectOwner)
        goto("./synthesizer");


        showNewProjectDialog.set(true);
    }

    function resetProjectData() {
        projectId.set(0);
        projectNameStore.set("")
        projectIsPublic.set(false);
        projectIsImportable.set(false);
        description.set("");
        projectLikes.set(0);
        projectOwner.set("")
        projectOwnerId.set(0)
    }


    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    async function loadProfilePicture(project) {
        try {
            const response = await fetch(
                `https://webgroove-82906d5c43b2.herokuapp.com/api/user/${project.User.id}/profile-picture`,
                { method: "GET" },
            );

            if (response.ok) {
                const data = await response.json();
                return formatBase64Image(data.base64);
            } else {
                // console.error(
                //     `Fehler beim Laden des Profilbilds für Projekt ${project.id}:`,
                //     response.status,
                // );
                return "/Logo/Logo.png"; // Fallback, falls das Laden des Profilbilds fehlschlägt
            }
        } catch (error) {
            // console.error(
            //     `Fehler beim Laden des Profilbilds für Projekt ${project.id}:`,
            //     error,
            // );
            return "/Logo/Logo.png"; // Fallback, falls ein Fehler auftritt
        }
    }

    function sortProjectsByLikes() {
        filteredProjects = filteredProjects.sort((a, b) => b.likeCount - a.likeCount);
        showSortMenu = false;
        
    }

    function sortProjectsByAlphabet() {
        filteredProjects = filteredProjects.sort((a, b) =>
            a.projectName.localeCompare(b.projectName),
        );
        showSortMenu = false;

    }

        // Funktion zur Durchführung der Suche
    function performSearch() {
    filteredProjects = projects.filter(project =>
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.User.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // verkürzt ggf. den Projektnamen damit er nicht zu lang wird
    function truncateText(text, maxLength = 13) {
        if (text.length <= maxLength) {
            return text;
        } else {
            return text.substr(0, maxLength - 3) + "..."; // Truncate and add ellipsis
        }
    }

    // Likes Logik
    async function likeProject(projectId) {
    const url = `https://webgroove-82906d5c43b2.herokuapp.com/api/projects/${projectId}/like`;

    try {
        let project = projects.find(p => p.id === projectId);
        let isLiked = project.likedByCurrentUser;

        const response = await fetch(url, {
            method: isLiked ? "DELETE" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: localStorage.getItem("userId"),
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Statuscode: ${response.status}`);
        }

        project.likeCount = isLiked ? parseInt(project.likeCount) - 1 : parseInt(project.likeCount) + 1;
        project.likedByCurrentUser = !isLiked;

        projects = projects.map(p => (p.id === projectId ? project : p));
        filteredProjects = projects;
    } catch (error) {
        console.error("Fehler beim Liken des Projekts:", error);
    }
}

</script>

<link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="component-container">
    <div class="component-header">
        <div class="title-container">
            <h1>Neue Projekte aus der Community</h1>
        </div>
        <div class="filter-container">
            <div class="search-bar">
                <i class="fa fa-search"></i>
                <input type="text" placeholder="Projekte suchen..." bind:value={searchQuery} on:input={performSearch} />
            </div>
            <div class="sort-menu-container">
                <button class="fa fa-filter" on:click={() => (showSortMenu = !showSortMenu)}>Sortieren nach</button>
                {#if showSortMenu}
                <div class="sort-menu">
                    <button on:click={sortProjectsByLikes}>Likes</button>
                    <button on:click={sortProjectsByAlphabet}>Alphabet</button>
                </div>
                {/if}
            </div>
        </div>
    </div>
    <div class ="legend">
        <i class="fa fa-clone"></i>
        <span class="tooltip">Creator erlaubt das Importieren des Projekts</span>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <div class="project-cards">
        {#if isLoading}
        <div class="initial-loading-container">
            <LoadingIndicator />
        </div>
        {:else}
        {#if projects.length === 0}
            <div class="project-card">Noch keine Projekte vorhanden...</div>
            {:else if filteredProjects.length === 0}
            <div class="project-card">Keine Projekte gefunden...</div>
        {:else}
            {#each filteredProjects as project}


                <div class="project-card">
                    {#if loadingProjectId === project.id}
                        <div class="loading-container">
                            <LoadingIndicator />
                        </div>
                    {:else}
                        <div class="card-header">
                            {#if project.isImportable}
                            <i on:click={() => handleImportProjectClick(project)} class="fa fa-clone import-button"></i>
                            {/if}
                            <i
                                class={previewIsPlaying[project.id]
                                    ? "fa fa-stop-circle"
                                    : "fa fa-play-circle"}
                                style="font-size:40px;"
                                on:click={previewIsPlaying[project.id]
                                    ? () => handleStopClick(project)
                                    : () => handlePlayClick(project)}
                            ></i>
                            <h2>
                                {#if !project.isImportable}
                                <a class="disabled">{truncateText(project.projectName)}</a>
                                {:else}
                                <a on:click={() => handleProjectClick(project)}
                                    >{truncateText(project.projectName)}</a
                                >
                                {/if}
                            </h2>
                        </div>
                        <div class="userinfo">
                            <img
                                id="profile"
                                src={project.profilePictureUrl}
                                alt="Profilbild"
                                class="profile-picture"
                            />
                            <label for="profile"
                                >{project.User.username}
                                {project.User.country}</label
                            >
                        </div>

                        <div class="likes">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24px"
                            height="24px"
                            on:click={() => likeProject(project.id)}
                        >
                            <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                fill={project.likedByCurrentUser ? '#ff0000' : 'rgb(161, 161, 161)'}
                            />
                        </svg>
                            <span>{parseInt(project.likeCount)}</span>
                            
                        </div>
                    {/if}
                </div>
            {/each}
        {/if}
    {/if}
    </div>
</div>
<style>
    .legend {
        font-size: medium;
        position: relative;
        left: 5em;
    }
    .disabled {
        pointer-events: none;
    }
    .initial-loading-container{
        display: flex;
        justify-content: center;
        width: 100%;
        position: relative;
        top: 8em
    }
    .import-button {
        font-size: 1.5em;
        position: absolute;
        right: 1.2em;
        /* top: 1.5em; */
        transition: .5s cubic-bezier(0.19, 1, 0.22, 1)
    }
    .import-button:hover {
        transform: scale(1.3);
    }
    .search-bar {
        position: relative;
        display: flex;
        align-items: center;
    }

    .search-bar input {
        padding-left: 30px; /* Platz für das Icon */
        height: 1.5em;
        font-size: 1em
    }

    .search-bar i.fa {
        position: absolute;
        left: 10px;
        font-size: 18px;
        color: #777;
    }

    .filter-container {
        position: relative;
        background: rgb(146, 146, 146);
        border-radius: 8px;
        margin: 1em;
        padding: .5em 1em;
        display: flex;
        align-items: center;
        gap: 1em;
        font-family: "Inter", sans-serif!important;
    }
    .card-header a:hover {
        text-decoration: underline;
    }
    .component-header {
        margin-top: 1%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        padding: 1em 4em 1em 4em;
    }

    .component-container {
        display: flex;
        flex-flow: column wrap;
        width: 100%;
        min-height: 500px;
    }
    .fa-stop-circle,
    .fa-play-circle:hover {
        color: #d10000;
    }

    .card-header {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        gap: 5%;
    }
    .project-card h2 {
        margin: 0 0;
    }
    /* .load-button {
        margin: 5px; */
    /* } */
    .userinfo {
        display: flex;
        align-items: center;
        margin-top: 20px; /* Optional: Abstand nach dem Titel */
    }

    .profile-picture {
        width: 40px; /* Breite des Profilbilds anpassen */
        height: 40px; /* Höhe des Profilbilds anpassen */
        border-radius: 50%; /* Runde Ecken für das Profilbild */
        margin-right: 10px; /* Optional: Abstand zwischen Profilbild und Benutzernamen */
    }


    label {
        margin: 0; /* Zur Sicherheit alle Ränder aufheben */
        text-align: center; /* Zentrieren des Benutzernamens */
        font-weight: 500;
    }

    .project-cards {
        display: flex;
        flex-flow: row wrap;
        padding: 0 4em;
        /* gap: 10px; */
        /* margin: 0 3.6%; */
    }

    .project-card {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        margin: 10px 10px;
        width: 300px;
        min-height: 100px;
        background-color: #f9f9f9;
        cursor: pointer;
        position: relative;
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            background-color 0.3s ease;
    }

    .project-card:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        /* transform: scale(1.05); */
        background-color: #e0f7fa;
    }

    /* .project-card p {
        margin-top: 0;
    } */

    .likes {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 20px;
        right: 20px;
    }

    .likes svg {
        fill: #ff0000;
        margin-right: 5px;
    }

    .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .sort-menu-container {
        position: relative;
        display: inline-block;
        cursor: pointer;
        color: rgb(255,255,255);
    }

    .sort-menu-container:hover {
        color: rgb(214, 214, 214);
    }

    .sort-menu {
        margin-top: .5em;
        display: flex;
        flex-direction: column;
        position: absolute;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 10px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        z-index: 1;
    }

    .sort-menu button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px;
        margin: 5px 0;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .sort-menu button:hover {
        background-color: #0056b3;
    }

    button {
        /* margin: 20px; */
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>
