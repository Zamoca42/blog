---
title: 댓글 기능(giscus) 설정하기
order: 4
---

[giscus 설정 방법](https://giscus.app/ko)

## 리포지토리 discussions 활성화

## 설정 따라해보기

## config에 넣기

```html
<script
  src="https://giscus.app/client.js"
  data-repo="zamoca42/blog"
  data-repo-id="your-repo-id"
  data-category="Announcements"
  data-category-id="DIC_your-category_id"
  data-mapping="og:title"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="preferred_color_scheme"
  data-lang="ko"
  crossorigin="anonymous"
  async
></script>
```

**./docs/.vuepress/theme.ts**

```ts
  plugins: {

    // You should generate and use your own comment service
    comment: {
      provider: "Giscus",
      repo: "zamoca42/blog",
      repoId: "your-repo-id",
      category: "Announcements",
      categoryId: "DIC_your-category_id",
      mapping: "og:title"
    },
  }
```

## 댓글 기능 테스트

배포가 완료되었다면 테스트

![discussions 사진]()