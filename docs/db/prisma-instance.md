---
title: Prisma - 인스턴스 경고 해결하기
description: prisma에서 "warn(prisma-client) There are already 10 instances of Prisma Client actively running." 경고를 해결하는 과정을 다룹니다.
category:
  - DB
tag:
  - Prisma
  - MySQL
  - PlanetScale
star: true
---

Next.js에서 Prisma를 사용하여 로컬 개발 환경에서 작업하다 보면, 터미널에 다음과 같은 경고 메시지가 나타나는 경우가 있다.

```txt
warn(prisma-client) There are already 10 instances of Prisma Client actively running.
```

이 글에서는 이 경고 메시지가 발생하는 이유와 해결 방법에 대해 알아보려고 한다.

## Prisma Client 인스턴스 생성

Prisma Client는 데이터베이스와 상호 작용하기 위한 객체이다.
Prisma는 각 요청마다 새로운 Prisma Client 인스턴스를 생성한다.
이는 Prisma가 데이터베이스 연결을 관리하고 최적화하는 방식 때문이다.

```ts
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
});

export default prisma;
```

## 경고 메시지의 원인

> 참고링크 : <https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices>

친절하게 prisma 공식문서에서 다음의 원인이 발생하는 원인과 해결방법에 대해 알 수 있었다.
next dev와 같이 개발 환경에서 실행 시 Node.js 캐시를 지우게 되고
PrismaClient는 핫 리로드로 인해 새 인스턴스가 초기화 되어 자체 연결 풀을 보유하므로
개발환경을 반복 실행 시 데이터베이스 연결이 불가능해질 수 있다.

실제로 경고메시지를 확인 후 여러번 재시작하게 되면 데이터베이스 연결 오류가 발생하게 된다.

## 해결 방법

이 에러에 대한 해결 방법은 개발 환경에서 PrismaClient의 인스턴스를
전역 객체([globalThis][globalThis])에서 생성하는 것이다.

```ts
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
```

[globalThis]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
