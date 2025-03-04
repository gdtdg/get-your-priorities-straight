<script>
    import "./style.css";
    import { tick } from "svelte";

    // --------------------------
    // Global Input State
    // --------------------------
    let priority = ""; // Current value of the input field.
    let priorities = []; // List of all entered priorities.
    let duplicateMessage = ""; // Message displayed when a duplicate priority is added.
    let duplicateTimeout; // Timeout reference for clearing duplicateMessage.

    // --------------------------
    // Method Selection State
    // --------------------------
    let chosenMethod = "merge"; // Default method: Merge Sort Comparison.
    let showOptions = false; // Flag to toggle display of ranking method options.

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
    $: finalRanking =
        chosenMethod === "merge" ? finalRankingMerge : finalRankingRR;

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
        console.log("addPriority() called. Raw input:", priority);

        // Remove any extra spaces.
        const trimmedInput = priority.trim();
        if (!trimmedInput) {
            console.log("Input is empty after trimming. Exiting function.");
            return;
        }

        // Split the input string by comma, semicolon, or newline.
        const entries = trimmedInput.split(/[,;\n]+/);
        console.log("Split entries:", entries);

        let addedAny = false; // Flag to check if any new priority was added.

        entries.forEach((entry) => {
            const item = entry.trim(); // Remove spaces from each entry.
            if (!item) {
                console.log("Skipping an empty entry after trim.");
                return;
            }
            // Check for duplicates.
            if (priorities.includes(item)) {
                console.log(`Duplicate found: "${item}"`);
                duplicateMessage = `Priority "${item}" already exists.`;
                // Clear any existing timeout and set a new one.
                clearTimeout(duplicateTimeout);
                duplicateTimeout = setTimeout(() => {
                    duplicateMessage = "";
                    console.log("Duplicate message cleared.");
                }, 3000);
                return;
            }
            // Add new priority if unique.
            priorities = [...priorities, item];
            addedAny = true;
            console.log(
                `Added priority: "${item}". Updated priorities:`,
                priorities,
            );
        });

        // Clear input if any priority was added.
        if (addedAny) {
            priority = "";
            console.log("Input field cleared after adding priorities.");
        }
        await tick(); // Wait for state updates.
    }

    // removePriority() removes a given priority from the list.
    function removePriority(item) {
        console.log(`Removing priority: "${item}"`);
        priorities = priorities.filter((p) => p !== item);
        console.log("Updated priorities after removal:", priorities);
    }

    // --------------------------
    // RESET FUNCTION
    // --------------------------
    // Resets all the application state back to the initial values.
    function resetState() {
        console.log("Resetting state...");
        // Reset global input state.
        priority = "";
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
        console.log("State reset complete.");
    }

    // --------------------------
    // START RANKING FUNCTION
    // --------------------------
    // Triggered when the "Start Ranking" button is clicked.
    function startRanking() {
        console.log("startRanking() called.");
        if (priorities.length < 3) {
            console.log(
                "Not enough priorities to rank. At least 3 are required.",
            );
            return;
        }
        isFinished = true;
        console.log("Input phase finished. Priorities:", priorities);

        // Choose ranking method based on selected option.
        if (chosenMethod === "merge") {
            console.log("Chosen method: Merge Sort Comparison");
            chooseMergeSort();
        } else if (chosenMethod === "roundrobin") {
            console.log("Chosen method: Round-Robin Tournament");
            chooseRoundRobin();
        }
    }

    // --------------------------
    // MERGE SORT–BASED COMPARISON FUNCTIONS
    // --------------------------

    // Initializes the merge sort process.
    function chooseMergeSort() {
        console.log("chooseMergeSort() called.");
        isMergeSort = true;
        // Initialize each priority as a single-element array.
        mergeSortLists = priorities.map((p) => [p]);
        console.log("Initial merge sort lists:", mergeSortLists);
        mergeNewRound = [];
        mergePairIndex = 0;
        mergeNextPair();
    }

    // Processes the next pair of lists for merging.
    function mergeNextPair() {
        console.log(
            "mergeNextPair() called with mergePairIndex:",
            mergePairIndex,
        );
        // If a pair is available, prepare it for merging.
        if (mergePairIndex < mergeSortLists.length - 1) {
            currentMerge = {
                left: mergeSortLists[mergePairIndex],
                right: mergeSortLists[mergePairIndex + 1],
                leftIndex: 0,
                rightIndex: 0,
                merged: [],
            };
            console.log(
                `Merging pair at indices ${mergePairIndex} and ${mergePairIndex + 1}:`,
                currentMerge.left,
                "vs",
                currentMerge.right,
            );
        } else {
            // If there's an odd list left, move it to the new round.
            if (mergePairIndex < mergeSortLists.length) {
                mergeNewRound.push(mergeSortLists[mergePairIndex]);
                console.log(
                    "Odd leftover list added to new round:",
                    mergeSortLists[mergePairIndex],
                );
            }
            // Prepare for the next round of merging.
            mergeSortLists = mergeNewRound;
            console.log(
                "Finished current merge round. New mergeSortLists:",
                mergeSortLists,
            );
            mergePairIndex = 0;
            mergeNewRound = [];
            // If only one merged list remains, the merge sort is complete.
            if (mergeSortLists.length === 1) {
                finalRankingMerge = mergeSortLists[0];
                isMergeSort = false;
                console.log(
                    "Merge sort complete. Final ranking:",
                    finalRankingMerge,
                );
            } else {
                // Otherwise, start merging the next round.
                mergeNextPair();
            }
        }
    }

    // selectMerge() is triggered when the user selects a winner during merge.
    // 'winner' must be either "left" or "right".
    function selectMerge(winner) {
        console.log("selectMerge() called with winner:", winner);
        if (!currentMerge) return;

        // Update merged list based on the chosen winner.
        if (winner === "left") {
            console.log(
                "Selected left item:",
                currentMerge.left[currentMerge.leftIndex],
            );
            currentMerge.merged.push(currentMerge.left[currentMerge.leftIndex]);
            currentMerge.leftIndex++;
        } else {
            console.log(
                "Selected right item:",
                currentMerge.right[currentMerge.rightIndex],
            );
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
                console.log("Appending remaining left items:", remainingLeft);
                currentMerge.merged.push(...remainingLeft);
            }
            if (currentMerge.rightIndex < currentMerge.right.length) {
                const remainingRight = currentMerge.right.slice(
                    currentMerge.rightIndex,
                );
                console.log("Appending remaining right items:", remainingRight);
                currentMerge.merged.push(...remainingRight);
            }
            // Save the merged result and move to the next pair.
            mergeNewRound.push(currentMerge.merged);
            console.log("Merged result for this pair:", currentMerge.merged);
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
        console.log("chooseRoundRobin() called.");
        isRoundRobin = true;
        wins = {};
        // Initialize win count for each priority.
        priorities.forEach((p) => {
            wins[p] = 0;
        });
        console.log("Initial wins object:", wins);
        rr_i = 0;
        rr_j = 1;
        comparisonsDone = false;
    }

    // selectRoundRobin() is triggered when a user picks the winner in a round-robin match.
    function selectRoundRobin(winner) {
        console.log("selectRoundRobin() called. Winner:", winner);
        wins[winner]++;
        console.log("Updated wins:", wins);

        // Move to the next comparison.
        if (rr_j < priorities.length - 1) {
            rr_j++;
            console.log("Incremented rr_j to:", rr_j);
        } else {
            rr_i++;
            rr_j = rr_i + 1;
            console.log(
                "Incremented rr_i to:",
                rr_i,
                "and reset rr_j to:",
                rr_j,
            );
        }

        // Check if all comparisons are complete.
        if (rr_i >= priorities.length - 1) {
            comparisonsDone = true;
            finalRankingRR = [...priorities].sort((a, b) => wins[b] - wins[a]);
            console.log("Round-robin complete. Final ranking:", finalRankingRR);
        }
    }

    // --------------------------
    // TOGGLE RANKING TABLE
    // --------------------------
    // Toggles the display of the full ranking table in the results phase.
    function toggleRanking() {
        showRanking = !showRanking;
        console.log("Toggled ranking display. Now showRanking:", showRanking);
    }
</script>

<svelte:head>
    <title>Choose Your Ranking Method</title>
    <meta name="description" content="Select Ranking Method for Priorities" />
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
                    bind:value={priority}
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
                on:click={() => {
                    showOptions = !showOptions;
                    console.log(
                        "Toggled options display. Now showOptions:",
                        showOptions,
                    );
                }}
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
