import { TiktokIntegrationContextType } from "./context";

export function tiktokContext(): TiktokIntegrationContextType {
  if (window !== undefined) {
    return window.tiktok_integration;
  }
  return {} as TiktokIntegrationContextType;
}
