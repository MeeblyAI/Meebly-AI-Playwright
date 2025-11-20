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
};

export const TIMEOUTS = {
  AI_RESPONSE: 60000, // 60 seconds for AI to respond
  DEFAULT: 5000,
};

// Helper function to generate timestamp-based names
export function getTimestampedName(prefix: string): string {
  const timestamp = Date.now();
  return `${prefix}_${timestamp}`;
}
