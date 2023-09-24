import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/DB/": [
    "",
    {
      text: "SQL 첫걸음",
      prefix: "SQL/",
      collapsible: true,
      children: "structure",
    },
  ],
  "/JS_TS/": [
    "",
    {
      text: "NestJS",
      prefix: "NestJS/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "모던 자바스크립트 딥다이브",
      prefix: "JavaScript/",
      collapsible: true,
      children: "structure",
    },
  ],
  "/Etc/": [
    "",
    {
      text: "코딩 테스트",
      prefix: "CodingTest/",
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
