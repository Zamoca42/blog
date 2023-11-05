---
title: nest에서 class-transformer, validator 사용하기
order: 5
---

## Nest에서 일반 객체를 -> 클래스 인스턴스로 변환

Nest에서 클라이언트에 데이터를 전달할 때 일반 객체를 클래스로 바꿔서 내보내기 위해
`class-transformer`를 사용했습니다.

- [class-transformer](https://github.com/typestack/class-transformer)

```ts
import { Exclude, Expose, Type } from "class-transformer";
import { License } from "./plan-licenses.dto";

@Exclude()
class ExcludePlanModelDto {
  expirationTime: number;

  activationTime: number;

  currencyCode: string;

  amount: number;

  objective: string;

  countrycode: string;

  @Type(() => License)
  licenses: License[];
}

export class PlanDto extends ExcludePlanModelDto {
  @Expose()
  title: string;

  @Expose()
  period: number;

  @Expose({ groups: ["queryParam"] })
  id: string;
}
```

요금제 id를 조회했을 때 요금제 이름과 요금제의 구독 개월 수를 보여주게 DTO를 만들었습니다.
class-transformer를 사용하지 않으면 서비스 로직에서 일일이 매핑을 해줘야겠지만

DTO에서 보여줄 필드는 `@Expose()`를 사용하고 제외할 필드는 `@Exclude()`를 사용해서
서비스로직에서 `plainToClass` 메서드를 사용하는 것으로 일반 객체를 클래스 인스턴스로 바꿔서 내보낼 수 있습니다.

```ts
import { PlainLiteralObject } from "@nestjs/common";
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
} from "class-transformer";

export const toClassInstance = <T>(
  cls: ClassConstructor<T>,
  plain: PlainLiteralObject,
  options?: ClassTransformOptions
): T => {
  return plainToClass(cls, plain, {
    excludeExtraneousValues: true,
    ...options,
  });
};
```

저는 `excludeExtraneousValues`옵션을 true로 사용하기 위해 `plainToClass`를 커스텀해서 사용했습니다.

```ts
@Injectable()
export class CustomerPlanService {
  private readonly planModel: Model<Plan>;

  constructor(private readonly customerService: CustomerService) {
    this.planModel = createPlanModel(tablePrefix);
  }

  async findPlanTitle(planId: string): Promise<PlanDto> {
    const planTitle = await this.planModel.get(planId);
    if (!planTitle) {
      throw new NotFoundException("요금제명을 찾지 못했습니다");
    }
    return toClassInstance(PlanDto, planTitle); // 여기서 객체를 클래스 인스턴스로 변환
  }
}
```

## 왜 일반 객체를 클래스 인스턴스로 바꿔야 할까?

자바스크립트에서 일반 객체(plain object)를 클래스 인스턴스로 변환하여 외부에 전달하는 이유는 뭘까요?

그냥 일반 객체를 매핑해서 보내면 안되는 것인지 고민하던 중에 모던 딥다이브에 [클로저](../deepdive/deepdive24.md)와 [클래스](../deepdive/deepdive25.md)에 관한 챕터에서 그 이유를 알 수 있었습니다.

여러가지 이유가 있겠지만 클래스 인스턴스를 사용하면 객체 내부의 상태나 메서드를 캡슐화해서 외부로부터 상태를 조작하는 것을 방지하는 측면에서 일반 객체를 클래스 인스턴스로 변환한다고 이해했습니다.

## 데이터 검증하기

클라이언트에서 넘어오는 데이터는 어떻게 검증(validation)할 수 있을까요?

class-validator와 global scoped pipes로 원하지 않는 데이터를 제외하고 받아올 수 있습니다.

이전 [로그인 구현하기](./login_module.md)에서 클라이언트 부분에서 Controller로 넘어오는 데이터를 검증해보겠습니다.

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

username에 "zamoca"대신 숫자 11을 넣으면 `LoginRequestDto`의 username에서 validator에 통과하지 못했기 때문에 `Bad Request Exception`이 발생하는 것을 볼 수 있습니다