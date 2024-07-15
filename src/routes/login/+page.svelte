<script lang="ts">
  import { goto } from "$app/navigation";
  import { loggedIn, updateDrumState } from "$lib/stores";
  import { Input, Button, Alert } from "@sveltestrap/sveltestrap";
  import Bottomtext from "../../lib/components/Footer/Bottomtext.svelte";
    import LoadingIndicator from "$lib/components/UiComponentes/loadingIndicator.svelte";

  let username = "";
  let password = "";
  let alert = { message: "", isOpen: false };
  let isLoading = false;

  async function handleAnmelden() {
    alert.message = "";
    alert.isOpen = false;
    try {
      isLoading = true;
      const response = await fetch("http://localhost:3999/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const responseData = await response.json();

      if (response.ok) {
        localStorage.setItem("jwtToken", responseData.loginData.token);
        localStorage.setItem("userId", responseData.loginData.id);
        localStorage.setItem("username", responseData.loginData.username);
        loggedIn.update(() => true)
        goto("./home");
        console.log("Erfogreich angemeldet");
      } else {
        console.log(responseData.message);
        alert.message = responseData.message;
        alert.isOpen = true;
        console.error("Fehler beim Einloggen:", responseData.message);
      }
    } catch (error) {
      console.error("Es gab ein Problem mit der Fetch-Anfrage:", error);
    } finally {
      isLoading = false;
    }
  }
</script>

<!-- svelte-ignore a11y-invalid-attribute -->

<div class="page">
  <!-- <div><LoadingIndicator/></div> -->
  <div class="container">
    <form
      on:submit|preventDefault={handleAnmelden}
      style="display: flex; flex-direction: column; align-items: center;"
    >
      <img src="/Logo/Logo.png" width="500" height="500" alt="Logo" />
      <div class="alert-container">
        {#if alert.isOpen}
          <span>{alert.message}</span>
        {/if}
      </div>
      <input
        type="text"
        id="username"
        placeholder="Benutzername"
        bind:value={username}
        style="text-align: center;"
      />
      <input
        type="password"
        id="password"
        placeholder="Passwort"
        bind:value={password}
        style="text-align: center;"
      />
      <div class="button-container">
        <button type="submit">Anmelden</button>
        <a href="/registration">
          <button type="submit">Registrieren</button>
        </a>
      </div>
      <a href="/resetPasswordForm" class="forget">Passwort vergessen?</a>
    </form>
  </div>
</div>


<Bottomtext />

<div class="continue">
  <a href="/home"> <button>ohne Login weiter</button></a>
</div>

<style>
  .page {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0;
    padding: 20px;
    box-sizing: border-box;
    /* background: green; */
  }

  .page{
    background: linear-gradient(-45deg, #272727, #1a1a1a, #272727);
    background-size: 400% 400%;
    animation: gradient 30s linear infinite;
    height: 100vh;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .container img {
    border-radius: 8px;
  }

  .container {
    width: 100%;
    max-width: 40%;
    margin: 0 auto;
    padding: 20px;
    background-color: #272727;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.3);
  }

  input[type="text"],
  input[type="password"] {
    width: 40%;
    padding: 10px;
    margin-bottom: 15px;
    background: hsl(0, 0%, 93%);
    border: 1px solid hsl(0, 0%, 50%, 40%);
    border-radius: 50px;
    box-shadow: 0 5px 6px rgba(0, 0, 0, 0.4);
  }

  button {
    padding: 5px;
    border: 1px solid #c1c1c1;
    background-color: hsl(0, 0%, 93%);
    color: rgb(0, 0, 0);
    border-radius: 30px;
    cursor: pointer;
    padding-left: 4em;
    padding-right: 4em;
    box-shadow: 0 5px 6px rgba(0, 0, 0, 0.4);
  }

  button[type="submit"]:hover,
  button[type="submit"]:focus {
    background-color: #ccc;
  }

  .button-container {
    width: 100%;
    display: flex;
    gap: 1em;
    justify-content: center;
  }

  .forget {
    color: #3ea2ff;
    margin: 15px 10px;
    font-weight: bold;
  }

  .continue {
    max-width: 15%;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .alert-container {
    width: 100%;
    color: rgb(255, 0, 0);
    padding-bottom: 0.8rem;
    text-align: center;
    z-index: 1000;
  }
</style>
