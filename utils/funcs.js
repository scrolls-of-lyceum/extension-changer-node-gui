export function* idGenerator(prefix = "id", max = 100) {
  let counter = 0;

  while (counter < max) {
    const uniqueId = `${prefix}-${counter}-${Math.random()
      .toString(36)
      .substring(2, 6)}`;
    yield uniqueId;
    counter++;
  }
}

export const idGen = idGenerator("input", 100);
