<script>
  import { tick } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Root, Item } from "$lib/components/ui/radio-group";

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
        setTimeout(() => duplicateMessage.set(""), 5000);
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
  <h4>Enter your choices or paste a CSV then press Enter.</h4>
  <p class="pb-0">(You need at least 3 choices to begin a ranking)</p>
  <p class="pt-0">(CSV delimiters are "," or ";")</p>
  <form on:submit={addPriority} class="input-form">
    <input
      type="text"
      bind:value={localPriority}
      placeholder="Enter priority or paste CSV text"
      required
      class="priority-input"
    />
  </form>

  {#if $duplicateMessage}
    <p class="duplicate-message">{$duplicateMessage}</p>
  {/if}

  {#if $priorities.length === 0}
    <p class="empty-state">No choices entered yet.</p>
  {:else}
    <div class="priorities-container">
      <ul class="priorities-list">
        {#each $priorities as item}
          <li class="priority-item">
            <span class="priority-text">{item}</span>
            <Button
              variant="outline"
              size="sm"
              class="remove-button"
              on:click={() => removePriority(item)}
            >
              ×
            </Button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <h5 class="ranking-method-title">Select Ranking Method:</h5>
  <div class="options">
    <Root class="radio-group" bind:value={$chosenMethod}>
      <div class="radio-item">
        <Item value="tournament" id="tournament" class="radio-button" />
        <label for="tournament">
          <strong>Tournament Bracket (fastest)</strong>: use this when you want
          to determine your top priority only, but quickly.
        </label>
      </div>

      <div class="radio-item">
        <Item value="merge" id="merge" class="radio-button" />
        <label for="merge">
          <strong>Merge Sort (medium speed)</strong>: use this when you want to
          determine the order of all your priorities.
        </label>
      </div>

      <div class="radio-item">
        <Item value="roundrobin" id="roundrobin" class="radio-button" />
        <label for="roundrobin">
          <strong>Round-Robin (slow)</strong>: use this when you want to make a
          thorough examination of all your priorities.
        </label>
      </div>
    </Root>
  </div>

  <div class="button-container">
    <Button
      variant="default"
      size="lg"
      on:click={startRanking}
      disabled={$priorities.length < 3}
    >
      Start Ranking
    </Button>
  </div>
</section>

<style>
  h4,
  h5 {
    margin-bottom: 0.5em;
    line-height: 1.2em;
    font-weight: bold;
  }

  h4 {
    font-size: 1.5rem;
  }

  h5 {
    font-size: 1.25rem;
  }

  .ranking-method-title {
    margin-top: 2.5rem;
  }

  .input-form {
    width: 100%;
    margin: 1.5rem auto;
    max-width: 600px;
  }

  .priority-input {
    width: 100%;
    padding: 0.8rem 1rem;
    font-size: 1.1rem;
    border: 2px solid #14abe3;
    border-radius: 8px;
    transition: all 0.3s ease;
    outline: none;
    box-shadow: 0 2px 8px rgba(20, 171, 227, 0.1);
  }

  .priority-input:focus {
    box-shadow: 0 4px 12px rgba(20, 171, 227, 0.2);
    border-color: #14abe3;
  }

  .priority-input::placeholder {
    color: #888;
  }

  .duplicate-message {
    color: #e53935;
    margin-top: 0.5rem;
    font-weight: 500;
  }

  .empty-state {
    color: #000000;
    font-weight: 600;
    animation: pulse 2.5s infinite;
    padding: 1rem;
    border-radius: 8px;
    background-color: rgba(20, 171, 227, 0.05);
    display: inline-block;
    margin: 1rem auto;
  }

  .priorities-container {
    width: 100%;
    max-width: 600px;
    margin: 1.5rem auto;
    padding: 0 1rem;
  }

  .priorities-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .priority-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(20, 171, 227, 0.05);
    border: 1px solid rgba(20, 171, 227, 0.2);
    border-radius: 6px;
    padding: 0.6rem 1rem;
    transition: all 0.2s ease;
  }

  .priority-item:hover {
    background: rgba(20, 171, 227, 0.1);
  }

  .priority-text {
    font-size: 1rem;
    flex: 1;
    text-align: center;
    line-height: 1.5;
    margin-right: 0.5rem;
    font-weight: 500;
  }

  .priority-item :global(.remove-button) {
    opacity: 0.7;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    transition: all 0.2s ease;
  }

  .priority-item :global(.remove-button:hover) {
    opacity: 1;
    background: rgba(229, 57, 53, 0.1);
    color: #e53935;
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

  /* Responsive adjustments for different screen sizes */
  @media (max-width: 768px) {
    .input-form {
      max-width: 100%;
    }

    .priority-input {
      font-size: 1rem;
      padding: 0.7rem 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .priority-input {
      font-size: 0.9rem;
      padding: 0.6rem 0.8rem;
    }
  }

  @media (max-width: 320px) {
    .priority-input {
      font-size: 0.85rem;
      padding: 0.5rem 0.7rem;
    }
  }

  p {
    font-size: 1em;
    line-height: 1.75em;
    margin-bottom: 1em;
  }

  .radio-item {
    display: flex;
    gap: 0.75rem;
    text-align: left;
    position: relative;
    align-items: center;
  }

  .radio-item label {
    cursor: pointer;
    line-height: 1.5;
    flex: 1;
    display: inline-flex;
    align-items: center;
    min-height: 24px; /* Ensures consistent height */
  }

  .options {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 1.5rem auto;
    max-width: 800px;
    padding: 0 1rem;
  }

  .button-container {
    width: 100%;
    max-width: 400px;
    margin: 2rem auto 0;
    display: flex;
    justify-content: center;
  }

  .button-container :global(button) {
    width: 100%;
    padding: 0.8rem 1rem;
    font-size: 1.1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(20, 171, 227, 0.2);
  }

  /* Responsive adjustments for button */
  @media (max-width: 768px) {
    .button-container {
      max-width: 350px;
    }

    .button-container :global(button) {
      font-size: 1rem;
      padding: 0.7rem 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .button-container {
      max-width: 300px;
    }

    .button-container :global(button) {
      font-size: 0.9rem;
      padding: 0.6rem 0.8rem;
    }
  }
</style>
