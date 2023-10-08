---
title: GitHub Actions 사용해서 배포 자동화 하기
order: 2
---

> [https://docs.github.com/ko/actions](GitHub Actions 공식 문서)

Github Actions에 대해 간단히 설명하면 테스트 및 배포 파이프라인을 자동화할 수 있는 CI/CD 플랫폼입니다. 레포지토리에서 push같은 이벤트가 일어날 때, workflow를 통해 작업이 실행되는 자동화 프로세스로 각 작업은 자체 가상머신을 사용하여 실행됩니다.

이번에는 GitHub Actions를 사용해서 AWS EC2에는 서버를 배포하고 S3에는 정적 웹페이지에 배포를 자동화 해보겠습니다.

## 워크플로우 정의

워크플로우는 GitHub 리포지토리 최상위에서 `.github/worflows`폴더를 만들고
YAML 파일에 의해 정의합니다.

워크플로우를 설정할 때 다음과 같은 기본 구성 요소가 포함되어야 합니다.

### 1. 트리거 

트리거는 워크플로가 실행되도록 하는 이벤트입니다. 이러한 이벤트는 다음과 같습니다.

- 리포지토리에서 발생하는 이벤트 (예: main 브랜치에 push 했을 때)
- 수동
- 예정된 시간

### 2. 작업, 가상머신

작업을 설정한 예제를 보겠습니다.

```yaml
jobs:
  example-job:
    runs-on: ubuntu-latest
    steps:
      - name: Retrieve secret
        env:
          super_secret: ${{ secrets.SUPERSECRET }}
        run: |
          example-command "$super_secret"
```

jobs 하위에 `example-job`로 작업 이름를 설정했습니다.
`runs-on`으로 가상머신의 OS를 설정하고, 그 다음 리포지토리에서 설정한 secrets를 가져온 예제입니다.

가상머신은 
[GitHub Actions에서 지원하는 가상머신](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#choosing-github-hosted-runners)을 사용할 수 있습니다.

리눅스 ubuntu, MacOS, Window를 설정할 수 있고 대쉬(-)뒤에 버전을 설정할 수 있습니다. 또는 자체 호스팅을 해줄 수도 있습니다.

### 3. 각 단계에서는 사용자가 정의한 스크립트

위의 예제에서 jobs와 작업 이름을 설정하고 steps아래에 `name`과 `run`을 여러개 설정하면 순서대로 실행이 됩니다.

아래는 앞으로 알아볼 AWS S3 배포 설정 중 일부를 가져와봤습니다.

```yaml
jobs: 
  deploy: # GitHub-hosted runners env
    runs-on: macos-latest # using MacOS

    defaults:
      run:
        working-directory: "frontend" # frontend 폴더에서 실행

    steps:
      - uses: actions/checkout@v3
      
      - name: Set Node.js 18.x
        uses: actions/setup-node@v3
        with:
          node-version: 18.x

      - name: Install dependencies
        run: npm install

      - name: Build page
        run: npm run build
```
위의 작업 과정을 요약하면 다음과 같습니다.

1. Node.js 불러오기
2. 필요한 패키지 설치
3. 빌드 실행

이렇게 `steps` 아래에 여러개의 명령을 설정할 수 있습니다.

## 워크플로우 만들기

레포지토리 안에서 `.github/workflows` 디렉토리를 만들어서 작업을 생성할 수 있습니다.
서버는 Django-EC2.yml, 프론트는 vue-S3.yml로 파일을 만들어서 배포를 담당해줬습니다.

![서버와 프론트 배포 워크플로우 파일을 만들기](https://github.com/Zamoca42/vue-django-blog/assets/96982072/2932c13c-9d50-4bac-be93-12cbf1e59b35)

설정파일을 만들고 레포지토리에 push해주면 리포지토리의 Acitons탭에서 확인할 수 있습니다.

![vue-django-blog의 Actions탭 확인](https://github.com/Zamoca42/vue-django-blog/assets/96982072/a0fa6037-e966-4af0-a6a4-e7802958a577)

## Secret 등록

워크플로우를 실행하는 과정에서 AWS의 EC2나 S3에 접근해서 배포하려면 AWS의 계정에서 발급한 액세스 키가 필요합니다.
액세스 키는 AWS에 접근할 수 있는 권한이기 때문에 직접 키를 노출하면 보안 이슈가 발생할 수 있습니다.
따라서 Github Secret을 이용해 액세스 키를 저장한 다음 환경변수처럼 불러와서 워크플로우에 사용할 수 있습니다.

![Actions를 사용할 리포지토리에서 Secrets 환경변수 등록](https://github.com/Zamoca42/vue-django-blog/assets/96982072/52f8a752-7904-465f-8961-0626e14f99e8)

키를 발급받는 방법은 [AWS 문서](https://docs.aws.amazon.com/ko_kr/singlesignon/latest/userguide/what-is.html)에 자세히 나와있습니다. 

AWS에서 키 발급하고 screts에 등록하기까지 다음과 같은 과정이 필요합니다.

### 1. AWS IAM

### 2. 권한 정책에 Github Actions에 사용할 권한 추가

### 3. 키와 액세스 키를 Github 레포지토리 리포지토리 Actions에 등록
