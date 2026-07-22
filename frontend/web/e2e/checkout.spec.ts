import { test, expect } from '@playwright/test';
import { registerUser } from './helpers/auth';
import {
  navigateToProductDetail,
  addProductToCartFromDetail,
  createTestAddress,
  fillTestPaymentForm,
} from './helpers/checkout';

test.describe('Critical Checkout Flow', () => {
  test('full end-to-end checkout with unique user', async ({ page }) => {
    // 1. Register unique user
    await registerUser(page);

    // 2. Verify authenticated — Profile link should be visible
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();

    // 3. Wait for products and navigate to product detail
    await navigateToProductDetail(page, 'Nova X Pro');

    // 4. Add to cart
    await addProductToCartFromDetail(page);

    // 5. Verify cart badge updates in navbar
    await expect(page.getByRole('link', { name: /Cart, \d+ item/i })).toBeVisible();

    // 6. Go to cart page
    await page.goto('/cart', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await expect(page.getByText('Nova X Pro')).toBeVisible();

    // 7. Proceed to checkout
    await page.getByRole('button', { name: /Checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout/);

    // 8. Create new address
    await createTestAddress(page);

    // 9. Verify address is auto-selected (radio checked)
    const selectedRadio = page.locator('input[name="shippingAddress"]:checked');
    await expect(selectedRadio).toBeAttached();

    // 10. Fill test payment form
    await fillTestPaymentForm(page);

    // 11. Set up request interception to verify no card data sent
    let orderRequestBody: Record<string, unknown> | null = null;
    page.on('request', (request) => {
      if (
        request.url().includes('/api/v1/orders') &&
        request.method() === 'POST'
      ) {
        try {
          orderRequestBody = JSON.parse(request.postData() || '{}');
        } catch {
          // Not JSON
        }
      }
    });

    // 12. Submit order
    const orderButton = page.getByRole('button', {
      name: /Simüle Ödeme ile Sipariş Ver/i,
    });
    await orderButton.click();

    // 13. Wait for order confirmation page
    await expect(page).toHaveURL(/\/order-confirm\/\d+/, { timeout: 15_000 });

    // 14. Verify order confirmation
    await expect(
      page.getByRole('heading', { name: 'Siparişiniz Alındı!' })
    ).toBeVisible();

    // 15. Verify total amount is displayed
    await expect(page.getByText('Genel Toplam')).toBeVisible();

    // 16. Verify cart badge is cleared
    await expect(
      page.getByRole('link', { name: /Cart, \d+ item/i })
    ).not.toBeVisible();

    // 17. Go to orders page
    await page.goto('/orders', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByRole('heading', { name: 'Siparişlerim' })
    ).toBeVisible();

    // 18. Verify new order is in the list (at least one order card link exists)
    await expect(page.getByRole('link', { name: /order-confirm/i }).or(
      page.locator('a[href*="/order-confirm/"]')
    ).first()).toBeVisible();

    // 19. Verify request body only has allowed fields
    expect(orderRequestBody).not.toBeNull();
    if (orderRequestBody) {
      expect(orderRequestBody).toHaveProperty('shipping_address_id');
      expect(orderRequestBody).toHaveProperty('payment_method', 'simulation');
      // Card data must NOT be in the request
      expect(orderRequestBody).not.toHaveProperty('cardholderName');
      expect(orderRequestBody).not.toHaveProperty('cardNumber');
      expect(orderRequestBody).not.toHaveProperty('expiry');
      expect(orderRequestBody).not.toHaveProperty('cvv');
    }
  });
});
