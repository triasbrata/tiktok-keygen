import { tiktokContext } from "@/context/ipc/tiktok";
import React, { useEffect, useState } from "react";
import ObsPreview from "../../components/pages/live/obs-preview";
import { useZustandState } from "@/context/zustand";
import { tiktokLiveContextSlice } from "@/context/slices/tiktok-live";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TiktokLiveEvent } from "@main/tiktok/types/tiktokLive";
import { Coins, Users } from "lucide-react";
import Chats from "../../components/pages/live/chats";

export default function Dashboard() {
  const { eventReconnect, isLiveEventStart } =
    useZustandState<tiktokLiveContextSlice>((s) => s);
  const [totalViewer, setTotalViewer] = useState(0);
  const [chats, setChats] = useState<Array<TiktokLiveEvent["chat"]>>([]);
  const [chatCounter, setChatCounter] = useState(0);
  const [estimatedGift, setEstimatedGift] = useState(0);
  const [estimatedNewUser, setEstimatedNewUser] = useState(0);
  const [topViwers, setTopViewers] = useState<
    TiktokLiveEvent["roomUser"]["topViewers"]
  >([]);
  const increaseChatCounter = () => setChatCounter((p) => p + 1);
  useEffect(() => {
    let unsub: any;
    if (isLiveEventStart) {
      unsub = tiktokContext().liveEvent((e) => {
        if (e.roomUser) {
          const data = e.roomUser;
          setTotalViewer(data.viewerCount);
          setTopViewers(data.topViewers.slice(0, 3));
        }
        if (e.gift) {
          const data = e.gift;
          console.log(data);
          setEstimatedGift((p) => p + data.diamondCount);
        }
        if (e.chat) {
          const data = e.chat;
          increaseChatCounter();
          setChats((p) => {
            if (p.length < 200) {
              const out = [...p, data];
              return out;
            }
            const [_, ...rest] = p;
            rest.push(data);
            return rest;
          });
        }
        if (e.member) {
          setEstimatedNewUser((p) => p + 1);
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
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
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
                {/* +20.1% from last month */}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estimated New Viewers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estimatedNewUser}</div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estimated Revenue
              </CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estimatedGift}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        <ObsPreview />
      </div>
      <div className="w-2/5  h-full">
        <Chats chatCounter={chatCounter} chats={chats} topViewers={topViwers} />
      </div>
    </div>
  );
}
