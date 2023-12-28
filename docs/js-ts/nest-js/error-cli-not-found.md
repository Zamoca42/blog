---
title: sh 1 nest not found 오류
category:
  - JS & TS
tag:
  - NestJS
  - Error
star: true
---

도커를 이미지화 하거나 배포시 인스턴스에서 `sh: 1: nest: not found`를 자주 보게 되는데
왜 이런 오류가 발생하는지 어떻게 해결했는지 포스트로 기록한다.

![Render로 배포시 발생한 not found 오류](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/bf72345c-c77e-48b3-a173-41d3a702ca19)

## 원인

프로젝트를 도커로 실행하면서 자주 봤던 오류지만 단순히 도커 명령어가 꼬인 것으로 판단했었다.
하지만 배포 단계에서 도커가 아닌 리눅스에서도 같은 오류가 발생한 것을 보면서 도커 명령어는 아닌 것으로 판단하고 왜 이런 오류가 발생했는지 찾아보았다.

[참고 링크](https://stackoverflow.com/questions/55805275/nest-command-not-found)
배포나 개발서버 최초 실행 시 command not found 명령어나 not found가 자주 발생되는데
package.json과 관련이 있었다.

package.json을 보면 `npm run build` 명령어와 `npm run start:dev`로 서버를 실행하게 되는데
여기에 `nest start --watch`같은 NestJS CLI 명령어가 들어가 있다.

![오류가 발생한 프로젝트의 package.json](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/be9c6162-88a3-4b79-adc6-4323e4ea1dae)

## 해결

nest 명령어를 못찾는 이유는 `npm install`시 패키지에 NestJS CLI가 포함되지 않아서였다.
서버를 명령어로 실행할때 패키지에 CLI도 포함이 되어 있어야한다.
다시한번 package.json을 살펴보니 devDependencies에 CLI와 cross-env가 들어가있었다.
devDependencies에 포함된 의존성들은 패키지에 포함되지 않는다.

**package.json**

```json
{
  //...
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "cross-env": "^7.0.3"
    //..
  }
}
```

```json
{
  //...
  "dependencies": {
    // devDependencies에서 dependencies로 이동시킨다.
    "@nestjs/cli": "^10.0.0",
    "cross-env": "^7.0.3"
    //..
  }
}
```

서버 실행 명령어에 필요한 패키지들을 dependencies로 옮겨서 빌드나 배포시에 패키지에 포함하도록 바꾸고
`npm install`을 실행해서 package.json을 업데이트 했다.

![같은 인스턴스의 로그에서 서버가 실행된 것을 확인했다](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/2615a0a2-045f-4e3d-88b8-49cef9c9c52a)
