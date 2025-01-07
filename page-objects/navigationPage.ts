import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {
  readonly formLayoutsMenu: Locator;
  readonly datePickerMenu: Locator;
  readonly toastrMenu: Locator;
  readonly tooltipMenu: Locator;
  readonly smartTableMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.formLayoutsMenu = page.getByText("Form Layouts");
    this.datePickerMenu = page.getByText("Datepicker");
    this.toastrMenu = page.getByText("Toastr");
    this.tooltipMenu = page.getByText("Tooltip");
    this.smartTableMenu = page.getByText("Smart Table");
  }

  async formLayoutPage() {
    await this.selectGroupMenuItem("Forms");
    await this.formLayoutsMenu.click();
    await this.waitForNumberOfSeconds(2);
  }
  async datePickerPage() {
    await this.selectGroupMenuItem("Forms");
    await this.datePickerMenu.click();
  }

  async toastrPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.toastrMenu.click();
  }

  async tooltipPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.tooltipMenu.click();
  }

  async smartTablePage() {
    await this.selectGroupMenuItem("Tables & Data");
    await this.smartTableMenu.click();
  }

  private async selectGroupMenuItem(groupItemTitle: string) {
    const groupMenuItem = this.page.getByTitle(groupItemTitle);
    const expandedState = await groupMenuItem.getAttribute("aria-expanded");
    if (expandedState === "false") {
      await groupMenuItem.click();
    }
  }
}
