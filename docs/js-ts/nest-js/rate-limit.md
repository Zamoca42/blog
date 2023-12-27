---
title: API 요청 시도 횟수 제한하기
category:
  - JS & TS
tag:
  - NestJS
  - Express
---

외부에서 로그인 시도할 때 횟수에 제약이 없다는 것은 무작위 반복해서 아이디와 비밀번호를 대입해도 막을 방법이 없다.
이를 막을 방법에는 세션에 로그인 시도를 기록하는 방법이 있고, 일정 로그인 횟수 이상으로 시도시 ip를 차단하는 방법도 있을 것이다.

직접 세션에 로그인 시도를 기록해야하는 경우 로직을 가드로 작성해야한다.
한가지 문제는 세션의 경우 세션을 삭제하면 로그인 시도 횟수도 초기화 된다는 것이다.
그래서 로그인 시도에 express-rate-limit을 사용해보기로 했다.

RateLimiting은 시간과 요청횟수를 지정해서 일정 시간이상 요청횟수가 넘어가면 요청을 제한하는 기능이다.
트래픽에 적은 admin 서버에 RateLimiting을 도입하려는 이유는
예전 aws로 블로그를 배포해서 사용했을 때 봇으로 의심되는 요청이 많이 들어와서 서버비용이 나간 경험이 있어서다.
robots.txt를 뚫고 들어오는 봇이라도 횟수를 제한하면 트래픽 비용을 줄일 수 있지 않을까?
로그인 시도도 express-rate-limit으로 제한하고 전체 요청 수도 제한하는 설정을 해볼 것이다.

