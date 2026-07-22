import { test, expect } from '@playwright/test';

test.describe('Product Catalog & Search', () => {
  test('home page shows seed products', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for products to load — check a known seed product
    await expect(page.getByRole('heading', { name: 'Nova X Pro', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pixel Lite 8', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'AtlasBook Air 14', level: 2 })).toBeVisible();
  });

  test('category filter updates product list', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for products
    await expect(page.getByRole('heading', { name: 'Nova X Pro', level: 2 })).toBeVisible();

    // Click Aksesuar category
    await page.getByRole('button', { name: 'Aksesuar' }).click();

    // Aksesuar products should be visible
    await expect(page.getByRole('heading', { name: 'Pulse ANC Kulaklik', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'SwiftCharge 65W', level: 2 })).toBeVisible();

    // Non-aksesuar products should not be visible
    await expect(page.getByRole('heading', { name: 'Nova X Pro', level: 2 })).not.toBeVisible();
  });

  test('search returns matching results', async ({ page }) => {
    await page.goto('/search', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByLabel('Search products');
    await searchInput.fill('Nova');

    // Wait for debounced search results
    await expect(page.getByRole('heading', { name: 'Nova X Pro', level: 2 })).toBeVisible();
  });

  test('search shows empty state for no results', async ({ page }) => {
    await page.goto('/search', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByLabel('Search products');
    await searchInput.fill('xyznonexistent12345');

    // Wait for empty state
    await expect(page.getByText('No results found')).toBeVisible();
  });

  test('product card navigates to detail page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Nova X Pro', level: 2 })).toBeVisible();

    // Click the product card
    await page.getByRole('heading', { name: 'Nova X Pro', level: 2 }).click();

    // Should navigate to product detail
    await expect(page).toHaveURL(/\/product\/\d+/);
    await expect(page.getByRole('heading', { name: 'Nova X Pro' })).toBeVisible();
  });

  test('invalid product ID shows not found', async ({ page }) => {
    await page.goto('/product/99999', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText(/Ürün bulunamadı/i)).toBeVisible();
  });
});
