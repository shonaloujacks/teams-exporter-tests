import { Page, Locator, expect } from "@playwright/test";
import fs from "fs";

class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto("https://app.teamsexporter.com/");
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
