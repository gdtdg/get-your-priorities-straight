<script>
  import { tick } from "svelte";
  import {
    priorities,
    duplicateMessage,
    chosenMethod,
    mergeSortData,
    roundRobinData,
    tournamentData,
    isMergeSort,
    isTournament,
    isRoundRobin,
  } from "$lib/state.js";

  import { initializeMergeSort } from "$lib/mergeSort.js";
  import { initializeRoundRobin } from "$lib/roundRobin.js";
  import { initializeTournament } from "$lib/tournament.js";

  let localPriority = "";

  async function addPriority(event) {
    event.preventDefault();
    const trimmedInput = localPriority.trim();
    if (!trimmedInput) return;
    const entries = trimmedInput.split(/[,;\n]+/);
    let addedAny = false;
    entries.forEach((entry) => {
      const item = entry.trim();
      if (!item) return;
      if ($priorities.includes(item)) {
        duplicateMessage.set(`Priority "${item}" already exists.`);
        setTimeout(() => duplicateMessage.set(""), 3000);
      } else {
        priorities.update((curr) => [...curr, item]);
        addedAny = true;
      }
    });
    if (addedAny) {
      localPriority = "";
    }
    await tick();
  }

  function removePriority(item) {
    priorities.update((curr) => curr.filter((p) => p !== item));
  }

  function startRanking() {
    if ($priorities.length < 3) return;
    const currentPriorities = $priorities;
    if ($chosenMethod === "merge") {
      mergeSortData.set(initializeMergeSort(currentPriorities));
      isMergeSort.set(true);
    } else if ($chosenMethod === "roundrobin") {
      roundRobinData.set(initializeRoundRobin(currentPriorities));
      isRoundRobin.set(true);
    } else if ($chosenMethod === "tournament") {
      tournamentData.set(initializeTournament(currentPriorities));
      isTournament.set(true);
    }
  }
</script>

<section>
  <h1>Enter Your Priorities</h1>
  <form on:submit={addPriority}>
    <input
      type="text"
      bind:value={localPriority}
      placeholder="Enter priority or paste CSV text"
      required
    />
  </form>

  {#if $duplicateMessage}
    <p class="duplicate-message">{$duplicateMessage}</p>
  {/if}

  {#if $priorities.length === 0}
    <p>No priorities entered yet.</p>
  {:else}
    <ul>
      {#each $priorities as item}
        <li>{item} <button on:click={() => removePriority(item)}>×</button></li>
      {/each}
    </ul>
  {/if}

  <div class="options">
    <p>Select Ranking Method:</p>
    <div>
      <label>
        <input type="radio" bind:group={$chosenMethod} value="tournament" />
        <strong>Tournament Bracket (fastest)</strong>: use this when you want to determine your top priority only, but quickly.
      </label>
    </div>
    <div>
      <label>
        <input type="radio" bind:group={$chosenMethod} value="merge" />
        <strong>Merge Sort (medium speed)</strong>: use this when you want to determine the order of all your priorities.
      </label>
    </div>
    <div>
      <label>
        <input type="radio" bind:group={$chosenMethod} value="roundrobin" />
        <strong>Round-Robin (slow)</strong>: use this when you want to make a thorough examination of all your priorities.
      </label>
    </div>
  </div>


  <button on:click={startRanking} disabled={$priorities.length < 3}>
    Start Ranking
  </button>
</section>
