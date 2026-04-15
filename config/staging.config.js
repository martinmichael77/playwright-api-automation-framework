// Configuration for Staging environment
export const stagingConfig = {
  env: 'staging',
  baseURL: 'https://staging-api.example.com',
  apiTimeout: 15000,
  retries: 3,
  logLevel: 'info',
  enableLogging: true,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'QA-Automation-Framework/1.0',
  },
};
