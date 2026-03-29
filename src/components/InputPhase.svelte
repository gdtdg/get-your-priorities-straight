<script>
  import { onDestroy } from "svelte";

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

  const rankingMethods = [
    {
      id: "tournament",
      title: "Tournament Bracket",
      description: "Fastest route to your top priority.",
    },
    {
      id: "merge",
      title: "Merge Sort",
      description: "Balanced speed with a full ordered list.",
    },
    {
      id: "roundrobin",
      title: "Round-Robin",
      description: "Most thorough comparisons across all choices.",
    },
  ];

  let draftItems = "";
  let selectedMethod = "tournament";

  const unsubscribeMethod = chosenMethod.subscribe((method) => {
    selectedMethod = method;
  });

  onDestroy(() => {
    unsubscribeMethod();
  });

  function addPriority() {
    const trimmedInput = draftItems.trim();
    if (!trimmedInput) return;

    const entries = trimmedInput.split(/[,;\n]+/);
    const existing = new Set($priorities.map((item) => item.toLowerCase()));
    const pending = new Set();
    const newItems = [];
    const duplicates = [];

    entries.forEach((entry) => {
      const item = entry.trim().replace(/\s+/g, " ");
      if (!item) return;

      const normalized = item.toLowerCase();
      if (existing.has(normalized) || pending.has(normalized)) {
        duplicates.push(item);
        return;
      }

      pending.add(normalized);
      newItems.push(item);
    });

    if (newItems.length) {
      priorities.update((curr) => [...curr, ...newItems]);
      draftItems = "";
    }

    if (duplicates.length) {
      const list = duplicates.slice(0, 3).join(", ");
      const suffix = duplicates.length > 3 ? ` and ${duplicates.length - 3} more` : "";
      duplicateMessage.set(`Skipped duplicates: ${list}${suffix}.`);
      setTimeout(() => duplicateMessage.set(""), 5000);
    } else {
      duplicateMessage.set("");
    }
  }

  function handleAddSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    addPriority();
  }

  function handleDraftKeydown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      addPriority();
    }
  }

  function removePriority(item) {
    priorities.update((curr) => curr.filter((p) => p !== item));
  }

  function selectMethod(method) {
    selectedMethod = method;
    chosenMethod.set(method);
  }

  function startRanking() {
    if ($priorities.length < 3) return;

    const currentPriorities = $priorities;
    isMergeSort.set(false);
    isRoundRobin.set(false);
    isTournament.set(false);

    if (selectedMethod === "merge") {
      mergeSortData.set(initializeMergeSort(currentPriorities));
      isMergeSort.set(true);
    } else if (selectedMethod === "roundrobin") {
      roundRobinData.set(initializeRoundRobin(currentPriorities));
      isRoundRobin.set(true);
    } else {
      tournamentData.set(initializeTournament(currentPriorities));
      isTournament.set(true);
    }
  }
</script>

