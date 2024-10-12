import { useWindowUnloadEffect } from "@/components/hooks/use-window-unload";
import { SpeakContextSlice } from "@/context/slices/speak";
import { useZustandState } from "@/context/zustand";
import { useCallback, useEffect } from "react";
import { mergeMap, Subject } from "rxjs";
export const QueueTextToSpeak = new Subject<string>();
export default function TextToSpeak() {
  const {
    isRandom,
    lang,
    volume,
    rate,
    pitch: pich,
  } = useZustandState<SpeakContextSlice>((s) => s);
  const speak = useCallback(
    (text: string) => {
      const speak = new SpeechSynthesisUtterance(text);
      speak.lang = lang;
      speak.volume = volume;
      speak.rate = rate;
      speak.pitch = pich;
      return new Promise<string>((res) => {
        speak.onend = () => res(text);
        window.speechSynthesis.speak(speak);
      });
    },
    [isRandom, lang, volume, rate, pich]
  );
  useWindowUnloadEffect(() => {
    window.speechSynthesis.cancel();
  }, true);
  useEffect(() => {
    QueueTextToSpeak.pipe(mergeMap((text) => speak(text), 1)).subscribe((x) =>
      console.log(`[log] text : ${x} read`)
    );
  }, []);

  return null;
}