![글을 작성하는 중에도 수상한 요청이 들어와있다](https://github.com/Zamoca42/blog/assets/96982072/92f42a5f-4940-4738-a07a-d9260bfd9d66)

Nest는 `@nest/throttler`라는 라이브러리로 RateLimiting을 지원하고
express에서는 `express-rate-limit`이라는 라이브러리가 있다.

둘 다 설정하는 방법은 비슷하다. 서버 인스턴스가 여러개로 늘어날 경우, 요청 남은 횟수를 서버 메모리가 아닌
외부 스토리지(예를 들어 레디스)를 적용할 때도 두 패키지 모두 서드파티 라이브러리로 레디스를 적용해야한다.

`express-rate-limit`이나 `@nest/throttler`의 ThrottleGuard든 전역으로 적용해야하면
앱모듈이나 미들웨어에 설정해야한다.
컨트롤러별로 설정을 다르게하려면 `@nest/throttler`가 유리하겠지만 전역으로 적용하려면 둘 다 비슷하다.

결국 `express-rate-limit`을 선택하게 되었는데 이유는 옵션 설정하기 편해보여서다.
어드민 서버는 로드밸런서를 사용 중인데`@nest/throttler`에서는 ThrottleGuard를 상속받아서
[프록시 설정](https://docs.nestjs.com/security/rate-limiting#proxies)을 하라고 공식문서에 나와있다.

`express-rate-limit`의 경우 추가로 설정해줄 필요없이 미들웨어에서 `app.set(trust proxy, 1)` 설정만 추가했다.

```ts
// 다른 모듈들..
import { rateLimit } from "express-rate-limit";

async function bootstrap(): Promise<void> {
  // 다른 설정들...

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 밀리세컨드로 15분
    max: process.env.NODE_ENV === "production" ? 30 : 90, // 배포환경일 때 30회
    message: "요청 횟수가 너무 많습니다. 잠시 후에 시도하세요.", // 요청이 횟수가 넘었을 때 메세지
  });

  app.getHttpAdapter().getInstance().set("trust proxy", 1); // 프록시 서버 세팅
  app.use(limiter); // 전체 url 요청에 적용
  // 다른 app.use들...
  await app.listen(+process.env.APP_SERVER_PORT);
}
bootstrap();
```

전체 경로에 요청이 들어올 때 적용할 리미터 설정을 미들웨어에 설정해줬다.
배포환경일 때는 15분에 30번이고 개발환경에서는 90번으로 적용해줬다.

![Response Header에 x-ratelimit-remaining이 남은 횟수이다.](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/a68ea01c-ba14-47db-b94f-705908ac5f25)

limiter 설정 하나 더 만들어서 로그인 url로 요청이 들어왔을 때의 제한도 걸어주자.

```ts
// 다른 모듈들..
import { rateLimit } from "express-rate-limit";

async function bootstrap(): Promise<void> {
  // 다른 설정들...

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 밀리세컨드로 15분
    max: process.env.NODE_ENV === "production" ? 30 : 90, // 배포환경일 때 30회
    message: "요청 횟수가 너무 많습니다. 잠시 후에 시도하세요.", // 요청이 횟수가 넘었을 때 메세지
  });

  const loginLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 밀리세컨드로 30분
    max: process.env.NODE_ENV === "production" ? 5 : 15, // 배포환경일 때 5회
    message: "로그인 요청 횟수가 너무 많습니다. 잠시 후에 시도하세요.", // 요청이 횟수가 넘었을 때 메세지
  });

  app.getHttpAdapter().getInstance().set("trust proxy", 1); // 프록시 서버 세팅
  app.use(limiter); // 전체 url 요청에 적용
  app.use("/api/auth/login", loginLimiter); // 로그인 경로에 url 횟수 제한
  // 다른 app.use들...
  await app.listen(+process.env.APP_SERVER_PORT);
}
bootstrap();
```

로그인은 30분에 5번으로 타이트하게 걸어줬다.
설정이 겹치는거 같아서 시간설정과 요청횟수를 변수로 만들어봤다.

```ts
// 다른 모듈들..
import { rateLimit } from "express-rate-limit";

async function bootstrap(): Promise<void> {
  // 다른 설정들...
  const maxRequests = process.env.NODE_ENV === "production" ? 5 : 15;
  const minute = 60 * 1000;

  const limiter = rateLimit({
    windowMs: 15 * minute, // 밀리세컨드로 15분
    max: maxRequests * 6, // 배포환경일 때 30회
    message: "요청 횟수가 너무 많습니다. 잠시 후에 시도하세요.", // 요청이 횟수가 넘었을 때 메세지
  });

  const loginLimiter = rateLimit({
    windowMs: 30 * minute, // 밀리세컨드로 30분
    max: maxRequests, // 배포환경일 때 5회
    message: "로그인 요청 횟수가 너무 많습니다. 잠시 후에 시도하세요.", // 요청이 횟수가 넘었을 때 메세지
  });

  app.getHttpAdapter().getInstance().set("trust proxy", 1); // 프록시 서버 세팅
  app.use(limiter); // 전체 url 요청에 적용
  app.use("/api/auth/login", loginLimiter); // 로그인 경로에 url 횟수 제한
  // 다른 app.use들...
  await app.listen(+process.env.APP_SERVER_PORT);
}
bootstrap();
```

![로그인 제한 적용](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/58c9060f-b4ca-4696-9fd7-0800622f6f11)

문제는 로그인을 한 후에도 로그인 시도를하면 여전히 loginLimiter의 설정이 사라지지 않고 남은 횟수가 줄어든다는 것이다.

![로그인 후에도 여전히 로그인 리미터가 적용 (개발 서버)](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/878ad695-a8e1-4d0f-b5f5-2bd6b198f6d5)

물론 클라이언트에서 로그인되어 있을 때 로그인 페이지로 접근 못하게 처리해줄 수도 있겠지만,
`@nest/throttler`에서는 `skipIf`옵션이 있고, `express-rate-limit`에서는
`skip` 프로퍼티를 추가해서 조건부로 리미터를 패스할 수 있다.

```ts
const loginLimiter = rateLimit({
  windowMs: 30 * minute, // 밀리세컨드로 30분
  max: maxRequests, // 배포환경일 때 5회
  message: "로그인 요청 횟수가 너무 많습니다. 잠시 후에 시도하세요.", // 요청이 횟수가 넘었을 때 메세지
  skip: (req) => req.session?.user !== undefined,
});
```

현재 프로젝트에서 로그인시에 세션에 user객체를 생성하기 때문에 세션에 user객체가 있으면 로그인 리미터를 통과하도록 설정했다.

![로그인 후에 다시 로그인 시도를해보면 전체 리미터가 적용된 것을 볼 수 있다.](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/8e560e8c-4e9a-4058-ab37-bc2be37e84cc)

## 참고링크

:pushpin: <https://docs.nestjs.com/security/rate-limiting>
:pushpin: <https://trend21c.tistory.com/2295>
:pushpin: <https://inpa.tistory.com/entry/NODE-%F0%9F%93%9A-API-%EC%82%AC%EC%9A%A9%EB%9F%89-%EC%A0%9C%ED%95%9C%ED%95%98%EA%B8%B0>
