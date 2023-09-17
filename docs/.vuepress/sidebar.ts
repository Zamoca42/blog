import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/Nest/": [
    "",
    "middle",
    "start",
    {
      text: "Nest",
      prefix: "Test/",
      collapsible: true,
      children: ["README", "2-start"],
    },
  ],
  "/Etc/": [""],
  "/Project/": [""],
});
