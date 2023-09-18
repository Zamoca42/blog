# merge

git에서 브랜치와 다른 브랜치를 합치는 명령어가 `merge`

## merge 명령어

브랜치와 다른 브랜치를 합치기 위해서 최종으로 합치고싶은 브랜치로 이동

예를 들어, `post`라는 브랜치와 `main`이라는 브랜치가 존재

`main`에 `post`를 합치고 싶다면 `main` 브랜치로 이동

```
git checkout main
```

`main`브랜치에서 `post`를 합치기

```
git merge post
```

![TypicalMerge](https://github.com/Zamoca42/blog/assets/96982072/089fcd33-72e2-4753-81c3-90ad3aa8d238)

브랜치 분기 후에 두 브랜치에서 commit한 기록이 있으면 로그가 전부 생성

## fast-forward

![FastForwardMerge](https://github.com/Zamoca42/blog/assets/96982072/535ff5bc-07b0-4375-9c47-3126a8dd2782)

브랜치 분기 후 다른 브랜치에 아무런 커밋이 없다면 merge 할 때 fast-forward 방식으로 merge

별도의 merge 기록 없이 원래 브랜치에서 작업한 것처럼 HEAD만 이동

## no-fast-forward (--no-ff)

![FastForwardMergeWith_no_ff](https://github.com/Zamoca42/blog/assets/96982072/8589cfc7-278a-4fbd-a08f-605b148e89d3)

로컬에서 merge Pull Request와 같이 merge commit을 만들고 싶다면 `--no-ff` 옵션 추가