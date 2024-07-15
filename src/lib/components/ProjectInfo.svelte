<script lang="ts">
    // @ts-nocheck

    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import {
        bpmStore,
        description,
        projectIsPublic,
        projectNameStore,
        projectId,
        drumPatternIdStore,
        seqPatternIdStore,
        projectLikes,
        projectOwner,
        resetProject,

        formatBase64Image,

        projectOwnerId,

        projectIsImportable,

        readOnlyMode,

        loggedIn





    } from "$lib/stores";
    import LoadingIndicator from "./UiComponentes/loadingIndicator.svelte";

    let isEditing: boolean = false;
    let isLiked: boolean = false;
    let likedByList;
    let likedByCurrentUser = false;
    let isLoading = false
    let msg = {show: false, msg: "" }
    let pictureUrl;


    function editProject(): void {
        isEditing = true;
    }
    function cancelEdit(): void {
        msg.show = false;
        msg.msg = "";
        isEditing = false;
    }


    // speichert die projektinfos nachdem sie editiert wurden
    async function saveProjectChanges(): Promise<void> {
        const data = {
            projectName: $projectNameStore,
            description: $description,
            bpm: $bpmStore,
            visibility: $projectIsPublic,
            isImportable: $projectIsImportable
        };

        try {
            const response = await fetch(
                `https://webgroove-82906d5c43b2.herokuapp.com/api/projects/${$projectId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                },
            );

            if (response.ok) {
                isEditing = false;
            } else {
                console.error(
                    "Fehler beim Speichern des Projekts:",
                    response.statusText,
                );
            }
        } catch (error) {
            console.error("Fehler beim Speichern des Projekts:", error);
        } 
    }

    //wenn ein Projekt geladen wird dann werden die aktuelle likezahl requested und es wird geschaut ob der aktuelle user das projekt bereits geliket hat
    onMount(async () => {
        pictureUrl = "";
        try {
            isLoading = true;

            const response = await fetch(
                `https://webgroove-82906d5c43b2.herokuapp.com/api/projects/${$projectId}/likes`,
            );
            getProfilePicture()
            const data = await response.json();
            projectLikes.set(data.likeCount);
        } catch (error) {
            console.error("Fehler beim Abrufen der Likes:", error);
        }

        // hole die liste der User die das Projekt geliket haben
        // response enhält dann ein array mit objekten die jeweils "id" und "username" haben
        try {
            const response = await fetch(
                `https://webgroove-82906d5c43b2.herokuapp.com/api/projects/${$projectId}/likedby`,
            );
            const data = await response.json();
            likedByList = data.users;

            // suche in der Liste nach dem eingeloggten User
            const currentUser = likedByList.find(user => user.id === parseInt(localStorage.getItem("userId")));

            if (currentUser) {
                likedByCurrentUser = true;
            } else {
                likedByCurrentUser = false;
            }
        } catch (error) {
            console.log("Fehler beim Abrufen der Likes:", error);
        } 

        // herz wird rot auf der seite
        isLiked = likedByCurrentUser;
        isLoading = false

    });

    // Anfrage and das Backend zum liken
    async function toggleLike(): Promise<void> {
        try {
            const response = await fetch(
                `https://webgroove-82906d5c43b2.herokuapp.com/api/projects/${$projectId}/like`,
                {
                    method: isLiked ? "DELETE" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: localStorage.getItem("userId"),
                    }),
                },
            );

            if (response.ok) {
                // Update the number of likes
                $projectLikes += isLiked ? -1 : 1;
                // Toggle the liked status
                isLiked = !isLiked;
            } else {
                console.error(
                    "Fehler beim Ändern des Like-Status:",
                    response.statusText,
                );
            }
        } catch (error) {
            console.error("Fehler beim Ändern des Like-Status:", error);
        }
    }

    async function handleDeleteProject() {
        try {
            const response = await fetch(
                `https://webgroove-82906d5c43b2.herokuapp.com/api/projects/${$projectId}`,
                {
                    method: "DELETE",
                    headers: {"Content-Type": "application/json",},
                    body: JSON.stringify({
                        userId: localStorage.getItem("userId"),
                        jwtToken: localStorage.getItem("jwtToken")
                    }),
                },
            );

            if (response.ok) {
                resetProject();
                goto("/home");
            } else {
                const responseText = await response.json();
                msg.msg = responseText.error
                msg.show = true
            }
        } catch (error) {
            console.error("Fehler beim Löschen des Projekts:", error);
        }
    }

    async function getProfilePicture() {
        pictureUrl = "";
        try {
            const response = await fetch(`https://webgroove-82906d5c43b2.herokuapp.com/api/user/${$projectOwnerId}/profile-picture`,
                {method: "GET"},
            );
            if (response.ok) {
                const data = await response.json();
                pictureUrl = formatBase64Image(data.base64)
            } else {
                pictureUrl = "/Logo/Logo.png"; // Fallback image URL
            }
        } catch (error) {
            pictureUrl = "/Logo/Logo.png"; // Fallback image URL
        }
    }

    function truncateText(text, maxLength = 20) {
        if (text.length <= maxLength) {
            return text;
        } else {
            return text.substr(0, maxLength - 3) + "..."; // Truncate and add ellipsis
        }
    }

</script>

