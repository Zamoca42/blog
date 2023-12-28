---
title: 외부 로거로 효율적으로 모니터링하기
category:
  - JS & TS
tag:
  - NestJS
  - Winston
  - Sentry
star: true
---

로컬에서는 에러가 발생했을 때 터미널에서 로그메세지를 확인할 수 있지만 배포환경에서는 로그를 남겨야 어떤 문제가 발생했는지 알 수 있다.

처음에는 모든 로그를 남겨서 확인하려고했으나 로그를 찾아서 확인하는 것도 번거로운 일이였다.
그래서 예상할 수 있는 예외는 제외하고 심각한 로그를 구분해서 알림을 만드는 것이 필요했다.

## 로그 레벨

로그 레벨은 해당 로그 메세지가 얼마나 중요한지를 알려주는 정보이다.
로그 수준은 로깅 프레임워크들마다 지원하는 로그 레벨들이 조금씩 다르다.
Winston, Sentry, NestJS의 내장로그를 각각 비교했을 때 공통적으로 가지고 있는 레벨은 다음과 같다.

### DEBUG

- 개발 혹은 테스트 단계에서 해당 기능들이 올바르게 작동하는지 확인하기 위한 로그 레벨이다.
- 다른 레벨들과 달리 운영 환경에서는 남기고 싶지 않은 로그 메세지를 위한 레벨이다.

### INFO

- 애플리케이션에서 정상 작동에 대한 정보 즉, 어떤 일이 발생했음을 나타내는 표준 로그 레벨
- 애플리케이션 상태, 설정 또는 외부 리소스와의 상호 작용과 같은 상태 확인을 위한 **이벤트**를 나타낸다.
- INFO 로그는 시스템을 파악하는데 유익한 정보여야만 한다.

### WARN

- 애플리케이션에서 잠재적으로 문제가 될 수 있는 상황일때 남기는 로그 레벨
  - 이런 경우 사용자에게 노출되는 메세지에 상세한 가이드가 필요한 것이지, 로그 레벨이 ERROR일 필요가 없다.

### ERROR

- 애플리케이션에서 발생한 심각한 오류나 예외 상황을 나타내는 로그 레벨
- 기능 자체가 제대로 작동하지 못하는 문제일때 남겨야 하며 즉시 조치가 필요할때를 의미한다.
  - 예를 들어 데이터베이스 연결이 실패한 경우, 내부 시스템의 문제로 결제가 실패하는 경우 등일 경우엔
    ERROR로 남기며 즉시 조치를 취해야 한다.

어떤 로그가 중요한지 구분하는건 개발자의 몫인거 같다.
일반적인 예외처리가된 부분은 Winston으로 파일로 만들어서 남기고
예상치 못하게 발생한 에러는 Sentry로 보내서 알림을 보내게 설정하려고 한다.

## Winston으로 로그 파일 만들기

윈스턴의 설정방법은 [스택 트레이스로 에러 추적하기](./stack-trace.md)에 나와있다.
추가로 로그를 파일로 남기는 설정을 [winston-daily-rotate-file][winston-daily-rotate-file]
패키지를 사용해서 해보려고한다.

winston-daily-rotate-file은 winston 플러그인으로 일일 기반으로 로그 파일을 생성하고,
일정 기간이 지나면 이전 로그 파일을 백업하고 새로운 로그 파일을 시작을 도와주는 패키지다.

### 설치

```bash
npm install winston-daily-rotate-file
```

### 설정

**src/common/config/winston.config.ts**

```ts
import * as winston from "winston";
import { utilities } from "nest-winston";
import * as DailyRotateFile from "winston-daily-rotate-file";

export const consoleTransport = new winston.transports.Console({
  level: process.env.NODE_ENV === "production" ? "info" : "silly",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    utilities.format.nestLike("DumpInAdmin", {
      prettyPrint: true,
      colors: true,
    })
  ),
});

const createFileTransport = (level: string): DailyRotateFile => {
  return new DailyRotateFile({
    level,
    filename: `%DATE%.${level}.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    dirname: "logs" + `/${level}`,
    maxSize: "20m",
    maxFiles: "30d",
  });
};

export const infoLogFileTransport: DailyRotateFile =
  createFileTransport("info");
export const errorLogFileTransport: DailyRotateFile =
  createFileTransport("error");
