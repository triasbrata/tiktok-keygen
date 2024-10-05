import { LifeBuoy, Settings, SquareUser, Triangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { routes } from "../routes";
import React from "react";
import { useRouter } from "next/router";

export default function SidebarMenu() {
  const router = useRouter();

  return (
    <aside className="w-[75px] flex h-fullbody flex-col border-r">
      <div className="border-b p-2 flex h-[60px]">
        <Button
          variant="outline"
          className="mx-auto"
          size="icon"
          aria-label="Home"
        >
          <Triangle className="size-5 fill-foreground" />
        </Button>
      </div>
      <nav className="grid gap-4 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={"/setup/account"}>
              <Avatar className="ml-1 mx-auto mt-2 w-[32px] h-[32px]">
                <AvatarImage
                  style={{ filter: "grayscale(100%)" }}
                  src="https://github.com/shadcn.png"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            <span>@username</span>
            <br />
            <span>Disconnected</span>
          </TooltipContent>
        </Tooltip>
        {routes.map((it, i) => {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg mx-auto"
                  aria-label="Setup"
                  asChild
                >
                  <Link href={it.url}>
                    {React.cloneElement(it.icon, { className: "size-5" })}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                {it.content}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
      <nav className="mt-auto grid gap-1 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mx-auto rounded-lg"
              aria-label="Help"
            >
              <LifeBuoy className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Help
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mx-auto rounded-lg"
              aria-label="Account"
            >
              <Link href={"/setting/main"}>
                <Settings className="size-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Settings
          </TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
