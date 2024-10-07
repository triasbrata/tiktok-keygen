/**
 * this code converted from this repository
 * https://github.com/Loukious/StreamLabsTikTokStreamKeyGenerator
 */
import {
  chromium,
  Browser,
  Page,
  Cookie,
  BrowserContext,
} from "playwright-core";
import * as fs from "fs";
import * as path from "path";
import { URL } from "url";

export class BrowserEngine {
  private readonly cookies_file: string;
  private readonly browserPath: string;
  private browser: Browser | null = null;
  private context: BrowserContext;

  constructor(browserPath: string, cookies_file = "../cookies.json") {
    this.cookies_file = path.resolve(__dirname, cookies_file);
    this.browserPath = browserPath; // Browser path is passed in the constructor
  }
  async page() {
    const pages = this.context.pages();
    if (pages.length === 0) {
      return this.context.newPage();
    }
    return pages[0];
  }
  async openTiktok() {
    const tiktokUserpageUrl = `https://www.tiktok.com/`;
    const page = await this.page();
    await page.goto(tiktokUserpageUrl);
    const el = await page.$("#__UNIVERSAL_DATA_FOR_REHYDRATION__");
    const content = await el.innerHTML();
    const json = JSON.parse(content);
    console.log({ json });
    const userContent = json["__DEFAULT_SCOPE__"]["webapp.app-context"].user;
    const userDataTiktok = {
      pp: userContent.avatarUri[0],
      secuid: userContent.secUid,
      uid: userContent.uniqueId,
      nicName: userContent.nickName,
    };
    return userDataTiktok;
  }
  // Load cookies from the file and apply them to the Playwright page
  private async loadCookies(context: BrowserContext) {
    if (fs.existsSync(this.cookies_file)) {
      const cookiesRaw: Cookie[] = JSON.parse(
        fs.readFileSync(this.cookies_file, "utf8")
      );
      await context.addCookies(
        cookiesRaw.map(({ sameSite, ...it }) => {
          if (/strict/i.test(sameSite)) {
            sameSite = "Strict";
          }
          if (/lax/i.test(sameSite)) {
            sameSite = "Lax";
          }
          if (!["Lax", "Strict"].includes(sameSite)) {
            sameSite = "None";
          }
          return {
            ...it,
            sameSite: sameSite,
          };
        })
      );
    }
  }

  // Save cookies from the Playwright context to a file
  async saveCookies(page: Page) {
    const cookies = await page.context().cookies();
    fs.writeFileSync(this.cookies_file, JSON.stringify(cookies, null, 2));
  }

  async stopEngine() {
    if (typeof this.browser?.close === "function") {
      await this.browser.close();
    }
  }
  async startEngine() {
    try {
      this.browser = await chromium.launch({
        executablePath: this.browserPath, // Use the custom browser path
        headless: false, // For debugging, you can set this to true for headless
      });
      this.context = await this.browser.newContext();
      await this.loadCookies(this.context);
      await this.context.newPage();
      return this;
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving token:", error.message);
    }
  }
}
