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
  <p class="subtitle">Your ranked priorities are ready to act on.</p>

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
  .results-phase {
    margin: 0 auto;
    padding: 1.35rem 0.2rem;
    text-align: center;
    min-height: 70vh;
  }

  h2 {
    margin: 0;
    font-size: clamp(1.55rem, 2.8vw, 2.15rem);
    line-height: 1.2;
  }

  .subtitle {
    color: rgba(8, 51, 68, 0.75);
    margin: 0.4rem 0 0;
  }

  .results-container {
    background: rgba(255, 255, 255, 0.82);
    border: 1px solid rgba(8, 51, 68, 0.14);
    border-radius: 18px;
    padding: 2rem;
    margin: 2rem auto;
    box-shadow: 0 14px 28px rgba(8, 51, 68, 0.08);
    max-width: 720px;
    backdrop-filter: blur(7px);
  }

  .top-priority {
    font-size: 1.3rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(8, 51, 68, 0.15);
    color: rgba(8, 51, 68, 0.82);
  }

  .priority-text {
    color: #0d9488;
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
    background-color: rgba(8, 51, 68, 0.06);
    color: #0f766e;
    font-weight: 600;
    padding: 0.8rem 1rem;
    text-align: center;
  }

  .results-table td {
    padding: 0.8rem 1rem;
    border-bottom: 1px solid rgba(8, 51, 68, 0.1);
  }

  .results-table tr:last-child td {
    border-bottom: none;
  }

  .results-table tr:hover td {
    background-color: rgba(13, 148, 136, 0.06);
  }

  .top-rank td {
    background-color: rgba(245, 158, 11, 0.16);
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
    font-size: 1.1rem;
    font-weight: 600;
    color: #0d9488;
    animation: pulse 2s infinite;
    margin: 2rem 0;
  }

  .button-container {
    width: 100%;
    max-width: 280px;
    margin: 2rem auto 0;
    display: flex;
    justify-content: center;
  }

  .button-container :global(.reset-button) {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border-radius: 12px;
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
      padding: 1rem 0;
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
