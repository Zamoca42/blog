import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/DB/": "structure",
  "/JS_TS/": [
    "",
    {
      text: "NestJS",
      prefix: "NestJS/",
      collapsible: true,
      children: "structure",
    },
  ],
  "/Etc/": [
    "",
    {
      text: "코딩 테스트",
      prefix: "Codingtest/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "git",
      prefix: "Git/",
      collapsible: true,
      children: "structure",
    },
    "github-flow",
    "git-flow",
  ],
});
