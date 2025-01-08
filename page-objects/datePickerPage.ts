import { Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatePickerPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
    // Playwright technique: Interacting with date picker input
    const calendarInput = await this.page.getByPlaceholder("Form Picker");
    await calendarInput.click();
    const assertionDate = await this.selectDateInCalendar(
      numberOfDaysFromToday
    );
    expect(await calendarInput.inputValue()).toEqual(assertionDate);
  }

  async selectDatepickerWithRangeFromToday(
    startDateFromToday: number,
    endDateFromToday: number
  ) {
    const calendarInput = await this.page.getByPlaceholder("Range Picker");
    await calendarInput.click();
    const assertionDateStart = await this.selectDateInCalendar(
      startDateFromToday
    );
    const assertionDateEnd = await this.selectDateInCalendar(endDateFromToday);
    expect(await calendarInput.inputValue()).toEqual(
      `${assertionDateStart} - ${assertionDateEnd}`
    );
  }

  private async selectDateInCalendar(numberOfDaysFromToday: number) {
    let date = new Date();
    date.setDate(date.getDate() + numberOfDaysFromToday);
    const expectedDate = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString("en-US", { month: "short" });
    const expectedYear = date.getFullYear().toString();
    const assertionDate = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    // Navigates to the correct month in the date picker
    let monthValue = await this.page
      .locator("nb-calendar-view-mode")
      .textContent();
    monthValue = new Date(monthValue + " 1, 2000").toLocaleString("en-US", {
      month: "short",
    });

    while (monthValue !== expectedMonthShort) {
      await this.page.locator('button[class*="next-month"]').click();
      await this.page.waitForTimeout(500);
      monthValue = await this.page
        .locator("nb-calendar-view-mode")
        .textContent();
      monthValue = new Date(monthValue + " 1, 2000").toLocaleString("en-US", {
        month: "short",
      });
    }

    // Selecting a specific date and verifying the input
    const dayValue = await this.page.locator(
      ".day-cell.ng-star-inserted:not(.bounding-month)"
    );
    await dayValue.getByText(expectedDate, { exact: true }).click();
    return assertionDate;
  }
}
