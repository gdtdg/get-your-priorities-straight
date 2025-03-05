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

<main>
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
</main>
