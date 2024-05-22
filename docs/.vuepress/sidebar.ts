import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/db/": [
    {
      text: "DB 관련글",
      children: "structure",
    },
  ],
  "/js-ts/": [
    {
      text: "자바스크립트와 타입스크립트 관련글",
      children: "structure",
    },
  ],
  "/etc/": [
    {
      text: "여러가지 주제글",
      children: "structure",
    },
  ],
  "/infra/": [
    {
      text: "인프라 관련글",
      children: "structure",
    },
  ],
});
