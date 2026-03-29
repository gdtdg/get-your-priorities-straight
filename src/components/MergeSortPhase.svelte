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
  <p class="subtitle">Choose between each pair to build your full ranking.</p>

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

        <span class="vs-divider">vs</span>

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
  .mergesort-phase {
    margin: 0 auto;
    padding: 1.35rem 0.2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 70vh;
    gap: 0.5rem;
  }

  h2 {
    margin: 0;
    font-size: clamp(1.55rem, 2.8vw, 2.15rem);
    line-height: 1.2;
  }

  .subtitle {
    color: rgba(8, 51, 68, 0.75);
    margin: 0;
  }

  .comparison-container {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(8, 51, 68, 0.14);
    border-radius: 18px;
    padding: 2rem;
    margin: 2rem auto;
    box-shadow: 0 14px 28px rgba(8, 51, 68, 0.08);
    max-width: 700px;
    backdrop-filter: blur(7px);
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
    min-height: 90px;
    padding: 1rem 1.5rem;
    font-size: 1.05rem;
    border-radius: 14px;
    box-shadow: 0 12px 22px rgba(13, 148, 136, 0.18);
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
    box-shadow: 0 16px 26px rgba(13, 148, 136, 0.24);
  }

  .vs-divider {
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(8, 51, 68, 0.56);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.5rem;
    margin: 0 0.5rem;
    align-self: center;
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
      min-height: 84px;
    }
  }

  @media (max-width: 480px) {
    .mergesort-phase {
      padding: 1rem 0;
    }

    .comparison-container {
      padding: 1rem;
      margin-left: 0;
      margin-right: 0;
      max-width: 100%;
    }

    h2 {
      font-size: 1.5rem;
    }
  }
</style>
