import { test, expect } from '@playwright/test';
import { getTimestampedName, TEST_DATA, TEST_ENV_VARS } from './constants';
import { MeeblyHelpers } from './helpers/meebly-helpers';

test.describe('Agent Tests', () => {
  test('Create New Agent and Delete it', async ({ page }) => {
    const helper = new MeeblyHelpers(page);
    await helper.enterTestApp();
    await page.getByRole('tab', { name: 'Agents' }).click();
    await page.getByRole('button', { name: 'Create Agent' }).click();

    const agentName = getTimestampedName(TEST_ENV_VARS.AGENT_NAME);
    await page.getByRole('textbox', { name: 'Agent Name' }).fill(agentName);
    await page
      .getByRole('textbox', { name: 'Instructions' })
      .fill('This is a test agent created by Playwright.');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Deploy Agent' }).click();

    await helper.navigateToAgent(agentName);
    await expect(page.getByRole('heading', { name: agentName })).toBeVisible();

    await page
      .getByRole('button', { name: 'Delete Agent', exact: true })
      .click();
    await page.getByRole('button', { name: 'Delete' }).nth(2).click();

    await page.getByRole('tab', { name: 'Agents' }).click();
    await page
      .getByRole('textbox', { name: 'Search agents...' })
      .fill(agentName);
    const actionHeading = page.getByRole('heading', { name: agentName });
    await expect(actionHeading).toHaveCount(0);
  });

  test('Update Agent Configuration', async ({ page }) => {
    const helper = new MeeblyHelpers(page);
    await helper.enterTestApp();
    await page.getByRole('tab', { name: 'Agents' }).click();

    // Find agent
    await helper.navigateToAgent(TEST_ENV_VARS.AGENT_NAME);

    // Edit Configuration
    await page.getByRole('button', { name: 'Edit Configuration' }).click();
    const instructionsTextbox = page.getByRole('textbox', {
      name: 'Instructions',
    });
    const newInstructions = getTimestampedName(TEST_DATA.AGENT_DESCRIPTION);
    await instructionsTextbox.fill(newInstructions);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Update Agent' }).click();

    // Verify the instructions were updated
    await expect(page.getByText(newInstructions)).toBeVisible();
  });
});
