import { test, expect } from '@playwright/test';
import {
  AUTH_CONSTANTS,
  TEST_DATA,
  getTimestampedName,
  TIMEOUTS,
} from './constants';

test('Complete E2E workflow - Create org, app, action and test AI', async ({
  page,
}) => {
  // Authentication
  await page.goto(AUTH_CONSTANTS.URL);
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel(/email/i).fill(AUTH_CONSTANTS.EMAIL);
  await page.getByLabel(/password/i).fill(AUTH_CONSTANTS.PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/dashboard', { timeout: 50000 });

  // Create New Organization with timestamp
  const orgName = getTimestampedName(TEST_DATA.ORG_NAME_PREFIX);

  // Check if "Create New Organization" button is visible, otherwise use existing org
  const createOrgButton = page.getByRole('button', {
    name: 'Create New Organization',
  });
  const isCreateOrgVisible = await createOrgButton
    .isVisible()
    .catch(() => false);

  if (isCreateOrgVisible) {
    // Create a new organization
    await createOrgButton.click();
    await page
      .getByRole('textbox', { name: 'Organization Name' })
      .fill(orgName);
    await page.getByRole('button', { name: 'Create' }).click();
  } else {
    // Wait
    await page.waitForTimeout(3000);
    // Organization already exists, continue with existing one
    await page.getByRole('button', { name: 'Switch organization' }).click();
    // Wait 3 seconds
    await page.waitForTimeout(3000);
    await createOrgButton.click();

    await page.waitForTimeout(1000);
    await page
      .getByRole('textbox', { name: 'Organization Name' })
      .fill(orgName);
    await page.getByRole('button', { name: 'Create' }).click();
  }

  // Wait for 300 ms
  await page.waitForTimeout(300);

  // Create New App with timestamp
  const appName = getTimestampedName(TEST_DATA.APP_NAME_PREFIX);
  await page.getByRole('button', { name: 'Create App' }).first().click();
  await page.getByRole('textbox', { name: 'Enter app name' }).fill(appName);
  await page
    .getByRole('textbox', { name: 'e.g., Production, Staging,' })
    .fill(TEST_DATA.APP_ENVIRONMENT);
  await page
    .getByRole('textbox', { name: 'https://api.example.com' })
    .fill(TEST_DATA.APP_URL);
  await page
    .locator('form')
    .getByRole('button', { name: 'Create App' })
    .click();

  // Wait for 300 ms
  await page.waitForTimeout(300);

  // Verify that the app was created and navigate to it
  await page.getByRole('heading', { name: appName }).click();
  await page.getByRole('button', { name: TEST_DATA.APP_ENVIRONMENT }).click();

  // Add New Action with timestamp
  const actionName = getTimestampedName(TEST_DATA.ACTION_NAME_PREFIX);
  await page.getByRole('button', { name: 'Add Action' }).click();
  await page.getByRole('textbox', { name: 'getUserData' }).fill(actionName);
  await page.getByRole('textbox').nth(2).click();
  // Fill it out
  await page.getByRole('textbox').nth(2).fill('/api/test');

  // Test AI Generate
  await page.getByRole('button', { name: 'Generate' }).click();
  await page
    .getByRole('textbox', { name: 'Describe what you want...' })
    .fill('This is a test action');
  await page.getByRole('button', { name: 'Create', exact: true }).click();

  // Verify that the AI generated description (textbox should have content)
  const descriptionField = page.getByRole('textbox', {
    name: 'Describe what this action',
  });
  await expect(descriptionField).not.toBeEmpty();

  // Get the generated content
  const generatedContent = await descriptionField.inputValue();
  expect(generatedContent.length).toBeGreaterThan(0);

  // Go to Payload and create the action
  await page.getByRole('button', { name: 'Payload' }).click();
  await page.getByRole('button', { name: 'Create', exact: true }).click();

  // Wait
  await page.waitForTimeout(300);

  // Verify the action exists by clicking on it
  await page.getByRole('heading', { name: actionName }).click();
  await expect(page.getByRole('heading', { name: actionName })).toBeVisible();

  // Test the action by chatting with it
  await page.getByRole('button', { name: 'Test', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Type your message...' })
    .fill('Test function');
  await page.getByRole('button', { name: 'Send' }).click();

  // Wait for AI response and verify it's valid (not "No response received")
  const responseElement = page.locator(
    '.max-w-\\[80\\%\\].rounded-lg.px-4.py-3.bg-gray-100 > .break-words'
  );
  await responseElement.waitFor({
    state: 'visible',
    timeout: TIMEOUTS.AI_RESPONSE,
  });

  const responseText = await responseElement.textContent();
  expect(responseText).toBeTruthy();
  expect(responseText!.trim().length).toBeGreaterThan(0);
  expect(responseText!.toLowerCase()).not.toContain('no response received');

  // Log success
  console.log('E2E Test Completed Successfully:', {
    orgName,
    appName,
    actionName,
    aiResponsePreview: responseText!.substring(0, 100) + '...',
  });
});
