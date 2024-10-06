import { Share } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PropsWithChildren, useEffect } from "react";
import { CustomScroll } from "@/libs/custom-scrollbar";
import { useRouter } from "next/router";
import React from "react";
import SidebarMenu from "../composite/sidebar-menu";

export default function AppLayout({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <div className="flex h-fullbody w-full">
      <SidebarMenu />
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
