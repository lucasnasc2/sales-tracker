import { globalConfig } from '../../globalConfig';

export default {
  install: (app) => {
    app.config.globalProperties.$globals = globalConfig;
  }
};

