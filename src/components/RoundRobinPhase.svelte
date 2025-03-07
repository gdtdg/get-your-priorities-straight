<script>
  import { Button } from "$lib/components/ui/button";

  import { priorities, roundRobinData, resetState } from "$lib/state.js";
  import { selectRoundRobin } from "$lib/roundRobin.js";

  // Using reactive declarations to get current priorities.
  let localPriorities = [];
  $: localPriorities = $priorities;

  function handleSelect(winner) {
    // Update the round-robin state based on the selected winner.
    roundRobinData.update((data) => {
      return selectRoundRobin(data, localPriorities, winner);
    });
  }
</script>

<section class="round-robin">
  <h2>Round-Robin Comparison</h2>
  {#if $roundRobinData.rr_i < localPriorities.length && $roundRobinData.rr_j < localPriorities.length}
    <p>
      Compare:
      <strong>{localPriorities[$roundRobinData.rr_i]}</strong>
      VS
      <strong>{localPriorities[$roundRobinData.rr_j]}</strong>
    </p>
    <div class="duel-buttons">
      <Button
        on:click={() => handleSelect(localPriorities[$roundRobinData.rr_i])}
      >
        {localPriorities[$roundRobinData.rr_i]}
      </Button>
      <span>VS</span>
      <Button
        on:click={() => handleSelect(localPriorities[$roundRobinData.rr_j])}
      >
        {localPriorities[$roundRobinData.rr_j]}
      </Button>
    </div>
  {:else}
    <p>All comparisons completed.</p>
  {/if}
  <Button on:click={resetState}>Start Over</Button>
</section>
