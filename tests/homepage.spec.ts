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

  test.only("Test user search function", async ({ page }) => {
    const homePage = new HomePage(page);
    // Update session storage
    homePage.updateSessionStorage();

    // Go to to homepage
    await homePage.navigate();

    // Select search box
    const searchBox = page.getByLabel(
      "Search Chats or 'users: Alice, Bob' to filter by members"
    );

    // Fill search box
    await searchBox.fill("users: Isaiah");

    // Click enter
    await page.keyboard.press("Enter");

    // Count chats
    const chatLabelCount = await homePage.chatLabel.count();

    // Check count is equal to 1
    expect(chatLabelCount).toEqual(1);
  });
});
