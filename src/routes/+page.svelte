<script>
    import Login from "./login/+page.svelte";
    import Home from "./home/+page.svelte";

    import Bottomtext from "$lib/components/Footer/Bottomtext.svelte";
    import { onMount } from "svelte";
    import { checkForLoginContext } from "$lib/components/Navbar/NavbarLogic";
    
    onMount(() => {
        checkForLoginContext();
    });
</script>

<!-- <Login /> -->
<Home/>
