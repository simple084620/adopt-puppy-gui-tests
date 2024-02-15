import { Locator, Page } from "@playwright/test";

export class HomePage {
  protected URL = "";

  constructor(protected page: Page) {}

  private orderConfirmationMessage = this.page.getByText(
    "Thank you for adopting a"
  );
  private cartMessage = this.page.getByText("Your cart is currently empty");

  async getCartMessage(): Promise<Locator> {
    return this.cartMessage;
  }

  async getOrderConfirmationMessage(): Promise<Locator> {
    return this.orderConfirmationMessage;
  }
}
