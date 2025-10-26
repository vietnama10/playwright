import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Trang Danh sách Đơn hàng
 */
export class OrderListPage extends BasePage {
  private newOrderButton = 'button#btnNewOrder';
  private orderTable = 'table#orderList';

  constructor(page: Page) {
    super(page);
  }

  /** Mở trang danh sách đơn hàng */
  async open() {
    await this.page.goto('/orders');
    await this.waitForPageLoad();
  }

  /** Nhấn nút "Tạo mới đơn hàng" -> mở trang đăng ký (new window) */
  async clickNewOrderButton() {
    return this.handleNewWindow(
      async () => {
        await this.page.click(this.newOrderButton);
      },
      async (popupPage) => popupPage
    );
  }

  /** Kiểm tra đơn hàng mới đã xuất hiện chưa */
  async verifyOrderExists(orderName: string) {
    await expect(this.page.locator(this.orderTable)).toContainText(orderName);
  }
}
