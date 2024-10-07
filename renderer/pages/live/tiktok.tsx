import { Combobox } from "@/components/composite/combobox";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { tiktokContext } from "@/context/ipc/tiktok";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Radio } from "lucide-react";
import { TextareaWithCounter } from "@/components/composite/text-area-with-counter";
import { useZustandState } from "@/context/zustand";
import { ObsConfigInjectContext } from "@/context/slices/obs-config-inject";
import { useToast } from "@/components/hooks/use-toast";
import { toastErrorPayload } from "@/libs/utils";
import { tiktokLiveContextSlice } from "@/context/slices/tiktok-live";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formTiktokSchema = z.object({
  title: z.string().min(3),
  topic: z.string().optional(),
});
type formTiktokSchemaType = z.infer<typeof formTiktokSchema>;
export default function TiktokLivePage() {
  const { toast } = useToast();
  const {
    configPath,
    injectConfig,
    multistream,
    title,
    topic,
    isLive,
    setLive,
  } = useZustandState<ObsConfigInjectContext & tiktokLiveContextSlice>(
    (s) => s
  );
  const form = useForm<formTiktokSchemaType>({
    resolver: zodResolver(formTiktokSchema),
    defaultValues: {
      title,
      topic,
    },
  });
  const [liveKey, setLiveKey] = useState({ rtmp: "", key: "" });
  const [initialOptions, setInitialOptions] = useState([]);
  const handleOnSearch = async (
    search?: string
  ): Promise<Array<{ key: string; render: ReactNode; value: string }>> => {
    try {
      const slKey = await tiktokContext().getStreamLabKey();
      const response = await axios.get<{
        categories: Array<{ full_name: string; game_mask_id: string }>;
      }>(
        `https://streamlabs.com/api/v5/slobs/tiktok/info?category=${encodeURIComponent(
          search
        )}`,
        {
          headers: { Authorization: `Bearer ${slKey}` },
        }
      );
      const categories = response.data.categories;
      if (Array.isArray(categories)) {
        // categories.push({ full_name: "Others", game_mask_id: "" });
        return categories.map((it) => ({
          key: it.game_mask_id,
          render: it.full_name,
          value: it.full_name,
        }));
      }
    } catch (error) {
      console.error("Error fetching game categories:", error);
    }
    return [];
  };
  useEffect(() => {
    const doAsync = async () => {
      const res = await handleOnSearch();
      setInitialOptions(res);
    };
    doAsync();
  }, []);
  const speak = useRef(new SpeechSynthesisUtterance());
  useEffect(() => {
    window.speechSynthesis.speak(speak.current);
    return () => {};
  }, []);

  // useEffect(() => {
  //   const removeListener = tiktokContext().getTiktokStreamID((data: any) => {
  //     setLive(data && data.value_data);
  //   });

  //   return () => {
  //     removeListener();
  //   };
  // }, []);

  const handleGoLive = useCallback(
    async (data: formTiktokSchemaType) => {
      try {
        const res = await tiktokContext().goLive({
          topic: data.topic,
          title: data.title,
          multistream,
          configPath,
        });
        setLive(true);
        setLiveKey(res);
      } catch (error) {
        toast(toastErrorPayload(error.message));
      }
    },
    [multistream, configPath]
  );
  const handleStopLive = async () => {
    await tiktokContext().stopLive();
    setLive(false);
    setLiveKey({ key: "", rtmp: "" });
  };
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGoLive)}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={"topic"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Combobox
                        disable={isLive || form.formState.isSubmitting}
                        onSearch={handleOnSearch}
                        onSelected={field.onChange}
                        initialSelected={field.value}
                        options={initialOptions}
                      />
                    </FormControl>
                    {!form.formState.errors.topic ? (
                      <FormDescription>Topic Live</FormDescription>
                    ) : (
                      <FormMessage>
                        {form.formState.errors.topic?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"title"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <TextareaWithCounter
                        maxLength={250}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLive || form.formState.isSubmitting}
                      />
                    </FormControl>
                    {!form.formState.errors.title ? (
                      <FormDescription>Title Live</FormDescription>
                    ) : (
                      <FormMessage>
                        {form.formState.errors.title?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
            {!isLive && (
              <div className="flex justify-end gap-4 items-end">
                <div className="">
                  <Button
                    type="submit"
                    className="flex items-center space-x-2"
                    //
                  >
                    <Radio /> <span>Go Live</span>
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
      {isLive && (
        <div className="flex justify-end gap-4 items-end">
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button">Streaming Settings</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Streaming Settings</DialogTitle>
                  <DialogDescription>
                    <div className="flex flex-col gap-3 w-full">
                      <div className="grid items-center gap-1.5">
                        <Label htmlFor="rtmp">RTMP</Label>
                        <Input
                          type="rtmp"
                          id="rtmp"
                          placeholder="RTMP"
                          className="w-full"
                          readOnly
                          value={liveKey.rtmp}
                        />
                      </div>
                      <div className="grid items-center gap-1.5">
                        <Label htmlFor="key">Key</Label>
                        <Input
                          type="key"
                          id="key"
                          className="w-full"
                          placeholder="Key"
                          readOnly
                          value={liveKey.key}
                        />
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <Button onClick={() => handleStopLive()}>Stop Live</Button>
          </div>
        </div>
      )}
    </div>
  );
}
