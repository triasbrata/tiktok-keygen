/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ptxa7ja9AhE
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Label } from "@/components/ui/label";
import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { useState } from "react";

type TextareaWithCounterProp = { maxLength: number } & TextareaProps;

export function TextareaWithCounter(props: TextareaWithCounterProp) {
  const [textLength, setTextLength] = useState(
    typeof props.value === "string" ? props.value.length : 0
  );
  return (
    <div className="relative">
      <Textarea
        {...props}
        onChange={(e) => {
          props.onChange(e);
          setTextLength(e.target.value.length);
        }}
      />
      <p className="absolute bottom-2 right-2 text-sm z-20 bg-background px-2">
        <span id="charCount">{textLength}</span>/{props.maxLength}
      </p>
    </div>
  );
}
