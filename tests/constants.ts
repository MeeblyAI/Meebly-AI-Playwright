export const AUTH_CONSTANTS = {
  URL: 'https://super-secret-edk-testing-ai-project.meebly.ai',
  EMAIL: 'aletheiasai@gmail.com',
  PASSWORD: 'Playwright1234@',
};

export const TEST_DATA = {
  ORG_NAME_PREFIX: 'Playwright',
  APP_NAME_PREFIX: 'Meebly',
  APP_ENVIRONMENT: 'Dev',
  APP_URL: 'https://super-secret-edk-testing-ai-project.meebly.ai',
  ACTION_NAME_PREFIX: 'testAction',
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
