import { test, expect } from '@playwright/test';
import { AUTH_CONSTANTS, TIMEOUTS } from './constants';

test.describe('Login Tests', () => {
  test('Successful Login', async ({ page }) => {
    await page.goto(AUTH_CONSTANTS.URL);
    await page.getByRole('link', { name: 'Login' }).click();

    await page.getByLabel(/email/i).fill(AUTH_CONSTANTS.EMAIL);
    await page.getByLabel(/password/i).fill(AUTH_CONSTANTS.PASSWORD);

    await page.getByRole('button', { name: /sign in/i }).click();

    await page.waitForURL('**/dashboard', { timeout: 50000 });
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Unsuccessful Login - Invalid Credentials', async ({ page }) => {
    await page.goto(AUTH_CONSTANTS.URL);
    await page.getByRole('link', { name: 'Login' }).click();

    await page.getByLabel(/email/i).fill('invalid@email.com');
    await page.getByLabel(/password/i).fill('wrongpassword');

    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.locator('text=Invalid login credentials')).toBeVisible({
      timeout: TIMEOUTS.DEFAULT,
    });
  });

  test('Unsuccessful Login - Missing Credentials', async ({ page }) => {
    await page.goto(AUTH_CONSTANTS.URL);
    await page.getByRole('link', { name: 'Login' }).click();

    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });
});
