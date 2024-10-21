import * as crypto from "crypto";
import { BrowserEngine } from "./tiktok";
import axios, { isAxiosError } from "axios";
import { BrowserWindow, session } from "electron";
import httpProxy from "http-proxy";
import { createServer } from "http";
import { sleep } from "@share/libs/sleep";
export class StreamLabAuth {
  private readonly STREAMLABS_API_URL =
    "https://streamlabs.com/api/v5/auth/data";
  private readonly code_verifier: string;
  private readonly streamlabs_auth_url: string;

  constructor(private readonly browserEngine: BrowserWindow) {
    this.code_verifier = this.generateCodeVerifier();
    const code_challenge = this.generateCodeChallenge(this.code_verifier);
    this.streamlabs_auth_url = `https://streamlabs.com/m/login?force_verify=1&external=mobile&skip_splash=1&tiktok&code_challenge=${code_challenge}`;
  }

  async getToken() {
    try {
      const urlPromise = new Promise<string>((res) => {
        this.browserEngine.webContents.session.webRequest.onBeforeRequest(
          { urls: [], types: ["xhr"] },
          (d, cb) => {
            if (d.url.includes("/passport/open/web/auth/v2/")) {
              res(d.url);
              cb({ cancel: true });
            }
            cb({ cancel: false });
          }
        );
      });
      // let auth_code = "";
      // const page = await this.browserEngine.page();
      // page.route("**/*", async (route, req) => {
      //   if (req.url().includes("/passport/open/web/auth/v2/")) {
      //     const response = await route.fetch();
      //     const respBody = await response.json();
      //     const redirect_url = respBody.redirect_url;
      //     if (redirect_url) {
      //       const parsedUrl = new URL(redirect_url);
      //       const code = parsedUrl.searchParams.get("code");
      //       if (code) {
      //         auth_code = code;
      //       }
      //     }
      //     return route.fulfill({ response });
      //   }
      //   return route.continue();
      // });
      // Navigate to Streamlabs OAuth page
      const cookies = await this.browserEngine.webContents.session.cookies.get({
        domain: ".tiktok.com",
      });
      await this.browserEngine.loadURL(this.streamlabs_auth_url);
      const url = await urlPromise;
      // await this.browserEngine.close();
      // this.browserEngine.close();
      // console.log({ cookies });
      console.log(url);
      // await this.browserEngine.loadURL(url);
      const d = await axios.post(
        url,
        {},
        {
          headers: {
            cookie: cookies
              .map((cookie) => `${cookie.name}=${cookie.value}`)
              .join("; "),
          },
        }
      );
      const redirect_url = new URL(d.data.redirect_url);
      const code_redirect = redirect_url.searchParams.get("code");
      return this.exchangeCodeForToken(code_redirect);
    } catch (error) {
      console.error(error);
    }
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

  // Function to exchange the authorization code for an access token
  async exchangeCodeForToken(auth_code: string): Promise<string | null> {
    const tokenRequestUrl = `${this.STREAMLABS_API_URL}?code_verifier=${this.code_verifier}&code=${auth_code}`;
    try {
      let retry = 0;
      let resJson;
      do {
        try {
          const response = await axios.get(tokenRequestUrl);
          resJson = await response.data;
        } catch (error: any) {
          console.log(error);
        }
        await sleep(10);
        // response = await page.reload();
        retry++;
      } while (retry < 5 && !resJson);
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
