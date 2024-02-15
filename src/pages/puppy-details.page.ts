import { Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { AdoptPuppyPage } from "./adopt.page";
import { LitterPage } from "./litter.page";

export class ViewPuppyDetailsPage extends BasePage {
  constructor(protected page: Page) {
    super(page);
  }

  private photo = this.page.locator("#content").getByRole("img");
  private feeLine = this.page.getByText("The fees to adopt me are £");
  private adoptMeButton = this.page.getByRole("button", { name: "Adopt Me!" });
  private returnToListButton = this.page.getByRole("link", {
    name: "Return to List",
  });

  async returnToPuppiesList(): Promise<AdoptPuppyPage> {
    await this.returnToListButton.click();
    return new AdoptPuppyPage(this.page);
  }

  async getAdoptionFee(): Promise<number> {
    const feeText = await this.feeLine.innerText();
    const fee = this.getPriceFromText(feeText);
    return fee;
  }

  async clickOnAdoptMeButton(): Promise<LitterPage> {
    await this.adoptMeButton.click();
    return new LitterPage(this.page);
  }
}
