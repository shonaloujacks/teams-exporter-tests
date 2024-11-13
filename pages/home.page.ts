import { Page, Locator, expect } from "@playwright/test";
import fs from "fs";

class HomePage {
  readonly page: Page;
  chatLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.chatLabel = page.getByRole("button").filter({
      has: page.locator(".MuiTypography-root.MuiTypography-body2.css-15b8szy"),
    });
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
