<script>
  import { Button } from "$lib/components/ui/button";

  import { tournamentData, priorities, resetState } from "$lib/state.js";
  import { selectTournamentWinner } from "$lib/tournament.js";

  // Reactive assignment to have an up-to-date list of priorities.
  let localPriorities = [];
  $: localPriorities = $priorities;

  function handleSelect(winner) {
    // Update tournament state when a winner is selected.
    tournamentData.update((data) => {
      return selectTournamentWinner(data, winner, localPriorities);
    });
  }
</script>

<section class="tournament">
  <h2>Tournament Bracket</h2>
  {#if $tournamentData.tournamentPairs[$tournamentData.tournamentIndex]}
    <p>
      Compare:
      <strong
        >{$tournamentData.tournamentPairs[
          $tournamentData.tournamentIndex
        ][0]}</strong
      >
      {#if $tournamentData.tournamentPairs[$tournamentData.tournamentIndex].length > 1}
        VS
        <strong
          >{$tournamentData.tournamentPairs[
            $tournamentData.tournamentIndex
          ][1]}</strong
        >
      {/if}
    </p>
    <div class="duel-buttons">
      <Button
        on:click={() =>
          handleSelect(
            $tournamentData.tournamentPairs[$tournamentData.tournamentIndex][0],
          )}
      >
        {$tournamentData.tournamentPairs[$tournamentData.tournamentIndex][0]}
      </Button>
      {#if $tournamentData.tournamentPairs[$tournamentData.tournamentIndex].length > 1}
        <span>VS</span>
        <Button
          on:click={() =>
            handleSelect(
              $tournamentData.tournamentPairs[
                $tournamentData.tournamentIndex
              ][1],
            )}
        >
          {$tournamentData.tournamentPairs[$tournamentData.tournamentIndex][1]}
        </Button>
      {/if}
    </div>
  {:else}
    <p>Preparing next round...</p>
  {/if}
  <Button on:click={resetState}>Start Over</Button>
</section>
