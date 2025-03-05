export function initializeMergeSort(priorities) {
  const mergeSortLists = priorities.map((p) => [p]);
  const data = {
    mergeSortLists,
    mergeNewRound: [],
    mergePairIndex: 0,
    currentMerge: null,
    comparisonsDone: false,
    finalRanking: [],
  };
  data.currentMerge = getNextMerge(data);
  return data;
}

export function getNextMerge(data) {
  const { mergeSortLists, mergePairIndex, mergeNewRound } = data;
  if (mergePairIndex < mergeSortLists.length - 1) {
    return {
      left: mergeSortLists[mergePairIndex],
      right: mergeSortLists[mergePairIndex + 1],
      leftIndex: 0,
      rightIndex: 0,
      merged: [],
    };
  } else {
    // Handle odd list or round transition:
    if (mergePairIndex < mergeSortLists.length) {
      mergeNewRound.push(mergeSortLists[mergePairIndex]);
    }
    data.mergeSortLists = mergeNewRound;
    data.mergePairIndex = 0;
    data.mergeNewRound = [];
    if (data.mergeSortLists.length === 1) {
      data.finalRanking = data.mergeSortLists[0];
      data.currentMerge = null;
      data.comparisonsDone = true;
      return null;
    }
    return getNextMerge(data);
  }
}

export function selectMerge(data, winner) {
  if (!data.currentMerge) return;
  if (winner === "left") {
    data.currentMerge.merged.push(
      data.currentMerge.left[data.currentMerge.leftIndex],
    );
    data.currentMerge.leftIndex++;
  } else {
    data.currentMerge.merged.push(
      data.currentMerge.right[data.currentMerge.rightIndex],
    );
    data.currentMerge.rightIndex++;
  }
  if (
    data.currentMerge.leftIndex >= data.currentMerge.left.length ||
    data.currentMerge.rightIndex >= data.currentMerge.right.length
  ) {
    if (data.currentMerge.leftIndex < data.currentMerge.left.length) {
      data.currentMerge.merged.push(
        ...data.currentMerge.left.slice(data.currentMerge.leftIndex),
      );
    }
    if (data.currentMerge.rightIndex < data.currentMerge.right.length) {
      data.currentMerge.merged.push(
        ...data.currentMerge.right.slice(data.currentMerge.rightIndex),
      );
    }
    data.mergeNewRound.push(data.currentMerge.merged);
    data.mergePairIndex += 2;
    data.currentMerge = null;
    data.currentMerge = getNextMerge(data);
  }
}
