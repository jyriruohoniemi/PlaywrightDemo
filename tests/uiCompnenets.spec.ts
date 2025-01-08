import { expect, test } from "@playwright/test";

// Page navigation
// Uses page.goto() to navigate to the initial URL before each test
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe("UI elements", () => {
  // Click interactions and page navigation
  // Uses page.getByText() to locate and click on elements for navigation
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  // Test case: Interacting with input fields
  test("input fields", async ({ page }) => {
    // Locating elements
    // Uses page.locator() with CSS selector to find the email input
    const usingTheGridEmailInput = page.locator("#inputEmail1");

    // Input interactions
    // Demonstrates fill(), clear(), and pressSequentially() for different input methods
    await usingTheGridEmailInput.fill("test@test.com");
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially("test@test.com", {
      delay: 400, // Simulates slow typing
    });

    // Assertions
    // Shows two methods to assert input value: direct value check and expect() with toHaveValue()
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("test@test.com");
    await expect(usingTheGridEmailInput).toHaveValue("test@test.com");
  });

  // Test case: Interacting with radio buttons
  test("Radio buttons", async ({ page, browserName }) => {
    test.skip(browserName === "firefox", "Flaky assertions on firefox");
    // Complex element location
    // Uses page.locator() with filter() to find a specific form within the page
    const usingTheGridForm = page.locator("nb-card").filter({
      hasText: "Using the Grid",
    });

    // Interacting with radio buttons
    // Demonstrates two methods to check radio buttons: by label and by role
    await usingTheGridForm.getByLabel("Option 1").click({ force: true });
    await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .click({ force: true });

    // Checking element state
    // Uses isChecked() to get the current state of the radio button
    const radioStatus = await usingTheGridForm
      .getByRole("radio", {
        name: "Option 1",
      })
      .isChecked();
    expect(await radioStatus).toBeTruthy();

    // Element state assertion
    // Uses expect().toBeChecked() to assert the radio button state
    await expect(usingTheGridForm.getByLabel("Option 1")).toBeChecked();

    // Changing and verifying radio button states
    await usingTheGridForm
      .getByRole("radio", { name: "Option 2" })
      .check({ force: true });

    // Verifies that checking one radio button unchecks the other
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 1" })
        .isChecked()
    ).toBeFalsy();
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 2" })
        .isChecked()
    ).toBeTruthy();
  });
});

// Test case: Interacting with checkboxes
test("Checkboxes", async ({ page }) => {
  // Navigation using roles
  // Uses getByRole() to find and click on navigation elements
  await page.getByRole("link", { name: "Modal & Overlays" }).click();
  await page.getByRole("link", { name: "Toastr" }).click();

  // Checkbox interactions
  // Demonstrates uncheck() and check() methods on checkboxes
  await page
    .getByRole("checkbox", { name: "Hide on click" })
    .uncheck({ force: true });
  await page
    .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
    .check({ force: true });

  // Working with multiple elements
  // Uses getByRole().all() to get all checkboxes and iterate over them
  const allCheckboxes = await page.getByRole("checkbox").all();
  for (const checkboxElement of allCheckboxes) {
    await checkboxElement.check({ force: true });
    expect(await checkboxElement.isChecked()).toBeTruthy();
  }
});

// Test case: Interacting with dropdowns and verifying theme changes
test("Lists and dropdowns", async ({ page }) => {
  // Complex element location
  // Uses page.locator() to find a specific dropdown element
  const dropdownSelector = page.locator("ngx-header nb-select");
  await dropdownSelector.click();

  // Verifying list contents
  // Uses expect().toHaveText() to check the text content of multiple elements
  const optionList = page.locator("nb-option-list nb-option");
  await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);

  // Interacting with dropdown options
  // Uses filter() to select a specific option and click() to choose it
  await optionList.filter({ hasText: "Cosmic" }).click();

  // CSS property assertion
  // Uses expect().toHaveCSS() to verify the background color after theme change
  const header = page.locator("nb-layout-header");
  await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

  // Iterating through options
  // Demonstrates how to test multiple dropdown options in a loop
  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };

  for (const color in colors) {
    await dropdownSelector.click();
    await optionList.filter({ hasText: color }).click();
    await expect(header).toHaveCSS("background-color", colors[color]);
  }
});

