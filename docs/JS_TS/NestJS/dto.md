---
title: DTO (Data Transfer Object)
order: 3
---

## DTO란?

DTO(Data Transfer Object)는 **계층간 데이터 교환**을 하기 위해 사용하는 객체로 비즈니스 로직을 가지지 않고 저장, 검색, 직렬화, 역직렬화 로직만을 가져야한다고 합니다.

계층간 데이터 교환은 계층화 아키텍쳐(Layered Architecture)와 관련있습니다.

![Layered](https://github.com/Zamoca42/blog/assets/96982072/9460d59f-2b48-445c-85ca-23f9b7021520)

- [Nest.js — Architectural Pattern, Controllers, Providers, and Modules.](https://medium.com/geekculture/nest-js-architectural-pattern-controllers-providers-and-modules-406d9b192a3a)

계층화 아키텍쳐는 다음과 같은 계층으로 나뉩니다

- 표현 계층(Presentation Layer)

  - 클라이언트를 통해 요청을 받아 처리하고 응답 결과를 출력
  - 사용자가 요청한 내용을 서비스 계층으로 전달, 처리한 결과를 사용자에게 반환

- 서비스 or 어플리케이션 계층(Service or Application Layer)

  - 비즈니스 로직이 구현되는 계층
  - 요청받은 데이터를 검증, 처리
  - 데이터 접근 계층에 요청을 보내고, 받은 데이터를 가공하여 반환

- 데이터 접근 계층 (Data Access Layer)
  - 데이터 베이스와 상호작용을 담당하는 계층

Nest의 공식문서의 내용과 계층화 아키텍쳐와 연관지어 정리해보면 표현 계층은 Controller, 서비스 계층은 Service, 데이터 접근 계층은 Datebase의 모델과 스키마로 정리해볼 수 있습니다

## Nest에서 데이터 이동, 검증, 변환 사용해보기

Nest에서는 `class-validator`, `class-transformer` 패키지로 데이터가 이동할 때 검증(validation), 변환(transform)할 수 있습니다.

- [Nest-class-validator](https://docs.nestjs.com/pipes#class-validator)
- [class-transformer](https://github.com/typestack/class-transformer)

이전 [로그인 구현하기](./login_module.md)에서 클라이언트 부분에서 Controller로 넘어오는 데이터를 검증하기 위해 DTO를 작성해보겠습니다.

먼저 패키지를 설치합니다

```
$ npm i --save class-validator class-transformer
```

`auth`폴더 아래에 `dto`폴더를 만들고 `auth.dto.ts` 파일을 만듭니다.
그리고 다음과 같이 작성했습니다.

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

하지만 데이터 검증이 완전히 작동하려면 main.ts에서 설정이 필요합니다.

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

ValidationPipe의 옵션은 [공식문서](https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe)에 자세히 설명되어 있습니다

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

`AuthController`에서 local 전략 대신 `LoginRequestDto`를 넣고 클라이언트에서 넘어오는 username과 password를 보겠습니다

username에서 문자열이 아닌 타입이 넘어오면 어떻게 될까요?

![](https://github.com/Zamoca42/blog/assets/96982072/fae68fb2-b407-4fc9-9925-f3550455488c)

username에 "zamoca"대신 숫자 11을 넣으면 `LoginRequestDto`의 username에서 validator에 통과하지 못했기 때문에 `Bad Request Error`가 발생하는 것을 볼 수 있습니다