import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchPlugin } from "@vuepress/plugin-search";
import { googleAnalyticsPlugin } from "@vuepress/plugin-google-analytics";

export default defineUserConfig({
  title: "Zamoca Space",
  theme,
  plugins: [
    searchPlugin({
      isSearchable: (page) => page.path !== "/",
    }),
    googleAnalyticsPlugin({
      id: "G-CESFSZCSP4",
    }),
    googleAnalyticsPlugin({
      id: "G-2JERBGBCM8",
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
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;700&display=swap",
        rel: "stylesheet",
      },
    ],
  ],
  // Enable it with pwa
  // shouldPrefetch: false,
});