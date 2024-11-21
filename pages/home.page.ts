import { Page, Locator, expect } from "@playwright/test";
import fs from "fs";

class HomePage {
  readonly page: Page;
  chatLabel: Locator;
  searchBox: Locator;
  chatList: Locator;
  settingsButton: Locator;
  logoutButton: Locator;
  pageBody: Locator;

  constructor(page: Page) {
    this.page = page;
    this.chatLabel = page.getByRole("button").filter({
      has: page.locator(".MuiTypography-root.MuiTypography-body2.css-15b8szy"),
    });
    this.searchBox = page.getByLabel(
      "Search Chats or 'users: Alice, Bob' to filter by members"
    );
    this.chatList = page.getByRole("button").filter({
      has: page.locator(".MuiAccordionSummary-content"),
    });
    this.settingsButton = page.getByRole("button", { name: /open settings/i });
    this.logoutButton = page.getByText(/logout/i);
    this.pageBody = page.locator("body");
  }

  async navigate() {
    await this.page.goto("https://app.teamsexporter.com/");
  }

  async checkOneOnOneLabel() {
    let chatLabelCount = await this.chatLabel.count();
    // Loop through and check only 1:1 chats are visible
    for (let i = 0; i < chatLabelCount; i++) {
      const element = this.chatLabel.nth(i);
      const labelText = await element.textContent();
      console.log("this is label text:", labelText);
      expect(labelText).toContain("1:1");
    }
  }

  async checkGroupLabel() {
    // Recount number of chats
    let chatLabelCount = await this.chatLabel.count();
    // Loop through and check only Group chats are visible
    for (let i = 0; i < chatLabelCount; i++) {
      const element = this.chatLabel.nth(i);
      const labelText = await element.textContent();
      console.log("this is label text:", labelText);
      expect(labelText).toContain("Group");
    }
  }

  async checkExpandIcon() {
    const chatListCount = await this.chatList.count();
    // Loop through list of chats
    for (let i = 0; i < chatListCount; i++) {
      const element = this.chatList.nth(i);
      const chatListText = await element.textContent();
      const expandIcon = element.getByTestId("ExpandMoreIcon"); // scope expandIcon to current element
      console.log("this is chat list text", chatListText);
      // Check that for items with text label Group, the expand Icon is present
      if (chatListText && chatListText.toLowerCase().includes("group")) {
        await expect(expandIcon).toBeVisible();
        // Check that for items with text label 1:1, the expand Icon is not present
      } else if (chatListText && chatListText.toLowerCase().includes("1:1")) {
        await expect(expandIcon).not.toBeVisible();
      }
    }
  }

  async updateSessionStorage() {
    // Get the sessionStorage from the session-storage.json file which contains our lovely tokens
    const sessionStorage = JSON.parse(
      fs.readFileSync("session-storage.json", "utf-8")
    );

    // Iterate through each item in the sessionStorage array and copy it over to the sessionStorage in the browser
    await this.page.addInitScript((storage: { [key: string]: any }) => {
      if (window.location.hostname === "app.teamsexporter.com") {
        for (const [key, value] of Object.entries(storage))
          window.sessionStorage.setItem(key, value);
      }
    }, sessionStorage);
  }
}

export default HomePage;
