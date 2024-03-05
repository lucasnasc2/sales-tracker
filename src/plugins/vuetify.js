/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import colors from 'vuetify/util/colors'

// Composables
import { createVuetify } from 'vuetify'
import { globalConfig } from '../../globalConfig'

export function getValueByKeyPath(data, keyPath) {
  const keys = keyPath.split(".");
  let result = data;
  for (const key of keys) {
    result = result[key];
    if (result === undefined) return undefined; // Return undefined if any key in the keyPath is not found
  }
  return result;
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: getValueByKeyPath(colors,globalConfig.themeColor),
        },
      },
    },
  },
});

