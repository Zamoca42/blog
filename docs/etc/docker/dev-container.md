---
title: DevContainer - VSCode(IDE)에서 리눅스 환경으로 개발하고 디버깅하기
---

## DevContainer란 무엇인가?

> [VS Code로 컨테이너 안에서 개발하기](https://ssowonny.medium.com/vs-code%EB%A1%9C-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%EC%95%88%EC%97%90%EC%84%9C-%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0-d8ed0950d69a)

> [Developing inside a Container - vscode 문서](https://code.visualstudio.com/docs/devcontainers/containers)

DevContainer는 주로 Visual Studio Code와 같은 통합 개발 환경(IDE)에서 사용되며, Visual Studio Code의 확장 앱을 통해 손쉽게 구성할 수 있습니다. 이를 통해 프로젝트를 개발하는 동안 개발 환경을 컨테이너 내에서 실행하고 호스트 시스템과 분리시키는 것이 가능합니다.

![VSCode DevContainer 확장 앱](https://github.com/Zamoca42/blog/assets/96982072/5752ba51-596b-4cde-a572-ec0e39f8e8ed)

DevContainer를 설정하려면 프로젝트 루트 디렉토리에 `.devcontainer` 디렉토리를 만들고, 그 안에 Dockerfile 및 환경 설정 파일을 구성해야 합니다.

## 왜 DevContainer인가?

DevContainer를 사용하려고 생각한 이유는 `docker compose up` 명령으로 도커 환경 실행 시 vscode (IDE)에서 디버깅을 할 수 있는 방법이 없었습니다. 추가로 프리온보딩 인턴십 팀프로젝트 회의 중에 OS마다 개발환경이 적용이 안되는 분이 계셨고 그래서 방법이 없을까 검색을 해보던 중에 vscode내에서 도커를 사용하고 개발 환경을 적용해보기 위해 DevContainer를 사용하게 되었습니다.

## 설정 과정

> [DevContainer 만들기 - vscode 문서](https://code.visualstudio.com/docs/devcontainers/create-dev-container)

저는 이미 프로젝트를 생성하고 docker-compose.yml이 설정되어 있어서 이미 설정된 프로젝트를 기준으로 DevContainer를 만들어 보겠습니다.

**미리 설정되어 있는 루트 디렉터리의 docker-compose.yml**

```yaml
version: "3.9"

volumes:
  mongodb: {}

services:
  nest-app:
    container_name: get-your-feeds-NestJS
    build:
      context: .
      dockerfile: docker/local.Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    depends_on:
      - database
    networks:
      - mynetwork
    environment:
      DATABASE_NAME: ${DATABASE_NAME}
      DATABASE_USER: ${DATABASE_USER}
      DATABASE_PASS: ${DATABASE_PASS}
      DATABASE_URI: ${DATABASE_URI}
      NODE_ENV: ${NODE_ENV}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}

  # start the mongodb service as container
  database:
    image: mongo:latest
    container_name: get-your-feeds-mongodb
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongodb:/data/db
    networks:
      - mynetwork
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_INITDB_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_INITDB_ROOT_PASSWORD}

  mongo-express:
    image: mongo-express
    container_name: get-your-feeds-mxpress
    restart: always
    ports:
      - 8081:8081
    networks:
      - mynetwork
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: ${ME_CONFIG_MONGODB_ADMINUSERNAME}
      ME_CONFIG_MONGODB_ADMINPASSWORD: ${ME_CONFIG_MONGODB_ADMINPASSWORD}
      ME_CONFIG_MONGODB_URL: ${ME_CONFIG_MONGODB_URL}

networks:
  mynetwork:
```

### 1. vsode에서 DevContainer 확장앱 설치

![VSCode DevContainer 확장 앱](https://github.com/Zamoca42/blog/assets/96982072/5752ba51-596b-4cde-a572-ec0e39f8e8ed)

### 2. 개발 컨테이너 구성파일 만들기

`F1`을 누르고 vscode의 명령팔레트에서 '개발 컨테이너 구성파일 추가'를 시작합니다.

![개발 컨테이너 구성파일 추가](https://github.com/Zamoca42/blog/assets/96982072/3fe0b87b-0e79-4561-9449-6098b40a4ea9)

![이미 docker-compose.yml이 있다면 확장앱에서 알아서 설정파일을 생성합니다](https://github.com/Zamoca42/blog/assets/96982072/2d6756de-507f-4a02-bf82-c8f611221f2f)

![NestJS 컨테이너를 선택했습니다](https://github.com/Zamoca42/blog/assets/96982072/2fd24bd5-5e79-48fb-9a0f-adfe86ff0eb7)

설정이 완료되면 `.devcontainer` 폴더가 생성되고 하위에 아래와 같은 파일이 생성됩니다.

**.devcontainer/devcontainer.json**

```json
{
  "name": "Existing Docker Compose (Extend)",

  // Update the 'dockerComposeFile' list if you have more compose files or use different names.
  // The .devcontainer/docker-compose.yml file contains any overrides you need/want to make.
  "dockerComposeFile": ["../docker-compose.yml", "docker-compose.yml"]
}
```

**.devcontainer/docker-compose.yml**

```yaml
version: "3.9"
services:
  # Update this to the name of the service you want to work with in your docker-compose.yml file
  nest-app:
    # Uncomment if you want to override the service's Dockerfile to one in the .devcontainer
    # folder. Note that the path of the Dockerfile and context is relative to the *primary*
    # docker-compose.yml file (the first in the devcontainer.json "dockerComposeFile"
    # array). The sample below assumes your primary file is in the root of your project.
    #
    # build:
    #   context: .
    #   dockerfile: .devcontainer/Dockerfile

    volumes:
      # Update this to wherever you want VS Code to mount the folder of your project
      - ..:/workspaces:cached

    # Uncomment the next four lines if you will use a ptrace-based debugger like C++, Go, and Rust.
    # cap_add:
    #   - SYS_PTRACE
    # security_opt:
    #   - seccomp:unconfined

    # Overrides default command so things don't shut down after the process ends.
    command: /bin/sh -c "while sleep 1000; do :; done"
```

### 3. 컨테이너 환경 실행하고 리눅스 터미널 사용하기

설정파일이 생성되었다면 다시 `F1`을 누르고 명령 팔레트로 들어가서 '컨테이너에서 다시 빌드하고 다시 열기'를 선택합니다.

![컨테이너에서 다시 빌드하고 다시 열기](https://github.com/Zamoca42/blog/assets/96982072/c526d910-a923-4987-a2d5-38d1b2376d51)

![원격 탐색기에 컨테이너가 생성된 모습](https://github.com/Zamoca42/blog/assets/96982072/48443c1f-6e06-4fd1-9c7f-a989bcd509ca)

![왼쪽 아래 원격연결이 되었는지 뜹니다. 터미널도 컨테이너의 리눅스 환경으로 실행](https://github.com/Zamoca42/blog/assets/96982072/2db5140c-f1d4-4c30-b734-67e20ea36e94)

### 4. 디버깅 설정하기

왼쪽 사이드바 실행 및 디버그에서 `launch.json` 파일 만들기를 선택하고 Node.js를 선택합니다.

![실행 및 디버그에서 launch.json 만들기](https://github.com/Zamoca42/blog/assets/96982072/fc3de268-94a3-4b87-8c14-59e2ae000511)

![Node.js를 선택](https://github.com/Zamoca42/blog/assets/96982072/25a848e3-94fb-4fff-bd9c-c66f0d9d605b)

`.vscode/launch.json`이 만들어지면 다음과 같이 디버깅 설정을 합니다.

```json
{
  // IntelliSense를 사용하여 가능한 특성에 대해 알아보세요.
  // 기존 특성에 대한 설명을 보려면 가리킵니다.
  // 자세한 내용을 보려면 https://go.microsoft.com/fwlink/?linkid=830387을(를) 방문하세요.
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "디버그: 프로그램 시작",
      "skipFiles": ["<node_internals>/**"],
      "port": 9229,
      "restart": true
    }
  ]
}
```

### 5. 디버깅 하기

`launch.json`까지 설정했다면 디버그를 실행할 수 있습니다.
터미널에서 `npm run start:debug`로 디버그 모드를 실행합니다.
그다음 실행 및 디버그에서 '디버그: 프로그램 시작' 옆의 플레이 버튼을 눌러줍니다.

![Debbuger attached가 되면 디버깅이 가능합니다.](https://github.com/Zamoca42/blog/assets/96982072/cce43faa-86e3-430f-a664-e2e7859c738f)

![브레이크 포인트를 찍고 디버깅이 가능해집니다.](https://github.com/Zamoca42/blog/assets/96982072/a36031b7-6489-4b55-8ee6-e0f1307857f1)

### 6. 컨테이너와 원격 연결 종료하기

원격 연결을 종료하는 방법은 두 가지 방법이 있는 것을 확인했습니다.

1. 왼쪽 아래 원격 컨테이너를 누르고 vscode 명령팔레트에서 원격 연결 닫기로 나가기

![왼쪽 아래 원격 컨테이너 누르기](https://github.com/Zamoca42/blog/assets/96982072/5588f9b5-746d-4158-8b52-ae8520fc32ca)

![원격 연결 닫기 선택](https://github.com/Zamoca42/blog/assets/96982072/d1efc0ac-7ba0-4a82-811b-3c392a681349)

2. 원격 탐색기에서 원격 연결 종료시키기

왼쪽 사이드바에서 원격 탐색기를 선택하고 해당 컨테이너에서 원격 연결을 시작하거나 실행 중인 컨테이너를 종료할 수 있습니다.

![연결 설정 혹은 종료](https://github.com/Zamoca42/blog/assets/96982072/968baff4-4709-4162-b5a1-76ea85b671c9)

## 마무리

컨테이너를 시작할 때 마다 `docker compose up`을 해야하는 과정마저 줄어들고,
리눅스 터미널을 사용해서 디버깅을 해볼 수 있다는 점에서 매력적이였습니다.
같은 팀에서 리눅스를 OS로 쓰시는분이 계시는데 `docker compose up`으로 도커 환경과 연결할 때 DB가 연결되지 않는 현상이 있었습니다.
DevContainer를 사용해서 해결될 수 있으면 더 좋을거 같습니다.