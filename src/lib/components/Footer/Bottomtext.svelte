<script>
  // Dein JavaScript Code hier, falls benötigt
</script>

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>
<!-- svelte-ignore a11y-invalid-attribute -->
<!-- svelte-ignore a11y-missing-content -->
<div class="footer-bar">
  <div class="socialmedia" aria-hidden="true">
    <a href="#" class="fa fa-facebook"></a>
    <a href="#" class="fa fa-twitter"></a>
    <a href="#" class="fa fa-instagram"></a>
  </div>
  <div class="links">
    <a href="/agb" class="footer-link">AGB</a>
    <a href="/impressum" class="footer-link">Impressum</a>
    <a href="/datenschutz" class="footer-link">Datenschutz</a>
  </div>
  <div class="trademark">
    <small>WebGroove™ 2024 - Alle Rechte vorbehalten</small>
  </div>

</div>

<style>
  .footer-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 1rem 0;
    margin-top: 4vw;
    background: rgb(0, 0, 0);
    position: relative;
    bottom: 0;
    width: 100%;
    height: 200px;
    /* margin-top: 20px; */
    color: #c2c2c2;
    font-size: 0.9rem;
    text-align: center;
  }

  .links {
    display: flex;
    justify-content: center;
    padding: 1rem;
  }

  .footer-link {
    margin: 0 1rem;
    color: #c2c2c2;
    text-decoration: none;
  }

  .footer-link:hover {
    color: #ffffff;
  }

  .trademark {
    margin-top: 10px;
  }

  .fa {
    padding: 20px;
    font-size: 30px;
    width: 30px;
    text-align: center;
    text-decoration: none;
    border-radius: 50%;
    color: rgb(255, 255, 255);
    transition: all 0.3s ease; 
  }

  .fa:hover {
    transform: scale(1.2); 
    color: white; 
  }
</style>
