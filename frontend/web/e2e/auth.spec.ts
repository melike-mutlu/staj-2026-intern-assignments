import { test, expect } from '@playwright/test';
import { loginDemoUser, DEMO_EMAIL, DEMO_PASSWORD } from './helpers/auth';

test.describe('Authentication', () => {
  test('successful login with demo user', async ({ page }) => {
    await loginDemoUser(page);

    // Should be on home page
    await expect(page).toHaveURL('/');

    // Navbar should show authenticated state (Profile link)
    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();
  });

  test('failed login shows error message', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(DEMO_EMAIL);
    await page.getByLabel('Password', { exact: true }).fill('WrongPassword123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Error message should be visible
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText(/invalid|hatalı|geçersiz/i);

    // Should still be on login page (not authenticated)
    await expect(page).toHaveURL(/\/login/);
  });

  test('protected route redirects to login and back after success', async ({ page }) => {
    // Visit protected route while logged out
    await page.goto('/orders');

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);

    // Login with demo user
    await page.getByLabel('Email').fill(DEMO_EMAIL);
    await page.getByLabel('Password', { exact: true }).fill(DEMO_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    // Should be redirected back to /orders
    await expect(page).toHaveURL(/\/orders/);
    await expect(page.getByRole('heading', { name: 'Siparişlerim' })).toBeVisible();
  });

  test('logout makes protected routes inaccessible', async ({ page }) => {
    // Login first
    await loginDemoUser(page);
    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();

    // Go to profile and logout
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'Profile Settings' })).toBeVisible();

    await page.getByRole('button', { name: 'Logout' }).click();

    // Should be redirected to login (RequireAuth prevents remaining on the page)
    await expect(page).toHaveURL(/\/login/);

    // Try to access profile — should redirect to login
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/);
  });
});
