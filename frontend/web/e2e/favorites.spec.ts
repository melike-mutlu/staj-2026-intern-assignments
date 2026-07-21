import { test, expect } from '@playwright/test';
import { registerUser } from './helpers/auth';

test.describe('Favorites', () => {
  test('add and remove favorite, verify persistence', async ({ page }) => {
    // Register unique user
    await registerUser(page);
    await page.goto('/');

    // Wait for products
    await expect(
      page.getByRole('heading', { name: 'Nova X Pro', level: 4 })
    ).toBeVisible();

    // Find the favorite button for the first product
    const favButton = page
      .getByRole('button', { name: /Nova X Pro favorilere ekle/i })
      .first();
    await expect(favButton).toBeVisible();

    // Add to favorites
    await favButton.click();

    // Verify aria-pressed becomes true
    await expect(
      page
        .getByRole('button', { name: /Nova X Pro favorilerden çıkar/i })
        .first()
    ).toHaveAttribute('aria-pressed', 'true');

    // Verify navbar favorites badge updates
    await expect(
      page.getByRole('link', { name: /Favoriler, \d+ ürün/i })
    ).toBeVisible();

    // Go to favorites page
    await page.goto('/favorites');
    await expect(page.getByText('Nova X Pro')).toBeVisible();

    // Remove from favorites
    const removeFavButton = page
      .getByRole('button', { name: /Nova X Pro favorilerden çıkar/i })
      .first();
    await removeFavButton.click();

    // Product should disappear from favorites page
    await expect(page.getByText('Nova X Pro')).not.toBeVisible({ timeout: 5_000 });

    // Reload and verify persistence
    await page.reload();
    await expect(page.getByText('Nova X Pro')).not.toBeVisible({ timeout: 5_000 });
  });

  test('guest user redirected to login when clicking favorite', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for products
    await expect(
      page.getByRole('heading', { name: 'Nova X Pro', level: 4 })
    ).toBeVisible();

    // Click favorite button as guest
    const favButton = page
      .getByRole('button', { name: /Nova X Pro favorilere ekle/i })
      .first();
    await favButton.click();

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});
