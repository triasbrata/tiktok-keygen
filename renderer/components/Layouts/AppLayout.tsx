import {
  Book,
  Bot,
  Code2,
  LifeBuoy,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Triangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PropsWithChildren } from "react";
import { CustomScroll } from "@/libs/custom-scrollbar";
import { useRouter } from "next/router";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { routes } from "../routes";
import React from "react";

export const description =
  "An AI playground with a sidebar navigation and a main content area. The playground has a header with a settings drawer and a share button. The sidebar has navigation links and a user menu. The main content area shows a form to configure the model and messages.";

export default function AppLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  return (
    <div className="flex h-fullbody w-full">
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
                <SquareUser className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Account
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col h-fullbody">
        <header className="flex min-h-[60px] max-h-[60px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">TikObs</h1>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
          >
            <Share className="size-3.5" />
            Share
          </Button>
        </header>
        <CustomScroll flex="1" heightRelativeToParent="100%" className="p-2">
          {children}
        </CustomScroll>
      </div>
    </div>
  );
}
