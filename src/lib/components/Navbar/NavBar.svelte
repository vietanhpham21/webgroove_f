<script>
    // @ts-nocheck
    import { goto } from "$app/navigation";
    import BpmAnzeiger from "$lib/components/BpmAnzeiger.svelte";
    import { bpmStore, rows, projectNameStore, projectIsPublic, loggedIn, showNewProjectDialog, formatBase64Image, readOnlyMode } from "$lib/stores";
    import { onMount } from "svelte";
    import LogoutDialog from "./Modals/LogoutDialog.svelte";
    import NewProjectDialog from "./Modals/newProjectDialog.svelte";
    import OpenProjectDialog from "./Modals/openProjectDialog.svelte";
    import { resetProjectData } from "$lib/components/Navbar/NavbarLogic";
    import SaveProjectDialog from "./Modals/saveProjectDialog.svelte";
    
    let hamburgerWrapper;
    let navMenu;
    let isActive = false;
    let showSaveProjectDialog = false;
    let showOpenProjectDialog = false;
    let showLogoutDialog = false;
    let projectName;
    let isPublic;
    let isImportable;
    let pictureUrl;

    async function getProfilePicture() {
        pictureUrl = "";
        try {
            const response = await fetch(`http://localhost:3999/api/user/${localStorage.getItem("userId")}/profile-picture`,
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

    function toggleActiveClass() {
        isActive = !isActive;
    }

    function closeMenu() {
        isActive = false;
    }

    function handleClickOutside(event) {
        try {
            if (isActive && !hamburgerWrapper.contains(event.target)) {
                isActive = false;
            } 
        } catch (error) {
            // Fehlerbehandlung
        }
    }

    onMount(() => {
        getProfilePicture();
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach((n) => n.addEventListener("click", closeMenu));
        document.addEventListener('click', handleClickOutside);
    });

    const handleBpmChange = (event) => {
        bpmStore.update(() => event.detail);
    };

    async function handleSaveSynth() {
        if ($loggedIn) {
            // Ihre Speicherlogik hier
        }
    }

    export function newProject() {
        resetProjectData();
        readOnlyMode.set(false);
        showNewProjectDialog.set(true);
    }

    export function openProject() {
        if ($loggedIn) {
            readOnlyMode.set(false);
            showOpenProjectDialog = true;
        }
    }

    export function saveProject() {
        if ($loggedIn) {
            showSaveProjectDialog = true;
        }
    }

    export function cancelSave() {
        showOpenProjectDialog = false;
        showSaveProjectDialog = false;
        showNewProjectDialog.set(false);
        projectName = "";
    }

    export function confirmLogout() {
        localStorage.clear();
        showLogoutDialog = false;
        loggedIn.set(false);
        goto("./home");
    }

    export function cancelLogout() {
        showLogoutDialog = false;
    }

    export function initiateLogout() {
        showLogoutDialog = true;
    }

    function navigateToProfile() {
        goto('/profil'); // Hier die URL deiner Profilseite angeben
    }

    let tooltipVisible = false;

    function getTooltip() {
        tooltipVisible = true; // Standardmäßig sichtbar, falls eine Bedingung zutrifft

        if (!localStorage.getItem("userId")) {
            return 'Bitte logge dich ein, um das Projekt zu speichern.';
        } else if ($projectNameStore == '') {
            return 'Keine Projektdaten vorhanden, bitte erstelle ein neues Projekt oder öffne ein vorhandenes.';
        } else if ($readOnlyMode) {
            return 'Das Projekt ist im Nur-Lesen-Modus, Änderungen sind nicht möglich.';
        }

        tooltipVisible = false; // Keine Bedingung zutrifft
        return ''; // Leerer Tooltip
    }


</script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<header class="header">
    <nav class="navbar">
        <button
            class="hamburger {isActive ? 'active' : ''}"
            bind:this={hamburgerWrapper}
            on:click={toggleActiveClass}
            aria-expanded={isActive}
            aria-label="Toggle navigation menu"
        >
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <ul class="nav-menu {isActive ? 'active' : ''}" bind:this={navMenu}>
            <li class="nav-item">
                {#if $loggedIn}
                    <a href="javascript:void(0);" on:click={navigateToProfile} class="nav-link">{localStorage.getItem("username")}</a>
                {:else}
                    <a href="./login" class="nav-link">Anmelden oder Registrieren</a>
                {/if}
                <img class="pfp" src={pictureUrl} alt="Picture" />
            </li>
            <!-- <li class="nav-item">
                <a href="javascript:void(0);" class="nav-link" class:disabled={!$loggedIn}>Share</a>
            </li> -->
            <li class="nav-item">
                <a href="javascript:void(0);" on:click={newProject} class="nav-link" class:disabled={!$loggedIn}>New</a>
            </li>
            <li class="nav-item">
                <a href="javascript:void(0);" on:click={openProject} class="nav-link" class:disabled={!$loggedIn}>Open</a>
            </li>
            <li class="nav-item">
                <a href="javascript:void(0);" 
                   on:click={saveProject} 
                   class="nav-link {(!$projectNameStore) ? 'error' : ''}" 
                   class:disabled={!$loggedIn || !$projectNameStore || $readOnlyMode} 
                   title={getTooltip()}>
                    Save Project
                    {#if !$projectNameStore}
                        <i class="fa fa-exclamation"></i>
                    {/if}
                </a>
                <span class="tooltiptext" style:visibility={tooltipVisible ? 'visible' : 'hidden'}>
                    {getTooltip()}
                </span>
            </li>
            <li class="nav-item">
                <a href="./home" class="nav-link">Home</a>
            </li>
            <li class="nav-item">
                <a href="javascript:void(0);" on:click={initiateLogout} class="nav-link" class:disabled={!$loggedIn}>Logout</a>
            </li>
        </ul>
        <div class="nav-elements bpm">
            <BpmAnzeiger on:bpmChange={handleBpmChange}></BpmAnzeiger>
        </div>
        <div class="nav-elements preset">
            <label for="presets">Preset</label>
            <select name="preset" id="presets">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
        </div>
    </nav>
</header>

<slot />

{#if $showNewProjectDialog}
    <NewProjectDialog
        projectName={projectName}
        isPublic={isPublic}
        cancelSave={cancelSave}
    />
{/if}

{#if showSaveProjectDialog}
    <SaveProjectDialog
        projectName={projectName}
        isPublic={isPublic}
        cancelSave={cancelSave}
    />
{/if}

{#if showOpenProjectDialog}
    <OpenProjectDialog
        cancelSave={cancelSave}
    />
{/if}

{#if showLogoutDialog}
    <LogoutDialog
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
    />
{/if}

<style>
    .bpm {
        position: relative;
        left: 5em;
    }
    .preset {
        visibility: hidden;
    }
    .nav-elements {
        font-size: 18pt;
    }

    .preset > select {
        width: 200px;
        height: 2rem;
        font-size: 18pt;
        text-align: center;
        margin-left: 5px;
        background: #d9d9d9;
        border-radius: 5px;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        --divider-color: rgb(214, 214, 214);
    }

    li {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    a {
        text-decoration: none;
    }

    .header {
        z-index: 100;
    }

    .navbar {
        background: rgb(0, 0, 0);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        padding: 1rem 1.5rem;
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 100;
    }

    .hamburger {
        display: none;
    }

    .bar {
        display: block;
        width: 35px;
        height: 5px;
        margin: 5px auto;
        -webkit-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out;
        background-color: #d9d9d9;
        border-radius: 10px;
    }

    .nav-item {
        padding-left: 1rem;
    }

    .nav-item:first-child {
        display: flex;
        padding-top: 1.6rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--divider-color);
    }

    .nav-item:nth-child(2) {
        padding-top: 0.8rem;
    }

    .nav-item:nth-child(3) {
        border-bottom: 2px solid var(--divider-color);
    }

    .nav-item:nth-child(4) {
        padding-top: 0.8rem;
    }

    .nav-item:nth-child(8) {
        border-bottom: 2px solid var(--divider-color);
    }

    .nav-item:nth-child(9) {
        padding-top: 0.8rem;
        border-bottom: 2px solid var(--divider-color);
    }

    .nav-item:nth-child(10) {
        padding-top: 0.8rem;
    }

    .nav-link {
        font-size: 1rem;
        font-weight: 500;
        color: #000000;
        display: inline-block;
        width: 100%;
        height: 2em;
        margin: 0;
    }

    .nav-link:hover {
        color: #482ff7;
    }

    .nav-link.disabled {
        color: #aaa;
        pointer-events: none;
    }

    .nav-link.error {
        color: red;
    }

    .nav-menu {
        display: flex;
        position: fixed;
        left: -100%;
        top: 4.5rem;
        flex-direction: column;
        background-color: #d9d9d9;
        width: 20rem;
        border-radius: 20px;
        text-align: left;
        transition: 0.3s;
        box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
        z-index: 1000;
    }

    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active .bar:nth-child(1) {
        transform: translateY(11px) rotate(45deg);
    }

    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8.5px) rotate(-45deg);
    }

    .nav-menu.active {
        left: 0;
    }

    .hamburger {
        display: block;
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
    }

    .pfp {
        position: relative;
        top: -10px;
        left: -20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    /* Tooltip container */

/* Tooltip text */
.tooltiptext {
  /* visibility: hidden; */
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
 
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

.tooltiptext::after {
  content: " ";
  position: absolute;
  top: 50%;
  right: 100%; /* To the left of the tooltip */
  margin-top: -65%;
  border-width: 5px;
  border-style: solid;
  border-color: transparent black transparent transparent;
}


</style>
