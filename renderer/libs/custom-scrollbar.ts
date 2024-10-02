import dynamic from "next/dynamic";

export const CustomScroll = dynamic(
  () => import("react-custom-scroll").then((mod) => mod.CustomScroll),
  {
    ssr: false,
  }
);
