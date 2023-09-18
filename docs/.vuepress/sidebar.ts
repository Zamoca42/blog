import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/Nest/": [
    "",
    {
      text: "Nest",
      prefix: "Test/",
      collapsible: true,
      children: [""],
    },
  ],
  "/Etc/": [""],
  "/Project/": [""],
  "/DB/": ["", "sql"],
});
