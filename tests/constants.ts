export const AUTH_CONSTANTS = {
  URL: 'https://super-secret-edk-testing-ai-project.meebly.ai',
  EMAIL: 'founders@meebly.ai',
  PASSWORD: 'MeeblyFounders',
};

export const TEST_DATA = {
  ORG_NAME_PREFIX: 'Playwright',
  APP_NAME_PREFIX: 'Meebly-Playwright',
  APP_ENVIRONMENT: 'Env-Playwright',
  APP_URL: 'https://super-secret-edk-testing-ai-project.meebly.ai',
  ACTION_NAME_PREFIX: 'testAction',
  ACTION_URL_PREFIX: '/api/test-endpoint',
};

export const TEST_ENV_VARS = {
  ORG_NAME: 'Meebly AI - Playwright Tests',
  APP_NAME: 'Meebly AI E2E Test App',
  ENVIRONMENT_NAME: 'Playwright Test',
  ACTION_NAME: 'getUsersData',
  AGENT_NAME: 'Meebly Playwright Test Agent',
  ACTION_DESCRIPTION: 'Get user data from the system. ',
  AGENT_DESCRIPTION: 'You are a helpful assistant.',
};

export const TIMEOUTS = {
  AI_RESPONSE: 30000, // 30 seconds for AI to respond
  DEFAULT: 5000,
};

// Helper function to generate timestamp-based names
export function getTimestampedName(prefix: string): string {
  const timestamp = Date.now();
  return `${prefix}_${timestamp}`;
}
