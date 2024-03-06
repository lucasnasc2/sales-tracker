import colors from 'vuetify/util/colors'

export function getColorByValuePath(keyPath) {
    const keys = keyPath.split(".");
    let result = colors;
    for (const key of keys) {
      result = result[key];
      if (result === undefined) return undefined; // Return undefined if any key in the keyPath is not found
    }
    return result;
  }