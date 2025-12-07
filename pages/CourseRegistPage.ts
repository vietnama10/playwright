//playwright/pages/CourseRegistPage.ts
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Trang Đăng ký Khóa học
 */
export class CourseRegistPage extends BasePage {
  // Selectors - có thể cần điều chỉnh theo DOM thực tế
  // Selectors that match the Contact Form 7 markup on the page
  private nameInput = 'input[name="your-name"]';
  private emailInput = 'input[name="your-email"]';
  private phoneInput = 'input[name="your-phone"]';
  private courseSelect = 'select[name="Study"]';
  private messageTextarea = 'textarea[name="your-message"]';
  private submitButton = 'input[type="submit"]#submit, input.wpcf7-submit';

  // Error message selectors specific to Contact Form 7
  private errorMessages = '.wpcf7-not-valid-tip, .wpcf7-response-output, .screen-reader-response, .wpcf7-form-control.wpcf7-not-valid';

  constructor(page: Page) {
    super(page);
  }

  /** Mở trang đăng ký khóa học */
  async open() {
    await this.page.goto('http://iviettech.vn/dang-ky');
    await this.waitForPageLoad();
  }

  /** Nhập tên */
  async fillName(name: string) {
    const el = this.page.locator(this.nameInput).first();
    await el.waitFor({ state: 'visible' });
    await el.fill(name);
  }

  /** Nhập email */
  async fillEmail(email: string) {
    const el = this.page.locator(this.emailInput).first();
    await el.waitFor({ state: 'visible' });
    await el.fill(email);
  }

  /** Nhập số điện thoại */
  async fillPhone(phone: string) {
    const el = this.page.locator(this.phoneInput).first();
    await el.waitFor({ state: 'visible' });
    await el.fill(phone);
  }

  /** Chọn khóa học */
  async selectCourse(course: string) {
    const el = this.page.locator(this.courseSelect).first();
    await el.waitFor({ state: 'visible' });
    await el.selectOption({ label: course });
  }

  /** Nhập tin nhắn */
  async fillMessage(message: string) {
    const el = this.page.locator(this.messageTextarea).first();
    await el.waitFor({ state: 'visible' });
    await el.fill(message);
  }

  /** Điền toàn bộ form đăng ký */
  async fillRegistrationForm(data: {
    name?: string;
    email?: string;
    phone?: string;
    course?: string;
    message?: string;
  }) {
    if (data.name) await this.fillName(data.name);
    if (data.email) await this.fillEmail(data.email);
    if (data.phone) await this.fillPhone(data.phone);
    if (data.course) await this.selectCourse(data.course);
    if (data.message) await this.fillMessage(data.message);
  }

  /** Submit form */
  async submitForm() {
    const btn = this.page.locator(this.submitButton).first();
    await btn.waitFor({ state: 'visible' });
    await btn.click();
    await this.page.waitForTimeout(1000); // Chờ xử lý
  }

  /** Kiểm tra có thông báo lỗi không */
  async verifyErrorVisible() {
    const errorElement = this.page.locator(this.errorMessages).first();
    await expect(errorElement).toBeVisible();
  }

  /** Kiểm tra thông báo lỗi cụ thể */
  async verifyErrorMessage(expectedMessage: string) {
    const errorElement = this.page.locator(this.errorMessages);
    await expect(errorElement).toContainText(expectedMessage);
  }

  /** Kiểm tra thành công (có thể là success message hoặc redirect) */
  async verifySuccess() {
    // Có thể là success message hoặc URL thay đổi
    await this.page.waitForTimeout(2000);
    // Kiểm tra success message nếu có
    const successMessage = this.page.locator('.success, .success-message, [class*="success"]');
    if (await successMessage.count() > 0) {
      await expect(successMessage).toBeVisible();
    }
  }

  /** Kiểm tra field có highlight lỗi không */
  async verifyFieldError(fieldName: 'name' | 'email' | 'phone' | 'course' | 'message') {
    let fieldSelector = '';
    switch (fieldName) {
      case 'name':
        fieldSelector = this.nameInput;
        break;
      case 'email':
        fieldSelector = this.emailInput;
        break;
      case 'phone':
        fieldSelector = this.phoneInput;
        break;
      case 'course':
        fieldSelector = this.courseSelect;
        break;
      case 'message':
        fieldSelector = this.messageTextarea;
        break;
    }
    
    const field = this.page.locator(fieldSelector);
    // Kiểm tra có class error hoặc aria-invalid (bao gồm Contact Form 7 classes)
    const hasError = await field.evaluate((el) => {
      return el.classList.contains('error') ||
             el.classList.contains('invalid') ||
             el.classList.contains('wpcf7-not-valid') ||
             el.getAttribute('aria-invalid') === 'true';
    });
    
    expect(hasError).toBeTruthy();
  }
}
