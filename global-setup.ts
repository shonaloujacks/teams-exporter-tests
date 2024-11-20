import { Browser, chromium, expect, Page } from "@playwright/test";
import fs from "fs";
import { Context } from "vm";

async function globalSetup() {
  const browser: Browser = await chromium.launch({ headless: true });
  const context: Context = await browser.newContext();
  const page: Page = await context.newPage();

  await page.goto("https://app.teamsexporter.com/");

  // Click log-in button and await pop up
  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    await page.getByRole("button", { name: "CONTINUE WITH MICROSOFT" }).click(),
  ]);

  // Enter sign-in credentials
  await popup
    .getByPlaceholder("Email or phone")
    .fill("adelev@7kfcjj.onmicrosoft.com");
  await popup.getByRole("button", { name: "Next" }).click();
  await popup.getByPlaceholder("Password").fill("Leinad0192837465!?!");
  await popup.getByRole("button", { name: "Sign in" }).click();
  await popup.getByRole("button", { name: "Yes" }).click();

  // Verify signed-in state
  const chatButton = page.getByRole("button", { name: "MY CHATS" });
  await expect(chatButton).toBeVisible();

  // Fetch session storage (containing tokens) from page context
  const sessionStorageJSON = await page.evaluate(() =>
    JSON.stringify(sessionStorage)
  );

  // Write the session storage to a new file
  fs.writeFileSync("session-storage.json", sessionStorageJSON);

  await browser.close();
}

export default globalSetup;
