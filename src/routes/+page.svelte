<script>
  import "./style.css";
  import {tick} from "svelte";

  // --------------------------
  // Global Input State
  // --------------------------
  let priorityInputValue = ""; // Current value of the input field.
  let priorities = []; // List of all entered priorities.
  let duplicateMessage = ""; // Message displayed when a duplicate priority is added.
  let duplicateTimeout; // Timeout reference for clearing duplicateMessage.

  // --------------------------
  // Method Selection State
  // --------------------------
  let chosenMethod = "merge"; // Default method: Merge Sort Comparison.
  let showOptions = false; // Flag to toggle display of ranking method options.

  // --------------------------
  // Tournament bracket based Comparison State
  // --------------------------
  let isTournament = false; // True when tournament bracket mode is active.
  let tournamentPairs = []; // Pairs of items for the current tournament round.
  let tournamentNextRound = []; // Winners advancing to the next round.
  let tournamentIndex = 0; // Current pair being compared.
  let finalRankingTournament = []; // Final ranking after the tournament.


  // --------------------------
  // Merge Sort–Based Comparison State
  // --------------------------
  let isMergeSort = false; // True when merge sort mode is active.
  let mergeSortLists = []; // Array where each element is a single-element array (for merge sort).
  let mergeNewRound = []; // Holds merged lists for the next round.
  let mergePairIndex = 0; // Index used to track current pair in merge sort.
  let currentMerge = null; // Object holding the details of the current merge process.
  let finalRankingMerge = []; // Final ranking result after merge sort completes.

  // --------------------------
  // Round-Robin Tournament State
  // --------------------------
  let isRoundRobin = false; // True when round-robin mode is active.
  let rr_i = 0; // Outer loop index for round-robin comparisons.
  let rr_j = 1; // Inner loop index for round-robin comparisons.
  let wins = {}; // Object to track win counts for each priority.
  let comparisonsDone = false; // Flag to signal that all comparisons have been done.
  let finalRankingRR = []; // Final ranking computed based on win counts.

  // --------------------------
  // Results Phase State
  // --------------------------
  let showRanking = false; // Flag to toggle the display of the full ranking table.
  // Reactive statement to compute the unified final ranking based on the chosen method.
  $: finalRanking = chosenMethod === "merge"
    ? finalRankingMerge
    : chosenMethod === "roundrobin"
      ? finalRankingRR
      : finalRankingTournament;


  function chooseTournament() {
    isTournament = true;
    tournamentPairs = makePairs([...priorities]); // Create initial pairs.
    tournamentNextRound = [];
    tournamentIndex = 0;
    finalRankingTournament = [];
  }

  // Helper function to create pairs for the tournament.
  function makePairs(arr) {
    const pairs = [];
    for (let i = 0; i < arr.length; i += 2) {
      if (i + 1 < arr.length) {
        pairs.push([arr[i], arr[i + 1]]);
      } else {
        // If odd number, last item gets a bye.
        pairs.push([arr[i]]);
      }
    }
    return pairs;
  }

  function selectTournamentWinner(winner) {
    // Add the winner to the next round.
    tournamentNextRound.push(winner);

    // Move to the next pair.
    tournamentIndex++;

    // If the current round is over:
    if (tournamentIndex >= tournamentPairs.length) {
      // Move winners to the next round.
      if (tournamentNextRound.length === 1) {
        // Tournament is over. The single remaining winner is ranked first.
        finalRankingTournament = [tournamentNextRound[0]];
        isTournament = false;

        // Remaining items are tied (not ranked between each other).
        finalRankingTournament = finalRankingTournament.concat(
          priorities.filter((p) => !finalRankingTournament.includes(p))
        );
      } else {
        // Progress to the next round.
        tournamentPairs = makePairs(tournamentNextRound);
        tournamentNextRound = [];
        tournamentIndex = 0;
      }
    }
  }


  // --------------------------
  // Phase Control Flag
  // --------------------------
  let isFinished = false; // Flag that indicates whether the input phase has ended.

  // --------------------------
  // INPUT PHASE FUNCTIONS
  // --------------------------

  // addPriority() handles the addition of priorities entered by the user.
  async function addPriority(event) {
    event.preventDefault();

    // Remove any extra spaces.
    const trimmedInput = priorityInputValue.trim();
    if (!trimmedInput) {
      return;
    }

    // Split the input string by comma, semicolon, or newline.
    const entries = trimmedInput.split(/[,;\n]+/);

    let addedAny = false; // Flag to check if any new priority was added.

    entries.forEach((entry) => {
      const item = entry.trim(); // Remove spaces from each entry.
      if (!item) {
        return;
      }
      // Check for duplicates.
      if (priorities.includes(item)) {
        duplicateMessage = `Priority "${item}" already exists.`;
        // Clear any existing timeout and set a new one.
        clearTimeout(duplicateTimeout);
        duplicateTimeout = setTimeout(() => {
          duplicateMessage = "";
        }, 3000);
        return;
      }
      // Add new priority if unique.
      priorities = [...priorities, item];
      addedAny = true;
    });

    // Clear input if any priority was added.
    if (addedAny) {
      priorityInputValue = "";
    }
    await tick(); // Wait for state updates.
  }

  // removePriority() removes a given priority from the list.
  function removePriority(item) {
    priorities = priorities.filter((p) => p !== item);
  }

  // --------------------------
  // RESET FUNCTION
  // --------------------------
  // Resets all the application state back to the initial values.
  function resetState() {
    // Reset global input state.
    priorityInputValue = "";
    priorities = [];
    duplicateMessage = "";
    isFinished = false;

    // Reset method selection state.
    chosenMethod = "merge";
    showOptions = false;

    // Reset merge sort state.
    isMergeSort = false;
    mergeSortLists = [];
    mergeNewRound = [];
    mergePairIndex = 0;
    currentMerge = null;
    finalRankingMerge = [];

    // Reset round-robin state.
    isRoundRobin = false;
    rr_i = 0;
    rr_j = 1;
    wins = {};
    comparisonsDone = false;
    finalRankingRR = [];

    // Reset results state.
    showRanking = false;
  }

  // --------------------------
  // START RANKING FUNCTION
  // --------------------------
  // Triggered when the "Start Ranking" button is clicked.
  function startRanking() {
    if (priorities.length < 3) {
      return;
    }
    isFinished = true;

    if (chosenMethod === "merge") {
      chooseMergeSort();
    } else if (chosenMethod === "roundrobin") {
      chooseRoundRobin();
    } else if (chosenMethod === "tournament") {
      chooseTournament();
    }
  }


  // --------------------------
  // MERGE SORT–BASED COMPARISON FUNCTIONS
  // --------------------------

  // Initializes the merge sort process.
  function chooseMergeSort() {
    isMergeSort = true;
    // Initialize each priority as a single-element array.
    mergeSortLists = priorities.map((p) => [p]);
    mergeNewRound = [];
    mergePairIndex = 0;
    mergeNextPair();
  }

  // Processes the next pair of lists for merging.
  function mergeNextPair() {
    // If a pair is available, prepare it for merging.
    if (mergePairIndex < mergeSortLists.length - 1) {
      currentMerge = {
        left: mergeSortLists[mergePairIndex],
        right: mergeSortLists[mergePairIndex + 1],
        leftIndex: 0,
        rightIndex: 0,
        merged: [],
      };
    } else {
      // If there's an odd list left, move it to the new round.
      if (mergePairIndex < mergeSortLists.length) {
        mergeNewRound.push(mergeSortLists[mergePairIndex]);
      }
      // Prepare for the next round of merging.
      mergeSortLists = mergeNewRound;
      mergePairIndex = 0;
      mergeNewRound = [];
      // If only one merged list remains, the merge sort is complete.
      if (mergeSortLists.length === 1) {
        finalRankingMerge = mergeSortLists[0];
        isMergeSort = false;
      } else {
        // Otherwise, start merging the next round.
        mergeNextPair();
      }
    }
  }

  // selectMerge() is triggered when the user selects a winner during merge.
  // 'winner' must be either "left" or "right".
  function selectMerge(winner) {
    if (!currentMerge) return;

    // Update merged list based on the chosen winner.
    if (winner === "left") {
      currentMerge.merged.push(currentMerge.left[currentMerge.leftIndex]);
      currentMerge.leftIndex++;
    } else {
      currentMerge.merged.push(
        currentMerge.right[currentMerge.rightIndex],
      );
      currentMerge.rightIndex++;
    }

    // If one side is exhausted, append the remaining items from the other side.
    if (
      currentMerge.leftIndex >= currentMerge.left.length ||
      currentMerge.rightIndex >= currentMerge.right.length
    ) {
      if (currentMerge.leftIndex < currentMerge.left.length) {
        const remainingLeft = currentMerge.left.slice(
          currentMerge.leftIndex,
        );
        currentMerge.merged.push(...remainingLeft);
      }
      if (currentMerge.rightIndex < currentMerge.right.length) {
        const remainingRight = currentMerge.right.slice(
          currentMerge.rightIndex,
        );
        currentMerge.merged.push(...remainingRight);
      }
      // Save the merged result and move to the next pair.
      mergeNewRound.push(currentMerge.merged);
      mergePairIndex += 2;
      currentMerge = null;
      mergeNextPair();
    }
  }

  // --------------------------
  // ROUND-ROBIN TOURNAMENT FUNCTIONS
  // --------------------------

  // Initializes the round-robin tournament.
  function chooseRoundRobin() {
    isRoundRobin = true;
    wins = {};
    // Initialize win count for each priority.
    priorities.forEach((p) => {
      wins[p] = 0;
    });
    rr_i = 0;
    rr_j = 1;
    comparisonsDone = false;
  }

  // selectRoundRobin() is triggered when a user picks the winner in a round-robin match.
  function selectRoundRobin(winner) {
    wins[winner]++;

    // Move to the next comparison.
    if (rr_j < priorities.length - 1) {
      rr_j++;
    } else {
      rr_i++;
      rr_j = rr_i + 1;
    }

    // Check if all comparisons are complete.
    if (rr_i >= priorities.length - 1) {
      comparisonsDone = true;
      finalRankingRR = [...priorities].sort((a, b) => wins[b] - wins[a]);
    }
  }

  // --------------------------
  // TOGGLE RANKING TABLE
  // --------------------------
  // Toggles the display of the full ranking table in the results phase.
  function toggleRanking() {
    showRanking = !showRanking;
  }
