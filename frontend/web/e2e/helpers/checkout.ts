import { type Page, expect } from '@playwright/test';

/**
 * Navigate to a product detail page by clicking its card on the home page.
 */
export async function navigateToProductDetail(page: Page, productName: string): Promise<void> {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  // Wait for products to load
  await page.getByRole('heading', { name: productName, level: 4 }).first().waitFor();
  // Click the product card link
  await page.getByRole('heading', { name: productName, level: 4 }).first().click();
  // Wait for product detail page
  await page.waitForURL(/\/product\/\d+/);
}

/**
 * Add the currently viewed product to cart from its detail page.
 */
export async function addProductToCartFromDetail(page: Page): Promise<void> {
  const addButton = page.getByRole('button', { name: 'Add to Cart' });
  await addButton.click();
  // Wait for success feedback
  await expect(page.getByRole('button', { name: /Added to Cart/i })).toBeVisible();
}

/**
 * Go to home page, click a product by name, and add it to cart.
 * Returns the product name.
 */
export async function addFirstProductToCart(page: Page, productName = 'Nova X Pro'): Promise<string> {
  await navigateToProductDetail(page, productName);
  await addProductToCartFromDetail(page);
  return productName;
}

/**
 * Create a new address on the checkout page.
 * Assumes user is on checkout page and no existing address is selected.
 */
export async function createTestAddress(page: Page): Promise<void> {
  // Click add new address button
  await page.getByRole('button', { name: /Yeni Adres Ekle/i }).click();

  // Fill address form
  await page.getByLabel('Adres Başlığı').fill('Test Ev');
  await page.getByLabel('Şehir').fill('Istanbul');
  await page.getByLabel('İlçe').fill('Besiktas');
  await page.getByLabel('Açık Adres').fill('E2E Test Sokak No: 1');
  await page.getByLabel(/Posta Kodu/i).fill('34000');

  // Submit address
  await page.getByRole('button', { name: 'Kaydet' }).click();

  // Wait for address to be saved and form to close
  await expect(page.getByText('Test Ev')).toBeVisible();
}

/**
 * Fill the test payment form.
 */
export async function fillTestPaymentForm(page: Page): Promise<void> {
  await page.getByLabel('Test Kartı Üzerindeki İsim').fill('Demo Kullanıcı');
  await page.getByLabel('Test Kartı Numarası').fill('4242 4242 4242 4242');
  await page.getByLabel('Test Son Kullanma Tarihi').fill('12/30');
  await page.getByLabel('Test CVV').fill('123');
}
