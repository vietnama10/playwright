  import { Page, Locator, Response } from '@playwright/test';

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

  /**
   * Wait for a selector with a given state.
   * state: 'attached' | 'detached' | 'visible' | 'hidden'
   */
  async waitForSelector(selector: string, state: 'visible' | 'hidden' | 'attached' | 'detached' = 'visible', timeout = 5000) {
    await this.page.waitForSelector(selector, { state, timeout });
  }

  /** Wait until an element is visible */
  async waitForVisible(selector: string, timeout = 5000) {
    await this.waitForSelector(selector, 'visible', timeout);
  }

  /** Return a Locator for a selector (convenience) */
  locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /** Fill an input safely: wait until visible then fill */
  async safeFill(selector: string, value: string, timeout = 5000) {
    const el = this.page.locator(selector).first();
    await el.waitFor({ state: 'visible', timeout });
    await el.fill(value);
  }

  /** Click an element safely: wait until visible then click */
  async safeClick(selector: string, timeout = 5000) {
    const el = this.page.locator(selector).first();
    await el.waitFor({ state: 'visible', timeout });
    await el.click();
  }

  /** Click and wait for navigation/load state. Useful when clicking triggers a navigation. */
  async clickAndWaitForNavigation(selector: string, waitFor: Parameters<Page['waitForLoadState']>[0] = 'load') {
    const el = this.page.locator(selector).first();
    await Promise.all([
      this.page.waitForLoadState(waitFor),
      el.click()
    ]);
  }

  /** Click and wait for a network response matching a url or predicate */
  async clickAndWaitForResponse(selector: string, urlOrPredicate: string | RegExp | ((response: Response) => boolean), timeout = 10000) {
    const el = this.page.locator(selector).first();
    const waiter = this.page.waitForResponse((resp) => {
      if (typeof urlOrPredicate === 'string') return resp.url().includes(urlOrPredicate);
      if (urlOrPredicate instanceof RegExp) return urlOrPredicate.test(resp.url());
      return urlOrPredicate(resp);
    }, { timeout });
    await Promise.all([waiter, el.click()]);
    return await waiter;
  }

  /** Select option by visible label */
  async selectByLabel(selector: string, label: string) {
    const el = this.page.locator(selector).first();
    await el.waitFor({ state: 'visible' });
    await el.selectOption({ label });
  }

  /** Get text content from an element */
  async getText(selector: string): Promise<string | null> {
    const el = this.page.locator(selector).first();
    await el.waitFor({ state: 'attached' });
    return (await el.textContent())?.trim() ?? null;
  }

  /** Check visibility */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).first().isVisible();
  }

  /** Take page screenshot helper */
  async takeScreenshot(path?: string) {
    return await this.page.screenshot(path ? { path, fullPage: true } : { fullPage: true });
  }

  /** Fill multiple fields by providing an object of selector -> value */
  async fillFormFields(fields: Record<string, string>) {
    for (const [selector, value] of Object.entries(fields)) {
      await this.safeFill(selector, value);
    }
  }

  /** Click and wait for networkidle (existing behavior preserved) */
  async clickAndWaitForLoad(selector: string) {
    const el = this.page.locator(selector).first();
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      el.click()
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
