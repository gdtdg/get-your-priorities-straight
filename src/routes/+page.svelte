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
  <div class="aurora aurora-1" aria-hidden="true"></div>
  <div class="aurora aurora-2" aria-hidden="true"></div>
  <main class="page-main">
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
  .page-wrapper {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow: hidden;
  }

  .page-main {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .main-container {
    min-width: 320px;
    max-width: 840px;
    margin: 0 auto;
    padding: 1rem;
    text-align: center;
    width: 100%;
    flex: 1;
  }

  .aurora {
    position: absolute;
    z-index: 1;
    border-radius: 999px;
    filter: blur(60px);
    opacity: 0.6;
    pointer-events: none;
  }

  .aurora-1 {
    width: 360px;
    height: 360px;
    top: -80px;
    right: -90px;
    background: rgba(13, 148, 136, 0.35);
  }

  .aurora-2 {
    width: 320px;
    height: 320px;
    left: -120px;
    bottom: 60px;
    background: rgba(245, 158, 11, 0.22);
  }

  @media (max-width: 640px) {
    .main-container {
      padding: 0.75rem;
    }

    .aurora {
      filter: blur(42px);
    }
  }
</style>
