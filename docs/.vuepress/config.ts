import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchPlugin } from "@vuepress/plugin-search";

export default defineUserConfig({
  base: "/",
  title: "Zamoca Space",
  theme,
  plugins: [
    searchPlugin({
      isSearchable: (page) => page.path !== "/",
    }),
  ],
  // Enable it with pwa
  // shouldPrefetch: false,
});
