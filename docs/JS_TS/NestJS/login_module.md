---
title: 로그인 구현하기
order: 2
---



React Admin에서 로그인 페이지를 만들고 Nest의 인증 모듈과 연결했을 때의 화면입니다.

![로그인 화면](https://github.com/Zamoca42/blog/assets/96982072/9218fafc-bc81-4780-b22b-4274e3f3ec6b)

공식문서에 나와있는 `passport` 패키지를 사용해보겠습니다.
`passport`는 node.js에서 가장 인기있는 인증 라이브러리로 다양한 인증 전략을 가지고있습니다.

- OAuth(Open Authentication)
- Local
- JWT(Json Web Token)

더 많은 인증 전략이 있지만 이번에는 세션을 기반으로 한 인증 전략인 `passport-local`를 사용하겠습니다

## `passport-local` 설치

```
$ npm install --save @nestjs/passport passport passport-local
$ npm install --save-dev @types/passport-local
```

## 관리자 모듈 만들기

회원을 관리할 관리자를 등록하는 모듈을 만들어줍니다

```
$ nest g module manager
$ nest g service manager
```

그러면 이런 구조가 만들어집니다

|manager/|
|:--|
|\|- manager.controller.ts |
|\|- manager.module.ts |
|\|- manager.service.ts |

그 다음 `ManagerService`에서 임시로 로그인 유저를 만듭니다. 이 부분은 Database를 연결해서 옮겨줄 수있습니다.

**manager/manager.service.ts**
```typescript
import { Injectable } from '@nestjs/common';
import { Manager } from './entities/manager.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ManagerService {
  private readonly managers = [
    {
      userId: 1,
      username: 'zamoca',
      password: 'zamoca1234',
    },
    {
      userId: 2,
      username: 'admin',
      password: 'admin1234',
    },
  ];

  async findOne(managername: string): Promise<Manager | undefined> {
    const manager = this.managers.find(
      (manager) => manager.username === managername,
    );
    if (manager) {
      const hashedPassword = await bcrypt.hash(manager.password, 10);
      return { ...manager, password: hashedPassword };
    }
    return undefined;
  }
}
```

`ManagerModule`에서 `exports`에 `ManagerService`를 추가하면 다른 모듈에서 `ManagerService`를 사용할 수 있습니다. 여기서는 `AuthService` 사용합니다.

**manager/manager.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';

@Module({
  providers: [ManagerService],
  exports: [ManagerService],
})
export class ManagerModule {}
```

## 인증 모듈 만들기

다음은 생성된 관리자가 맞는지 인증하는 모듈을 만듭니다

```
$ nest g module auth
$ nest g controller auth
$ nest g service auth
```

이런 폴더 구조가 생성됩니다

|auth/|
|:--|
|\|- auth.controller.ts |
|\|- auth.module.ts |
|\|- auth.service.ts |

### 유저 검증 추가하기

`AuthService`에서는 사용자를 검색하고 비밀번호를 확인하는 작업을 `validateUser()`에 작성합니다. 

마지막에 로그인을 확인하기 위해 유저 이름을 반환하겠습니다.

**auth/auth.service.ts**
```typescript
import { Injectable } from '@nestjs/common';
import { ManagerService } from '../manager/manager.service';
import { LoginResponseDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private managerService: ManagerService) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<LoginResponseDto | null> {
    const user = await this.managerService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return { username: user.username };
    }
    return null;
  }
}
```
### 로컬 인증 전략 불러오기

다음은 `auth` 폴더에 `passport`의 인증 전략을 따로 `local.strategy.ts`를 만들어 추가합니다.

**auth/local.strategy.ts**
```typescript
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<LoginResponseDto> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

### 모듈 불러오기

`AuthModule`에서 위에서 설치한 passport의 `PassportModule`과 `ManagerModule`을 imports에 넣습니다.

이러면 인증 모듈에서 passport와 관리자 아이디, 비밀번호를 사용할 수 있습니다

**auth/auth.module.ts**
```typescript
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ManagerModule } from '../manager/manager.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [ManagerModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
```

### 로그인 경로 구현

마지막에 `AuthController`에서 `/auth/lgoin` 경로를 구현하고 `@UseGuards(AuthGuard('local'))`를 추가해서

로컬 인증 전략을 불러옵니다

**auth/auth.controller.ts**
```typescript
import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginRequestDto, LoginResponseDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() reqUser: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.validateUser(reqUser.username, reqUser.password);
  }
}
```

## 로그인

이제 Nest를 실행하고 `/auth/login`으로 Post요청을 보내면 확인할 수 있습니다.

![요청 성공](https://github.com/Zamoca42/blog/assets/96982072/3f54e6c7-3935-443e-8eaf-a1f9ed319201)

![요청 실패](https://github.com/Zamoca42/blog/assets/96982072/a6050763-38ee-45a8-af1f-5c12b5bc0790)

인증에 실패하면 401(Unauthorized)에러를 반환하고 성공하면 유저이름을 반환하고 다음페이지로 넘어갑니다

## 정리

![](https://github.com/Zamoca42/blog/assets/96982072/9791d296-88c8-4e40-a178-c22e423c6f78)

로그인을 구현하면서 구성을 플로우차트로 정리했습니다.

:pushpin: React Admin에 대해서는 기회가 되면 블로그에서 다루도록 하겠습니다