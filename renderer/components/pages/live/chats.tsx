import React from "react";
import { CustomScroll } from "@/libs/custom-scrollbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Coins } from "lucide-react";
import { nameInitial } from "@/libs/utils";
import { TiktokIcon } from "hugeicons-react";
import { TiktokLiveEvent } from "@main/tiktok/types/tiktokLive";
interface ChatLiveProps {
  chatCounter: number;
  topViewers: TiktokLiveEvent["roomUser"]["topViewers"];
  chats: Array<TiktokLiveEvent["chat"]>;
}
export default function Chats({
  chatCounter,
  topViewers,
  chats,
}: ChatLiveProps) {
  return (
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
      {topViewers.length > 0 && (
        <CardContent className="border-t border-b grid grid-rows-5 grid-flow-col gap-4  items-stretch p-2 max-h-[200px]">
          {topViewers.map((topViwer, i, s) => (
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
                  <AvatarFallback>{nameInitial(it.nickname)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1 grow">
                  <p className="text-sm font-medium leading-none">
                    {it.nickname}
                  </p>
                  <p className="text-sm text-muted-foreground">{it.comment}</p>
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
  );
}
