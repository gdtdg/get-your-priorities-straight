<script>
  import "../app.css";
  import { PUBLIC_UMAMI_SCRIPT_URL, PUBLIC_UMAMI_WEBSITE_ID } from '$env/static/public';
  let { children } = $props();
</script>

<svelte:head>
  <script defer src={PUBLIC_UMAMI_SCRIPT_URL} data-website-id={PUBLIC_UMAMI_WEBSITE_ID}></script>
</svelte:head>

{@render children()}
