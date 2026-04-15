// Configuration for Development environment
export const devConfig = {
  env: 'development',
  baseURL: 'https://jsonplaceholder.typicode.com',
  apiTimeout: 10000,
  retries: 2,
  logLevel: 'debug',
  enableLogging: true,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'QA-Automation-Framework/1.0',
  },
};
