import React from "react";
import { LoginTiktok } from "./_tiktok/login";
import { ExtractTiktokAccount } from "./_tiktok/extract-cookies";

export default function SetupAccountPage() {
  return (
    <div>
      <div className="gap-4 items-center grid">
        <LoginTiktok />
        <ExtractTiktokAccount />
      </div>
    </div>
  );
}
