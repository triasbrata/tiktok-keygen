"use client";
import React, { PropsWithChildren } from "react";
import WindowFrame from "../window/WindowFrame";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "../ui/tooltip";

export default function ProviderWrapper({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
