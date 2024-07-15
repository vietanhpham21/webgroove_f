
<script>
    // @ts-nocheck
    import { goto } from "$app/navigation";

    export let closeSuccessModal;

    function handleConfirm() {
        closeSuccessModal()
        goto("./login")
    }


</script>
<div class="dialog-overlay">
        <div class="container">
            <h1>Registrierung erfolgreich!</h1>
            <p>Vielen Dank für Ihre Registrierung. Bitte überprüfe deine Ihre E-Mail-Adresse, um den Registrierungsvorgang abzuschließen.</p>
            <button on:click={handleConfirm}>weiter</button>
        </div>
</div>



<style>
    .dialog-overlay {
        position: fixed;
        top: 0; /* Höhe der Navigationsleiste */
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(8px); /* Hintergrund verschwimmen */
        z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgb(0, 0, 0);
    }

    .container {
        color: rgb(0, 0, 0);
        flex-flow: column nowrap;
        background-color: #d9d9d9;
        padding: 2em;
        border-radius: 15px;
        text-align: center;
        padding-bottom: 1em;
    }

    p {
        margin-bottom: 20px;
    }


    button {
        margin: 0.5rem;
        padding: 0.5rem 1.5rem;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        transition: background-color 0.3s, transform 0.2s;
    }


    button {
        background-color: #0B5ED7;
        color: white;
    }

    button:hover {
        background-color: #0B5ED7;
        transform: scale(1.05);
    }
</style>
