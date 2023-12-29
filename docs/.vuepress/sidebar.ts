import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/db/": [
    "",
    {
      text: "SQL 첫걸음",
      prefix: "sql/",
      collapsible: true,
      children: "structure",
    },
    "dynamoose",
    "query-range",
    "typeorm",
  ],
  "/js-ts/": [
    "",
    {
      text: "NestJS",
      prefix: "nest-js/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "모던 자바스크립트 딥다이브",
      prefix: "deepdive/",
      collapsible: true,
      children: "structure",
    },
  ],
  "/etc/": [
    "",
    {
      text: "코딩 테스트",
      prefix: "coding-test/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "git",
      prefix: "git/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "GitHub Actions로 배포 자동화",
      prefix: "github-actions/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "회고",
      prefix: "retrospect/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "Docker",
      prefix: "docker/",
      collapsible: true,
      children: "structure",
    },
    "grafana-prometheus-in-django",
    "github-flow",
    "git-flow",
  ],
});
