import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  title: "Zamoca Space",
  theme,
  // Enable it with pwa
  // shouldPrefetch: false,
});
