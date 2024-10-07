import type { TiktokIntegrationContextType } from "@main/tiktok/context";

export function tiktokContext(): TiktokIntegrationContextType {
  if (window !== undefined) {
    return window.tiktok_integration;
  }
  return {} as TiktokIntegrationContextType;
}
