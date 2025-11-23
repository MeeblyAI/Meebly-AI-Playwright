import { Page, expect } from '@playwright/test';
import {
  TEST_DATA,
  getTimestampedName,
  TIMEOUTS,
  AUTH_CONSTANTS,
  TEST_ENV_VARS,
} from '../constants';

export class MeeblyHelpers {
  constructor(private page: Page) {}

  /**
   * Performs authentication by logging in with credentials
   */
  async authenticate(): Promise<void> {
    await this.page.goto(AUTH_CONSTANTS.URL);
    await this.page.getByRole('link', { name: 'Login' }).click();
    await this.page.getByLabel(/email/i).fill(AUTH_CONSTANTS.EMAIL);
    await this.page.getByLabel(/password/i).fill(AUTH_CONSTANTS.PASSWORD);
    await this.page.getByRole('button', { name: /sign in/i }).click();
    await this.page.waitForURL('**/dashboard', { timeout: 50000 });
  }

  /**
   * Creates a new organization with a timestamped name
   * @param orgNamePrefix - Prefix for the organization name (optional, defaults to TEST_DATA.ORG_NAME_PREFIX)
   * @returns The generated organization name
   */
  async createOrganization(
    orgNamePrefix: string = TEST_DATA.ORG_NAME_PREFIX
  ): Promise<string> {
    const orgName = getTimestampedName(orgNamePrefix);

    await this.page
      .getByRole('button', { name: 'Create New Organization' })
      .click();
    await this.page
      .getByRole('textbox', { name: 'Organization Name' })
      .fill(orgName);
    await this.page.getByRole('button', { name: 'Create' }).click();

    return orgName;
  }

