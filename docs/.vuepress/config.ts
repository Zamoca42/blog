import { defineUserConfig } from "vuepress";
import { defaultTheme } from "@vuepress/theme-default";

export default defineUserConfig({
  title: "Zamoca Space",
  description: "Today I Learn",
  theme: defaultTheme({
    // set config here
    navbar: [
      // NavbarItem
      { text: "TS", link: "/TS/" },
      { text: "Nest", link: "/Nest/" },
      { text: "Python", link: "/Python/" },
      // NavbarGroup
      {
        text: "Info",
        children: [{ text: "Github", link: "https://github.com/Zamoca42" }],
      },
      // string - page file path
    ],
  }),
});
