import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchPlugin } from "@vuepress/plugin-search";
import { googleAnalyticsPlugin } from "@vuepress/plugin-google-analytics";

export default defineUserConfig({
  base: "/blog/",
  title: "Zamoca Space",
  theme,
  plugins: [
    searchPlugin({
      isSearchable: (page) => page.path !== "/",
    }),
    googleAnalyticsPlugin({
      id: "G-CESFSZCSP4",
    }),
  ],
  head: [
    [
      "link",
      {
        rel: "pretendard",
        href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css",
        crosorigin: "",
      },
    ],
  ],

  // Enable it with pwa
  // shouldPrefetch: false,
});
