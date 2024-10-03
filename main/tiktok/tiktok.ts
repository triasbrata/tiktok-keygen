/**
 * this code converted from this repository
 * https://github.com/Loukious/StreamLabsTikTokStreamKeyGenerator
 */
import { chromium, Browser, Page, Cookie } from "playwright-core";
import axios from "axios";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { URL, URLSearchParams } from "url";
import { json } from "stream/consumers";

export class TokenRetriever {
  CLIENT_KEY = "awdjaq9ide8ofrtz";
  REDIRECT_URI = "https://streamlabs.com/tiktok/auth";
  STATE = "";
  SCOPE =
    "user.info.basic,live.room.info,live.room.manage,user.info.profile,user.info.stats";
  STREAMLABS_API_URL = "https://streamlabs.com/api/v5/auth/data";

  code_verifier: string;
  code_challenge: string;
  streamlabs_auth_url: string;
  cookies_file: string;
  browserPath: string;
  browser: Browser | null = null;

  constructor(browserPath: string, cookies_file = "../cookies.json") {
    this.code_verifier = this.generateCodeVerifier();
    this.code_challenge = this.generateCodeChallenge(this.code_verifier);
    this.streamlabs_auth_url = `https://streamlabs.com/m/login?force_verify=1&external=mobile&skip_splash=1&tiktok&code_challenge=${this.code_challenge}`;
    this.cookies_file = path.resolve(__dirname, cookies_file);
    this.browserPath = browserPath; // Browser path is passed in the constructor
  }

  // Generate a secure random code verifier
  generateCodeVerifier(): string {
    return crypto.randomBytes(64).toString("base64url").replace(/=/g, "");
  }

  // Generate a code challenge based on the code verifier
  generateCodeChallenge(code_verifier: string): string {
    return crypto
      .createHash("sha256")
      .update(code_verifier)
      .digest("base64url")
      .replace(/=/g, "");
  }

  // Load cookies from the file and apply them to the Playwright page
  async loadCookies(page: Page) {
    if (fs.existsSync(this.cookies_file)) {
      const cookiesRaw: Cookie[] = JSON.parse(
        fs.readFileSync(this.cookies_file, "utf8")
      );
      await page.context().addCookies(
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

  // Function to launch Playwright and retrieve the token
  async retrieveToken(): Promise<string | null> {
    const res = await this.getToken();
    if (typeof this.browser?.close === "function") {
      await this.browser.close();
    }
    return res;
  }
  async getToken() {
    try {
      this.browser = await chromium.launch({
        executablePath: this.browserPath, // Use the custom browser path
        headless: false, // For debugging, you can set this to true for headless
      });
      const context = await this.browser.newContext();
      const page = await context.newPage();
      let auth_code = "";
      page.route("**/*", async (route, req) => {
        if (req.url().includes("/passport/open/web/auth/v2/")) {
          const response = await page.request.fetch(route.request(), {
            ignoreHTTPSErrors: true,
            failOnStatusCode: true,
          });
          const respBody = await response.json();

          const redirect_url = respBody.redirect_url;
          if (redirect_url) {
            const parsedUrl = new URL(redirect_url);
            const code = parsedUrl.searchParams.get("code");
            if (code) {
              auth_code = code;
            }
          }
          return route.fulfill({ response });
        }
        return route.continue();
      });
      // Load cookies if available
      await this.loadCookies(page);
      // Load TikTok authentication page
      await page.goto("https://www.tiktok.com/login");

      // Navigate to Streamlabs OAuth page
      await page.goto(this.streamlabs_auth_url);
      let timeout = 0;
      do {
        if (page.isClosed()) {
          throw new Error("browser already closed");
        }
        await new Promise<void>((res) => {
          setTimeout(() => res(), 1000);
        });
        timeout++;
      } while (auth_code == "" || timeout >= 600);
      //close browser
      await page.close();
      // Wait for the login and consent process to complete
      if (auth_code) {
        // Exchange the authorization code for an access token
        return this.exchangeCodeForToken(auth_code);
      } else {
        throw new Error("Authorization code not found.");
      }
    } catch (error) {
      throw new Error("Error retrieving token:", error.message);
    }
  }

  // Function to exchange the authorization code for an access token
  async exchangeCodeForToken(auth_code: string): Promise<string | null> {
    const tokenRequestUrl = `${this.STREAMLABS_API_URL}?code_verifier=${this.code_verifier}&code=${auth_code}`;
    const page = await this.browser.newPage();
    try {
      const response = await page.goto(tokenRequestUrl);

      const resBody = await response.body();
      const resJson = await new Promise<Record<string, any>>((res, rej) => {
        try {
          res(JSON.parse(resBody.toString("utf-8")));
        } catch (error) {
          rej(error);
        }
      });

      if (resJson.success) {
        return resJson.data.oauth_token;
      } else {
        console.error("Failed to retrieve token.");
        return null;
      }
    } catch (error: any) {
      console.log(error);
      console.error("Error exchanging code for token:", error.message);
      return null;
    }
  }
}
