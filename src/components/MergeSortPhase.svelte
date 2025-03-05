<script>
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

<section>
  <h2>Merge Sort Comparison</h2>
  {#if currentMerge}
    <p>
      Compare:
      <strong>{currentMerge.left[currentMerge.leftIndex]}</strong>
      VS
      <strong>{currentMerge.right[currentMerge.rightIndex]}</strong>
    </p>
    <button on:click={() => handleSelect("left")}>
      {currentMerge.left[currentMerge.leftIndex]}
    </button>
    <span> VS </span>
    <button on:click={() => handleSelect("right")}>
      {currentMerge.right[currentMerge.rightIndex]}
    </button>
  {/if}
  <button on:click={resetState}>Start Over</button>
</section>
