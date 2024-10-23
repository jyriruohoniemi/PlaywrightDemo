import { test, expect } from "@playwright/test";

// You can also add a timeout on a suite elevel using testInfo
test.beforeEach(async ({ page }, testInfo) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();
  testInfo.setTimeout(testInfo.timeout + 10000); // Add 10 seconds to the timeout
});

// Playwright doesn't provide automatic waiting for all actions (https://playwright.dev/docs/actionability)
// For those situations we can use waitFor or {timeout: int} property

test("Auto waiting", async ({ page }) => {
  const successButton = page.locator(".bg-success");
  //await successButton.waitFor({ state: "attached" }); // Use waitFor to enable waiting for elements that don't support autowaiting out of the box
  //const text = await successButton.allTextContents();
  //expect(text).toContain("Data loaded with AJAX get request.");

  await expect(successButton).toHaveText("Data loaded with AJAX get request.", {
    timeout: 20000,
  });
});

test("Alternative waits", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  // wait for element
  //await page.waitForSelector(".bg-success");

  // wait for API response
  //await page.waitForResponse("http://uitestingplayground.com/ajaxdata");

  // wait for all network calls to be completed NOT RECOMMENDED
  await page.waitForLoadState("networkidle");

  // wait for x amount of time
  await page.waitForTimeout(5000);
});

test("Timeouts", async ({ page }) => {
  test.slow(); // Slow() will make the tests run 3x slower to prevent flakiness
  const successButton = page.locator(".bg-success");
  await successButton.click();
});
