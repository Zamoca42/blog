---
title: 자주 사용하는 git 명령어 모음
category:
  - etc.
tag:
  - Git
star: true
---

## 설정

**vscode로 git 설정**

```shell

git config --global core.editor "code --wait"
```

**CRLF 설정**

```shell
git config --global core.autocrlf true #for Windows
git config --global core.autocrlf input #for Mac
```

## 기본

**스테이징에 추가하기**

```shell
git add .
git add filename.txt #stage file
```

**파일 이동**

```shell
git mv from.txt to.txt
git mv from.text /logs/from.text
```

**파일 삭제**

```shell
git rm file.txt # removes file
git rm --cached file.txt #removes from staging area only
```

**커밋**

```shell
git commit #commit stagged files
git commit -m "Commit message" #commit stagged files with commit message
git commit -am "Commit message" #commit all files with commit message
```

**로그 보기**

hash log

```shell
git reflog
```

커밋 로그

```shell
git log
```

## 브랜치

## 스태쉬

## 원격

## 되돌리기
