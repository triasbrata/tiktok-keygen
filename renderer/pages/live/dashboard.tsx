import { tiktokContext } from "@/context/ipc/tiktok";
import React, { useEffect, useState } from "react";
import ObsPreview from "./_componenets/obs-preview";
import { useZustandState } from "@/context/zustand";
import { tiktokLiveContextSlice } from "@/context/slices/tiktok-live";
import { CustomScroll } from "@/libs/custom-scrollbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TiktokLiveEvent } from "@main/tiktok/types/tiktokLive";
import { Coins, Users } from "lucide-react";
import { nameInitial } from "@/libs/utils";
import { TiktokIcon } from "hugeicons-react";

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
        <Card className="h-[100%] flex flex-col justify-between">
          <CardHeader className="h-[72px] flex flex-row items-center justify-between space-y-0">
            <CardTitle>Chat</CardTitle>
            <div className="flex flex-row gap-2 justify-between">
              <div>
                <span>Total Chat</span>
              </div>
              <div>
                <span>{chatCounter}</span>
              </div>
            </div>
          </CardHeader>
          {topViwers.length > 0 && (
            <CardContent className="border-t border-b grid grid-rows-5 grid-flow-col gap-4  items-stretch p-2 max-h-[200px]">
              {topViwers.map((topViwer, i, s) => (
                <div
                  className={`flex justify-items-center justify-between row-span-${
                    i === 0
                      ? "5"
                      : i === 1 && s.length < 3
                      ? "5"
                      : i === 1
                      ? "3"
                      : "2"
                  } col-span-${i === 0 ? "3" : "2"} p-3 gap-2 items-center`}
                >
                  {React.createElement("h" + (i + 1), {}, [i + 1])}
                  <div className="grid gap-2 justify-items-center justify-center">
                    <Avatar>
                      <AvatarImage src={topViwer.user.profilePictureUrl} />
                      <AvatarFallback>
                        {nameInitial(topViwer.user.nickname)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{topViwer.user.nickname}</span>
                  </div>
                  <div className="flex gap-2">
                    <Coins />
                    <span>{topViwer.coinCount}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
          <CardContent className="flex-1 min-h-[0px] min-w-[0px] pt-2">
            <CustomScroll heightRelativeToParent="100%">
              {chats.map((it, i) => {
                return (
                  <div key={i} className="flex items-center gap-4 mb-3 ">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src={it.profilePictureUrl ?? ""} />
                      <AvatarFallback>
                        {nameInitial(it.nickname)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1 grow">
                      <p className="text-sm font-medium leading-none">
                        {it.nickname}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {it.comment}
                      </p>
                    </div>
                    <TiktokIcon />
                  </div>
                );
              })}
            </CustomScroll>
          </CardContent>
          <CardContent></CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  );
}
