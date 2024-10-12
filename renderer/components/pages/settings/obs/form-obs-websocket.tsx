import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useZustandState } from "@/context/zustand";
import { OBSWebsocketContext } from "@/context/slices/obswebsocket";
const formSchema = z.object({
  ip: z.string().ip({ version: "v4" }),
  port: z.coerce
    .number()
    .max(65535, "port max number is 65535")
    .min(0, "port min number is 0"),
  password: z.string().optional(),
});
type formSchemaType = z.infer<typeof formSchema>;

export default function FormObsWebsocketSettings() {
  const { ip, password, port, updateWebsocketOBS } =
    useZustandState<OBSWebsocketContext>((s) => s);
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ip,
      password,
      port,
    },
  });
  const onSubmit = (data: formSchemaType) => {
    console.log({ data });
    updateWebsocketOBS({
      ip: data.ip!,
      password: data.password,
      port: data.port!,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/3 space-y-3">
        <FormField
          control={form.control}
          name="ip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IP Address</FormLabel>
              <FormControl>
                <Input placeholder="127.0.0.1" {...field} />
              </FormControl>
              {!form.formState.errors.ip ? (
                <FormDescription>Websocket IP address</FormDescription>
              ) : (
                <FormMessage>{form.formState.errors.ip?.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="port"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port</FormLabel>
              <FormControl>
                <Input placeholder="4454" type="number" {...field} />
              </FormControl>
              {!form.formState.errors.port ? (
                <FormDescription>Websocket port</FormDescription>
              ) : (
                <FormMessage>{form.formState.errors.port?.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="(optionals)" type="password" {...field} />
              </FormControl>
              {!form.formState.errors.password ? (
                <FormDescription>Obs password</FormDescription>
              ) : (
                <FormMessage>
                  {form.formState.errors.password?.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Test Connection</Button>
        </div>
      </form>
    </Form>
  );
}
