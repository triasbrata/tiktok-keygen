const webview = document.getElementById("authWebView") as Electron.WebviewTag;

webview.addEventListener("did-navigate", (event) => {
  const url = new URL(event.url);

  // Detect if the URL contains the authorization code
  if (url.searchParams.has("code")) {
    const authCode = url.searchParams.get("code");
    console.log("Authorization code received:", authCode);
    if (authCode) {
      // Send the auth code to the main process to exchange for an access token
      window.electronAPI.exchangeAuthCode(authCode);
    }
  }
});
