export function calculateWinner(array: number[][], fieldSize = 3) {
  if (!array || !array.length || array.length !== fieldSize) {
    return console.error(
      'Field size and game field do not match, or array.length = undefined'
    );
  }

  /* recursion; created to optimize vertical_&_diagonal search logic for gamefield of any size; shift is need for diagonally check */
  function recursiveCheck(index: number, nextIndex: number, shift = 0) {
    /* check if nextValue is undefined (need to understand when the game field will end) */
    if (array.flat()[nextIndex] === undefined) {
      return true;
    }

    /* check if firstValue and nextValue are valid AND if firstValue === nextValue */
    if (
      array.flat()[index] &&
      array.flat()[nextIndex + shift] &&
      array.flat()[index] === array.flat()[nextIndex + shift]
    ) {
      /* 
        shift is responsible for checking gamefield diagonally. logic will look like a stairs;
        for example (values in '()' are arguments for function):
      
        2-1-2                                     (2)-1-2                                                  2-1-2
        1-2-1 => first call: we pass indexes of > (1)-2-1 => second call (recursive): we pass indexes of > 1-(2)-1 (with shift already)
        1-0-2                                      1-0-2                                                   1-(0)-2 (with shift already)
       */
      if (shift !== 0) {
        return recursiveCheck(
          nextIndex + shift,
          nextIndex + fieldSize + shift,
          shift
        );
      }
      return recursiveCheck(nextIndex, nextIndex + fieldSize, shift);
    }
    return false;
  }

  /* vertical check */
  for (let i = 0; i < array.length; i++) {
    if (recursiveCheck(i, i + fieldSize)) {
      console.log('vertical win');
      return {
        /* 
          logic: make a proportion and find end of square; after that we divide full width/height of gameField by FIELD_SIZE and after divide by 2 to find center of block
        */
        endGameAnimationStartFrom: {
          x1: `${((i + 1) / fieldSize) * 100 - 100 / fieldSize / 2}%`, //  i + 1 is needed to avoid starting from 0
          y1: `0%`,
          x2: `${((i + 1) / fieldSize) * 100 - 100 / fieldSize / 2}%`,
          y2: '100%',
        },
        winner: array.flat()[i],
      };
    }
  }

  /* horizontal check */
  for (let i = 0; i < array.length; i++) {
    if (array[i].every((item) => array[i][0] && item && item === array[i][0])) {
      console.log('horizontal win');
      return {
        endGameAnimationStartFrom: {
          x1: `0%`,
          y1: `${((i + 1) / fieldSize) * 100 - 100 / fieldSize / 2}%`,
          x2: `100%`,
          y2: `${((i + 1) / fieldSize) * 100 - 100 / fieldSize / 2}%`,
        },
        winner: array[i][0],
      };
    }
  }

  /* left-top-corner-diagonal check */
  if (recursiveCheck(0, 0 + fieldSize, 1)) {
    console.log('left-corner-diagonal win');
    return {
      endGameAnimationStartFrom: {
        x1: `0%`,
        y1: `0%`,
        x2: `100%`,
        y2: `100%`,
      },
      winner: array.flat()[0],
    };
  }

  /* right-top-corner-diagonal check */
  if (recursiveCheck(fieldSize - 1, fieldSize - 1 + fieldSize, -1)) {
    console.log('right-corner-diagonal win');
    return {
      endGameAnimationStartFrom: {
        x1: `100%`,
        y1: `0%`,
        x2: `0%`,
        y2: `100%`,
      },
      winner: array.flat()[fieldSize - 1],
    };
  }

  return null;
}
