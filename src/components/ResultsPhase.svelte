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

<section class="results-phase">
  <h2>Final Ranking</h2>
  <p class="subtitle">Here are your priorities in order of importance</p>

  {#if finalRanking && finalRanking.length}
    <div class="results-container">
      <p class="top-priority">
        Top Priority: <strong class="priority-text">{finalRanking[0]}</strong>
      </p>

      <div class="table-container">
        <table class="results-table">
          <thead>
            <tr>
              <th class="rank-column">Rank</th>
              <th class="priority-column">Priority</th>
            </tr>
          </thead>
          <tbody>
            {#each finalRanking as item, index}
              <tr class={index === 0 ? "top-rank" : ""}>
                <td class="rank-cell">{index + 1}</td>
                <td class="priority-cell">{item}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {:else}
    <p class="preparing-text">No final ranking available.</p>
  {/if}

  <div class="button-container">
    <Button
      variant="outline"
      size="lg"
      class="reset-button"
      on:click={resetState}
    >
      Start Over
    </Button>
  </div>
</section>

<style>
  h2 {
    font-size: 2rem;
    margin-bottom: 0.5em;
    line-height: 1.2em;
    font-weight: bold;
  }

  p {
    font-size: 1em;
    line-height: 1.75em;
    margin-bottom: 1em;
  }

  .subtitle {
    color: #666;
    margin-bottom: 1.5rem;
  }

  .results-phase {
    max-width: 800px;
    margin: 0 auto;
    padding: 1.5rem;
    text-align: center;
  }

  .results-container {
    background: rgba(20, 171, 227, 0.05);
    border: 1px solid rgba(20, 171, 227, 0.2);
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem auto;
    box-shadow: 0 2px 8px rgba(20, 171, 227, 0.1);
    max-width: 600px;
  }

  .top-priority {
    font-size: 1.3rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(20, 171, 227, 0.2);
  }

  .priority-text {
    color: #14abe3;
    font-weight: 600;
    font-size: 1.5rem;
  }

  .table-container {
    overflow-x: auto;
    margin: 0 auto;
  }

  .results-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 auto;
    text-align: left;
  }

  .results-table th {
    background-color: rgba(20, 171, 227, 0.1);
    color: #14abe3;
    font-weight: 600;
    padding: 0.8rem 1rem;
    text-align: center;
  }

  .results-table td {
    padding: 0.8rem 1rem;
    border-bottom: 1px solid rgba(20, 171, 227, 0.1);
  }

  .results-table tr:last-child td {
    border-bottom: none;
  }

  .results-table tr:hover td {
    background-color: rgba(20, 171, 227, 0.05);
  }

  .top-rank td {
    background-color: rgba(20, 171, 227, 0.1);
    font-weight: 600;
  }

  .rank-column {
    width: 80px;
  }

  .rank-cell {
    text-align: center;
    font-weight: 600;
  }

  .priority-cell {
    text-align: center;
  }

  .preparing-text {
    font-size: 1.2rem;
    font-weight: 500;
    color: #14abe3;
    animation: pulse 2s infinite;
    margin: 2rem 0;
  }

  .button-container {
    width: 100%;
    max-width: 250px;
    margin: 2rem auto 0;
    display: flex;
    justify-content: center;
  }

  .button-container :global(.reset-button) {
    width: 100%;
    padding: 0.7rem 1rem;
    font-size: 1rem;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  @keyframes pulse {
    0% {
      opacity: 0.8;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      opacity: 0.8;
      transform: scale(1);
    }
  }

  /* Responsive styling for different screen sizes */
  @media (max-width: 768px) {
    .results-container {
      padding: 1.5rem;
    }

    .top-priority {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
    }

    .priority-text {
      font-size: 1.3rem;
    }

    .results-table th,
    .results-table td {
      padding: 0.6rem 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .results-phase {
      padding: 1rem;
    }

    .results-container {
      padding: 1rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    .top-priority {
      font-size: 1.1rem;
      margin-bottom: 1.2rem;
    }

    .priority-text {
      font-size: 1.2rem;
    }

    .results-table th,
    .results-table td {
      padding: 0.5rem 0.6rem;
      font-size: 0.9rem;
    }
  }
</style>
