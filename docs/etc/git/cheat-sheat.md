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

**커밋 템플릿 설정**

```shell
git config --global commit.template .gitmessage.txt
```

::: details 커밋 템플릿 예시

.gitmessage.txt

```txt
################
# <타입> : <제목> 의 형식으로 제목을 아래 공백줄에 작성
# 제목은 50자 이내 / 변경사항이 "무엇"인지 명확히 작성 / 끝에 마침표 금지
# 예) Feat : 로그인 기능 추가

# 바로 아래 공백은 지우지 마세요 (제목과 본문의 분리)

################
# 본문(구체적인 내용)을 아랫줄에 작성
# 여러 줄의 메시지를 작성할 땐 "-"로 구분 (한 줄은 72자 이내)
# '왜'라는 것에 초점을 맞춰 작성

# 바로 아래 공백은 지우지 마세요 (본문과 꼬릿말 분리)

################
# 꼬릿말(footer)을 아랫줄에 작성 (현재 커밋과 관련된 이슈 번호 추가 등)
# 해결 -> Closes(종료), Fixes(수정), Resolves(해결)
# 참고 -> Ref(참고), Related to(관련), See also(참고)
# 예) Close #7

################
# Feat : 새로운 기능 추가
# Fix : 버그 수정
# Docs : 문서 수정
# Test : 테스트 코드, 리팩토링 테스트 코드 추가
# Refactor : 코드 리팩토링
# Style : 코드 스타일 변경 (코드 포매팅, 세미콜론 누락 등)기능 수정이 없는 경우
# Ci : CI 설정 파일 수정
# Perf : 성능 개선
# Chore : 빌드 업무 수정, 패키지 매니저 수정 (gitignore 수정 등)
# Rename : 파일 혹은 폴더명을 수정만 한 경우
# Remove : 파일을 삭제만 한 경우
################
```

:::

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

```shell
git commit --amend #마지막 커밋 수정
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

**생성**

```shell
git branch name
git checkout name # 생성한 브랜치로 이동

git checkout -b name #브랜치를 생성하고 해당 브랜치로 이동
```

**확인**

```shell
git branch #브랜치 목록 확인
git branch -r #원격 브랜치 확인
git branch --all #모든 브랜치 확인
```

**원격 브랜치 관리**

```shell
git push --set-upstream origin branchname #로컬 브랜치를 원격으로 push
```

**Merge, Rebase, Squash**

```shell
# 다른 브랜치에서
git merge --no-ff feat/name #브랜치 커밋 기록을 모두 남기고 병합
git merge --squash feat/name #하나의 브랜치 커밋 기록만 남기고 병합

# 보통 충돌시에 사용
git merge --continue
git merge --abort
```

Rebase는 말 그대로 base를 바꾼다라고 이해하면 편하다.

```shell
git rebase main #main 브랜치로 지금 브랜치의 내용들을 이동
```

**필요한 커밋만 가져오기**

```shell
git cherry-pick hash
```

## 원격 설정

**레포지토리 연결**

```shell
git clone URL #URL - https://github.com/zamoca42/blog.git
git remote -v #원격으로 연결된 레포지토리 주소 확인
```

**레포지토리 추가**

```shell
git remote add name URL #새로운 원격 레포지토리 주소를 추가
```

**동기화**

```shell
git pull #데이터를 가져오고 병합
git push #원격 브랜치에 데이터 전송
git push origin main # 원격 브랜치와 로컬 main 브랜치 연결
```

## 임시 저장(Stash)

**스테이지 내용을 저장**

```shell
git stash
```

**stash 확인**

```shell
git stash list #목록으로 보기
```

**내용 가져오기**

```shell
git stash apply #마지막으로 저장한 stash 가져오기
git stash apply hash #특정 목록에 저장된 stash 가져오기
```

**삭제**

```shell
git stash clear #저장된 stash 전부 삭제
git stash drop hash #특정 stash 삭제
```

## 되돌리기

`reset` 명령어를 사용해서 되돌린 커밋은 기록 자체를 남기지 않는다

**Reset**

```shell
git reset --soft HEAD #커밋을 되돌리고 되돌린 내용은 stage로 보냄
git reset --hard HEAD #커밋을 되돌리고 내용도 삭제
```

**Revert**

`revert`는 되돌린 코드를 커밋으로 남긴다.

```shell
git revert hash
```
