import { TiktokIntegrationContextType } from "./context";

export function tiktokContext(): TiktokIntegrationContextType {
  console.log(window);
  if (window !== undefined) {
    return window.tiktok_integration;
  }
  return {} as TiktokIntegrationContextType;
}
