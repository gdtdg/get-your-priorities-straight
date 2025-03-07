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

<section>
  <h2>Merge Sort Comparison</h2>
  {#if currentMerge}
    <p>
      Compare:
      <strong>{currentMerge.left[currentMerge.leftIndex]}</strong>
      VS
      <strong>{currentMerge.right[currentMerge.rightIndex]}</strong>
    </p>
    <Button on:click={() => handleSelect("left")}>
      {currentMerge.left[currentMerge.leftIndex]}
    </Button>
    <span> VS </span>
    <Button on:click={() => handleSelect("right")}>
      {currentMerge.right[currentMerge.rightIndex]}
    </Button>
  {/if}
  <Button on:click={resetState}>Start Over</Button>
</section>
