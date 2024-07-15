<script>
// @ts-nocheck

    import Bottomtext from "$lib/components/Footer/Bottomtext.svelte";
    import Navbar2 from "$lib/components/Navbar/NavbarHome.svelte";
    import { onMount } from "svelte";
    import { checkForLoginContext, resetProjectData } from "$lib/components/Navbar/NavbarLogic";
    import VeriyEmail from "$lib/components/veriyEmail.svelte";
    import { bpmStore, loggedIn, resetProject, showOpenProjectDialog, fetchUrl, projectOwner } from "$lib/stores";
    import PublicProjects from "$lib/components/publicProjects.svelte";
    import OpenProjectDialog from "$lib/components/Navbar/Modals/openProjectDialog.svelte";
    import Synthesizer from "$lib/components/Synthesizer.svelte";
    import Drummachine from "$lib/components/Drummachine.svelte";
    import Debuginfo from "$lib/components/Debuginfo.svelte";
    import { goto } from "$app/navigation";
    
    onMount(() => {
        checkForLoginContext();
    });

    function navigateToApp() {
        resetProjectData()
        goto("/synthesizer")
    }

    function navigateToAppNoUser() {
        projectOwner.set('')
        resetProjectData()
        goto("/synthesizer")
    }
    
    function openProject() {
        showOpenProjectDialog.set(true)
    }

    export function cancelSave() {
        showOpenProjectDialog.set(false);
    }

</script>

<Navbar2/>
<div class="container">
    <div class="introduction">
        <div class="introduction-text">
            <h1>WEBGROOVE<br></h1>
            <h2>Melodien und Beats erstellen</h2>
            <ul>
                <li>Coole vielfältige Synthesizer</li>
                <li>Breite Auswahl an Drumkits</li>
                <li>Teile deine Musik und erlebe die Meisterwerke anderer User</li>
            </ul>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="links">
                {#if !$loggedIn}
                <a class="cta-button" on:click={navigateToAppNoUser}>ohne Login loslegen</a>
                <a class="register-link" href="./registration">registriere dich hier</a>
                {:else}
                <a class="cta-button" on:click={navigateToApp}>neues Projekt erstellen</a>
                <a class="cta-button" on:click={openProject}>Projekt öffnen</a>
                {/if} 
                
            </div>
        </div>
        <div class="introduction-images">
            <div class="image-container">
                <img class="stepseq-img" src="/Icons/synth2.png" alt="stepsequencer"/>
            </div>
            <div class="image-container">
                <img class="like-img" src="/Icons/heart.png" alt="like"/>
            </div>
            <div class="image-container">
                <img class="note-img" src="/Icons/NoteIcon.jpg" alt="Note"/>
            </div>
            <div class="image-container">
                <img class="drums-img" src="/Icons/drums.png" alt="drums"/>
            </div>
        </div>
    </div>
</div>
<div class="container public">
    <div id= "publicProjects" class="public-projects">
        <PublicProjects/>
    </div>
</div>
{#if $showOpenProjectDialog}
    <OpenProjectDialog
        cancelSave={cancelSave}
    />
{/if}
<!-- <Debuginfo></Debuginfo> -->
<div class="hidden">
    <Synthesizer />
    <Drummachine/>
  </div>
<Bottomtext/>

<style>
     .hidden {
    display: none;
    }
    /*Navigation*/
    .container {
        margin-top: 6em;
        display: flex;
        justify-content: center;
        padding: 0 1rem;
    }

    .container.public {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0 1rem;
        margin-top: 5em;
    }

    .public-header {
        width: 100%;
        max-width: 1600px;
        display: flex;
        justify-content: center;
        margin-bottom: 1.5rem;
    }

    .public-header h2 {
        font-size: 2rem;
        color: #ffffff;
        text-align: center;
    }

    .public-projects {
        color: rgb(0,0,0);
        background: #e3e4e6;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        gap: 5rem;
        max-width: 1600px;
        width: 100%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
    }

    .navigation {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        margin-top: 1vw;
        margin-bottom: 1vw;
        gap: 5rem;
        max-width: 1200px;
        width: 100%;
        background-color: #e3e4e6;
        border-radius: 8px;
    }

    /*Introduction Teil*/
    .introduction {
        background: #e3e4e6;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        margin-top: 2vw;
        gap: 5rem;
        max-width: 1600px;
        width: 100%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
    }

    .introduction-text {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 2rem;
        background-color: #e3e4e6;
        border-radius: 8px;
    }

    h1 {
        font-weight: 700;
        font-size: 3rem;
        margin-bottom: 0;
        color: #333;
        text-align: left;
    }

    h2 {
        font-weight: 700;
        font-size: 1.8rem;
        margin-bottom: 1rem;
        color: #333;
        text-align: left;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    ul li {
        font-size: 1.2rem;
        margin-bottom: 0.2rem;
        color: #555;
    }

    .projects-list li {
        font-size: 1rem;
        margin-bottom: 0.5rem;
        color: #666;
    }

    .introduction-images {
        width: 30%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 2rem;
        padding: 2rem;
        border-radius: 8px;
        margin: 10px;
        position: relative;
        right: 3vw;
    }

    .image-container {
        position: relative;
        width: 100%;
        padding-top: 100%; 
        overflow: hidden;
    }

    .image-container img {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        object-fit: contain;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
        border-radius: 8px;
    }

    .links {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    .cta-button, .register-link {
        cursor: pointer;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border-radius: 5px;
        text-decoration: none;
        text-align: center;
        transition: background-color 0.3s ease, transform 0.3s ease;
    }

    .cta-button {
        background-color: #007BFF;
        color: white;
    }

    .cta-button:hover {
        background-color: #0056b3;
        transform: scale(1.05);
    }

    .register-link {
        background-color: #28a745;
        color: white;
    }

    .register-link:hover {
        background-color: #218838;
        transform: scale(1.05);
    }

    @media (max-width: 768px) {
        .introduction {
            flex-direction: column;
            align-items: center;
        }

        .introduction-text, .introduction-images {
            width: 100%;
            margin-left: 0;
            margin-right: 0;
        }

        .introduction-text {
            margin-bottom: 2rem;
        }

        .introduction-images {
            padding: 1rem;
        }

        .image-container img {
            max-width: 100px;
            max-height: 100px;
        }
    }

    @media (min-width: 1200px) {
        .image-container img {
            max-width: 200px;
            max-height: 200px;
        }
    }
</style>
