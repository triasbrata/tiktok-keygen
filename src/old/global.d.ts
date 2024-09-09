interface ElectronAPIPreloadApp {
  loadConfig: () => Promise<any>;
  saveConfig: (config: any) => Promise<any>;
  loadToken: () => Promise<any>;
  fetchOnlineToken: () => Promise<any>;
  startStream: (title: string, game: string) => Promise<any>;
  endStream: () => Promise<any>;
  searchGame: (gameName: string) => Promise<any>;
  getToken: (gameName: string) => Promise<any>;
  listenObs: (config: { url: string; password?: string }) => Promise<any>;
  onServerObsClose: (cb: () => void) => void;
}

interface ElectronAPIPreloadLogin {
  exchangeAuthCode: (authCode: string) => void;
}

// Extend the Window interface
interface Window {
  electronAPI: ElectronAPIPreloadApp & ElectronAPIPreloadLogin;
}
