<script lang="ts">
    // @ts-nocheck
    import Bottomtext from '$lib/components/Footer/Bottomtext.svelte';

    let email;

    async function sendEmail() {
        console.log("sende Email");
        const data = { email: email };
        try {
            const response = await fetch(
                "https://webgroove-82906d5c43b2.herokuapp.com/api/user/sendResetEmail",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                },
            );
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
            }
            // Falls Fetch fehlschlägt
        } catch (error) {
            console.log(error);
        }
    }

</script>
<div class="container">
    <div class="reset-form">
        <h2>Passwort zurücksetzen</h2>
        <p>Bitte geb ein deine E-Mail-Adresse, damit wir dir einen Resetlink senden können</p>
        <form on:submit|preventDefault={sendEmail} method="POST">
            <input
                type="email"
                name="email"
                placeholder="E-Mail-Adresse"
                required
                bind:value={email}
            />
            <button type="submit">Senden</button>
        </form>
    </div>
</div>

<style>
    .container {
        width: 100%;
        display: flex;
        justify-content: center; /* Horizontal zentrieren */
        align-items: center; /* Vertikal zentrieren */
        padding: 2em 0; /* Vertikaler Abstand anpassen */
    }

    .reset-form {
        color: black;
        width: 25%; /* Breite des Formulars auf 25% der Bildschirmbreite setzen */
        max-width: 400px; /* Maximalbreite des Formulars festlegen */
        padding: 1em; /* Innenabstand des Formulars anpassen */
        box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.3); /* Schatten hinzufügen */
        background-color: #D9D9D9; /* Hintergrundfarbe des Formulars */
    }

    .reset-form h2 {
        text-align: center; /* Überschrift zentrieren */
    }

    .reset-form p{
        text-align: center;
    }

    .reset-form input {
        width: 100%; /* Eingabefeld auf volle Breite des Containers setzen */
        padding: 10px;
        margin: 10px 0;
        box-sizing: border-box;
    }

    .reset-form button {
        width: 25%; /* Button auf volle Breite des Containers setzen */
        padding: 10px;
        margin: 10px auto; /* Horizontale Zentrierung des Buttons durch automatische Margins */
        box-sizing: border-box;
        background-color: #007BFF;
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        transition: transform 0.3s ease; /* Übergangseffekt für die Transformation hinzufügen */
    }

    .reset-form button:hover {
        background-color: #0056b3;
        transform: scale(1.1); /* Vergrößern des Buttons um 10% bei Hover */
    }
</style>

<Bottomtext/>
