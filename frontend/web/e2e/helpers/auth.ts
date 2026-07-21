import { type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';

/**
 * Generate a unique test email address.
 * Format: e2e-{timestamp}-{uuid}@example.com
 */
export function generateTestEmail(): string {
  return `e2e-${Date.now()}-${randomUUID().slice(0, 8)}@example.com`;
}

/** Default test password (min 8 chars) */
export const TEST_PASSWORD = 'E2ePassword123';

/** Demo user credentials (read-only/controlled tests only) */
export const DEMO_EMAIL = 'demo@eticaret.com';
export const DEMO_PASSWORD = 'DemoPass123';

/**
 * Register a new user via UI.
 * Returns the email used.
 */
export async function registerUser(
  page: Page,
  options?: { email?: string; password?: string; fullName?: string }
): Promise<string> {
  const email = options?.email ?? generateTestEmail();
  const password = options?.password ?? TEST_PASSWORD;
  const fullName = options?.fullName ?? 'E2E Test User';

  await page.goto('/register');
  await page.getByLabel('Full Name').fill(fullName);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Confirm Password').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();

  // Wait for navigation away from register page
  await page.waitForURL((url) => !url.pathname.includes('/register'));

  return email;
}

/**
 * Login via UI.
 */
export async function loginUser(
  page: Page,
  options?: { email?: string; password?: string }
): Promise<void> {
  const email = options?.email ?? DEMO_EMAIL;
  const password = options?.password ?? DEMO_PASSWORD;

  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  // Wait for navigation away from login page
  await page.waitForURL((url) => !url.pathname.includes('/login'));
}

/**
 * Login with demo user.
 */
export async function loginDemoUser(page: Page): Promise<void> {
  await loginUser(page, { email: DEMO_EMAIL, password: DEMO_PASSWORD });
}