<section class="input-phase">
  <div class="panel input-panel">
    <h2>Build your choice list in one pass.</h2>
    <p class="helper-text">Paste anything separated by commas, semicolons, or line breaks.</p>
    <p class="helper-text">Use Enter or the Add button. Ctrl/Cmd + Enter also works.</p>

    <form class="composer" onsubmit={handleAddSubmit}>
      <textarea
        value={draftItems}
        class="priority-textarea"
        rows="4"
        placeholder="Learn piano&#10;Publish portfolio&#10;Visit Iceland"
        oninput={(event) => (draftItems = event.currentTarget.value)}
        onkeydown={handleDraftKeydown}
      ></textarea>
    <div class="composer-actions">
        <button type="submit" class="action-button" disabled={!draftItems.trim()}>
          Add Items
        </button>
      </div>
    </form>

    {#if $duplicateMessage}
      <p class="duplicate-message">{$duplicateMessage}</p>
    {/if}
  </div>

  <div class="panel list-panel">
    <div class="list-header">
      <h3 class="list-title">Current Choices</h3>
      <span class="count-badge">{$priorities.length}</span>
    </div>

    {#if $priorities.length === 0}
      <p class="empty-state">No choices yet. Add at least 3 to start ranking.</p>
    {:else}
      <div class="priorities-container">
        <ul class="priorities-list">
          {#each $priorities as item}
            <li class="priority-item">
              <span class="priority-text">{item}</span>
              <button type="button" class="remove-button" onclick={() => removePriority(item)}>
                x
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>

  <div class="panel method-panel">
    <h3 class="method-title">Pick Your Ranking Style</h3>
    <div class="methods" role="radiogroup" aria-label="Ranking method">
      {#each rankingMethods as method}
        <button
          type="button"
          class="method-card"
          class:active={selectedMethod === method.id}
          onclick={() => selectMethod(method.id)}
          aria-pressed={selectedMethod === method.id}
        >
          <strong>{method.title}</strong>
          <span>{method.description}</span>
        </button>
      {/each}
    </div>

    <div class="button-container">
      <button
        type="button"
        class="action-button start-button"
        onclick={startRanking}
        disabled={$priorities.length < 3}
      >
        Start Ranking
      </button>
    </div>
  </div>

</section>

<style>
  .input-phase {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 1.2rem;
  }

  .panel {
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(8, 51, 68, 0.14);
    border-radius: 18px;
    backdrop-filter: blur(8px);
    padding: 1.25rem;
    box-shadow: 0 14px 28px rgba(8, 51, 68, 0.08);
  }

  h2 {
    margin: 0;
    font-size: clamp(1.35rem, 2.2vw, 1.85rem);
    line-height: 1.25;
  }

  .helper-text {
    margin: 0.45rem 0 0;
    color: rgba(8, 51, 68, 0.74);
    font-size: 0.98rem;
  }

  .composer {
    width: 100%;
    margin-top: 1rem;
  }

  .priority-textarea {
    width: 100%;
    min-height: 8rem;
    resize: vertical;
    padding: 0.9rem 1rem;
    font-size: 1.02rem;
    border: 1px solid rgba(8, 51, 68, 0.25);
    border-radius: 12px;
    transition: all 0.3s ease;
    outline: none;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
    background: rgba(250, 255, 255, 0.95);
    color: #083344;
  }

  .priority-textarea:focus {
    box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.15);
    border-color: #0d9488;
  }

  .priority-textarea::placeholder {
    color: rgba(8, 51, 68, 0.46);
  }

  .composer-actions {
    margin-top: 0.75rem;
    display: flex;
    justify-content: flex-end;
  }

  .action-button {
    border: 0;
    border-radius: 12px;
    padding: 0.75rem 1rem;
    font-size: 0.98rem;
    font-weight: 700;
    color: #ecfeff;
    background: #0d9488;
    box-shadow: 0 12px 20px rgba(13, 148, 136, 0.22);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  }

  .action-button:hover:enabled {
    transform: translateY(-1px);
    box-shadow: 0 16px 24px rgba(13, 148, 136, 0.26);
  }

  .action-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }

  .duplicate-message {
    color: #b91c1c;
    margin: 0.75rem 0 0;
    font-weight: 600;
  }

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .list-title,
  .method-title {
    margin: 0;
    font-size: 1.12rem;
  }

  .count-badge {
    min-width: 2rem;
    text-align: center;
    font-weight: 700;
    color: #0f766e;
    background: rgba(13, 148, 136, 0.12);
    border: 1px solid rgba(13, 148, 136, 0.35);
    border-radius: 999px;
    padding: 0.2rem 0.6rem;
  }

  .empty-state {
    color: rgba(8, 51, 68, 0.8);
    font-weight: 600;
    padding: 1rem;
    border-radius: 12px;
    background-color: rgba(13, 148, 136, 0.08);
    display: inline-block;
    margin: 0.9rem auto 0;
  }

  .priorities-container {
    width: 100%;
    margin: 0.9rem auto 0;
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
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(8, 51, 68, 0.15);
    border-radius: 12px;
    padding: 0.65rem 0.8rem 0.65rem 1rem;
    transition: all 0.2s ease;
  }

  .priority-item:hover {
    border-color: rgba(13, 148, 136, 0.5);
    transform: translateY(-1px);
  }

  .priority-text {
    font-size: 1rem;
    flex: 1;
    text-align: left;
    line-height: 1.5;
    margin-right: 0.5rem;
    font-weight: 600;
    color: #083344;
  }

  .remove-button {
    border: 1px solid rgba(8, 51, 68, 0.2);
    border-radius: 999px;
    width: 28px;
    height: 28px;
    background: transparent;
    color: rgba(8, 51, 68, 0.76);
    font-weight: 700;
    cursor: pointer;
  }

  .remove-button:hover {
    background: rgba(185, 28, 28, 0.1);
    border-color: rgba(185, 28, 28, 0.35);
    color: #b91c1c;
  }

  .methods {
    margin-top: 0.95rem;
    display: grid;
    gap: 0.7rem;
  }

  .method-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 0.35rem;
    padding: 0.95rem;
    border: 1px solid rgba(8, 51, 68, 0.14);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.72);
    color: rgba(8, 51, 68, 0.9);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .method-card span {
    color: rgba(8, 51, 68, 0.72);
    font-size: 0.95rem;
    font-weight: 500;
  }

  .method-card:hover {
    transform: translateY(-1px);
    border-color: rgba(13, 148, 136, 0.4);
  }

  .method-card.active {
    border-color: rgba(13, 148, 136, 0.72);
    background: rgba(13, 148, 136, 0.12);
    box-shadow: 0 8px 16px rgba(13, 148, 136, 0.12);
  }

  .button-container {
    width: 100%;
    max-width: 100%;
    margin: 1.2rem auto 0;
    display: flex;
    justify-content: center;
  }

  .start-button {
    width: 100%;
    max-width: 340px;
  }

  @media (max-width: 768px) {
    .input-phase {
      gap: 0.75rem;
    }

    .priority-textarea {
      font-size: 0.97rem;
    }

    .composer-actions {
      justify-content: stretch;
    }

    .action-button {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .panel {
      padding: 1rem;
    }

    .method-card {
      padding: 0.8rem;
    }
  }
</style>