  /**
   * Switches to a specified organization
   * @param orgName - Name of the organization to switch to
   */
  async switchOrganization(orgName: string): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.page
      .getByRole('button', { name: 'Switch Organization' })
      .click();
    await this.page
      .getByRole('textbox', { name: 'Search my organizations...' })
      .waitFor({ state: 'visible', timeout: 3000 });
    await this.page
      .getByRole('textbox', { name: 'Search my organizations...' })
      .fill(orgName);
    // await this.page
    //   .getByText(orgName)
    //   .waitFor({ state: 'visible', timeout: 3000 });
    await this.page.getByText(orgName).click();
  }

  /**
   * Creates a new app with timestamped name and environment
   * @param appNamePrefix - Prefix for the app name (optional)
   * @param environment - Environment name (optional, defaults to TEST_DATA.APP_ENVIRONMENT)
   * @param apiUrl - API URL for the app (optional, defaults to TEST_DATA.APP_URL)
   * @returns Object containing the generated app name
   */
  async createApp(
    appNamePrefix: string = TEST_DATA.APP_NAME_PREFIX,
    environment: string = TEST_DATA.APP_ENVIRONMENT,
    apiUrl: string = TEST_DATA.APP_URL
  ): Promise<{ appName: string }> {
    const appName = getTimestampedName(appNamePrefix);

    // Click on Create App button in navigation
    await this.page.goto('https://www.meebly.ai/dashboard');
    await this.page
      .getByRole('navigation')
      .getByRole('button', { name: 'Create App' })
      .click();

    // Fill in app details
    await this.page
      .getByRole('textbox', { name: 'Enter app name' })
      .fill(appName);
    await this.page
      .getByRole('textbox', { name: 'e.g., Production, Staging,' })
      .fill(environment);
    await this.page
      .getByRole('textbox', { name: 'https://api.example.com' })
      .fill(apiUrl);

    // Submit the form
    await this.page
      .locator('form')
      .getByRole('button', { name: 'Create App' })
      .click();

    return { appName };
  }

  /**
   * Navigates to a specific app and environment
   * @param appName - Name of the app to open
   * @param environment - Environment to select (optional, defaults to TEST_DATA.APP_ENVIRONMENT)
   */
  async navigateToApp(
    appName: string,
    environment: string = TEST_DATA.APP_ENVIRONMENT
  ): Promise<void> {
    await this.page.getByRole('heading', { name: appName }).click();
    await this.page.getByRole('button', { name: environment }).click();
  }

  /** Selects a specific app
   * @param appName - Name of the app to select
   */
  async selectApp(appName: string): Promise<void> {
    await this.page.getByText(`${appName}App ID`).click();
  }

  /**
   * Creates a new action with AI-generated description
   * @param actionNamePrefix - Prefix for the action name (optional)
   * @param endpoint - API endpoint for the action
   * @param aiPrompt - Prompt for AI to generate description
   * @returns Object containing the generated action name
   */
  async createAction(
    actionNamePrefix: string = TEST_DATA.ACTION_NAME_PREFIX,
    endpoint: string = '/api/test',
    aiPrompt: string = 'This is a test action'
  ): Promise<{ actionName: string }> {
    const actionName = getTimestampedName(actionNamePrefix);

    // Click Add Action button
    await this.page.getByRole('button', { name: 'Add Action' }).click();

    // Fill in action name
    await this.page
      .getByRole('textbox', { name: 'getUserData' })
      .fill(actionName);

    // Fill in endpoint
    await this.page
      .getByRole('textbox', { name: '/api/{{userId}}' })
      .fill(endpoint);

    // Use AI to generate description
    await this.page.getByRole('button', { name: 'Generate' }).click();
    await this.page
      .getByRole('textbox', { name: 'Describe what you want...' })
      .fill(aiPrompt);
    await this.page
      .getByRole('button', { name: 'Create', exact: true })
      .click();

    return { actionName };
  }

  async navigateToAction(actionName: string): Promise<void> {
    await this.page
      .getByRole('textbox', { name: 'Search actions...' })
      .fill(actionName);
    await this.page.getByRole('heading', { name: actionName }).click();
  }

  /**
   * Verifies that AI generated a description (checks if textbox has content)
   * @param textboxName - Name/label of the textbox to check
   * @returns true if textbox has content, false otherwise
   */
  async verifyAIGeneratedContent(
    textboxName: string = 'Describe what this action'
  ): Promise<boolean> {
    const textbox = this.page.getByRole('textbox', { name: textboxName });
    const content = await textbox.inputValue();
    return content.length > 0;
  }

  /**
   * Completes the action creation by navigating to Payload and clicking Create
   */
  async completeActionCreation(): Promise<void> {
    await this.page.getByRole('button', { name: 'Payload' }).click();
    await this.page
      .getByRole('button', { name: 'Create', exact: true })
      .click();
  }

  /**
   * Opens an existing action by clicking on its heading
   * @param actionName - Name of the action to open
   */
  async openAction(actionName: string): Promise<void> {
    await this.page.getByRole('heading', { name: actionName }).click();
  }

  /**
   * Opens the test chat interface for the current action
   */
  async openTestChat(): Promise<void> {
    await this.page.getByRole('button', { name: 'Test', exact: true }).click();
  }

  /**
   * Sends a message in the test chat
   * @param message - Message to send
   */
  async sendChatMessage(message: string): Promise<void> {
    await this.page
      .getByRole('textbox', { name: 'Type your message...' })
      .fill(message);
    await this.page.getByRole('button', { name: 'Send' }).click();
  }

  /**
   * Waits for and verifies AI response in chat
   * Checks that the AI responded with text that's not "No response received"
   * @param timeout - Maximum time to wait for response (optional, defaults to TIMEOUTS.AI_RESPONSE)
   * @returns true if valid AI response received, false otherwise
   */
  async verifyAIResponse(timeout: number = TIMEOUTS.AI_RESPONSE): Promise<{
    success: boolean;
    responseText: string;
  }> {
    try {
      // Wait for the AI response element to appear
      const responseElement = this.page.locator(
        '.max-w-\\[80\\%\\].rounded-lg.px-4.py-3.bg-gray-100 > .break-words'
      );

      await responseElement.waitFor({ state: 'visible', timeout });

      const responseText = await responseElement.textContent();

      // Check that response exists and is not "No response received"
      const isValidResponse =
        responseText !== null &&
        responseText.trim().length > 0 &&
        !responseText.toLowerCase().includes('no response received');

      return {
        success: isValidResponse,
        responseText: responseText || '',
      };
    } catch (error) {
      return {
        success: false,
        responseText: '',
      };
    }
  }

  /**
   * Complete workflow: Create org, app, action with AI, and test it
   * @param options - Configuration options for the workflow
   */
  async completeWorkflow(options?: {
    orgName?: string;
    appName?: string;
    environment?: string;
    apiUrl?: string;
    actionName?: string;
    endpoint?: string;
    aiPrompt?: string;
    chatMessage?: string;
  }): Promise<{
    orgName: string;
    appName: string;
    actionName: string;
    aiResponseValid: boolean;
    aiResponseText: string;
  }> {
    // Create organization
    const orgName = await this.createOrganization(options?.orgName);

    // Create app
    const { appName } = await this.createApp(
      options?.appName,
      options?.environment,
      options?.apiUrl
    );

    // Navigate to the app
    await this.navigateToApp(appName, options?.environment);

    // Create action with AI
    const { actionName } = await this.createAction(
      options?.actionName,
      options?.endpoint,
      options?.aiPrompt
    );

    // Verify AI generated content
    const hasAIContent = await this.verifyAIGeneratedContent();
    expect(hasAIContent).toBeTruthy();

    // Complete action creation
    await this.completeActionCreation();

    // Open the action
    await this.openAction(actionName);

    // Open test chat
    await this.openTestChat();

    // Send test message
    await this.sendChatMessage(options?.chatMessage || 'Test function');

    // Verify AI response
    const { success: aiResponseValid, responseText: aiResponseText } =
      await this.verifyAIResponse();

    return {
      orgName,
      appName,
      actionName,
      aiResponseValid,
      aiResponseText,
    };
  }

  /**
   * Enter test environment app
   */
  async enterTestApp(): Promise<void> {
    await this.authenticate();
    await this.switchOrganization(TEST_ENV_VARS.ORG_NAME);
    await this.selectApp(TEST_ENV_VARS.APP_NAME);
  }
}
