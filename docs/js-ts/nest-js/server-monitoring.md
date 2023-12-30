---
title: 서버 상태 모니터링하기
category:
  - JS & TS
tag:
  - NestJS
  - Sentry
---

[외부 로거 도입](./external-logger.md)해서 Sentry로 error 레벨의 로그를 알림을 받도록 했었다.
Sentry의 기능 중에 크론 모니터링 기능이 있어서 NestJS가 지원하는 스케쥴러로 주기적으로 서버 상태를 모니터링하려고 했다.

## 헬스 체크

Nest는 Terminus 헬스체크 라이브러리를 제공한다. Terminus는 다양한 상태 표시기를 제공하며,
현재는 TypeOrm의 상태표시기를 적용해보려고 한다.

### Terminus 설치

```bash
npm install @nestjs/terminus
```

### 적용

컨트롤러를 생성해서 AppModule에 적용했다.

**src/health.controller.ts**

```ts
//...

@ApiTags("헬스체크")
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  async readiness(): Promise<ResponseEntity<HealthCheckResult>> {
    const result = await this.health.check([
      async () => this.db.pingCheck("database", { timeout: 300 }),
    ]);

    return ResponseEntity.OK_WITH<HealthCheckResult>(
      "헬스 체크 결과입니다.",
      result
    );
  }
}
```

앱모듈에 헬스 컨트롤러와 Terminus 모듈을 등록하면 해당 헬스 라우트로 요청가능하다.

**src/app.module.ts**

```ts
//...
import { HealthController } from "./health.controller";
import { TerminusModule } from "@nestjs/terminus";

@Module({
  controllers: [HealthController],
  imports: [TerminusModule],
})
export class AppModule {}
```

### 요청 결과

```json
{
  "code": 200,
  "message": "헬스 체크 결과입니다.",
  "success": true,
  "data": {
    "status": "ok",
    "info": {
      "database": {
        "status": "up"
      }
    },
    "error": {},
    "details": {
      "database": {
        "status": "up"
      }
    }
  }
}
```

## NestJS 스케쥴러

이제 NestJS에서 지원하는 스케쥴러를 등록해 주기적으로 헬스체크를 실행한다.

Node.js에는 Cron과 같은 기능을하는 여러 라이브러리가 있는데 NestJS는 인기 패키지인 node-cron을 통합한
@nestjs/schedule 패키지를 제공한다.

### 설치

```bash
npm install --save @nestjs/schedule
```

### 적용

앱 모듈에 스케쥴 모듈을 등록하고 헬스체크에 적용한다.

**src/app.module.ts**

```ts
//...
import { HealthController } from "./health.controller";
import { TerminusModule } from "@nestjs/terminus";

@Module({
  controllers: [HealthController],
  imports: [TerminusModule, ScheduleModule.forRoot()],
})
export class AppModule {}
```

**src/health.controller.ts**

```ts
//...

@ApiTags("헬스체크")
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  @Cron(CronExpression.EVERY_3_HOURS) // 스케쥴러 등록
  async readiness(): Promise<ResponseEntity<HealthCheckResult>> {
    const result = await this.health.check([
      async () => this.db.pingCheck("database", { timeout: 300 }),
    ]);

    return ResponseEntity.OK_WITH<HealthCheckResult>(
      "헬스 체크 결과입니다.",
      result
    );
  }
}
```

이렇게 크론 데코레이터를 사용해 스케쥴러로 등록할 수 있다.
또 다른 방법으로 애스테리스크(\*)를 이용한 방법도 있다.

```ts
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron("45 * * * * *")
  handleCron() {
    this.logger.debug("Called when the current second is 45");
  }
}
```

```ts
* * * * * *
| | | | | |
| | | | | day of week
| | | | months
| | | day of month
| | hours
| minutes
seconds (optional)
```

### 작동 테스트

스케쥴러가 등록되어있는지 확인하기위해 개발서버에서 30초로 변경 후 확인했다.

![DB로 `SELECT 1` 요청을 보내는 것을 확인할 수 있다](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/62e25d24-ec50-4147-8c25-0bf016abcbb5)

## Sentry 크론 모니터링

Sentry에 Cron기능이 잘 실행되는지 확인하는 Cron Monitors 기능이 있길래 사용해봤다.
만약 서버에서 Cron기능이 실행되지 않았다면 서버에 문제가 있는 것이므로 이메일로 알람이 받을 수 있게 설정하려고한다.
Sentry의 Crons에서 모니터 설정을 해준다.

![모니터 이름과 얼마 주기로 체크하는지 설정한다.](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/d2145fe0-3f1a-4e47-845c-52a909a46c5b)

배포환경(production)에서 모니터링에 이상이 있으면 알림을 보내게 설정했다.
그 다음 헬스체크 컨트롤러에 `captureCheckIn` 메서드를 추가한다.

**src/health.controller.ts**

```ts
//...

@ApiTags("헬스체크")
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  @Cron(CronExpression.EVERY_3_HOURS) // 스케쥴러 등록
  async readiness(): Promise<ResponseEntity<HealthCheckResult>> {
    const result = await this.health.check([
      async () => this.db.pingCheck("database", { timeout: 300 }),
    ]);

    Sentry.captureCheckIn({
      // 모니터링 추가
      monitorSlug: "server-health",
      status: "ok",
    });
    return ResponseEntity.OK_WITH<HealthCheckResult>(
      "헬스 체크 결과입니다.",
      result
    );
  }
}
```

추후 captureCheckIn에서 헬스 체크의 결과에 따라 status를 변경해줄 수도 있을거같다.

![만약 서버에서 Cron이 실행되지 않는다면 missed(노란색)으로 나타낸다.](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/ddd419d5-22b0-4751-92e2-d14b7d52e4ed)
