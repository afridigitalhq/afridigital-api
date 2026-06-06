import React from "react";
import DashboardGrid from "../components/layout/DashboardGrid";
import useDynamicFeed from "../hooks/useDynamicFeed";

import WalletWidget from "../components/home/widgets/WalletWidget";
import JobsWidget from "../components/home/widgets/JobsWidget";
import EarnWidget from "../components/home/widgets/EarnWidget";
import ServicesWidget from "../components/home/widgets/ServicesWidget";
import BoostWidget from "../components/home/widgets/BoostWidget";
import NotificationsWidget from "../components/home/widgets/NotificationsWidget";
import ActivityWidget from "../components/home/widgets/ActivityWidget";

const map = {
  wallet: WalletWidget,
  jobs: JobsWidget,
  earn: EarnWidget,
  services: ServicesWidget,
  boost: BoostWidget,
  notifications: NotificationsWidget,
  activity: ActivityWidget
};

export default function Home() {

  const user = { id: "demo-user" };

  const feed = useDynamicFeed(user);

  return (
    <DashboardGrid>
      {feed.map((item, i) => {
        const Component = map[item.type];
        if (!Component) return null;

        return (
          <div key={i} style={{ gridColumn: "span 6" }}>
            <Component />
          </div>
        );
      })}
    </DashboardGrid>
  );
}
