import { APP_CONFIG } from "@/lib/config";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { DeviceFrameLayout } from "@/components/layout/device-frame-layout";
import { FullCanvasLayout } from "@/components/layout/full-canvas-layout";
import { SplitShowcaseLayout } from "@/components/layout/split-showcase-layout";

const layoutMap: Record<
  string,
  React.ComponentType<{ children: React.ReactNode }>
> = {
  "dashboard-app": SidebarLayout,
  "mobile-app-preview": DeviceFrameLayout,
  "multi-screen-walkthrough": DeviceFrameLayout,
  "landing-page": FullCanvasLayout,
  "admin-console": FullCanvasLayout,
  "split-panel-demo": SplitShowcaseLayout,
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Layout = layoutMap[APP_CONFIG.demoFormat] ?? SidebarLayout;
  return <Layout>{children}</Layout>;
}
