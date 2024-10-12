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
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
const formSchema = z.object({
  isRandom: z.boolean().optional(),
  lang: z.string().optional(),
  pitch: z.coerce.number().optional(),
  volume: z.coerce.number().optional(),
  rate: z.coerce.number().optional(),
});
type formSchemaType = z.infer<typeof formSchema>;
export default function Speak() {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isRandom: false,
      lang: "id",
      pitch: 50,
      rate: 50,
      volume: 75,
    },
  });
  const onSubmit = (param: any) => {
    console.log({ param });
  };
  return (
    <div className="div">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Button type="submit">here</Button>
          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-2">
              <FormField
                name="lang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      {/* <Slider
                        max={100}
                        value={[field.value]}
                        disabled={field.disabled}
                        step={1}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className={`w-full`}
                      /> */}
                    </FormControl>
                    {form.formState.errors["lang"] && (
                      <FormMessage>
                        {form.formState.errors["lang"].message}
                      </FormMessage>
                    )}
                    {!form.formState.errors["lang"] && (
                      <FormDescription>
                        Set Text to speak Language
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                name="volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Slider
                        max={100}
                        defaultValue={[field.value]}
                        disabled={field.disabled}
                        step={1}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className={`w-full`}
                      />
                    </FormControl>
                    {form.formState.errors["volume"] && (
                      <FormMessage>
                        {form.formState.errors["volume"].message}
                      </FormMessage>
                    )}
                    {!form.formState.errors["volume"] && (
                      <FormDescription>
                        Set Text to speak volume
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                name="pitch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Slider
                        max={100}
                        value={[field.value]}
                        disabled={field.disabled}
                        step={1}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className={`w-full`}
                      />
                    </FormControl>
                    {form.formState.errors["pitch"] && (
                      <FormMessage>
                        {form.formState.errors["pitch"].message}
                      </FormMessage>
                    )}
                    {!form.formState.errors["pitch"] && (
                      <FormDescription>Set Text to speak pitch</FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Slider
                        max={100}
                        value={[field.value]}
                        disabled={field.disabled}
                        step={1}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className={`w-full`}
                      />
                    </FormControl>
                    {form.formState.errors["rate"] && (
                      <FormMessage>
                        {form.formState.errors["rate"].message}
                      </FormMessage>
                    )}
                    {!form.formState.errors["rate"] && (
                      <FormDescription>Set Text to speak pitch</FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                name="isRandom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Slider
                        max={100}
                        value={[field.value]}
                        disabled={field.disabled}
                        step={1}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className={`w-full`}
                      />
                    </FormControl>
                    {form.formState.errors["isRandom"] && (
                      <FormMessage>
                        {form.formState.errors["isRandom"].message}
                      </FormMessage>
                    )}
                    {!form.formState.errors["isRandom"] && (
                      <FormDescription>Set Text to speak</FormDescription>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col justify-end">
              <div className="text-test ">
                <Textarea />
              </div>
              <div className="">Button Speak</div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
