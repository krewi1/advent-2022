export function printMatrix(matrix) {
  let inner = matrix.map((r, ri) => [ri, ...r]);
  const cs = inner[0].map((_, ci) => ci - 1);
  inner.unshift(cs);
  inner.map((row) => {
    const columns = row.map((c) => {
      const size = `${c}`.length;
      const space = 4 - size;
      const finalSpace = new Array(space).fill(" ").join("");
      return `${c}${finalSpace}`;
    });
    console.log(columns.join(""));
  });
  console.log("===================");
}

export function transpose(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}
