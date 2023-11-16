---
title: 예외 처리하기(Exception Filter)
order: 5
category:
  - JS & TS
tag:
  - NestJS
  - TypeScript
---

Nest에는 애플리케이션 전체에서 처리되지 않은 모든 예외를 처리하는 예외 계층(Exceptions Layer)이 내장되어 있습니다.
애플리케이션 코드에서 예외가 처리되지 않으면 이 계층에서 이를 포착한 다음 사용자에게 응답을 내보냅니다.

## 커스텀하기

`http-exception.filter.ts`파일을 만듭니다

다음과 같이 작성합니다

**common/filter/http-exception.filter.ts**

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(
      `Request URL: ${request.url} | Status: ${status} | Message: ${
        exception.message || "Internal server error"
      }`
    );

    if (exception instanceof BadRequestException) {
      response.status(exception.getStatus()).json(exception);
      return;
    }
    response.status(status).json({
      statusCode: status,
      message: exception.message || "Internal server error",
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
```

`Logger`를 불러와서 개발환경에서 예외가 발생했을 때 터미널에서 확인할 수 있습니다.
`response`에서 timestamp를 넣어서 발생시간도 확인할 수 있습니다.

마지막으로 main.ts에서 `useGlobalFilters()`를 추가하면 어플리케이션 전체에서 에러를 확인할 수 있습니다

**main.ts**

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filter/http-exception.filter";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
```

## 예외처리 확인하기

예외가 발생했을 때 URL, 상태코드, 예외메세지를 확인할 수 있습니다.

![exception](https://github.com/Zamoca42/blog/assets/96982072/d610b655-9b5e-4840-acdc-920d0017e534)
