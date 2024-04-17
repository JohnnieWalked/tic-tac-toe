export function calculateWinner(array: number[][], fieldSize = 3) {
  if (array.length !== fieldSize) {
    throw new Error('Field size and game field do not match.');
  }
  let horizontal = false;
  let vertical = false;
  let diagonal = false;

  // /* recursion; created to optimize vertical-search logic for gamefield of any size */
  function verticalCheck(index: number, nextIndex: number) {
    /* check if nextValue is undefined (need because of last line of gameField) */
    if (array.flat()[nextIndex] === undefined) {
      return true;
    }
    /* check if firstValue and nextValue are valid AND if firstValue === nextValue */
    if (
      array.flat()[index] &&
      array.flat()[nextIndex] &&
      array.flat()[index] === array.flat()[nextIndex]
    ) {
      return verticalCheck(nextIndex, nextIndex + fieldSize);
    }
    return false;
  }

  // /* vertical check */
  for (let i = 0; i < fieldSize; i++) {
    if (verticalCheck(i, i + fieldSize)) {
      console.log('vertical win');
      return array.flat()[i];
    }
  }

  /* horizontal check */
  for (let i = 0; i < array.length; i++) {
    if (array[i].every((item) => array[i][0] && item && item === array[i][0])) {
      console.log('horizontal win');
      return array[i][0];
    }
  }

  return null;
}
