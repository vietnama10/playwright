import { test } from '@playwright/test';
import { CourseRegistPage } from '../pages/CourseRegistPage';
import { readCSV } from '../utils/csvReader';

// Read test data once at load time and create one Playwright test per row.
const records = readCSV('./test-data/course-regist-data.csv');

for (const row of records) {
  const { testCase, name, email, phone, course, message, expectedResult } = row;

  test(`${testCase} - Course Registration`, async ({ page }) => {
    const coursePage = new CourseRegistPage(page);

    // Open the registration page
    await coursePage.open();

    // Fill the form using the POM helper (only fills fields that are present)
    await coursePage.fillRegistrationForm({
      name: name || '',
      email: email || '',
      phone: phone || '',
      course: course || '',
      message: message || ''
    });

    // Submit the form
    await coursePage.submitForm();

    // Assert result based on expectedResult value
    if (expectedResult === 'success') {
      await coursePage.verifySuccess();
    } else if (expectedResult && expectedResult.startsWith('error_')) {
      // e.g. error_name -> field = 'name'
      const field = expectedResult.replace('error_', '') as
        | 'name'
        | 'email'
        | 'phone'
        | 'course'
        | 'message';

      // General error visible and specific field highlighted
      await coursePage.verifyErrorVisible();
      await coursePage.verifyFieldError(field);
    } else {
      throw new Error(`Unsupported expectedResult: ${expectedResult}`);
    }
  });
}
