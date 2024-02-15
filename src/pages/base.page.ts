import { Page } from "@playwright/test";

export class BasePage {
  protected URL = "";

  constructor(protected page: Page) {}

  async goto(parameters = ""): Promise<void> {
    await this.page.goto(this.URL);
  }

  async getTitle(): Promise<string> {
    await this.page.waitForLoadState();
    return await this.page.title();
  }

  async waitForPageToLoadUrl(): Promise<void> {
    await this.page.waitForURL(this.URL);
  }

  async getPriceFromText(str: string): Promise<number> {
    return parseFloat(str.replace(/[^\d\.]*/g, ""));
  }
}
