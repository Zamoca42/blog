---
title: 블로그 이전 후기
---

처음 vue-django를 이용해서 기술 블로그를 사용하면서 옵시디언으로 글을 작성해서 블로그에 업로드하고 
GitHub의 TIL 리포지토리에 쓴 글들을 백업하는 과정이 있었는데 업로드 과정이 비효율적이라는 생각이 들었습니다.
점점 공부한 내용을 기록하고 업로드하는 과정이 즐겁지 않아서 업로드 기간이 늘어나고 점점 글을 쓰지 않게 되었습니다.
그래서 업로드 기간이 늘어난 것에 대해 고민을 하다가 vue-django 블로그를 정리하고 GitHub Pages로 블로그를 변경했습니다. 블로그를 바꾸게된 과정과 생각을 이번 글에서 정리해보겠습니다.

## 블로그를 바꾸게 된 계기

### 글을 업로드하는 구조

저는 완벽하게 끝내지 않을거면 시작하지 않고 미루는 버릇을 가지고 있었습니다. 블로그 글을 쓸 때도 여러가지 주제를 하나의 글에 넣으려고 하다보니 포스트는 점점 길어지고 글의 문맥을 다듬고 업로드하는데 더 오랜 시간이 걸리게 되었습니다. 점점 글쓰는게 지치는 작업이 되다보니 글을 업로드하는 기간이 점점 길어져서 짧은글을 나눠서 업로드하는 시스템이 필요하게 되었고, 글을 바로 수정할 수 있고 공부한 것을 기록하는 것에 집중할 수 있는 방법을 찾게 되었습니다.

![한 페이지에 많은 내용을 적으려고 했던 프로젝트 후기 포스트](https://github.com/Zamoca42/blog/assets/96982072/b34bb194-2b5f-4d2d-8a57-d70f4b9f7f00)

### 마크다운

생각보다 프론트 페이지에 추가할 기능들이 많았습니다. 처음에는 마크다운 패키지들만 설치하면 모든게 해결될거라 생각
했지만 마크다운은 마크다운문법만 적용하고 다른 코드 블럭과 언어를 감지해 하이라이팅 해주는 기능, 수학 수식을 추가하려면 katex를 추가해야했고 기능이 필요하면 일일이 패키지를 가져와서 설정해야하는 번거로움이 있었습니다.

### SEO (검색 엔진 최적화)

처음 Route53에 도메인을 등록하고 vue-django 블로그와 연결했을 때는 알아서 구글이 크롤링해갈 것이라고 생각했는데 직접 구글 서치콘솔에 등록하고 크롤링을 요청해야했습니다. 프론트에 사이트맵, robots.txt, 메타태그를 추가하고 구글 서치콘솔에 등록해봤지만 한달이 지나도 검색 인덱싱을 생성하지 못했고 유효성 검사 기간에만 추가로 한달 이상이 걸려서 원인 찾는데 힘들었습니다.

![구글 서치 콘솔 사진](https://github.com/Zamoca42/blog/assets/96982072/ae667de6-3ee6-45b3-96eb-ffa5bf2f4350)

![메인페이지 외에 인덱싱이 생성되지 않음](https://github.com/Zamoca42/blog/assets/96982072/04cd5176-3bfe-477e-9326-0b63c51a1e2a)

### AWS 비용

비용 문제도 있었습니다. 로깅에 보이는 대부분의 호스트가 봇이었고 AWS WAF(Web Application Firewall)로 트래픽을 모니터링 했을 때 봇이 대부분이였습니다. 비록 봇이지만 트래픽에 대한 비용은 나가고 WAF의 비용도 청구되고 있었습니다.

![WAF 모니터링](https://github.com/Zamoca42/blog/assets/96982072/3da29004-d098-4c45-b1db-ca9b7b683684)

## vuepress 블로그 플러그인(+테마) 발견

블로그 관련 플러그인을 찾아보던 중에 vuepress 플러그인 발견했습니다.
SEO, 마크다운 플러그인이 포함된 테마도 발견해서 vuepress에 적용하면 유지보수가 쉬울 것이라 기대하고 리포지토리를 생성하고 직접 사용을 해봤습니다.

- [vuepress 2.x](https://vuejs.press/)
- [vuepress-hope-theme 2.0.0-beta](https://vuepress-theme-hope.github.io/v2/config/frontmatter/blog-home.html)

### GitHub Pages에 배포

GitHub Pages를 이용하면 트래픽과 모니터링 비용이 들지않고 마크다운으로 블로그 페이지를 생성하기때문에 따로 GitHub에 업로드할 필요가 없어서 이전보다 업로드 프로세스 단계가 줄어든다는 장점이 있었습니다.

### 마크다운 기능

테마에서 마크다운 기능에 katex, 코드 하이라이팅, 코드블록 복사와 같은 다양한 기능을 플러그인으로 제공하고 있었습니다.

- [vuepress-plugin-md-enhance](https://vuepress-theme-hope.github.io/v2/md-enhance/guide/)

vuepress에서는 frontmatter을 사용해서 markdown 페이지 내에서 yaml 문법으로 여러 설정이 가능했습니다.
예를 들어, 블로그 홈을 만드려면 README.md를 docs 폴더 아래에 만들고 메타태그에 구글 서치콘솔 인증키를 넣을 수 있습니다.

**docs/etc/readme.md**

```md
---
head:
  - - meta
    - name: google-site-verification
      content: ka-your-google-site-verification
---
```

### SEO (검색 엔진 최적화)

자동으로 사이트맵 생성해주는 플러그인과 페이지가 생성될 때 [메타태그를 자동으로 만들어주는 플러그인](https://vuepress-theme-hope.github.io/v2/guide/advanced/seo.html#default-ogp-generation)이 있습니다.

![vuepress 사이트맵 플러그인으로 생성된 사이트맵](https://github.com/Zamoca42/blog/assets/96982072/887db1b7-b3c5-4093-9868-0b3aa971e19a)

vue-django 블로그보다 빠르게 서치콘솔에 사이트맵을 등록하고 페이지 색인 생성을 시작할 수 있었습니다.

![사이트맵 서치콘솔에 등록](https://github.com/Zamoca42/blog/assets/96982072/f0dfe476-1f09-4ffd-a40b-c75d2c43d058)

![](https://github.com/Zamoca42/blog/assets/96982072/5545733a-2487-451a-8864-f4b31ec57b65)

### 짧은 글을 여러개 작성

마크다운으로 페이지를 생성하고 폴더로 그룹화가 가능해서 폴더 이름으로 주제를 정하고 하위 주제는 마크다운 파일만 생성했습니다. 작은 주제로 나눠서 여러 개의 글을 작성할 수 있었기 때문에 그 날 기록한 것을 바로 업로드할 수 있습니다. 

![딥다이브 스터디한 내용을 당일에 바로 정리](https://github.com/Zamoca42/blog/assets/96982072/0d96edc0-47e3-4f2c-83f2-28f17aa82d78)

## 마무리

vscode로 공부한 내용을 마크다운 파일로 기록하고 커밋 후 main 브랜치에 병합하면 배포 후 블로그 페이지에 보여집니다. 
수정이 필요한 부분은 vscode에서 바로 수정이 가능해서 글쓰는데만 집중할 수 있고 업로드 기간을 짧게 가져가려는 습관이 생기고 길게 글을 써야한다는 부담을 줄일 수 있었습니다. 
