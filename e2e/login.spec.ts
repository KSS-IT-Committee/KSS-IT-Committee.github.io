import { test, expect } from '@playwright/test';

test.describe('Login flow', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('ログイン');
  });

  // TODO: Add more E2E tests for login flow
});