{#if isLoading}
<div class="loading"><LoadingIndicator /></div>
{:else}
<div class="container">

        {#if isEditing}
            <div class="header">
                <button class="hidden">edit</button>
                <p>edit Project Info</p>
                <button class="cancel-button" on:click={handleDeleteProject}>delete</button>
            </div>
            <div class="input-field body">
                <label for="name">Projektname:</label>
                <input type="text" id="name" bind:value={$projectNameStore} />
            </div>
            <div class="input-checkbox">
                <div>
                <label for="isPublic">Öffentlich:</label>
                <input
                    type="checkbox"
                    id="isPublic"
                    bind:checked={$projectIsPublic}
                /></div>
                <div>
                <label for="isPublic">importierbar:</label>
                <input
                    type="checkbox"
                    id="isImportable"
                    bind:checked={$projectIsImportable}
                /></div>
            </div>

            {#if msg.show}
            <small class="msg">{msg.msg}</small>
            {/if}
            <div class="button-container">
                <button class="save-button button" on:click={saveProjectChanges}
                    >Speichern</button
                >
                <button class="cancel-button button" on:click={cancelEdit}
                    >Abbrechen</button
                >
            </div>
        {:else}
            <div class="header">
                <button class="hidden">edit</button>
                <p>{truncateText($projectNameStore)}</p>
                {#if $projectOwner === localStorage.getItem("username") && $projectId != -1}
                    <button class="edit-button button" on:click={editProject}
                        >edit</button
                    >
                {:else}
                    <button class="like-button button" on:click={toggleLike}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24px"
                            height="24px"
                        >
                            <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                fill={isLiked ? '#ff0000' : 'rgb(161, 161, 161)'}
                            />
                        </svg>
                    </button>
                {/if}
            </div>
            <div class="body input-field">
                <label for="description">Beschreibung:</label>
                {#if $projectOwner === localStorage.getItem("username")}
                    <textarea id="description" bind:value={$description}></textarea>
                {:else}
                    <textarea id="description" bind:value={$description} readonly></textarea>
                {/if}
            </div>
            <div class="body project-info">
                <div class="container">
                    <div class="user">
                        <!-- svelte-ignore a11y-img-redundant-alt -->
                        <img class="pfp" src={pictureUrl} alt="Picture" />
                        <p>{$projectOwner}</p>
                    </div>
                    <div class="likes">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24px"
                            height="24px"
                            fill="#ff0000"
                        >
                            <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            />
                        </svg>
                        <p>{$projectLikes}</p>
                    </div>
                </div>
            </div>
            <div class="ids">
                {#if $loggedIn && $projectId === -1}
                <small class="info-box warning">bitte öffne oder erstelle ein neues Projekt</small>
                {:else if $readOnlyMode}
                <small class="info-box info">read only Modus: Änderung werden nicht gepeichert</small>
                {:else if !$loggedIn}
                <small class="info-box info">bitte melde dich an um Projekte zu speichern</small>
                {:else}
                <small>Projekt ownerId: {$projectOwnerId}</small>
                <small>Projekt ID: {$projectId}</small>
                <small>Synth ID: {$seqPatternIdStore}</small>
                <small>Drum ID: {$drumPatternIdStore}</small>
                {/if}
            </div>
        {/if}
</div>
{/if}


<style>
    .msg {
        text-align: center;
    }

    .info-box {
        padding: 1%;
        margin-bottom: 1%;
        border-radius: 8px;
    }
    .warning {
        background: #ff0000;
        color: rgb(255, 255, 255);
    }

    .info {
        background: #a5a5a5;
        color: rgb(3, 3, 3);
    }
    .loading {
        position: relative;
        top: 8em
    }
    .container {
        display: flex;
        flex-flow: column nowrap;
        height: 100%;
        width: 100%;
    }

    .project-info {
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 1rem;
    }

    .project-info div {
        text-align: center;
    }

    .button-container {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
    }

    .button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 0.5rem;
    }

    .save-button {
        background-color: #007bff;
        color: white;
    }

    .cancel-button {
        background-color: #dc3545;
        color: white;
        cursor: pointer;
    }

    .edit-button {
        background-color: #007bff;
        color: white;
    }

    .input-field {
        margin-bottom: 0.5rem;
    }

    .input-field label {
        display: block;
        margin-bottom: 0.5rem;
    }

    .input-field input,
    .input-field textarea {
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .input-checkbox {
        display: flex;
        flex-flow: row nowrap;
        padding: 1em 2em;
        justify-content: space-evenly;
    }

    .header {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        background: #343434;
        border-radius: 8px;
        height: 3em;
        margin: 0.1em;
        font-size: 1.2em;
    }

    .header button {
        margin-left: auto;
        margin: 1em;
        width: 3.5em;
        height: 70%;
        border-radius: 8px;
        border: none;
        font-size: 1em;
        text-align: center;
    }

    .header p {
        margin: auto;
    }

    .hidden {
        visibility: hidden;
    }

    .body.input-field {
        margin: 1em 2em;
    }

    .body.project-info .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
        font-size: 1.2em;
    }

    .user {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        width: 100%;
        justify-content: center;
        gap: 1em;
    }

    #description {
        height: 5em;
        resize: none;
    }

    .pfp {
        position: relative;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        z-index: 1;
    }

    .ids {
        display: flex;
        justify-content: space-around;
        align-self: flex-end;
        width: 100%;
        color: rgb(161, 161, 161);
    }

    .body {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        text-align: center;
        gap: 1em;
    }

    .likes {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .likes svg {
        fill: #ff0000;
        margin-right: 5px;
    }

    .like-button svg {
        fill: rgb(161, 161, 161);
    }

    .like-button {
        background: none;
        border: none;
        cursor: pointer;
    }

    .like-button svg {
        transition: fill 0.3s ease;
    }

    .like-button svg:hover {
        fill: #ff0000;
    }
</style>
