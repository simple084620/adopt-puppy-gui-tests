import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { ViewPuppyDetailsPage } from "./puppy-details.page";

export class AdoptPuppyPage extends BasePage {
  protected URL = "/";

  constructor(protected page: Page) {
    super(page);
  }

  private puppyListHeader = this.page.getByRole("heading", {
    name: "Puppy List",
  });
  private puppyNamesList = this.page.locator(".name");

  async goto(): Promise<void> {
    await this.page.goto(this.URL);
  }

  async goToSubPage(pageNumber: number): Promise<AdoptPuppyPage> {
    await this.page.getByLabel(`Page ${pageNumber}`).click();
    return new AdoptPuppyPage(this.page);
  }

  async getPuppyListHeader(): Promise<Locator> {
    return this.puppyListHeader;
  }

  async clickOnViewDetailsButton(
    puppyName: string
  ): Promise<ViewPuppyDetailsPage> {
    const buttonsList = await this.page.locator(".rounded_button").all();
    const id = await this.getPuppyId(puppyName);

    if (id > buttonsList.length - 1 || id < 0) {
      throw new Error(
        `Id ${id} is not available. Available ids: [0-${
          buttonsList.length - 1
        }]`
      );
    }
    await buttonsList[id].click();
    return new ViewPuppyDetailsPage(this.page);
  }

  async isPuppyNameOnTheSubPage(puppyName: string): Promise<boolean> {
    const names = await this.puppyNamesList.allInnerTexts();

    for (const name of names) {
      if (name === puppyName) {
        return true;
      }
    }
    return false;
  }

  private async getPuppyId(name: string): Promise<number> {
    const names = await this.puppyNamesList.allInnerTexts();

    for (let id = 0; id < names.length; id++) {
      if (names[id] === name) {
        return id;
      }
    }
    throw new Error(`Puppy ${name} not available.`);
  }
}