```

이렇게 운영환경에서 로그를 폴더로 볼 수 있게 설정을 했다.

**src/common/common.module.ts**

```ts
@Module({
  imports: [
    //...
    WinstonModule.forRoot({
      transports: [
        consoleTransport,
        infoLogFileTransport,
        errorLogFileTransport,
      ],
    }),
  ],
  exports: [WinstonModule],
})
export class CommonModule {}
```

**src/main.ts**

```ts
@Module({
  imports: [
    CommonModule,
    //...
  ],
})
export class AppModule {}
```

이렇게 설정하고 서버 인스턴스에서 작동하는지 확인하면 로그 기록을 확인할 수 있다.

![리눅스에서 로그 파일 확인](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/60bfe079-b699-4962-993f-16376d6782c0)

.gz로 압축된 로그의 경우 리눅스에서 `zless`, `zmore` 등의 명령어로 확인가능하고
.log의 경우는 `tail -f` 명령어로 확인가능하다.

![`tail -f 2023-12-28.info.log`로 info 레벨 로그 확인](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/aa09c417-085b-480c-a8f5-6b1f42351127)

## Sentry

[Sentry](https://sentry.io/welcome/)는 에러 모니터링 및 로깅 플랫폼으로,
개발자들이 실시간으로 애플리케이션의 에러를 추적하고 모니터링하는 도구이다.
서비스 자체는 유료이지만, 일정 사용량까지는 무료이므로 error 레벨 수준의 로그가 발생하면 알림을 보내주도록 설정하려고한다.

### 설치

```bash
npm install @sentry/node
```

### 설정

**src/common/config/sentry.config.ts**

```ts
import { NodeOptions } from "@sentry/node";
import "@sentry/tracing";

export const sentryOptions: NodeOptions = {
  dsn: process.env.SENTRY_DSN, // Sentry 설정 참고
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: process.env.NODE_ENV, // 환경에 따라 로그 분리
  debug: process.env.NODE_ENV !== "production",
};
```

**src/common/sentry/sentry.module.ts**

```ts
import { Logger, Module } from "@nestjs/common";
import * as Sentry from "@sentry/node";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "../filter/http-exception.filter";

export const SENTRY_OPTIONS = "SENTRY_OPTIONS";

@Module({})
export class SentryModule {
  static forRoot(options: Sentry.NodeOptions) {
    // initialization of Sentry, this is where Sentry will create a Hub
    Sentry.init(options);

    return {
      module: SentryModule,
      providers: [
        Logger,
        {
          provide: SENTRY_OPTIONS,
          useValue: options,
        },
        {
          provide: APP_FILTER,
          useClass: HttpExceptionFilter,
        },
      ],
    };
  }
}
```

**src/common/common.module.ts**

```ts
@Module({
  imports: [
    SentryModule.forRoot(sentryOptions), // sentry 모듈 추가
    WinstonModule.forRoot({
      transports: [
        consoleTransport,
        infoLogFileTransport,
        errorLogFileTransport,
      ],
    }),
  ],
  exports: [ConfigModule, WinstonModule],
})
export class CommonModule {}
```

### 테스트

설정이 정상적으로 완료되었다면 `Sentry.captureException()`으로 Sentry에서 로그를 확인할 수 있다.
전역 예외 필터에서 captureException을 추가해서 확인해보자.

**src/common/filter/http-exception.filter.ts**

```ts
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: Error, host: ArgumentsHost): Error {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const statusCode = (exception as HttpException).getStatus();
    const getResponse = (exception as HttpException).getResponse();
    const response = ResponseEntity.EXCEPTION(
      getResponse["message"] || "Internal Server Error",
      statusCode
    );
    const stack = exception.stack;
    const log = createLog({ req, stack, response });

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    Sentry.captureException(exception); //Sentry 로그 확인
    this.logger.log(log);
    res.status(statusCode).json(response);
    return exception;
  }
}
```

![기본 로그 레벨이 error이기 때문에 모든 로그가 error로 잡히는 상황](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/7866ff04-79bc-4455-b1a0-072187c2a63b)

만약에 info레벨로 로그를 만들고 싶다면 withScope 메서드를 사용하면된다.
나는 HttpException을 제외한 나머지를 error 레벨로 확인하기 위해 captureException을 이동했다.

**src/common/filter/http-exception.filter.ts**

```ts
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: Error, host: ArgumentsHost): Error {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const statusCode = (exception as HttpException).getStatus();
    const getResponse = (exception as HttpException).getResponse();
    const response = ResponseEntity.EXCEPTION(
      getResponse["message"] || "Internal Server Error",
      statusCode
    );
    const stack = exception.stack;
    const log = createLog({ req, stack, response });

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
      Sentry.captureException(exception); //여기로 이동
    }

    this.logger.log(log);
    res.status(statusCode).json(response);
    return exception;
  }
}
```

exception이 HttpException아닌 에러를 Sentry로 보낸다.
Sentry로 로그가 보내지면 등록한 이메일로 알림을 확인할 수 있다.

![메일로 받은 로그 알림 예시](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/d98fc918-62f5-4cd8-b56e-5d28c471b216)

그 외에도 Sentry는 성능, 스케줄링 모니터링 등 다양한 기능이 있어서. 서버 헬스체크 관련 포스트에서 다뤄보려고한다.

## 참고

:pushpin: NestJS로 배우는 백엔드 프로그래밍 - 한용재

:pushpin: <https://jojoldu.tistory.com/712>

:pushpin: <https://github.com/ericjeker/nestjs-sentry-example>

[winston-daily-rotate-file]: https://github.com/winstonjs/winston-daily-rotate-file
