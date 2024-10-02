import React from "react";
import type { AppProps } from "next/app";

import "../styles/globals.css";
import ProviderWrapper from "../components/provider/ProviderWrapper";
import WindowFrame from "@/components/window/WindowFrame";
import dynamic from "next/dynamic";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ProviderWrapper>
      <WindowFrame>
        <Component {...pageProps} />
      </WindowFrame>
    </ProviderWrapper>
  );
}
export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
