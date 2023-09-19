---
order: 1
---

# 프로젝트 시작하기

## 소개

Nest(NestJS)는 Node.js에 기반한 프레임워크로 Express나 Fastify를 사용하여 동작합니다

#### with Express (default)

```typescript
import * as session from 'express-session';

// somewhere in your initialization file
app.use(
  session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
  }),
);
```

#### with Fastify
```typescript
import secureSession from '@fastify/secure-session';

// somewhere in your initialization file
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
);
await app.register(secureSession, {
  secret: 'averylogphrasebiggerthanthirtytwochars',
  salt: 'mq9hDxBVDbspDR6n',
});
```

NestJS는 데이터베이스, ORM, 설정(Configuration), 유효성 검사 등 수많은 기능을 기본 제공하고 있습니다. 그러면서도 필요한 라이브러리를 쉽게 설치하여 기능을 확장할 수 있는 Node.js 장점은 그대로 가지고 있습니다.

## 프로젝트 생성

프로젝트를 시작하려면 처음 사용하는 경우 Nest CLI를 이용하여 새 프로젝트를 만듭니다
터미널에서 [Nest CLI](https://docs.nestjs.com/cli/usages)명령을 이용해 프로젝트에 필요한 모듈 생성, 앱 실행, 컴파일, 빌드가 가능합니다


```cli
$ npm i -g @nestjs/cli
$ nest new 프로젝트 이름
```

`nest new` 명령어를 사용하면 타입스크립트를 기본 언어로 프로젝트가 만들어집니다.

다음 주제부터는 공식문서를 참고하여 회원 관리페이지를 만들어보겠습니다.

## 참고 링크

프로젝트에서 생성된 `module`, `service`, `controller`의 역할은 공식문서를 참고바랍니다

:pushpin: [module](https://docs.nestjs.com/modules)
:pushpin: [service](https://docs.nestjs.com/providers)
:pushpin: [controller](https://docs.nestjs.com/controllers)