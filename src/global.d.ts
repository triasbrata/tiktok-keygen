interface ElectronAPI {
  loadConfig: () => Promise<any>;
  saveConfig: (config: any) => Promise<any>;
  loadToken: () => Promise<any>;
  fetchOnlineToken: () => Promise<any>;
  startStream: (title: string, game: string) => Promise<any>;
  endStream: () => Promise<any>;
  searchGame: (gameName: string) => Promise<any>;
  getToken: (gameName: string) => Promise<any>;
}

// Extend the Window interface
interface Window {
  electronAPI: ElectronAPI;
}
