<script lang="ts">
    // @ts-nocheck
    import Bottomtext from "$lib/components/Footer/Bottomtext.svelte";
    import { fail } from "@sveltejs/kit";
    import countries from "$lib/countries";
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import {Input,Button,FormGroup,Form,Alert,Modal,} from "@sveltestrap/sveltestrap";
    import SuccessfulRegistrationDialog from "./SuccessfulRegistrationDialog.svelte";

    let username = "";
    let email = "";
    let password1 = "";
    let password2 = "";
    let country = "";
    let profilePic: File | null = null;
    let profilePicUrl = "";
    let showPassword = false;
    let showConfirmedPassword = false;
    let form = { success: false, error: "" };
    let acceptTerms = false;
    let isOpen = false;
    let profilePicBase64 = ""; //mudi
    

    function handleFileUpload(event: any) {
        const uploadedImg = event.target.files[0];
        profilePic = uploadedImg;
        profilePicUrl = URL.createObjectURL(uploadedImg);

        
        const reader = new FileReader();//mudi Dieser Code verwendet FileReader, um die Datei in Base64 zu kodieren, und fügt sie dem FormData hinzu, bevor das Formular gesendet wird. Damit wird sichergestellt, dass das Bild in Base64 kodiert und in der Datenbank gespeichert wird.
        reader.onload = () => {
            profilePicBase64 = reader.result.split(',')[1]; // Nur der Base64-Teil
        };
        reader.readAsDataURL(uploadedImg);
    
    
    
    
    }

    function togglePasswordVisibility() {
        showPassword = !showPassword;
        showConfirmedPassword = !showConfirmedPassword;
    }

    async function handleSubmit() {
        form.success = false;
        form.error = "";

        if (!acceptTerms) {
            form.error = "Sie müssen die AGB und Datenschutzbedingungen akzeptieren";
            return fail(422, {
                error: "Sie müssen die AGB und Datenschutzbedingungen akzeptieren",
            });
        }

        if (password1 !== password2) {
            form.error = "Passwörter stimmen nicht überein";
            return fail(422, {
                error: "Passwörter stimmen nicht überein",
            });
        }

        let formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password1);
        if(country) {
            formData.append('country', country);
        }
        if (profilePic) {
            formData.append('profilePicture', profilePicBase64);
        }
        // console.log(formData.entries)

        console.log(profilePicBase64)

        try {
            const response = await fetch("http://localhost:3999/api/user", {
                method: "POST",
                // headers: { "Content-Type": "application/json" },
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                // Erfolgreiche Antwort verarbeiten, z.B. Weiterleitung oder Anzeige einer Erfolgsmeldung
                console.log("Benutzer erfolgreich erstellt");
                // await goto('/');
                return (form.success = true);
            } else {
                // Fehlerhafte Antwort verarbeiten
                if (data.errors) {
                data.errors.forEach(error => {
                    if (error.path === 'password') {
                        form.error = "Passwort ist nicht stark genug";
                    }
                });
            }
            }
        // Falls Fetch fehlschlägt
        } catch (error) {
            console.error(
                "Es gab ein Problem mit Fetch:",
                error,
            );
            form.error= "Es gab ein Problem mit Fetch. Ist das Backend gestartet?"
        }
    }

    function closeSuccessModal() {
        isOpen = false;
        goto("./home");
    }

</script>
<svelte:head>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    />
</svelte:head>
<div class="FormContainer">
    <div id="form">
        <form on:submit|preventDefault={handleSubmit}>
            <div>
                <h2>Neuen Account erstellen</h2>
            </div>
            <div class="form-group">
                <label for="username">Benutzername*</label>
                <Input
                    name="username"
                    required
                    id="username"
                    bind:value={username}
                />
            </div>
            <div class="form-group">
                <label for="email"> Email*</label>
                <Input
                    name="email"
                    required
                    type="email"
                    id="email"
                    bind:value={email}
                />
            </div>
            <div class="form-group">
                <label for="password1">Passwort*</label>
                <span class="input-group">
                    <Input
                        name="password1"
                        required
                        type={showPassword ? "text" : "password"}
                        id="password1"
                        bind:value={password1}
                    />
                    <Button
                        class="btn btn-outline-secondary btn-sm"
                        on:click={togglePasswordVisibility}
                        type="button"
                        outline
                        size="sm"
                    >
                        {showPassword ? "Verstecken" : "Anzeigen"}
                    </Button>
                </span>
            </div>
            <div class="form-group">
                <label for="password2">Passwort bestätigen*</label>
                <span class="input-group">
                    <Input
                        name="password2"
                        required
                        type={showConfirmedPassword ? "text" : "password"}
                        id="password2"
                        bind:value={password2}
                    />
                </span>
            </div>
            <div class="form-group">
                <label for="country"> Land</label>
                <Input name="country" type="select" bind:value={country}>
                    {#each countries as country}
                        <option value={country.value}>{country.label}</option>
                    {/each}
                </Input>
            </div>
            <div class="form-group img-wrapper">
                <Input
                    name="profilePic"
                    type="file"
                    id="profilePic"
                    accept="image/*"
                    on:change={handleFileUpload}
                />
                <div class="img-container">
                    <img src={profilePicUrl} alt="Profilbild Hochladen" />
                </div>
            </div>
            <div class="form-group checkbox">
                <input type="checkbox" id="acceptTerms" bind:checked={acceptTerms}>
                <label for="acceptTerms">
                    Ich akzeptiere die <a href="/agb" target="_blank">AGB</a> und die <a href="/datenschutz" target="_blank">Datenschutzbedingungen</a>.
                </label>
            </div>
            <div class="form-group submit">
            <div><small>Pflichtfelder sind mit * markiert</small></div>
            <Button class="d-inline-block w-100" color="primary" type="submit">
                Registrieren
            </Button>
        </div>
        </form>
    </div>
</div>
{#if form.error}
    <div class="alert">
        <Alert color="danger" class="" fade dismissible={true}>
            {form.error}
        </Alert>
    </div>
{/if}

{#if form.success}
    <SuccessfulRegistrationDialog 
    closeSuccessModal={closeSuccessModal} />
{/if}

<style>
    *,
    *::after,
    *::before {
        box-sizing: border-box;
    }
    h2 {
        text-align: center;
    }
    .FormContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #272727;
        padding: 20px;
    }

    .FormContainer{
    background: linear-gradient(-45deg, #272727, #2e2e2e, #272727);
    background-size: 400% 400%;
    animation: gradient 30s linear infinite;
    /* height: 100vh; */
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

    #form {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        max-width: 600px;
        background: #595959;
        border-radius: 7px;
        padding: 20px;
        color: white;
        overflow-y: auto;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
        margin-left: 2em; 
        margin-right: 2em; 
        gap: 2px
    }
    
    .form-group.checkbox{
        display: flex;
        flex-direction: row;
        margin-bottom: 15px;
        justify-content: center;
        gap: 1em;    }

    .form-group.submit{
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
        justify-content: center;
        gap: 5px;
    }
      
    
    .img-wrapper {
        border: 1.5px ridge #dee2e6;
        background-color: rgb(255, 255, 255);
        padding: 3% 5%;
        border-radius: 7px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-width: 100%;
    }

    #form img {
        width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        overflow: hidden;
        margin-top: 2em;
        justify-content: center;
        align-items: center;
    }

    .alert {
        margin: 0;
        padding: 0;
        padding-right: 15px;
        position: absolute;
        bottom: 0;
        right: 0;
    }
</style>
