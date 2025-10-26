import { Page } from '@playwright/test';

/**
 * BasePage - lớp cơ sở cho tất cả Page Object.
 * Cung cấp các phương thức tiện ích chung.
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Chờ trang tải hoàn toàn */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Click và chờ trang tải lại */
  async clickAndWaitForLoad(selector: string) {
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.page.click(selector)
    ]);
  }

  /** Xử lý mở cửa sổ mới (popup/new window) */
  async handleNewWindow<T>(
    action: () => Promise<void>,
    callback: (newPage: Page) => Promise<T>
  ): Promise<T> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      action()
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    const result = await callback(newPage);
    await newPage.close();
    return result;
  }
}
