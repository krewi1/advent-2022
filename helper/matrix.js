export function printMatrix(matrix) {
  console.log(matrix.map((d) => d.join(" ")).join("\n"));
  console.log("===================");
}

export function transpose(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}
