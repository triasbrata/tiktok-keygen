import React, { PropsWithChildren } from "react";
import WindowBar from "./window/WindowBar";
import { ThemeProvider } from "next-themes";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <div>
        <WindowBar />
        {children}
      </div>
    </ThemeProvider>
  );
}
