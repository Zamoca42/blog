---
title: 전역 로거 사용하기
category:
  - JS & TS
tag:
  - NestJS
---

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
