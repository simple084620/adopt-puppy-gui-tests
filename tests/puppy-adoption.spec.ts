import { test, expect } from "@playwright/test";
import { AdoptPuppyPage } from "../src/pages/adopt.page";
import { ViewPuppyDetailsPage } from "../src/pages/puppy-details.page";
import { LitterPage } from "../src/pages/litter.page";
import { HomePage } from "../src/pages/home.page";
import { OrderPage, PaymentMethod } from "../src/pages/order.page";
import { UserFactory } from "../src/factories/user.factory";

test.describe("Puppy adoption tests", () => {
  let adoptPage: AdoptPuppyPage;

  test.beforeEach(async ({ page }) => {
    adoptPage = new AdoptPuppyPage(page);
    await page.goto("/");
  });

  test("User can display Hanna details and go back to puppies list", async () => {
    // ACT
    const viewDetailsPage: ViewPuppyDetailsPage =
      await adoptPage.clickOnViewDetailsButton("Hanna");
    adoptPage = await viewDetailsPage.returnToPuppiesList();

    // ASSERT
    const puppyListHeader = await adoptPage.getPuppyListHeader();
    expect(puppyListHeader).toBeVisible;
  });

  test("Puppy Maggie May is visible on the first page", async () => {
    // ACT
    adoptPage = await adoptPage.goToSubPage(1);
    const isMaggieMayVisible = await adoptPage.isPuppyNameOnTheSubPage(
      "Maggie Mae"
    );

    // ASSERT
    expect(isMaggieMayVisible).toBeTruthy();
  });

  test("Puppy Tipsy is visible on second page", async () => {
    // ACT
    adoptPage = await adoptPage.goToSubPage(2);
    const isMaggieMayVisible = await adoptPage.isPuppyNameOnTheSubPage("Tipsy");

    // ASSERT
    expect(isMaggieMayVisible).toBeTruthy();
  });

  test("Twinkie adoption fee is $22.50", async () => {
    // ARRANGE
    const expectedFee = 22.5;

    // ACT
    adoptPage = await adoptPage.goToSubPage(3);
    const viewDetailsPage: ViewPuppyDetailsPage =
      await adoptPage.clickOnViewDetailsButton("Twinkie");
    const actualAdoptionFee = await viewDetailsPage.getAdoptionFee();

    // ASSERT
    expect(actualAdoptionFee).toEqual(expectedFee);
  });

  test("User can adopt Spud then change their mind", async () => {
    // ARRANGE
    const expectedMessage = "Your cart is currently empty";

    // ACT
    adoptPage = await adoptPage.goToSubPage(2);
    const viewDetailsPage: ViewPuppyDetailsPage =
      await adoptPage.clickOnViewDetailsButton("Spud");
    const litterPage: LitterPage = await viewDetailsPage.clickOnAdoptMeButton();
    const homePage: HomePage = await litterPage.clickOnChangeYourMindButton();
    const actualCartMessage = await homePage.getCartMessage();

    // ASSERT
    await expect(actualCartMessage).toHaveText(expectedMessage);
  });

  test("User can adopt Hanna and Maggie Mae in single transaction", async () => {
    // ARRANGE
    const expectedTotal = 37.94;

    // ACT
    adoptPage = await adoptPage.goToSubPage(1);
    let viewDetailsPage: ViewPuppyDetailsPage =
      await adoptPage.clickOnViewDetailsButton("Hanna");
    let litterPage: LitterPage = await viewDetailsPage.clickOnAdoptMeButton();
    adoptPage = await litterPage.clickOnAdoptAnotherPuppyButton();
    viewDetailsPage = await adoptPage.clickOnViewDetailsButton("Maggie Mae");
    litterPage = await viewDetailsPage.clickOnAdoptMeButton();
    const actualTotalAmount = await litterPage.getTotalAmount();

    // ASSERT
    expect(actualTotalAmount).toEqual(expectedTotal);
  });

  test("User can adopt Hanna and Maggie Mae and complete transaction with credit card payment", async () => {
    // ARRANGE
    const expectedConfirmationMessage = "Thank you for adopting a puppy!";
    const userFactory = new UserFactory();
    const userData = userFactory.getRandomUserData();

    // ACT
    adoptPage = await adoptPage.goToSubPage(1);
    let viewDetailsPage: ViewPuppyDetailsPage =
      await adoptPage.clickOnViewDetailsButton("Hanna");
    let litterPage: LitterPage = await viewDetailsPage.clickOnAdoptMeButton();
    adoptPage = await litterPage.clickOnAdoptAnotherPuppyButton();
    viewDetailsPage = await adoptPage.clickOnViewDetailsButton("Maggie Mae");
    litterPage = await viewDetailsPage.clickOnAdoptMeButton();
    const orderPage: OrderPage =
      await litterPage.clickOnCompleteAdoptionButton();
    const homePage: HomePage = await orderPage.placeOrder(
      userData,
      PaymentMethod.CREDIT_CARD
    );
    const actualOrderConfirmationMessage =
      await homePage.getOrderConfirmationMessage();

    // ASSERT
    await expect(actualOrderConfirmationMessage).toHaveText(
      expectedConfirmationMessage
    );
  });

  test("User can adopt Brook and buy a travel carrier as extra purchase", async () => {
    // ARRANGE
    const brookLitterId = 0;

    // ACT
    adoptPage = await adoptPage.goToSubPage(1);
    const viewDetailsPage: ViewPuppyDetailsPage =
      await adoptPage.clickOnViewDetailsButton("Brook");
    const litterPage: LitterPage = await viewDetailsPage.clickOnAdoptMeButton();
    await litterPage.selectAdditionalTravelCarrier(brookLitterId);

    const travelCarrierPrice =
      await litterPage.getAdditionalTravelCarrierPrice();
    const brookFeeAmount = await litterPage.getPuppyFeeAmount();
    const actualTotalAmount = await litterPage.getTotalAmount();

    // ASSERT
    const expectedAmount = travelCarrierPrice + brookFeeAmount;
    expect(actualTotalAmount).toEqual(expectedAmount);
  });

  test("User can adopt Brook and Maggie May and purchase extra products with credit card", async () => {
    // ARRANGE
    const expectedConfirmationMessage = "Thank you for adopting a puppy!";
    const userFactory = new UserFactory();
    const userData = userFactory.getRandomUserData();
    const brookLitterId = 0;
    const maggieLitterId = 1;

    // ACT
    adoptPage = await adoptPage.goToSubPage(1);
    let viewDetailsPage: ViewPuppyDetailsPage =
      await adoptPage.clickOnViewDetailsButton("Brook");
    let litterPage: LitterPage = await viewDetailsPage.clickOnAdoptMeButton();
    adoptPage = await litterPage.clickOnAdoptAnotherPuppyButton();
    viewDetailsPage = await adoptPage.clickOnViewDetailsButton("Maggie Mae");
    litterPage = await viewDetailsPage.clickOnAdoptMeButton();

    await litterPage.selectAdditionalVetVisit(brookLitterId);
    await litterPage.selectAdditionalCollarAndLeash(brookLitterId);
    await litterPage.selectAdditionalTravelCarrier(maggieLitterId);

    const orderPage: OrderPage =
      await litterPage.clickOnCompleteAdoptionButton();
    const homePage: HomePage = await orderPage.placeOrder(
      userData,
      PaymentMethod.CREDIT_CARD
    );
    const actualOrderConfirmationMessage =
      await homePage.getOrderConfirmationMessage();

    // ASSERT
    await expect(actualOrderConfirmationMessage).toHaveText(
      expectedConfirmationMessage
    );
  });
});
