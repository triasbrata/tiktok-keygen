import React from "react";
import { LoginTiktok } from "../../components/pages/setup/tiktok/login";
import { ExtractTiktokAccount } from "../../components/pages/setup/tiktok/extract-cookies";

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
