---
title: vuepress 블로그 만들기(+ 테마)
---

> vuepress 2.x버전을 기준으로 설명합니다.

vuepress로 블로그를 만드는 방법에 대해 알아보겠습니다.
vuepress도 자체도 편리했지만 설정에서 설정이나 다른 부분이 더 필요했습니다.
편리한 기능을 제공하는 테마를 발견해서 사용법도 함께 알아보도록 하겠습니다.

## 프로젝트 시작하기

1. 프로젝트 폴더 만들기

blog란 폴더를 만들고 vscode에서 새 터미널을 열어줍니다.
blog는 깃헙 리포지토리 이름이 됩니다.

```sh
mkdir blog
cd blog
```

2. 프로젝트 시작

```sh
git init
npm init
```

3. vuepress 시작

```sh
npm install -D vuepress@next
```

4. 테마 설치

```sh
npm init vuepress-theme-hope add docs
```

docs 폴더 아래로 테마 설정과 플러그인 기능이 제공됩니다.

5. 정적 웹사이트 미리보기

```sh
npm run docs:dev
```

위 명령어로 블로그를 미리 볼 수 있습니다.

## 깃헙 페이지에 배포

테마를 설치했다면 `.github/workflows`아래에 `deploy-docs.yml` 배포 설정파일이 생성됩니다.
main 브랜치에 변경사항이 생기면 배포가 시작됩니다.

![GitHub Pages 설정 방법](https://github.com/Zamoca42/blog/assets/96982072/b2e50e1d-2314-4900-b360-0f8d6b359a1d)

깃헙 리포지토리에서 Settings - Pages로 이동해서 위의 사진대로 설정을 해주면 github.io 도메인으로 블로그가 생성됩니다.
