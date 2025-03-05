import { derived, writable } from "svelte/store";

export const priorityInputValue = writable("");
export const priorities = writable([]);
export const duplicateMessage = writable("");
export const chosenMethod = writable("tournament");

// States for ranking mechanisms:
export const isMergeSort = writable(false);
export const mergeSortData = writable({
  mergeSortLists: [],
  mergeNewRound: [],
  mergePairIndex: 0,
  currentMerge: null,
  comparisonsDone: false,
  finalRanking: [],
});

export const isRoundRobin = writable(false);
export const roundRobinData = writable({
  rr_i: 0,
  rr_j: 1,
  wins: {},
  comparisonsDone: false,
  finalRanking: [],
});

export const isTournament = writable(false);
export const tournamentData = writable({
  tournamentPairs: [],
  tournamentNextRound: [],
  tournamentIndex: 0,
  comparisonsDone: false,
  finalRanking: [],
});

// Dynamically derive isFinished based on comparisonsDone of the three states
export const isFinished = derived(
  [mergeSortData, roundRobinData, tournamentData],
  ([$mergeSortData, $roundRobinData, $tournamentData]) =>
    $mergeSortData.comparisonsDone ||
    $roundRobinData.comparisonsDone ||
    $tournamentData.comparisonsDone,
);

// Reset all state stores to their initial values.
export function resetState() {
  priorityInputValue.set("");
  priorities.set([]);
  duplicateMessage.set("");
  chosenMethod.set("tournament");
  isMergeSort.set(false);
  mergeSortData.set({
    mergeSortLists: [],
    mergeNewRound: [],
    mergePairIndex: 0,
    currentMerge: null,
    comparisonsDone: false,
    finalRanking: [],
  });
  isRoundRobin.set(false);
  roundRobinData.set({
    rr_i: 0,
    rr_j: 1,
    wins: {},
    comparisonsDone: false,
    finalRanking: [],
  });
  isTournament.set(false);
  tournamentData.set({
    tournamentPairs: [],
    tournamentNextRound: [],
    tournamentIndex: 0,
    comparisonsDone: false,
    finalRanking: [],
  });
}
