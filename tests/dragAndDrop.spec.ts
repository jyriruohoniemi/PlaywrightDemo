import { expect, test } from "@playwright/test";

test.skip("Drag and Drop", async ({ page }) => {
  await page.goto("https://www.globalsqa.com/demo-site/draganddrop/");

  await page.getByRole("button", { name: "Consent" }).click();

  const frame = page.frameLocator('[rel-title="Photo Manager"] iframe');

  await frame
    .locator("li", { hasText: "High Tatras 2" })
    .dragTo(frame.locator("#trash"));

  await expect(frame.locator("#trash")).toContainText("High Tatras 2");

  // More precise control
  await frame.locator("li", { hasText: "High Tatras 4" }).hover();
  await page.mouse.down();
  await frame.locator("#trash").hover();
  await page.mouse.up();

  await expect(frame.locator("#trash")).toContainText("High Tatras 4");
});
