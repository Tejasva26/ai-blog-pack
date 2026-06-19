import { createFileRoute } from "@tanstack/react-router";
import HistoryPage from "./history";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved Projects — SEO Blog Pack AI" }] }),
  component: (HistoryPage as any).options?.component ?? (() => null),
});
