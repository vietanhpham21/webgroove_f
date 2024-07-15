<script>
  // @ts-nocheck
  import VeriyEmail from "$lib/components/veriyEmail.svelte";
  export let data;
</script>

<style>
  .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      text-align: center;
  }

  .message {
      font-size: 1.2em;
      margin-bottom: 20px;
      color: #ffffff;
  }
</style>

<div class="container">
  {#if data.status === ''}
      <p class="message">Verifiziere deine E-Mail-Adresse...</p>
  {:else if data.status === 'success'}
      <p class="message">Deine E-Mail-Adresse wurde erfolgreich verifiziert! Du kannst die Seite nun schließen.</p>
  {:else if data.status === 'false'}
      <p class="message">Verifikation fehlgeschlagen. Bitte überprüfe den Link oder kontaktiere den Support.</p>
  {:else if data.status === 'invalid'}
      <p class="message">Ungültiger Verifikationslink.</p>
  {/if}
</div>
