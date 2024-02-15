import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { HomePage } from "./home.page";
import { AdoptPuppyPage } from "./adopt.page";
import { OrderPage } from "./order.page";

export class LitterPage extends BasePage {
  constructor(protected page: Page) {
    super(page);
  }

  private totalAmount = this.page.locator(".total_cell");
  private puppyFee = this.page.locator(".item_price");
  private completeAdoptionButton = this.page.getByRole("button", {
    name: "Complete the Adoption",
  });
  private adoptAnotherButton = this.page.getByRole("button", {
    name: "Adopt Another Puppy",
  });
  private changeYourMindButton = this.page.getByRole("button", {
    name: "Change your mind",
  });
  private productTravelCarrier = this.page.getByRole("cell", {
    name: "Travel Carrier (£39.99)",
  });
  private productCollarCheckboxList = this.page.locator("#collar");
  private productTravelCarrierCheckboxList = this.page.locator("#carrier");
  private productVetVisitCheckboxList = this.page.locator("#vet");

  async getTotalAmount(): Promise<number> {
    const totalText = await this.totalAmount.innerText();
    return this.getPriceFromText(totalText);
  }

  async clickOnCompleteAdoptionButton(): Promise<OrderPage> {
    await this.completeAdoptionButton.click();
    return new OrderPage(this.page);
  }

  async clickOnAdoptAnotherPuppyButton(): Promise<AdoptPuppyPage> {
    await this.adoptAnotherButton.click();
    return new AdoptPuppyPage(this.page);
  }

  async clickOnChangeYourMindButton(): Promise<HomePage> {
    await this.changeYourMindButton.click();
    return new HomePage(this.page);
  }

  async selectAdditionalTravelCarrier(id: number): Promise<void> {
    await this.selectAdditionalProduct(
      this.productTravelCarrierCheckboxList,
      id
    );
  }

  async selectAdditionalCollarAndLeash(id: number): Promise<void> {
    await this.selectAdditionalProduct(this.productCollarCheckboxList, id);
  }

  async selectAdditionalVetVisit(id: number): Promise<void> {
    await this.selectAdditionalProduct(this.productVetVisitCheckboxList, id);
  }

  async getAdditionalTravelCarrierPrice(): Promise<number> {
    const travelCarrierText = await this.productTravelCarrier.innerText();
    return this.getPriceFromText(travelCarrierText);
  }

  async getPuppyFeeAmount(): Promise<number> {
    const feeText = await this.puppyFee.innerText();
    return this.getPriceFromText(feeText);
  }

  private async selectAdditionalProduct(
    product: Locator,
    id: number
  ): Promise<void> {
    const checkboxes = await product.all();
    if (id > checkboxes.length - 1 || id < 0) {
      throw new Error(
        `Id ${id} is not available. Available ids: [0-${checkboxes.length - 1}]`
      );
    }
    await checkboxes[id].check();
  }
}
