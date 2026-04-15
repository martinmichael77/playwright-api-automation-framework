// Master config loader - switches based on environment
import { devConfig } from './dev.config.js';
import { stagingConfig } from './staging.config.js';
import { prodConfig } from './prod.config.js';

const environment = process.env.ENV || 'dev';

const configMap = {
  dev: devConfig,
  staging: stagingConfig,
  prod: prodConfig,
};

export const getConfig = () => {
  const config = configMap[environment];
  if (!config) {
    throw new Error(`Invalid environment: ${environment}. Supported: dev, staging, prod`);
  }
  return config;
};

export default getConfig();
