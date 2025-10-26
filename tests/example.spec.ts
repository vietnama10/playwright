import { test, expect } from '@playwright/test';
import { readCSV } from '../utils/csvReader';

test.describe('Example Test', () => {
  const csvData = readCSV('./test-data/order-data.csv');

  for (const data of csvData) {
    test(`get started link  ${data.orderName}`, async ({ page }) => {
      await page.goto('https://playwright.dev/');
    
      // Click the get started link.
      await page.getByRole('link', { name: 'Get started' }).click();
    
      // Expects page to have a heading with the name of Installation.
      await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
    });
  }
});
