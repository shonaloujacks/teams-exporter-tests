import { test, expect } from "@playwright/test";
import HomePage from "../pages/home.page";

test("Test filter buttons", async ({ page }) => {
  const homePage = new HomePage(page);
  // Update session storage
  homePage.updateSessionStorage();
  // Go to to homepage
  await homePage.navigate();

  //Click 1:1 chat button
  await page.getByLabel("one on one chats").click();

  // // Check only 1:1 chats are visible
  // const chatLabel1 = page.getByRole("paragraph", { name: "1:1" });

  // expect(chatLabel1).toBeVisible();

  // // Click group chat button
  // await page.getByLabel("group chats").click();

  // //Check only 1:1 chats are visible
  // const chatLabel2 = page.getByRole("paragraph", { name: "Group" });

  // expect(chatLabel2).toBeVisible();
});
