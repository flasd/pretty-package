export function sortObject(
  sortedKeys: string[],
  object: {
    [key: string]: any;
  }
) {
  const newObject: {
    [key: string]: any;
  } = {};

  for (const key of sortedKeys) {
    if (key in object) {
      newObject[key] = object[key];
    }
  }

  // Append unknown keys at the end.
  for (const key of Object.keys(object)) {
    if (!(key in newObject)) {
      newObject[key] = object[key];
    }
  }

  return newObject;
}

export function alphabeticalSortObject(object: object) {
  return Object.fromEntries(
    Object.entries(object).sort(([a], [b]) => a.localeCompare(b))
  );
}
