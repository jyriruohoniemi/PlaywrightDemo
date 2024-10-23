import { expect, test } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test("navigate from page", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutPage();
  await pm.navigateTo().datePickerPage();
  await pm.navigateTo().toastrPage();
  await pm.navigateTo().tooltipPage();
  await pm.navigateTo().smartTablePage();
});

test("parameterized methods", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().formLayoutPage();

  await pm
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOption(
      "test@test.com",
      "test",
      "Option 1"
    );

  await pm
    .onFormLayoutsPage()
    .submitInlineFormWithNameEmailAndCheckbox(
      "John Doe",
      "test@test.com",
      true
    );

  await pm.navigateTo().datePickerPage();
  await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(14);
  await pm.onDatePickerPage().selectDatepickerWithRangeFromToday(6, 12);
});
