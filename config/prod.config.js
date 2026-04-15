// Configuration for Production environment
export const prodConfig = {
  env: 'production',
  baseURL: 'https://api.example.com',
  apiTimeout: 20000,
  retries: 1,
  logLevel: 'warn',
  enableLogging: true,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'QA-Automation-Framework/1.0',
  },
};
