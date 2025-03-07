export function initializeTournament(priorities) {
  return {
    tournamentPairs: makePairs(priorities),
    tournamentNextRound: [],
    tournamentIndex: 0,
    comparisonsDone: false,
    finalRanking: [],
  };
}

function makePairs(arr) {
  const pairs = [];
  for (let i = 0; i < arr.length; i += 2) {
    if (i + 1 < arr.length) {
      pairs.push([arr[i], arr[i + 1]]);
    } else {
      pairs.push([arr[i]]);
    }
  }
  return pairs;
}

export function selectTournamentWinner(data, winner, priorities) {
  data.tournamentNextRound.push(winner);
  data.tournamentIndex++;

  // Automatically advance single-value pairs in the current round
  while (
    data.tournamentIndex < data.tournamentPairs.length &&
    data.tournamentPairs[data.tournamentIndex].length === 1
  ) {
    // Directly push the sole value to the next round
    data.tournamentNextRound.push(
      data.tournamentPairs[data.tournamentIndex][0],
    );
    data.tournamentIndex++; // Skip to the next pair
  }

  if (data.tournamentIndex >= data.tournamentPairs.length) {
    if (data.tournamentNextRound.length === 1) {
      data.finalRanking = [data.tournamentNextRound[0]].concat(
        priorities.filter((p) => p !== data.tournamentNextRound[0]),
      );
      data.comparisonsDone = true;
    } else {
      data.tournamentPairs = makePairs(data.tournamentNextRound);
      data.tournamentNextRound = [];
      data.tournamentIndex = 0;
    }
  }
  return data;
}
