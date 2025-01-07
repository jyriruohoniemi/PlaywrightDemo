import { expect, test } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { faker } from "@faker-js/faker";
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
  const randomFullName = faker.person.fullName();
  const randomEmail = `${randomFullName.toLowerCase()}${faker.number.int(
    10000
  )}@test.com`;

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
      randomFullName,
      randomEmail,
      true
    );

  await pm.navigateTo().datePickerPage();
  await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(14);
  await pm.onDatePickerPage().selectDatepickerWithRangeFromToday(6, 12);
});
