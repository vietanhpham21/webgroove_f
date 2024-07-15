<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import LoadingIndicator from "./UiComponentes/loadingIndicator.svelte";
    import { loggedIn } from "$lib/stores";
    let isVerified;
    let isLoading = true; 

    onMount(() => {
        if($loggedIn) {
            getVerifiedStatus(); 
        } else {
            isLoading = false
        }
    });

    async function getVerifiedStatus() {
        const userId = localStorage.getItem("userId");
        const url = `https://webgroove-82906d5c43b2.herokuapp.com/api/user/getVerifytoken?userId=${userId}`;
        let verificationToken;
        try {
            const response = await fetch(url, { method: "GET" });

            if (response.ok) {
                const responseData = await response.json();
                verificationToken = responseData.verificationToken;
                isVerified = true;
            } else {
                console.error(
                    "Konnte Status nicht überprüfen:",
                    response.status,
                    response.statusText,
                );
                isVerified = false;
            }
        } catch (error) {
            console.error("Konnte Status nicht überprüfen:", error);
            isVerified = false;
        } finally {
            isLoading = false;
        }
    }
</script>

{#if isLoading}
    <LoadingIndicator/>
{/if}

{#if typeof isVerified !== 'undefined' && !isVerified}
    <p>Deine Email ist noch nicht bestätigt</p>
    <p>Bitte überprüfe dein Postfach</p>
{/if}

{#if isVerified}
    <p>Deine Email ist bestätigt!</p>
{/if}

<style>
    p {
        color: rgb(0, 0, 0);
    }
</style>

