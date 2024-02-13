---
title: sparse-checkout으로 필요한 디렉터리만 clone하기
category:
  - Infra.
tag:
  - Git
order: 3
---

현재 프로젝트 레포지토리의 디렉터리 구조는 이렇게 되어있다.

> :file_folder: toeic
> ├─ :file_folder: backend/
> ├─ :file_folder: frontend/
> ├─ package-lock.json
> └─ package.json

GitHub repository에서 frontend 디렉터리를 제외한 나머지 파일 및 디렉터리를 clone해서 가져오려면 어떻게 해야할까?

ec2 인스턴스에 서버의 포함된 패키지와 클라이언트에 포함된 패키지까지 설치하면
서버를 구동하는데 불필요한 패키지까지 설치해야하므로 그만큼 효율적이지 못하다.

그래서 frontend 디렉터리를 제외한 나머지만 clone을 해보려고한다.
git에서는 sparse checkout이라는 기능을 제공해 일부 디렉터리만 clone할 수 있도록 지원하고있다.

> <https://git-scm.com/docs/git-sparse-checkout>

git 버전 2.35이상 부터는 `sparse-checkout`이라는 명령어로 설정할 수 있다.
`sparse-checkout` 명령어가 나왔을 당시에는 `init`과 `set`을 모두 호출해야했지만
현재는 `set`으로 `sparse-checkout`을 바로 설정할 수 있다.

## git 레포지토리 초기 설정

이미 존재하는 프로젝트를 clone하는 것이므로 프로젝트 이름의 폴더를 만들어서 진행한다.

```bash
mkdir toeic
cd toeic
```

그리고 해당 폴더에서 git을 시작하고 pull하기전에 clone할 레포지토리 URL을 연결해야한다.

```bash
git init
git remote add origin <project-url>
```

## 필요한 디렉터리만 clone하기

그다음 sparse-checkout을 설정하자.

```bash
git sparse-checkout set 'backend/'
```

이렇게 입력하고 git pull을 하게 되면 전체 디렉터리 중 backend 폴더 하위의 내용들만 받아진다.
하지만 나는 toeic 아래에 있는 package.json도 받아오고 싶어서 특정 폴더를 제외하는 설정을 했다.

```bash
git sparse-checkout set --no-cone '/*' '!frontend/'
```

clone하기를 원하지 않는 디렉터리는 패턴 앞에 `!`를 붙여서 제외하면 된다.

설정이 되어있는지 확인하려면 `list`를 명령어를 사용한다.

![`git sparse-checkout list`로 적용되었는지 확인](https://github.com/Zamoca42/blog/assets/96982072/2d628532-aee9-46dd-99a7-b31e2b4ca403)

여기서 기존 set 설정에서 패턴을 추가하려면 `add`를 사용하면된다.

다시 변경사항을 확실하게 적용하려면 `reapply`를 적용해주자.
그다음 `git pull origin main`을 해보면 내가 원하는 폴더만 받아진 것을 볼 수 있다.

![`ls`로 디렉터리 확인](https://github.com/Zamoca42/blog/assets/96982072/bcb75615-ce04-4880-a55e-92f9aa07e878)

sparse-checkout 설정을 사용하고싶지않다면 `disable`로 다시 전체 폴더를 받아오게할 수 있다.

```bash
git sparse-checkout disbale
```
