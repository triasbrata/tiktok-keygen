import { ObsContext } from "@/context/ipc/obs";
import { tiktokContext } from "@/context/ipc/tiktok";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ObsPreview from "./_componenets/obs-preview";
import { useZustandState } from "@/context/zustand";
import { tiktokLiveContextSlice } from "@/context/slices/tiktok-live";
import InfiniteScroll from "react-infinite-scroller";
import { CustomScroll } from "@/libs/custom-scrollbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TiktokLiveEvent } from "@main/tiktok/types/tiktokLive";
import { Subject } from "rxjs";
import { Users } from "lucide-react";

export default function Dashboard() {
  const { eventReconnect, isLiveEventStart } =
    useZustandState<tiktokLiveContextSlice>((s) => s);
  const [totalViewer, setTotalViewer] = useState(0);
  const [chats, setChats] = useState<Array<TiktokLiveEvent["chat"]>>([]);
  useEffect(() => {
    let unsub: any;
    if (isLiveEventStart) {
      unsub = tiktokContext().liveEvent((e) => {
        console.log(e);
        if (e.roomUser) {
          const data = e.roomUser;
          setTotalViewer(data.viewerCount);
        }
        if (e.chat) {
          const data = e.chat;
          setChats((p) => {
            if (p.length < 50) {
              const out = [...p, data];
              return out;
            }
            const [_, ...rest] = p;
            rest.push(data);
            return rest;
          });
        }
      });
    }
    return () => {
      if (unsub && typeof unsub === "function") {
        unsub();
      }
    };
  }, [eventReconnect, isLiveEventStart]);
  return (
    <div className="flex flex-row gap-3 h-full w-full items-stretch">
      <div className="grow flex flex-col space-y-4">
        <div className="flex gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Viewers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViewer}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViewer}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViewer}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        <ObsPreview />
      </div>
      <div className="w-2/5  h-full">
        <Card className="h-[100%] flex flex-col">
          <CardHeader className="grow">
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[92%]">
            <CustomScroll keepAtBottom flex="1" heightRelativeToParent="100%">
              {chats.map((it, i) => {
                return (
                  <div key={i} className="flex items-center gap-4 mb-3">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src={it.profilePictureUrl ?? ""} />
                      <AvatarFallback>
                        {it.nickname
                          .split(" ")
                          .map((it) => it?.[0] ?? "")
                          .slice(0, 2)
                          .join()
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {it.nickname}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {it.comment}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CustomScroll>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
