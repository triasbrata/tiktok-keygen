import * as crypto from "crypto";
import { BrowserEngine } from "./tiktok";

export class StreamLabAuth {
  private readonly STREAMLABS_API_URL =
    "https://streamlabs.com/api/v5/auth/data";
  private readonly code_verifier: string;
  private readonly streamlabs_auth_url: string;

  constructor(private readonly browserEngine: BrowserEngine) {
    this.code_verifier = this.generateCodeVerifier();
    const code_challenge = this.generateCodeChallenge(this.code_verifier);
    this.streamlabs_auth_url = `https://streamlabs.com/m/login?force_verify=1&external=mobile&skip_splash=1&tiktok&code_challenge=${code_challenge}`;
  }

  async getToken() {
    try {
      let auth_code = "";
      this.browserEngine.page.route("**/*", async (route, req) => {
        if (req.url().includes("/passport/open/web/auth/v2/")) {
          const response = await route.fetch();
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
      // Navigate to Streamlabs OAuth page
      await this.browserEngine.page.goto(this.streamlabs_auth_url);
      let timeout = 0;
      do {
        if (this.browserEngine.page.isClosed()) {
          throw new Error("browser already closed");
        }
        await new Promise<void>((res) => {
          setTimeout(() => res(), 1000);
        });
        timeout++;
      } while (auth_code == "" || timeout >= 600);
      //close browser
      await this.browserEngine.page.close();
      // Wait for the login and consent process to complete
      if (auth_code) {
        // Exchange the authorization code for an access token
        return this.exchangeCodeForToken(auth_code);
      } else {
        throw new Error("Authorization code not found.");
      }
    } catch (error) {}
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
    const page = this.browserEngine.page;
    try {
      const response = await page.goto(tokenRequestUrl);

      const resBody = await response.body();
      const resJson = await new Promise<Record<string, any>>((res, rej) => {
        try {
          res(JSON.parse(resBody.toString("utf-8")));
        } catch (error) {
          rej(
            new Error(
              "Failed to retrieve token. with error message: " + error.message
            )
          );
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
