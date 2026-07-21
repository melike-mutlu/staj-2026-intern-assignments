import { test, expect } from '@playwright/test';
import { registerUser } from './helpers/auth';
import {
  navigateToProductDetail,
  addProductToCartFromDetail,
  createTestAddress,
  fillTestPaymentForm,
} from './helpers/checkout';

test.describe('Checkout Negative Cases', () => {
  test('empty cart redirects from checkout to cart', async ({ page }) => {
    // Register to be authenticated
    await registerUser(page);

    // Go directly to checkout with empty cart
    await page.goto('/checkout');

    // Should be redirected to cart page
    await expect(page).toHaveURL(/\/cart/);
  });

  test('order button is disabled without address', async ({ page }) => {
    // Register, add product, go to checkout
    await registerUser(page);
    await navigateToProductDetail(page, 'Pixel Lite 8');
    await addProductToCartFromDetail(page);
    await page.goto('/checkout');

    // Order button should be disabled (no address selected)
    const orderButton = page.getByRole('button', {
      name: /Simüle Ödeme ile Sipariş Ver/i,
    });
    await expect(orderButton).toBeDisabled();
  });

  test('empty payment fields show validation errors', async ({ page }) => {
    // Register, add product, go to checkout, create address
    await registerUser(page);
    await navigateToProductDetail(page, 'SwiftCharge 65W');
    await addProductToCartFromDetail(page);
    await page.goto('/checkout');
    await createTestAddress(page);

    // Submit form without filling payment — click the order button which submits the form
    const orderButton = page.getByRole('button', {
      name: /Simüle Ödeme ile Sipariş Ver/i,
    });
    await orderButton.click();

    // Validation errors should appear
    await expect(page.getByText(/Kart üzerindeki isim en az/i)).toBeVisible();
  });

  test('wrong card number shows validation error', async ({ page }) => {
    await registerUser(page);
    await navigateToProductDetail(page, 'Pulse ANC Kulaklik');
    await addProductToCartFromDetail(page);
    await page.goto('/checkout');
    await createTestAddress(page);

    // Fill with wrong card number
    await page.getByLabel('Test Kartı Üzerindeki İsim').fill('Demo Kullanıcı');
    await page.getByLabel('Test Kartı Numarası').fill('1111 2222 3333 4444');
    await page.getByLabel('Test Son Kullanma Tarihi').fill('12/30');
    await page.getByLabel('Test CVV').fill('123');

    const orderButton = page.getByRole('button', {
      name: /Simüle Ödeme ile Sipariş Ver/i,
    });
    await orderButton.click();

    await expect(
      page.getByText(/Yalnızca 4242 4242 4242 4242 test kartını kullanın/i)
    ).toBeVisible();
  });

  test('wrong CVV shows validation error', async ({ page }) => {
    await registerUser(page);
    await navigateToProductDetail(page, 'SwiftCharge 65W');
    await addProductToCartFromDetail(page);
    await page.goto('/checkout');
    await createTestAddress(page);

    await page.getByLabel('Test Kartı Üzerindeki İsim').fill('Demo Kullanıcı');
    await page.getByLabel('Test Kartı Numarası').fill('4242 4242 4242 4242');
    await page.getByLabel('Test Son Kullanma Tarihi').fill('12/30');
    await page.getByLabel('Test CVV').fill('999');

    const orderButton = page.getByRole('button', {
      name: /Simüle Ödeme ile Sipariş Ver/i,
    });
    await orderButton.click();

    await expect(page.getByText(/Test CVV değeri 123 olmalıdır/i)).toBeVisible();
  });

  test('double-click on order button sends only one request', async ({ page }) => {
    await registerUser(page);
    await navigateToProductDetail(page, 'AtlasBook Air 14');
    await addProductToCartFromDetail(page);
    await page.goto('/checkout');
    await createTestAddress(page);
    await fillTestPaymentForm(page);

    // Count POST /orders requests
    let orderRequestCount = 0;
    page.on('request', (request) => {
      if (
        request.url().includes('/api/v1/orders') &&
        request.method() === 'POST'
      ) {
        orderRequestCount++;
      }
    });

    // Intercept and delay the API response to simulate network latency,
    // giving us time to double click and verify the disabled state.
    await page.route('**/api/v1/orders', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });

    const orderButton = page.locator('button[type="submit"]');

    // Click twice quickly bypassing actionability checks to simulate fast double-click
    await orderButton.dispatchEvent('click');
    await orderButton.dispatchEvent('click');

    // The button should be disabled immediately while request is pending
    await expect(orderButton).toBeDisabled();

    // Wait for order confirmation (navigation proves first succeeded)
    await expect(page).toHaveURL(/\/order-confirm\/\d+/, { timeout: 15_000 });

    // Only one POST should have been sent
    expect(orderRequestCount).toBe(1);
  });

  test('invalid order ID shows not found', async ({ page }) => {
    // Need to be authenticated for order-confirm route
    await registerUser(page);

    await page.goto('/order-confirm/abc');
    await expect(page.getByText(/Sipariş bulunamadı/i)).toBeVisible();
  });
});
