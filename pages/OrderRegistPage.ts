import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Trang Đăng ký Đơn hàng (popup/new window)
 */
export class OrderRegistPage extends BasePage {
  private orderNameInput = '#txtOrderName';
  private amountInput = '#txtAmount';
  private registerButton = '#btnRegister';

  constructor(page: Page) {
    super(page);
  }

  /** Nhập thông tin đơn hàng */
  async fillOrderForm(orderName: string, amount: string) {
    await this.page.fill(this.orderNameInput, orderName);
    await this.page.fill(this.amountInput, amount);
  }

  /** Bấm nút "Đăng ký" để lưu đơn hàng */
  async submitOrder() {
    await this.clickAndWaitForLoad(this.registerButton);
  }
}
