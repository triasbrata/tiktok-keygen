import React from "react";
import type { AppProps } from "next/app";

import "../styles/globals.css";
import ProviderWrapper from "../components/provider/ProviderWrapper";
import WindowFrame from "@/components/window/WindowFrame";
import dynamic from "next/dynamic";
import BackgroundProcess from "@/components/Layouts/background/wrapper";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <div className="text-muted-foreground">
    <ProviderWrapper>
      <WindowFrame>
        <Component {...pageProps} />
      </WindowFrame>
      <BackgroundProcess />
    </ProviderWrapper>
    // </div>
  );
}
export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
