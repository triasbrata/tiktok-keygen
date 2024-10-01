import { useTheme } from "next-themes";
import React from "react";

export default function WindowBar() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="h-[36px] w-full">
      <div className="flex flex-row">
        <div>File</div>
        <div>Edit</div>
        <div>Selection</div>
        <div>
          <button onClick={() => setTheme("light")}>Light Mode</button>
          <button onClick={() => setTheme("dark")}>Dark Mode</button>
        </div>
      </div>
    </div>
  );
}
