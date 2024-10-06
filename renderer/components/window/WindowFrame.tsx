"use client";

import { useTheme } from "next-themes";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import AppLayout from "../Layouts/AppLayout";
import { Minus, Moon, Square, Sun, X } from "lucide-react";
import context from "@/context/ipc/window";
import titlebarMenus from "../../../main/window/titlebarMenus";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import WindowFrameWindowsButtons from "./WindowFrameWindowsButtons";
import { Toaster } from "../ui/toaster";
type Props = {
  title?: string;
  borderColor?: string;
};

type Context = {
  platform: "windows" | "mac";
};

export const WindowContext = React.createContext<Context>({
  platform: "windows",
});
export default function WindowFrame({
  children,
  ...props
}: PropsWithChildren<Props>) {
  const itsRef = useRef<HTMLDivElement>(null);
  const [platform, setPlatform] = useState<"windows" | "mac">("windows");

  useEffect(() => {
    context()
      .os()
      .then((res) => {
        setPlatform(res);
      });
    if (itsRef?.current) {
      const { parentElement } = itsRef.current;
      parentElement.classList.add("has-electron-window");
      parentElement.classList.add("has-border");
      // Apply border color if prop given
      if (props.borderColor) {
        parentElement.style.borderColor = props.borderColor;
      }
    }
  }, []);
  const handler = (action: string, value: any) => {
    const fn = context()[action];
    if (typeof fn === "function") {
      fn(value);
    }
  };
  const { theme, setTheme } = useTheme();
  return (
    <div className="overflow-x-hidden">
      <div className="h-[36px] w-full p-3 pt-2 border-solid border-0 border-b border-foreground/900 window-frame">
        <div className="flex flex-row">
          <div className="actions grid grid-flow-col gap-4">
            {titlebarMenus.map((it, i) => {
              return (
                <DropdownMenu key={i}>
                  <DropdownMenuTrigger>{it.name}</DropdownMenuTrigger>

                  <DropdownMenuContent className="min-w-64">
                    {it.items.map((item, id) => {
                      if (item.name === "__") {
                        return <DropdownMenuSeparator />;
                      }

                      return (
                        <DropdownMenuItem
                          key={id}
                          onClick={() => handler(item.action, item.value)}
                        >
                          <span>{item.name}</span>
                          <DropdownMenuShortcut>
                            {item.shortcut}
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}
          </div>
          <div
            className="grow"
            onDoubleClick={() => context().toggle_maximize()}
          />
          <div className="actions grid grid-flow-col gap-4">
            <div>
              {theme === "dark" ? (
                <button onClick={() => setTheme("light")}>
                  <Moon size={16} />
                </button>
              ) : (
                <button onClick={() => setTheme("dark")}>
                  <Sun size={16} />
                </button>
              )}
            </div>
            {platform === "windows" ? (
              <WindowFrameWindowsButtons context={context()} />
            ) : null}
          </div>
        </div>
      </div>
      {/* window content */}
      <div className="overflow-auto">
        <AppLayout>{children}</AppLayout>
      </div>
      <Toaster />
    </div>
  );
}
