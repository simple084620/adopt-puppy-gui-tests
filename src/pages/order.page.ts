import { Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { HomePage } from "./home.page";
import { UserModel } from "../models/user.model";

export class OrderPage extends BasePage {
  protected URL: "/orders/new?";

  constructor(protected page: Page) {
    super(page);
  }

  private label = this.page.getByText("Please Enter Your Details");
  private nameInput = this.page.getByLabel("Name");
  private addressInput = this.page.getByLabel("Address");
  private emailInput = this.page.getByLabel("Email");
  private paymentOptionDropdown = this.page.getByLabel("Pay type");
  private placeOrderButton = this.page.getByText("Place Order");

  async placeOrder(
    user: UserModel,
    paymentMethod: PaymentMethod
  ): Promise<HomePage> {
    await this.nameInput.fill(user.userName);
    await this.addressInput.fill(user.userAddress);
    await this.emailInput.fill(user.userEmail);
    await this.page.getByLabel("Pay type").selectOption(paymentMethod);
    await this.placeOrderButton.click();
    return new HomePage(this.page);
  }
}

export enum PaymentMethod {
  CHECK = "Check",
  PURCHASE = "Purchase order",
  CREDIT_CARD = "Credit card",
}
