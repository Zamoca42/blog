---
title: 요청 객체 역직렬화하기 (class-validator)
order: 5
category:
  - JS & TS
tag:
  - NestJS
---

## 데이터 검증하기

클라이언트에서 넘어오는 데이터는 어떻게 검증(validation)할 수 있을까?

class-validator와 global scoped pipes로 원하지 않는 데이터를 제외하고 받아올 수 있습니다.

이전 로그인 구현하기에서 클라이언트 부분에서 Controller로 넘어오는 데이터를 검증해보겠습니다.

`auth`폴더 아래에 `dto`폴더를 만들고 `auth.dto.ts` 파일을 만듭니다.
예제는 NestJS 문서를 참고했습니다.

**auth/dto/auth.dto.ts**

```typescript
import { IsString, MinLength, MaxLength } from "class-validator";

export class LoginRequestDto {
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(15)
  password: string;
}

export class LoginResponseDto {
  username: string;
}
```

`LoginRequestDto`에서 클라이언트에서 넘어온 데이터가 문자인지 그리고 최소길이, 최대길이를 만족하는지 decorator를 통해 검증합니다.

데이터 검증이 완전히 작동하려면 `src/main.ts`에서 설정이 필요합니다.

**src/main.ts**

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(3000);
}
bootstrap();
```

전체 프로젝트에서 DTO의 validation이 작동할 수 있게 `useGlobalPipes`를 통해서 설정했습니다.
다른 모듈이 생성되더라도 따로 설정해줄 필요없이 validation이 가능합니다.

- [Global-scoped-pipes](https://docs.nestjs.com/pipes#global-scoped-pipes)

`ValidationPipe`는 validator가 작동할 때 어떻게 동작할지 설정할 수 있습니다.

ValidationPipe의 옵션은 [공식문서][document]에 자세히 설명되어 있습니다

**auth/auth.controller.ts**

```typescript
import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { LoginRequestDto, LoginResponseDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() reqUser: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.validateUser(reqUser.username, reqUser.password);
  }
}
```

`AuthController`에서 local 전략 대신 `LoginRequestDto`를 넣고
클라이언트에서 넘어오는 username과 password를 보겠습니다

username에서 문자열이 아닌 타입이 넘어오면 어떻게 될까요?

![validator](https://github.com/Zamoca42/blog/assets/96982072/fae68fb2-b407-4fc9-9925-f3550455488c)

username에 "zamoca"대신 숫자 11을 넣으면 `LoginRequestDto`의 username에서 validator에
통과하지 못했기 때문에 `Bad Request Exception`이 발생하는 것을 볼 수 있습니다

[document]: https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe
