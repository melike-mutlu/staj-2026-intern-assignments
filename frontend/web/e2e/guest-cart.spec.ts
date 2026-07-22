import { test, expect } from '@playwright/test';
import { generateTestEmail, TEST_PASSWORD } from './helpers/auth';
import { navigateToProductDetail, addProductToCartFromDetail } from './helpers/checkout';

test.describe('Guest Cart', () => {
  test('guest cart persists and merges after login', async ({ page }) => {
    // 1. As guest, add product to cart
    await navigateToProductDetail(page, 'SwiftCharge 65W');
    await addProductToCartFromDetail(page);

    // 2. Go to cart, verify product is there
    await page.goto('/cart', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('SwiftCharge 65W')).toBeVisible();

    // 3. Reload — verify guest cart persists via localStorage
    await page.reload();
    await expect(page.getByText('SwiftCharge 65W')).toBeVisible();

    // 4. Try to checkout — should redirect to login
    await page.getByRole('button', { name: /Checkout/i }).click();
    await expect(page).toHaveURL(/\/login/);

    // 5. Register a unique user instead of using demo
    const email = generateTestEmail();
    await page.goto('/register', { waitUntil: 'domcontentloaded' });
    await page.getByLabel('Full Name').fill('Guest Cart Test');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);
    await page.getByLabel('Confirm Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Register' }).click();

    // Wait for registration to complete
    await page.waitForURL((url) => !url.pathname.includes('/register'));

    // 6. Go to cart page
    await page.goto('/cart', { waitUntil: 'domcontentloaded' });

    // 7. Verify merge banner is visible
    await expect(page.getByRole('button', { name: /Hesabıma Aktar/i })).toBeVisible();

    // 8. Click merge button
    await page.getByRole('button', { name: /Hesabıma Aktar/i }).click();

    // 9. Wait for merge result
    await expect(page.getByText(/aktarıldı/i)).toBeVisible({ timeout: 10_000 });

    // 10. Verify product appears in the cart items
    await expect(page.getByText('SwiftCharge 65W')).toBeVisible();
  });
});
