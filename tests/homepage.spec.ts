import { test, expect } from "@playwright/test";
import HomePage from "../pages/home.page";

test.describe("Homepage", () => {
  test("Test filter buttons", async ({ page }) => {
    const homePage = new HomePage(page);

    // Update session storage
    homePage.updateSessionStorage();

    // Go to to homepage
    await homePage.navigate();

    //Click 1:1 chat button
    await page.getByLabel("one on one chats").click();

    // Loop through and check only 1:1 chats are visible
    await homePage.checkOneOnOneLabel();

    // Click group chat button
    await page.getByLabel("group chats").click();

    // Loop through and check only Group chats are visible
    await homePage.checkGroupLabel();
  });

  test("Test that export pdf button opens in new tab", async ({ page }) => {});
});
