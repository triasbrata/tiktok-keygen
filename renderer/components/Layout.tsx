import React, { PropsWithChildren } from "react";
import WindowBar from "./window/WindowBar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <WindowBar />
      {children}
    </div>
  );
}
