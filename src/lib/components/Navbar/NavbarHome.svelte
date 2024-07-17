<script>
    // @ts-nocheck
    import { goto } from "$app/navigation";

    import BpmAnzeiger from "$lib/components/BpmAnzeiger.svelte";
    import { bpmStore, rows, projectNameStore, projectIsPublic, loggedIn, formatBase64Image, readOnlyMode, showNewProjectDialog } from "$lib/stores";
    import { onMount } from "svelte";
    import LogoutDialog from "./Modals/LogoutDialog.svelte";
    import NewProjectDialog from "./Modals/newProjectDialog.svelte";
    import OpenProjectDialog from "./Modals/openProjectDialog.svelte";
    import { resetProjectData } from "./NavbarLogic";

    let hamburgerWrapper;
    let navMenu;
    let isActive = false;
    let showSaveProjectDialog = false;
    let showOpenProjectDialog = false;
    let showLogoutDialog = false;

    let projectName;
    let isPublic;
    let pictureUrl;

    async function getProfilePicture() {
        pictureUrl = "/Logo/Logo.png";
        try {
            const response = await fetch(`https://webgroove-82906d5c43b2.herokuapp.com/api/user/${localStorage.getItem("userId")}/profile-picture`,
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

    $: if(!$loggedIn || $loggedIn) {
        getProfilePicture()
    }

    function toggleActiveClass() {
        isActive = !isActive;
    }

    function closeMenu() {
        isActive = false;
    }

    function handleClickOutside(event) {
        if (isActive && !hamburgerWrapper.contains(event.target)) {
            isActive = false;
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
        goto("./synthesizer");
        showNewProjectDialog.set(true);
    }

    function openProject() {
        if ($loggedIn) {
            showOpenProjectDialog = true;
        }
    }

    function saveProject() {
        if ($loggedIn) {
            showSaveProjectDialog = true;
        }
    }

    function cancelSave() {
        showOpenProjectDialog = false;
        showSaveProjectDialog = false;
        projectName = "";
    }

    function confirmLogout() {
        loggedIn.set(false);
        localStorage.clear();
        showLogoutDialog = false
        goto("./home");
    }

    function cancelLogout() {
        showLogoutDialog = false;
    }

    function initiateLogout() {
        showLogoutDialog = true;
    }

    function handleLogin() {
        goto("./login")
    }

    function navigateToProfile() {
        goto('/profil'); // Hier die URL deiner Profilseite angeben
    }
</script>

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
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <!-- svelte-ignore a11y-invalid-attribute -->

        <ul class="nav-menu {isActive ? 'active' : ''}" bind:this={navMenu}>
            <li class="nav-item">
                {#if $loggedIn}
                    <a href="javascript:void(0);" on:click={navigateToProfile} class="nav-link">{localStorage.getItem("username")}</a>
                {:else}
                    <a href="/login" class="nav-link">Anmelden oder Registrieren</a>
                {/if}
                <img class="pfp" src={pictureUrl} alt="Pictures" />
            </li>
            <li class="nav-item">
                <a href="javascript:void(0);" on:click={newProject} class="nav-link" class:disabled={!$loggedIn}>New</a>
            </li>
            <li class="nav-item">
                <a href="#" on:click={openProject} class="nav-link" class:disabled={!$loggedIn}>Open</a>
            </li>
            <li class="nav-item">
                <a href="#" on:click={initiateLogout} class="nav-link" class:disabled={!$loggedIn}>Logout</a>
            </li>
        </ul>
        {#if !$loggedIn}
        <div class="nav-elements login"><button on:click={handleLogin}>Login</button></div>
        {/if}


    </nav>
</header>

<slot />

{#if showSaveProjectDialog}
    <NewProjectDialog
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

    .nav-elements.login button{
        font-size: 15px;
        font-weight: bold;
        padding: 5px 10px 5px 10px;
        border-radius: 8px;
        border: 1px solid rgb(100, 100, 100);
        background: none;
        color:#d9d9d9;
        cursor: pointer;
        transition: color 0.3s ease;

    }

    .nav-elements.login button:hover{
        background:#d9d9d9;
        color:#000000
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

    .navbar {
        background: #000000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        padding: 1rem 1.5rem;
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 100;
        border-bottom: 2px rgba(51, 51, 51, 0.8) solid;
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
    /* .nav-menu {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    } */

    .nav-item {
        padding-left: 1rem;
        /* margin: 0.5rem 0.5rem; */
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
</style>