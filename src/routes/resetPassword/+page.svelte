<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
    import Bottomtext from '$lib/components/Footer/Bottomtext.svelte';

  let username = '';
  let email = '';
  let token = '';
  let newPassword = '';
  let showSuccessMessage = false;
  let countdown = 5; // Countdown-Zähler für den Timer

  // Extrahiere die URL-Parameter
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    username = urlParams.get('username') || '';
    email = urlParams.get('email') || '';
    token = urlParams.get('token') || '';
  });

  // Funktion zum Senden des neuen Passworts
  async function changePassword() {
    const data = { email, newPassword };

    try {
      const response = await fetch(`http://localhost:3999/api/user/changePassword/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        showSuccessMessage = true; // Zeige Erfolgsmeldung an
        // Starte den Timer für die Weiterleitung zum Login
        const timer = setInterval(() => {
          countdown--;
          if (countdown === 0) {
            clearInterval(timer);
            goto('/login'); // Weiterleitung zur Login-Seite
          }
        }, 1000); // Aktualisiere den Countdown alle 1 Sekunde
      } else {
        console.error('Fehler beim Ändern des Passworts');
      }
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="container">
  <div class="setPasswort">
    <h1 style="text-align: center;">Neues Passwort</h1>
    <p style="text-align: center;">Username: {username}</p>
    <p style="text-align: center;">E-Mail: {email}</p>
    <p><br><strong>Jetzt kannst du ein neues Passwort vergeben:</strong></p>
    <input type="password" bind:value={newPassword} placeholder="Neues Passwort" style="width: 100%; box-sizing: border-box; padding: 0.5em;">
    <button on:click={changePassword}>Passwort ändern</button>
  </div>

  {#if showSuccessMessage}
    <div class="success-message">
      Das Passwort wurde erfolgreich geändert! 
      <div class="redirect-info">
        Du wirst in Kürze weitergeleitet zum <span>Login</span> ({countdown}s).
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    width: 100%;
    display: flex;
    flex-direction: column; /* Spaltenlayout für vertikale Ausrichtung */
    justify-content: center;
    align-items: center;
    padding: 2em 0;
  }

  .setPasswort {
    color: black;
    width: 100%;
    max-width: 400px;
    padding: 1em;
    box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.3);
    background-color: #d9d9d9;
    text-align: center; /* Horizontal zentrieren */
  }

  button {
    width: 40%;
    padding: 10px;
    margin: 10px auto; /* Horizontale Zentrierung des Buttons */
    box-sizing: border-box;
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    transition: transform 0.3s ease; /* Übergangseffekt für die Transformation hinzufügen */
  }

  button:hover {
    background-color: #0056b3;
    transform: scale(1.1); /* Vergrößern des Buttons um 10% bei Hover */
  }

  .success-message {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
    text-align: center; /* Zentrum der Nachricht */
    width: 100%; /* Volle Breite */
    max-width: 400px; /* Maximale Breite */
    box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.3);
  }

  .redirect-info {
    margin-top: 10px;
    font-size: 14px;
  }

  .redirect-info span {
    font-weight: bold;
    color: #007bff;
  }
</style>
<Bottomtext/>