</script>

<svelte:head>
    <title>Choose Your Ranking Method</title>
    <meta name="description" content="Select Ranking Method for Priorities"/>
</svelte:head>

<!--
    APPLICATION STRUCTURE:
    1. Input Phase: User enters priorities.
    2. Ranking Phase: Either merge sort or round-robin is used to rank priorities.
    3. Results Phase: Displays top priority with an option to see the full ranking table.
-->
<section>
    {#if !isFinished && !isMergeSort && !isRoundRobin}
        <!-- INPUT PHASE -->
        <main>
            <div class="header-container">
                <h1>Enter Your Priorities</h1>
                <p>
                    Paste text (CSV style with commas, semicolons, or newlines)
                    and press Enter.
                </p>
            </div>
            <form on:submit={addPriority}>
                <input
                        type="text"
                        bind:value={priorityInputValue}
                        placeholder="Enter priority or paste CSV text"
                        required
                />
            </form>
            {#if duplicateMessage}
                <p class="duplicate-message">{duplicateMessage}</p>
            {/if}
            {#if priorities.length === 0}
                <p>No priority entered yet.</p>
            {:else}
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Priority</th>
                        <th>Remove</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each priorities as item, index}
                        <tr>
                            <td>{index + 1}</td>
                            <td>{item}</td>
                            <td>
                                <button
                                        on:click={() => removePriority(item)}
                                >
                                    &times;
                                </button>
                            </td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            {/if}
            <button on:click={startRanking} disabled={priorities.length < 3}>
                Start Ranking
            </button>
            <button
                    on:click={() => {showOptions = !showOptions;}}
            >
                Options
            </button>
            {#if showOptions}
                <div class="options">
                    <p>Select Ranking Method:</p>
                    <label>
                        <input
                                type="radio"
                                bind:group={chosenMethod}
                                value="tournament"
                        />
                        Tournament Bracket
                    </label>
                    <label>
                        <input
                                type="radio"
                                bind:group={chosenMethod}
                                value="merge"
                        />
                        Merge Sort Comparison
                    </label>
                    <label>
                        <input
                                type="radio"
                                bind:group={chosenMethod}
                                value="roundrobin"
                        />
                        Round-Robin Tournament
                    </label>
                </div>
            {/if}
            <button on:click={resetState}>Reset</button>
        </main>
    {:else if isMergeSort}
        <!-- MERGE SORT COMPARISON PHASE -->
        <main class="merge-sort">
            <div class="header-container">
                <h2>Merge Sort Comparison</h2>
            </div>
            {#if currentMerge}
                <p>
                    Compare:
                    <strong>{currentMerge.left[currentMerge.leftIndex]}</strong>
                    VS
                    <strong
                    >{currentMerge.right[currentMerge.rightIndex]}</strong
                    >
                </p>
                <div class="duel-buttons">
                    <button class="duel-button" on:click={() => selectMerge("left")}>
                        {currentMerge.left[currentMerge.leftIndex]}
                    </button>
                    <span>VS</span>
                    <button class="duel-button" on:click={() => selectMerge("right")}>
                        {currentMerge.right[currentMerge.rightIndex]}
                    </button>
                </div>
            {/if}
            <button on:click={resetState}>Start Over</button>
        </main>
    {:else if isRoundRobin && !comparisonsDone}
        <!-- ROUND-ROBIN COMPARISON PHASE -->
        <main class="round-robin">
            <div class="header-container">
                <h2>Round-Robin Comparison</h2>
            </div>
            <p>
                Compare:
                <strong>{priorities[rr_i]}</strong>
                VS
                <strong>{priorities[rr_j]}</strong>
            </p>
            <div class="duel-buttons">
                <button class="duel-button" on:click={() => selectRoundRobin(priorities[rr_i])}>
                    {priorities[rr_i]}
                </button>
                <span>VS</span>
                <button class="duel-button" on:click={() => selectRoundRobin(priorities[rr_j])}>
                    {priorities[rr_j]}
                </button>
            </div>
            <button on:click={resetState}>Start Over</button>
        </main>
    {:else if isTournament}
        <main class="tournament">
            <div class="header-container">
                <h2>Tournament Bracket</h2>
            </div>
            {#if tournamentPairs[tournamentIndex]}
                <p>
                    Compare:
                    <strong>{tournamentPairs[tournamentIndex][0]}</strong>
                    {#if tournamentPairs[tournamentIndex][1]}
                        VS
                        <strong>{tournamentPairs[tournamentIndex][1]}</strong>
                    {/if}
                </p>
                <div class="duel-buttons">
                    <button class="duel-button" on:click={() => selectTournamentWinner(tournamentPairs[tournamentIndex][0])}>
                        {tournamentPairs[tournamentIndex][0]}
                    </button>
                    {#if tournamentPairs[tournamentIndex][1]}
                        <span>VS</span>
                        <button class="duel-button" on:click={() => selectTournamentWinner(tournamentPairs[tournamentIndex][1])}>
                            {tournamentPairs[tournamentIndex][1]}
                        </button>
                    {/if}
                </div>
            {:else}
                <p>Preparing next round...</p>
            {/if}
            <button on:click={resetState}>Start Over</button>
        </main>

    {:else}
        <!-- RESULTS PHASE -->
        <main>
            <h2>Final Ranking</h2>
            {#if finalRanking && finalRanking.length}
                <p>Top Priority: <strong>{finalRanking[0]}</strong></p>
                <button on:click={toggleRanking}>
                    {showRanking ? "Hide Ranking" : "See Ranking"}
                </button>
                {#if showRanking}
                    <table>
                        <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Priority</th>
                            {#if chosenMethod === "roundrobin"}
                                <th>Score</th>
                            {/if}
                        </tr>
                        </thead>
                        <tbody>
                        {#each finalRanking as item, index}
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item}</td>
                                {#if chosenMethod === "roundrobin"}
                                    <td>{wins[item]}</td>
                                {/if}
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                {/if}
            {:else}
                <p>No final ranking available.</p>
            {/if}
            <button on:click={resetState}>Start Over</button>
        </main>
    {/if}
</section>
