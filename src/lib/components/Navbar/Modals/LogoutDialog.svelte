<script>
    // @ts-nocheck

    import { goto } from "$app/navigation";
    import { loggedIn } from "$lib/stores";

    export let onConfirm;
    export let onCancel;

    function handleConfirm() {
        onConfirm();
    }

    function handleCancel() {
        onCancel();
    }
</script>

<div class="dialog-backdrop">
    <div class="dialog">
        <p>Möchtest du dich wirklich abmelden?</p>
        <button class="confirm" on:click={handleConfirm}>Abmelden</button>
        <button class="cancel" on:click={handleCancel}>Abbrechen</button>
    </div>
</div>

<style>
    .dialog-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
    }

    .dialog {
        z-index: 5;
        color: rgb(0, 0, 0);
        flex-flow: column nowrap;
        background-color: #d9d9d9;
        padding: 2em;
        border-radius: 15px;
        text-align: center;
        padding-bottom: 1em;
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

    button.confirm {
        background-color: #ff4b5c;
        color: white;
    }

    button.confirm:hover {
        background-color: #ff1f3a;
        transform: scale(1.05);
    }

    button.cancel {
        background-color: #4b4b4b;
        color: white;
    }

    button.cancel:hover {
        background-color: #2c2c2c;
        transform: scale(1.05);
    }
</style>
