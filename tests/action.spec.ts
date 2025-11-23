import { test, expect } from '@playwright/test';
import { getTimestampedName, TEST_DATA, TEST_ENV_VARS } from './constants';
import { MeeblyHelpers } from './helpers/meebly-helpers';

test.describe('Action Tests', () => {
  test('Create New Action and Delete it', async ({ page }) => {
    const helper = new MeeblyHelpers(page);
    await helper.enterTestApp();
    await page.getByRole('button', { name: 'Add Action' }).click();

    const actionName = getTimestampedName(TEST_DATA.ACTION_NAME_PREFIX);
    const actionUrl = getTimestampedName(TEST_DATA.ACTION_URL_PREFIX);
    await page.getByRole('textbox', { name: 'getUserData' }).fill(actionName);
    await page.getByRole('textbox').nth(2).click();
    await page.getByRole('textbox').nth(2).fill(actionUrl);
    await page
      .getByRole('textbox', { name: 'Describe what this action' })
      .fill('This is a test action created by Playwright.');
    await page.getByRole('button', { name: 'Payload' }).click();
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    // Verify the action was created
    await helper.navigateToAction(actionName);
    await expect(page.getByRole('heading', { name: actionName })).toBeVisible();

    // Now delete the action
    await page.getByRole('button', { name: 'Delete Endpoint' }).click();
    await page.getByRole('button', { name: 'Delete' }).nth(2).click();

    // Verify the action is deleted by checking it no longer appears in the list
    await page
      .getByRole('textbox', { name: 'Search actions...' })
      .fill(actionName);
    const actionHeading = page.getByRole('heading', { name: actionName });
    await expect(actionHeading).toHaveCount(0);
  });

  test('Update Action Description', async ({ page }) => {
    const helper = new MeeblyHelpers(page);
    await helper.enterTestApp();

    // Find action
    await page
      .getByRole('textbox', { name: 'Search actions...' })
      .fill(TEST_ENV_VARS.ACTION_NAME);
    await page
      .getByRole('heading', { name: TEST_ENV_VARS.ACTION_NAME })
      .click();

    // Edit description
    await page.getByRole('button', { name: 'Edit Configuration' }).click();
    const descriptionTextbox = page.getByRole('textbox', {
      name: 'Describe what this action',
    });
    const newDescription = getTimestampedName(TEST_ENV_VARS.ACTION_DESCRIPTION);
    await descriptionTextbox.fill(newDescription);
    await page.getByRole('button', { name: 'Payload' }).click();
    await page.getByRole('button', { name: 'Update', exact: true }).click();

    // Verify the description was updated
    await expect(page.getByText(newDescription)).toBeVisible();
  });
});
