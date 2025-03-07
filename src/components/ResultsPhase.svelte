<script>
  import { Button } from "$lib/components/ui/button";

  import {
    chosenMethod,
    mergeSortData,
    roundRobinData,
    tournamentData,
    resetState,
  } from "$lib/state.js";

  $: finalRanking =
    $chosenMethod === "merge"
      ? $mergeSortData.finalRanking
      : $chosenMethod === "roundrobin"
        ? $roundRobinData.finalRanking
        : $tournamentData.finalRanking;
</script>

<section>
  <h2>Final Ranking</h2>
  {#if finalRanking && finalRanking.length}
    <p>Top Priority: <strong>{finalRanking[0]}</strong></p>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        {#each finalRanking as item, index}
          <tr>
            <td>{index + 1}</td>
            <td>{item}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p>No final ranking available.</p>
  {/if}
  <Button on:click={resetState}>Start Over</Button>
</section>
