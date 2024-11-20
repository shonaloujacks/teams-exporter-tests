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

  test("Test user search function", async ({ page }) => {
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

  test("Test members dropdown appears on group chats", async ({ page }) => {
    const homePage = new HomePage(page);
    // Update session storage
    homePage.updateSessionStorage();

    // Go to to homepage
    await homePage.navigate();

    const chatList = page.getByRole("button").filter({
      has: page.locator(".MuiAccordionSummary-content"),
    });

    const chatListCount = await chatList.count();

    // Loop through list of chats and check that for items with text label Group, the expand Icon is present. For items with text label 1:1, make sure it is not present
    for (let i = 0; i < chatListCount; i++) {
      const element = chatList.nth(i);
      const chatListText = await element.textContent();
      const expandIcon = element.getByTestId("ExpandMoreIcon"); // scope expandIcon to current element
      console.log("this is chat list text", chatListText);
      if (chatListText && chatListText.toLowerCase().includes("group")) {
        await expect(expandIcon).toBeVisible();
      } else if (chatListText && chatListText.toLowerCase().includes("1:1")) {
        await expect(expandIcon).not.toBeVisible();
      }
    }
  });
});
