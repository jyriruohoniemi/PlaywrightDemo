import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test.skip("Locator syntax rules", async ({ page }) => {
  //by tag name
  await page.locator("input").first().click();

  //by ID
  await page.locator("#inputEmail1").click();

  //by class name
  await page.locator(".shape-rectangle").first().click();

  //by attribute
  await page.locator("[placeholder=Email]").first().click();

  //by class full value
  await page
    .locator(
      '[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]'
    )
    .first()
    .click();

  //combine multiple selectors
  await page.locator("input[placeholder=Email]").first().click();

  //by XPath (NOT RECOMMENDED BY PLAYWRIGHT)
  await page.locator('//*[@id="inputEmail1"]').click();

  //by partial text
  await page.locator(':text("Using")').first().click();

  //by exact text
  await page.locator(':text-is("Using the Grid")').click();
});

test("User Facing Locators", async ({ page }) => {
  //
  await page.getByRole("textbox", { name: "Email" }).first().click();

  await page.getByRole("button", { name: "Sign in" }).first().click();

  await page.getByLabel("Email").first().click();

  await page.getByPlaceholder("Jane Doe").click();

  await page.getByTestId("SignIn").click();

  await page.getByRole("link", { name: "IoT Dashboard" }).click();
});

test("Locating child  elements", async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  // or you can chain them
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 1")')
    .click();

  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign in" })
    .first()
    .click();

  await page.locator("nb-card").nth(3).getByRole("button").click(); // Not recommended
});

test("Locating parent elements", async ({ page }) => {
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card", { has: page.locator("#inputEmail1") })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator(".status-danger") })
    .getByRole("textbox", { name: "Password" })
    .click();

  await page
    .locator("nb-card") // Finds all nb-cards
    .filter({ has: page.locator("nb-checkbox") }) // Filters out nb-cards without nb-checkboxes
    .filter({ hasText: "Sign in" }) // Filters out nb-cards without "Sign in" text
    .getByRole("textbox", { name: "Email" }) // Finds the first textbox inside the filtered nb-cards
    .click(); // Clicks on the textbox

  await page
    .locator(":text-is('Using the Grid')")
    .locator("..") // Move up one level in the DOM
    .getByRole("textbox", { name: "Email" })
    .click();
});

test("Reusing locators", async ({ page }) => {
  // Previously we could see that the nb-card basic form is being reused multiple times in the previous tests
  // so instead of writing the same code multiple times, we can reuse it with a constant

  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const emailField = basicForm.getByRole("textbox", { name: "Email" }); // you can also add abstraction to your variables like this

  await emailField.fill("test@test.com");

  await basicForm.getByRole("textbox", { name: "Password" }).fill("Welcome123");

  await basicForm.locator("nb-checkbox").click();

  await basicForm.getByRole("button").click();

  await expect(emailField).toHaveValue("test@test.com");
});

test("Extracting values", async ({ page }) => {
  // Single value
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const buttonText = await basicForm.locator("button").textContent();
  expect(buttonText).toEqual("Submit");

  // Multiple values
  const allRadioButtonLabels = await page.locator("nb-radio").allTextContents();
  expect(allRadioButtonLabels).toContain("Option 1");

  // Input field values
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("test@test.com");
  const emailValue = await emailField.inputValue();
  expect(emailValue).toEqual("test@test.com");

  const placeHolder = await emailField.getAttribute("placeholder");
  expect(placeHolder).toEqual("Email");
});

test("Assertions", async ({ page }) => {
  const basicFormButton = page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .locator("button");

  //General assertion
  const buttonText = await basicFormButton.textContent();
  expect(buttonText).toEqual("Submit");

  //Locator assertion
  await expect(basicFormButton).toHaveText("Submit");

  //Soft assertion
  //await expect.soft(basicFormButton).toHaveText("Submit5"); // With a soft assertion even if this fails Playwright will execute the next steps
  //await basicFormButton.click();
});
