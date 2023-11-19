---
title: 스택 트레이스로 예외 처리 상세보기(feat. winston)
category:
  - JS & TS
tag:
  - NestJS
---

기존의 예외 처리 설정에서는 BadRequestException이 발생하면
오류가 발생한 url이나 메세지 정도는 보여줬지만, 정확한 위치나 내용은 알 수 없었습니다.

스택 트레이스를 넣어보면서 에러의 위치나 내용을 자세히 넣는 기능을 넣어보고
내장 로거대신 winston 로거 설정을 추가해서 읽기 좋은 로거를 만들어 보려고 합니다.

## 스택 트레이스란?

스택 트레이스는 예외가 어디에서 발생했는지, 어떤 함수 호출 순서가 예외를 유발했는지 등을
나타내는 정보를 로그에 추가해 디버깅 및 예외 추적 시 도움이 됩니다.
NestJS에서는 Error 객체에 stack 프로퍼티를 사용해서 스택 트레이스를 볼 수 있습니다.

## 예외 처리에 스택 트레이스 넣기

기존의 예외 처리 필터에서 `const stack = exception.stack;`로
스택 트레이스 설정을 추가하고 하단의 로거에 추가해보겠습니다.

**http-exception.filter.ts**

```ts
// module import...

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {} // 로거 사용

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const stack = exception.stack; // 스택 트레이스 설정

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const statusCode = (exception as HttpException).getStatus();
    const response = (exception as HttpException).getResponse();
    const formattedResponse = {
      code: statusCode,
      message: response["message"] || "Internal Server Error",
      success: false,
      data: "",
    };

    const log = {
      url: req.url,
      formattedResponse,
      stack,
    };
    this.logger.error(log); // 로거 사용

    res
      .status((exception as HttpException).getStatus())
      .json(formattedResponse);
  }
}
```

![내장 로거로 본 예외 처리 로그](https://github.com/Zamoca42/blog/assets/96982072/4479d4f1-90a5-4181-979f-9b3aed73d9fe)

이제 요청한 url에서 예외가 발생하면 어디서 예외가 발생했는지 볼 수 있지만 읽기는 불편한거 같습니다.
여기서 내장 로거 대신 winston 로거로 좀 더 읽기 좋게 만들어 보겠습니다.

## winston 로거 설정

윈스턴 로거를 사용하기 위해 `winston`과 `nest-winston` 패키지가 필요합니다.

```bash
npm install winston nest-winston
```

그 다음 AppModule에서 winston 로거 모듈을 불러와서 설정했습니다.

`utilities.format.nestLike` 옵션으로 로그에서 보일 이름과
prettyPrint로 스택을 정렬해서 볼 수 있고

`level`에서 로그 레벨을 설정할 수 있습니다.

**app.module.ts**

```ts
import { utilities, WinstonModule } from "nest-winston";
import * as winston from "winston";

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === "production" ? "info" : "silly",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            utilities.format.nestLike("project-name", { prettyPrint: true })
          ),
        }),
      ],
    }),
  ],
})
export class AppModule {}
```

그 다음 미들웨어에서 `bufferLogs: true`와 `app.useLogger` 설정을 해주면
전역으로 winston 로거를 사용할 수 있습니다.

**main.ts**

```ts
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  //...

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(3000);
}
bootstrap();
```

![winston 로거를 사용하고 예외 발생 시](https://github.com/Zamoca42/blog/assets/96982072/02a8ac9b-7feb-4c6b-9ace-92a52604f972)

NestJS를 구동하면 터미널에 윈스턴 모듈에서 설정했던 이름이 나오고
예외 발생 시 정렬된 스택 트레이스를 볼 수 있습니다.
