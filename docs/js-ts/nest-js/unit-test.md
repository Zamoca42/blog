---
title: Stub을 이용한 단위 테스트 적용하기
category:
  - JS & TS
tag:
  - NestJS
  - Test
---

프로젝트를 진행해보면서 단위(Unit) 테스트를 처음으로 작성해봤는데 작성해보면서 느낀점들을 정리하려고한다.
테스트를 작성할 때 [테스트하기 좋은 코드](https://jojoldu.tistory.com/683?category=1036934)의 시리즈가
많은 도움이 되었다.

## Jest를 이용한 단위 테스트 예시

자바스크립트에는 많은 테스트 프레임워크가 존재하는데 NestJS에서는 기본 테스트 프레임워크로 Jest와 SuperTest를 제공한다.
SuperTest는 superagent 라이브러리를 기반으로 하는 HTTP 테스트 라이브러리로 E2E테스트를 하는데
사용하고 이번에는 Jest를 통해 단위 테스트를 해볼 것이다.

Jest에서 테스트 코드는 `describe()`와 `it()` 구문으로 구성된다.
`describe()`는 테스트 스위트(suite)로 테스트를 의미있는 단위로 묶는다.

테스트 스위트 안의 `it()` 구문으로 특정 테스트 시나리오를 작성한다.
각 `it()` 구문은 별개의 테스트 케이스로 다뤄져야하며 서로 의존관계가 존재하지 않도록 작성하는 것이 중요하다.

테스트 케이스의 작성방법은 이번 포스트에서 Given/When/Then 스타일로 테스트 코드를 작성할 것이다.

- Given

  - 해당 테스트 케이스가 동작하기 위해 갖춰져야하는 선행조건

- When

  - 테스트하고자 하는 대상 코드를 실행
  - '대상 코드가 동작한다면'을 뜻함

- Then

  - 대상 코드의 수행 결과를 판단
  - '기대한 값과 수행 결과가 맞는지'를 비교

## 어떤 것을 테스트 할 것인가

테스트는 테스트를 하고자 하는 대상의 동작에만 집중해서 작성한다.
외부 모듈은 외부 모듈만을 위한 테스트 코드를 작성해야하고 외부 상태에 상관없이
대상 코드의 동작을 살펴보기 위해 임의의 객체를 다루는 것이 테스트 더블(test double)이라고한다.

테스트 더블을 세부적으로 더미(dummy), 페이크(fake), 스텁(Stub), 스파이(spy), 모의 객체(mock)로 나눈다.

위 다섯가지의 설명을 읽어봤지만 세부적인 차이를 정확히 이해한 것은 아니지만 가짜 데이터를 만든다고 이해하면 될거 같다.

이번에는 함수 호출 결과를 미리 준비된 응답으로 제공하는 스텁(Stub)과 모의 객체(Mock)를 단위 테스트에서 주로 사용했다.

## 테스트 코드

현재 프로젝트에서 인증에 관련한 테스트 코드를 예시로 설명하려고 한다.

**src/auth/auth.service.ts**

```ts
import { Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { GetAdminSessionDto } from "../user/dto/get-session-admin.dto";
import { UserService } from "../user/user.service";
import { AdminLogInProps } from "./dto/post-login.dto";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  /**
   * @param props - 유저 정보 (username, password)
   * @desc - 유저 검증 로직
   *       - props에서 전달받은 비밀번호를 DB에 저장된 정보와 비교
   */
  async validateAdminForLogIn(
    props: AdminLogInProps,
    session: Record<string, GetAdminSessionDto>
  ): Promise<boolean> {
    const admin = await this.userService.findOneAdminBy(props);
    const parsingDBPassword = admin.password.replace("bcrypt_sha256$", "");
    const isSamePassword = await bcrypt.compare(
      props.password,
      parsingDBPassword
    );

    if (!isSamePassword) {
      throw new NotFoundException("관리자 정보를 찾지 못했습니다");
    }

    session.user = new GetAdminSessionDto(admin);
    return true;
  }
}
```

DB의 user 테이블에서 가져온 정보를 bcrypt로 비교해서 세션을 넣는 로직이다.
validateAdminForLogIn메서드를 테스트하기 위해서 외부 라이브러리인 bcrypt와
유저 서비스의 findOneAdminBy를 Stub으로 만들었다.

```ts
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import * as bcrypt from "bcrypt";
import { User } from "../user/entity/user.entity";
import { NotFoundException } from "@nestjs/common";
import { UserService } from "../user/user.service";

class MockUserService {
  findOneAdminBy = jest.fn(); // 유저 서비스 Mock
}

describe("AuthService", () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useClass: MockUserService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);

    //Bcrypt Stub
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementation((plain, hashed) =>
        Promise.resolve(`${plain} hashed 12` === hashed)
      );

    // UserService Stub
    jest
      .spyOn(userService, "findOneAdminBy")
      .mockImplementation(({ username }) => {
        if (username === "admin") {
          const savedUser = new User();
          savedUser.username = "admin";
          savedUser.email = "admin@example.com";
          savedUser.password = "admin hashed 12";
          return Promise.resolve(savedUser);
        } else {
          return Promise.reject(
            new NotFoundException("관리자 정보를 찾지 못했습니다")
          );
        }
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });
});
```

그 다음 describe에 테스트할 메서드를 추가하고 테스트 케이스로
성공했을 때, 비밀번호가 틀렸을 때, 관리자 번호가 맞지 않을 때를 케이스로 작성했다.

```ts
//... 위의 코드 생략

describe("validateAdminForLogIn()", () => {
  // Given
  const mockSession = {};
  const getLogInProps = { username: "admin", password: "admin" };

  it("SUCCESS: 어드민 역할을 가진 유저일 때 로그인", async () => {
    // When
    const result = await authService.validateAdminForLogIn(
      getLogInProps,
      mockSession
    );

    // Then
    expect(result).toEqual(true);
  });

  it("FAILURE: 비밀번호가 맞지 않을 때, 404 예외 throw", async () => {
    // Given
    getLogInProps.password = "user";

    // When & Then
    await expect(async () => {
      await authService.validateAdminForLogIn(getLogInProps, mockSession);
    }).rejects.toThrowError(
      new NotFoundException("관리자 정보를 찾지 못했습니다")
    );
  });

  it("FAILURE: 관리자 정보가 존재하지 않을 때, 404 예외 throw", async () => {
    // Given
    getLogInProps.username = "anonymous";

    // When & Then
    await expect(async () => {
      await authService.validateAdminForLogIn(getLogInProps, mockSession);
    }).rejects.toThrowError(
      new NotFoundException("관리자 정보를 찾지 못했습니다")
    );
  });
});
```

## 결과

![`npm run test src/auth/auth.service.ts`로 테스트한 결과](https://github.com/Zamoca42/blog/assets/96982072/6364832a-f584-436f-929b-e09ffbe3208e)

테스트를 작성했을 때의 장점들을 정리해보자면 다음과 같다.

1. 테스트하기 쉬운 코드와 어려운 코드를 분리
2. 로직을 단순화하고 일관성을 지키도록 노력
3. 디버깅 시간을 줄이고 테스트로 빠른 리팩터링 및 코드 작성

아쉬운 점은 단위 테스트만으로는 통과했던 코드들이 API를 호출했을 때는 오류들이 발생했다.
단위 테스트만으로 확인할 수 없는 부분들이 존재해서 통합테스트도 같이 작성을 해야할거 같다.
이 후 목표는 통합테스트를 작성해보고 포스트로 정리해보려고한다.
