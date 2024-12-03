export class FlatJsonException extends Error {
  constructor(key) {
    const message = `FlatJsonException: Found duplicated key: ${key}, it will be override by the last one.`;
    super(message);
    this.name = 'FlatJsonException';
  }
}

export const isString = (value) => typeof value === 'string';
export const getLeveledKey = (parentKey, key) => (parentKey !== '' ? `${parentKey}.${key}` : key);

export const parseJson = (json, parentKey = '', saveToFlat) => {
  for (const [key, value] of Object.entries(json)) {
    const isTail = isString(value);
    const leveledKey = getLeveledKey(parentKey, key);
    if (isTail) {
      saveToFlat(leveledKey, value);
    } else {
      parseJson(value, leveledKey, saveToFlat);
    }
  }
};

export const jsonToFlat = (json) => {
  const flatJson = {};
  const useSaveToFlat = (flatJson) => (key, value) => {
    if (flatJson[key] !== undefined) {
      console.warn(new FlatJsonException(key));
    }
    flatJson[key] = value;
  };
  const saveToFlat = useSaveToFlat(flatJson);
  parseJson(json, '', saveToFlat);
  return flatJson;
};

export const flatToJson = (flatJson) => {
  const json = {};
  for (const [key, value] of Object.entries(flatJson)) {
    const keys = key.split('.');
    let current = json;
    for (const [index, key] of keys.entries()) {
      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
    }
  }
  return json;
};

export const fixFlatJson = (flatJson, replace) => {
  const fixedFlatJson = {};
  for (const [key, value] of Object.entries(flatJson)) {
    const [keyHead, ...tail] = key.split('.');
    const isBroken = replace.has(keyHead);
    if (isBroken) {
      const fixedKey = [replace.get(keyHead), ...tail].join('.');
      fixedFlatJson[fixedKey] = value;
    } else {
      fixedFlatJson[key] = value;
    }
  }
  return fixedFlatJson;
};

export const cleanJson = (json, required) => {
  const cleanedJson = {};
  for (const key of required) {
    const value = json[key];
    if (value !== undefined) {
      cleanedJson[key] = value;
    }
  }
  return cleanedJson;
};

export const optimizeJson = (json = {}, required = [], replace = new Map()) => {
  const flatJson = jsonToFlat(json);
  const fixedFlatJson = replace.size > 0 ? fixFlatJson(flatJson, replace) : flatJson;
  const freshJson = flatToJson(fixedFlatJson);
  const optimizedJson = required.length > 0 ? cleanJson(freshJson, required) : freshJson;
  return optimizedJson;
};

export const deepSortObject = (object) => {
  // from A to Z
  const sortedKeys = Object.keys(object).sort((a, b) => a.localeCompare(b));

  const sortedObject = {};
  for (const key of sortedKeys) {
    if (typeof object[key] === 'object' && !Array.isArray(!object[key])) {
      object[key] = deepSortObject(object[key]);
    }
    sortedObject[key] = object[key];
  }
  return sortedObject;
};

export const selectProcess = (processMap, processType) => {
  const process = processMap[processType];
  if (!process) {
    throw new Error('Invalid process type');
  }
  return process;
}
