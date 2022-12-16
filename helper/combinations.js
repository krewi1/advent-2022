export function createCombinations(array, targetLength) {
  const combinations = [];
  function createCombination(cc, ci, rc) {
    for (let si = ci; si < array.length; si++) {
      const next = [...cc, array[si]];

      if (rc === 1) {
        combinations.push(next);
      } else {
        createCombination(next, si + 1, rc - 1);
      }
    }
  }

  createCombination([], 0, targetLength);
  return combinations;
}
