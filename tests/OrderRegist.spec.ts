import { test } from '@playwright/test';
import { OrderListPage } from '../pages/OrderListPage';
import { OrderRegistPage } from '../pages/OrderRegistPage';
import { readCSV } from '../utils/csvReader';

test.describe('Order Registration Flow', () => {
  const csvData = readCSV('./test-data/order-data.csv');

  for (const data of csvData) {
    test(`Đăng ký đơn hàng: ${data.orderName}`, async ({ page }) => {
      const orderListPage = new OrderListPage(page);
      await orderListPage.open();

      // Mở cửa sổ Đăng ký đơn hàng (popup)
      const popupPage = await orderListPage.clickNewOrderButton();

      // Làm việc trên popup window
      const orderRegistPage = new OrderRegistPage(popupPage);
      await orderRegistPage.fillOrderForm(data.orderName, data.amount);
      await orderRegistPage.submitOrder();

      // Quay lại trang danh sách chính và kiểm tra kết quả
      await orderListPage.verifyOrderExists(data.orderName);
    });
  }
});
