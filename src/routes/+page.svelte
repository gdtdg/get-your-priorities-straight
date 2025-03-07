<script>
  import {
    isFinished,
    isMergeSort,
    isRoundRobin,
    isTournament,
  } from "$lib/state.js";
  import InputPhase from "$components/InputPhase.svelte";
  import MergeSortPhase from "$components/MergeSortPhase.svelte";
  import RoundRobinPhase from "$components/RoundRobinPhase.svelte";
  import TournamentPhase from "$components/TournamentPhase.svelte";
  import ResultsPhase from "$components/ResultsPhase.svelte";
  import Header from "$components/Header.svelte";
  import Footer from "$components/Footer.svelte";

  // Determine the current phase based on state.
  $: phase = $isFinished
    ? "results"
    : $isMergeSort
      ? "merge"
      : $isRoundRobin
        ? "roundrobin"
        : $isTournament
          ? "tournament"
          : "input";
</script>

<Header />
<main>
  <div class="main-container">
    {#if phase === "input"}
      <InputPhase />
    {:else if phase === "merge"}
      <MergeSortPhase />
    {:else if phase === "roundrobin"}
      <RoundRobinPhase />
    {:else if phase === "tournament"}
      <TournamentPhase />
    {:else}
      <ResultsPhase />
    {/if}
  </div>
</main>
<Footer />

<style>
  main {
    padding-top: 130px;
  }
  .main-container {
    min-width: 320px;
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    text-align: center;
    width: 100%;
    @media (min-width: 1280px) {
      max-width: 76rem;
      padding-left: 0;
      padding-right: 0;
    }
  }
  /* TODO: delete */
  /* Typography */
  p {
    font-size: 1em;
    line-height: 1.75em;
    margin-bottom: 1em;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-bottom: 0.5em;
    line-height: 1.2em;
    font-weight: bold;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.75rem;
  }

  h4 {
    font-size: 1.5rem;
  }

  h5 {
    font-size: 1.25rem;
  }

  h6 {
    font-size: 1rem;
  }

  ul,
  ol {
    margin-bottom: 1em;
    padding-left: 1.5em;
  }

  li {
    font-size: 1em;
    line-height: 1.75em;
    margin-bottom: 0.5em;
  }
</style>
