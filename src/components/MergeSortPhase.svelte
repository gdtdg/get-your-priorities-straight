<script>
  import { Button } from "$lib/components/ui/button";

  import { mergeSortData, resetState } from "$lib/state.js";
  import { selectMerge } from "$lib/mergeSort.js";

  let currentMerge;
  $: currentMerge = $mergeSortData.currentMerge;

  function handleSelect(winner) {
    mergeSortData.update((data) => {
      selectMerge(data, winner);
      return data;
    });
  }
</script>

<section class="mergesort-phase">
  <h2>Merge Sort Comparison</h2>
  <p class="subtitle">Choose which option you prefer between each pair</p>

  {#if currentMerge}
    <div class="comparison-container">
      <div class="duel-buttons">
        <Button
          variant="default"
          size="lg"
          class="choice-button"
          on:click={() => handleSelect("left")}
        >
          {currentMerge.left[currentMerge.leftIndex]}
        </Button>

        <span class="vs-divider">VS</span>

        <Button
          variant="default"
          size="lg"
          class="choice-button"
          on:click={() => handleSelect("right")}
        >
          {currentMerge.right[currentMerge.rightIndex]}
        </Button>
      </div>
    </div>
  {:else}
    <p class="preparing-text">Processing your choices...</p>
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
    color: #14abe3;
    margin-bottom: 1.5rem;
  }

  .mergesort-phase {
    max-width: 800px;
    margin: 0 auto;
    padding: 1.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 80vh;
  }

  .comparison-container {
    background: rgba(20, 171, 227, 0.05);
    border: 1px solid rgba(20, 171, 227, 0.2);
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem auto;
    box-shadow: 0 2px 8px rgba(20, 171, 227, 0.1);
    max-width: 600px;
  }

  .duel-buttons {
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 1.5rem;
    margin: 1.5rem 0;
  }

  .duel-buttons :global(.choice-button) {
    min-width: 150px;
    min-height: 80px;
    height: 80px;
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(20, 171, 227, 0.2);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    word-break: break-word;
    white-space: normal;
    flex: 1;
  }

  .duel-buttons :global(.choice-button:hover) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(20, 171, 227, 0.3);
  }

  .vs-divider {
    font-size: 1.2rem;
    font-weight: 600;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.5rem;
    margin: 0 0.5rem;
    align-self: center;
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
    .comparison-container {
      padding: 1.5rem;
    }

    .duel-buttons {
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }

    .vs-divider {
      margin: 0.75rem 0;
      padding: 0.5rem 0;
      width: 100%;
      justify-content: center;
    }

    .duel-buttons :global(.choice-button) {
      width: 100%;
      min-width: unset;
      min-height: 80px;
      height: 80px;
    }
  }

  @media (max-width: 480px) {
    .mergesort-phase {
      padding: 1rem;
    }

    .comparison-container {
      padding: 1rem;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      max-width: calc(100% - 1rem);
    }

    h2 {
      font-size: 1.5rem;
    }
  }
</style>
