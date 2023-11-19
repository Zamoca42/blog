---
title: 스택 트레이스로 예외 처리 상세보기(feat. winston)
category:
  - JS & TS
tag:
  - NestJS
---

기존의 예외 처리 설정에서는 BadRequestException이 발생하면
오류가 발생한 url이나 메세지 정도는 보여줬지만, 정확한 위치나 내용은 알 수 없었다.

그래서 예외를 상세보는 설정을 추가하면서 내장 로거대신 winston 로거 설정도 해보려고한다.

main.ts

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

app.module.ts

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
            utilities.format.nestLike("DumpInAdmin", { prettyPrint: true })
          ),
        }),
      ],
    }),
  ],
})
export class AppModule {}
```

http-exception.filter.ts

```ts
// module import...

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {} // 로거 사용

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const stack = exception.stack;

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
    this.logger.error(log);

    res
      .status((exception as HttpException).getStatus())
      .json(formattedResponse);
  }
}
```
