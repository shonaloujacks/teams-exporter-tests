import { test, expect } from "@playwright/test";
import HomePage from "../pages/home.page";
import { url } from "inspector";

test.describe("Homepage", () => {
  test("Test group and 1:1 filter buttons", async ({ page }) => {
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

  test("Test user search function", async ({ page }) => {
    const homePage = new HomePage(page);
    // Update session storage
    homePage.updateSessionStorage();

    // Go to to homepage
    await homePage.navigate();

    // Fill search box
    await homePage.searchBox.fill("users: Isaiah");

    // Click enter
    await page.keyboard.press("Enter");

    // Count chats
    const chatLabelCount = await homePage.chatLabel.count();

    // Check count is equal to 1
    expect(chatLabelCount).toEqual(1);
  });

  test("Test members dropdown appears on group chats", async ({ page }) => {
    const homePage = new HomePage(page);
    // Update session storage
    homePage.updateSessionStorage();

    // Go to to homepage
    await homePage.navigate();

    // Check that for items with text label Group, the expand Icon is present and that for those with label 1:1, it is not
    await homePage.checkExpandIcon();
  });

  test("Test log out flow", async ({ page }) => {
    const homePage = new HomePage(page);
    // Update session storage
    homePage.updateSessionStorage();

    // Go to to homepage
    await homePage.navigate();

    // Click to open settings
    await homePage.settingsButton.click();

    // Click log out
    await homePage.logoutButton.click();

    // Check for sign-out text
    await expect(homePage.pageBody).toHaveText(
      /You signed out of your account/i
    );
  });
});
