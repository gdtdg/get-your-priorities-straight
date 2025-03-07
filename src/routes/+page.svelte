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

<div class="page-wrapper">
  <main>
    <div class="main-container">
      {#if phase === "input"}
        <Header />
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
</div>

<style>
  :global(body) {
    background: linear-gradient(
      135deg,
      rgba(79, 129, 237, 0.25) 0%,
      rgba(121, 161, 240, 0.15) 40%,
      rgba(181, 204, 246, 0.08) 75%
    );
    min-height: 100vh;
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  :global(#app) {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
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
    flex: 1;
    @media (min-width: 1280px) {
      max-width: 76rem;
      padding-left: 0;
      padding-right: 0;
    }
  }
</style>
