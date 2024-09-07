// renderer/renderer.ts
interface Config {
  title: string;
  game: string;
  token: string;
}

interface Category {
  full_name: string;
  game_mask_id: string;
}

window.addEventListener("DOMContentLoaded", () => {
  const loadTokenButton = document.getElementById(
    "loadTokenButton"
  ) as HTMLButtonElement;
  const fetchOnlineTokenButton = document.getElementById(
    "fetchOnlineTokenButton"
  ) as HTMLButtonElement;
  const tokenInput = document.getElementById("tokenInput") as HTMLInputElement;
  const toggleTokenButton = document.getElementById(
    "toggleTokenButton"
  ) as HTMLButtonElement;
  const streamTitleInput = document.getElementById(
    "streamTitle"
  ) as HTMLInputElement;
  const gameCategoryInput = document.getElementById(
    "gameCategory"
  ) as HTMLInputElement;
  const goLiveButton = document.getElementById(
    "goLiveButton"
  ) as HTMLButtonElement;
  const endLiveButton = document.getElementById(
    "endLiveButton"
  ) as HTMLButtonElement;
  const streamURLInput = document.getElementById(
    "streamURL"
  ) as HTMLInputElement;
  const streamKeyInput = document.getElementById(
    "streamKey"
  ) as HTMLInputElement;
  const copyURLButton = document.getElementById(
    "copyURLButton"
  ) as HTMLButtonElement;
  const copyKeyButton = document.getElementById(
    "copyKeyButton"
  ) as HTMLButtonElement;
  const saveConfigButton = document.getElementById(
    "saveConfigButton"
  ) as HTMLButtonElement;
  const helpButton = document.getElementById("helpButton") as HTMLButtonElement;
  const openLiveMonitorButton = document.getElementById(
    "openLiveMonitorButton"
  ) as HTMLButtonElement;
  const listbox = document.getElementById("listbox") as HTMLDivElement;

  let isTokenVisible = false;

  const showToken = () => {
    tokenInput.type = "text";
    toggleTokenButton.textContent = "Hide Token";
    isTokenVisible = true;
  };

  const hideToken = () => {
    tokenInput.type = "password";
    toggleTokenButton.textContent = "Show Token";
    isTokenVisible = false;
  };

  toggleTokenButton.addEventListener("click", () => {
    if (isTokenVisible) {
      hideToken();
    } else {
      showToken();
    }
  });

  loadTokenButton.addEventListener("click", async () => {
    // Implement loadToken logic if available
    // For simplicity, notifying user to fetch online
    alert(
      "Load Token functionality is not implemented. Please fetch token online."
    );
  });

  fetchOnlineTokenButton.addEventListener("click", async () => {
    const token = await window.electronAPI.fetchOnlineToken();
    if (token) {
      tokenInput.value = token;
      streamTitleInput.disabled = false;
      gameCategoryInput.disabled = false;
      goLiveButton.disabled = false;
    } else {
      alert("Failed to fetch token online.");
    }
  });

  goLiveButton.addEventListener("click", async () => {
    const title = streamTitleInput.value;
    const game =
      (gameCategoryInput as any).game_mask_id || gameCategoryInput.value;

    const response = await window.electronAPI.startStream(title, game);
    if (response.success) {
      streamURLInput.value = response.rtmp;
      streamKeyInput.value = response.key;
      endLiveButton.disabled = false;
      alert("Stream started successfully!");
    } else {
      alert(`Error starting stream: ${response.message}`);
    }
  });

  endLiveButton.addEventListener("click", async () => {
    const response = await window.electronAPI.endStream();
    if (response.success) {
      streamURLInput.value = "";
      streamKeyInput.value = "";
      endLiveButton.disabled = true;
      alert("Stream ended successfully!");
    } else {
      alert(`Error ending stream: ${response.message}`);
    }
  });

  copyURLButton.addEventListener("click", () => {
    navigator.clipboard.writeText(streamURLInput.value);
    alert("Stream URL copied to clipboard!");
  });

  copyKeyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(streamKeyInput.value);
    alert("Stream Key copied to clipboard!");
  });

  saveConfigButton.addEventListener("click", async () => {
    const config: Config = {
      title: streamTitleInput.value,
      game: gameCategoryInput.value,
      token: tokenInput.value,
    };
    await window.electronAPI.saveConfig(config);
    alert("Configuration saved successfully!");
  });

  helpButton.addEventListener("click", () => {
    const helpMessage = `
1. Apply and get access to LIVE on Streamlabs using the link below.
2. Install Streamlabs and log into your TikTok account.
3. Use this app to get Streamlabs token.
4. Go live!
`;
    const helpURL =
      "https://tiktok.com/falcon/live_g/live_access_pc_apply/result/index.html?id=GL6399433079641606942&lang=en-US";
    if (
      confirm(
        `${helpMessage}\nClick OK to open the Streamlabs LIVE access application.`
      )
    ) {
      window.open(helpURL, "_blank");
    }
  });

  openLiveMonitorButton.addEventListener("click", () => {
    const liveMonitorURL =
      "https://livecenter.tiktok.com/live_monitor?lang=en-US";
    window.open(liveMonitorURL, "_blank");
  });

  gameCategoryInput.addEventListener("input", async (event) => {
    const value = (event.target as HTMLInputElement).value;
    if (value.length === 0) {
      listbox.style.display = "none";
      return;
    }

    const categories: Category[] = await window.electronAPI.searchGame(value);
    listbox.innerHTML = "";
    categories.forEach((category) => {
      const div = document.createElement("div");
      div.textContent = category.full_name;
      div.addEventListener("click", () => {
        gameCategoryInput.value = category.full_name;
        (gameCategoryInput as any).game_mask_id = category.game_mask_id;
        listbox.style.display = "none";
      });
      listbox.appendChild(div);
    });

    if (categories.length > 0) {
      listbox.style.display = "block";
    } else {
      listbox.style.display = "none";
    }
  });

  document.addEventListener("click", (event) => {
    if (!(event.target as HTMLElement).closest("#gameCategory")) {
      listbox.style.display = "none";
    }
  });

  // Load configuration on startup
  (async () => {
    const config: Config | null = await window.electronAPI.loadConfig();
    if (config) {
      streamTitleInput.value = config.title;
      gameCategoryInput.value = config.game;
      tokenInput.value = config.token;
      if (config.token) {
        streamTitleInput.disabled = false;
        gameCategoryInput.disabled = false;
        goLiveButton.disabled = false;
      }
    }
  })();
});
