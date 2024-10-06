import { useEffect, useRef } from "react";

export const useWindowUnloadEffect = (
  handler: () => void,
  callOnCleanup: boolean
) => {
  const cb = useRef(handler);

  useEffect(() => {
    const handler = () => cb.current();
    window.addEventListener("beforeunload", handler);

    return () => {
      if (callOnCleanup) handler();

      window.removeEventListener("beforeunload", handler);
    };
  }, [callOnCleanup]);
};

export const useWindowUnloadEffectNext = (
  handler: () => () => void,
  callOnCleanup: boolean,
  dependency?: any[]
) => {
  dependency = [
    callOnCleanup,
    ...(Array.isArray(dependency) ? dependency : []),
  ];
  useEffect(() => {
    const unsub = handler();
    window.addEventListener("beforeunload", unsub);

    return () => {
      if (callOnCleanup) unsub();

      window.removeEventListener("beforeunload", unsub);
    };
  }, dependency);
};