// Test case: Verifying tooltips
test("Tooltips", async ({ page, browserName }) => {
  test.skip(browserName === "firefox", "Tooltip card not visible on firefox");
  // Navigation using roles
  await page.getByRole("link", { name: "Modal & Overlays" }).click();
  await page.getByRole("link", { name: "Tooltip" }).click();

  // Complex element location and interaction
  // Uses locator() with multiple selectors to find a specific button and hover over it
  const toolTipCard = page.locator("nb-card", {
    hasText: "Tooltip Placements",
  });
  // Wait for button to be visible before hovering
  await toolTipCard
    .getByRole("button", { name: "Top" })
    .waitFor({ state: "visible" });
  await toolTipCard.getByRole("button", { name: "Top" }).hover();

  // Verifying dynamic content
  // Uses locator() to find the tooltip and textContent() to get its text
  const tooltip = await page.locator("nb-tooltip").textContent();
  expect(tooltip).toEqual("This is a tooltip");
});

// Test case: Handling dialog boxes
test("dialog boxes", async ({ page }) => {
  // Navigation using roles
  await page.getByRole("link", { name: "Tables & Data" }).click();
  await page.getByRole("link", { name: "Smart Table" }).click();

  // Handling dialogs
  // Uses page.on('dialog') to set up a handler for dialog events
  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?");
    dialog.accept();
  });

  // Complex element location and interaction
  // Uses multiple chained locators to find and click a specific delete button
  await page
    .getByRole("table")
    .locator("tr", { hasText: "mdo@gmail.com" })
    .locator(".nb-trash")
    .click();

  // Asserting element visibility
  // Uses expect().not.toBeVisible() to verify an element is no longer present
  await expect(
    page.locator('table tr:has-text("mdo@gmail.com")')
  ).not.toBeVisible();
});

// Test case: Interacting with web tables
test("Web Tables", async ({ page }) => {
  // Navigation using roles
  await page.getByRole("link", { name: "Tables & Data" }).click();
  await page.getByRole("link", { name: "Smart Table" }).click();

  // Interacting with table rows
  // Uses getByRole() to locate a specific row and interact with its elements
  const row = page.getByRole("row", { name: "twitter@outlook.com" });
  await row.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("Age").clear();
  await page.locator("input-editor").getByPlaceholder("Age").fill("35");
  await page.locator(".nb-checkmark").click();

  // Complex table interaction
  // Demonstrates how to edit a row identified by its ID
  await page.getByRole("link", { name: "2" }).click();
  const rowId = page
    .getByRole("row", { name: "11" })
    .filter({ has: page.locator("td").nth(1).getByText("11") });
  await rowId.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("E-mail").clear();
  await page
    .locator("input-editor")
    .getByPlaceholder("E-mail")
    .fill("pentti.stentti@email.com");
  await page.locator(".nb-checkmark").click();
  await expect(rowId.locator("td").nth(5)).toHaveText(
    "pentti.stentti@email.com"
  );

  // Table filtering and verification
  // Demonstrates how to filter table data and verify results
  const ages = ["20", "30", "40", "200"];
  for (let age of ages) {
    await page.locator("input-filter").getByPlaceholder("Age").clear();
    await page.locator("input-filter").getByPlaceholder("Age").fill(age);
    const ageRow = page.locator("tbody tr");
    await page.waitForTimeout(500);
    for (let row of await ageRow.all()) {
      const cellValue = await row.locator("td").last().textContent();

      if (age == "200") {
        expect(await page.locator("td").textContent()).toContain(
          "No data found"
        );
      } else {
        expect(cellValue).toEqual(age);
      }
    }
  }
});

// Test case: Interacting with date pickers
test("Date Pickers", async ({ page }) => {
  // Navigation using roles
  await page.getByRole("link", { name: "Forms" }).click();
  await page.getByRole("link", { name: "Datepicker" }).click();

  // Interacting with date picker input
  const calendarInput = await page.getByPlaceholder("Form Picker");
  await calendarInput.click();

  // Date manipulation
  // Calculates a date 14 days in the future for testing
  let date = new Date();
  date.setDate(date.getDate() + 14);
  const expectedDate = date.getDate().toString();
  const expectedMonthShort = date.toLocaleString("en-US", { month: "short" });
  const expectedYear = date.getFullYear().toString();
  const assertionDate = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

  // Complex date picker interaction
  // Navigates to the correct month in the date picker
  let monthValue = await page.locator("nb-calendar-view-mode").textContent();
  monthValue = new Date(monthValue + " 1, 2000").toLocaleString("en-US", {
    month: "short",
  });

  while (monthValue !== expectedMonthShort) {
    await page.locator('button[class*="next-month"]').click();
    await page.waitForTimeout(500);
    monthValue = await page.locator("nb-calendar-view-mode").textContent();
    monthValue = new Date(monthValue + " 1, 2000").toLocaleString("en-US", {
      month: "short",
    });
  }

  // Selecting a specific date and verifying the input
  const dayValue = await page.locator('[class="day-cell ng-star-inserted"]');
  await dayValue.getByText(expectedDate, { exact: true }).click();
  expect(await calendarInput.inputValue()).toEqual(assertionDate);
});
