export function initializeRoundRobin(priorities) {
  const wins = {};
  priorities.forEach((p) => {
    wins[p] = 0;
  });
  return {
    rr_i: 0,
    rr_j: 1,
    wins,
    comparisonsDone: false,
    finalRanking: [],
  };
}

export function selectRoundRobin(data, priorities, winner) {
  data.wins[winner]++;
  if (data.rr_j < priorities.length - 1) {
    data.rr_j++;
  } else {
    data.rr_i++;
    data.rr_j = data.rr_i + 1;
  }
  if (data.rr_i >= priorities.length - 1) {
    data.comparisonsDone = true;
    data.finalRanking = [...priorities].sort(
      (a, b) => data.wins[b] - data.wins[a],
    );
  }
  return data;
}
