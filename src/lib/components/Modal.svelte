<!-- Modal.svelte -->
<script>
    export let show = false;
    export let message = "Modal Message";
    export let onConfirm;
    export let onCancel;
</script>

<style>
    .modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
    color: black;
    backdrop-filter: blur(5px); /* Weichzeichnungseffekt */
    -webkit-backdrop-filter: blur(5px); /* Unterstützung für ältere Webkit-basierte Browser */
}

    .modal.show {
        display: block;
    }
    .modal-content {
        position: relative;
        margin: auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        max-width: 500px;
        background-color: #d9d9d9;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
    }
    .modal-body {
        flex: 1;
        padding: 10px;
    }
    .modal-footer {
        display: flex;
        justify-content: space-between;
        padding-top: 10px; /* Kannst du nach Bedarf anpassen */
        margin-top: auto; /* Statt 10px */
        border-top: none; /* kein Strich oben im footer */
    }

    .btn {
        padding: 10px 20px;
        margin: 5px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .btn-confirm {
        background-color: #dc3545;
        color: white;
    }
    .btn-confirm:hover {
        background: #c82333;
        transform: scale(1.1);
    }
    .btn-cancel {
        background-color: #007bff;
        color: white;
    }
    .btn-cancel:hover {
        background: #0056b3;
        transform: scale(1.1);
    }
</style>

<div class="modal {show ? 'show' : ''}">
    <div class="modal-content">
        <div class="modal-body">
            <p>{message}</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-cancel" on:click={onCancel}>Abbrechen</button>
            <button class="btn btn-confirm" on:click={onConfirm}>Löschen</button>
        </div>
    </div>
</div>
