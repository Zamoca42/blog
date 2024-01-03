---
title: 서비스 레이어에서 예외처리 분리하기
category:
  - JS & TS
tag:
  - NestJS
  - TypeORM
  - Error
star: true
---

서비스 레이어에서 예외처리를 하고있었는데 [좋은 예외(Exception) 처리][exception-blog]에서
글을 보고 의문이 들어 리팩터링을 진행했는데 포스트로 정리하려고한다.
소제목 파트인 정상적인 흐름에서 Catch 금지, Layer에 맞는 예외 보고 의문이 들기 시작했다.

![어디서 많이 본 로직이 보였다.](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/ef451050-bdfe-4e59-a4c1-7030c6f181aa)

현재 프로젝트에서도 단건으로 조회할 때 데이터가 없으면 바로 예외처리를 해주는 로직으로 설정하고있었다.

```ts
@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  /**
   * @param id - 리뷰 id
   * @desc 해당 리뷰 데이터 조회
   */
  async findOneReviewById(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOneReview(Review.byId(id));
    if (!review) {
      throw new NotFoundException("리뷰를 찾지 못했습니다.");
    }
    return review;
  }
}
```

## 문제

위 리뷰 서비스의 메서드와 블로그의 내용을 읽어보고 드는 문제를 정리하자면 다음과 같다.

1. 정상적인 흐름에서 예외처리되고있다는 점
2. 서비스 레이어에서 HTTP예외를 처리하고 있다는 점

확실히 class-validator에서 검증 decorator를 Dto에서 적용한다고 생각해봤을 때 레이어에 안맞는 예외처리라고 느꼈다.

TypeORM의 예외는 어떻게 처리해야할지 몰라서 HTTP 예외를 서비스 레이어에 적용하는 것을 당연하게 생각했던거 같다.

그렇다면 다음과 같은 두 가지를 목표로 리팩터링 해보려고한다.

1. TypeORM에서 단건 엔티티 조회에 대해 데이터가 없을 때 예외처리
2. 예외처리하는 부분은 서비스 레이어에서 최대한 이동

## TypeORM 예외 필터 적용

TypeOrm 라이브러리에 내장된 Error 인스턴스는 EntityNotFoundError, QueryFailedError 등이 있지만
엔티티를 정상적으로 조회했지만 데이터가 없을 때 만들 수 있는 예외 처리는 EntityNotFoundError를 사용해야한다.

레포지토리에서 findOneOrFail메서드를 사용했을 때 데이터가 없으면 EntityNotFoundError를 발생시킨다.
다음은 존재하지 않는 리뷰를 조회했을 때 나오는 에러 메세지를 가져왔다.

```bash
[DumpInAdmin] Info      2024. 1. 4. 오전 3:07:23 undefined - {
  ip: '::1',
  date: '2024. 1. 4. 오전 3:07:23',
  url: '/api/review/16',
  response: {
    code: 404,
    message: "Could not find any entity of type 'Review' matching: { 'where': { 'id': 16, 'isDeleted': false }, 'relations': { 'reviewConcepts': true, 'reviewImages': true, 'photoBooth': true, 'user': true }, 'select': { 'id': true, 'content': true, 'date': true, 'viewCount': true, 'likeCount': true, 'photoBooth': { 'name': true }, 'user': { 'nickname': true, 'username': true } } }",
    success: false,
    data: ''
  },
   stack: 'EntityNotFoundError: Could not find any entity of type "Review" matching: {\n' +
   #... 스택 트레이스는 생략
```

이렇게 response에 404 Error 적용하려면 EntityNotFoundError 캐치하고
HTTP 예외로 바꿔서 내보내도록 예외 필터를 적용해야한다.

### TypeORM 에러 예외 필터 적용

```ts
@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  /**
   * @param message - exception.message
   * @desc - 정규 표현식을 사용하여 개행 문자 및 빈 공간 제거
   *       - 개행 문자를 공백으로 대체
   *       - 여러 개의 공백을 하나로 축소
   *       - 쌍따옴표를 홑따옴표로 대체
   *       - 문자열 앞뒤의 공백 제거
   */
  private cleanUpMessage(message: string): string {
    return message
      .replace(/(\r\n|\r|\n)/gm, " ")
      .replace(/\s+/g, " ")
      .replace(/"/g, "'")
      .trim();
  }

  public catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const statusCode = HttpStatus.NOT_FOUND; // 404 에러코드
    const cleanedUpMessage = this.cleanUpMessage(exception.message);
    const response = ResponseEntity.EXCEPTION(cleanedUpMessage, statusCode);

    return res.status(statusCode).json(response);
  }
}
```

cleanUpMessage 메서드는 exception.message에 개행문자같은 부분을 제외하기 위해 적용했다.
그리고 단건 조회에서 findOneOrFail 메서드를 적용한다.

```ts
@Injectable()
export class ReviewRepository extends Repository<Review> {
  constructor(private readonly dataSource: DataSource) {
    const baseRepository = dataSource.getRepository(Review);
    super(
      baseRepository.target,
      baseRepository.manager,
      baseRepository.queryRunner
    );
  }

  findOneReview(review: Review): Promise<Review> {
    const options = this.findReviewManyOptions(review);
    return this.findOneOrFail(options);
  }
}
```

이후 서비스 레이어에서는 예외처리를 제외할 수 있다.

```ts
@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  /**
   * @param id - 리뷰 id
   * @desc 해당 리뷰 데이터 조회
   */
  async findOneReviewById(id: number): Promise<Review> {
    // -> 예외 처리 제외
    // if (!review) {
    //   throw new NotFoundException("리뷰를 찾지 못했습니다.");
    // }
    return this.reviewRepository.findOneReview(Review.byId(id));
  }
}
```

## 파이프로 서비스 레이어에서 예외 처리 분리하기

TypeORM에서는 엔티티 관련 예외를 처리했다면 로그인에서 비밀번호 검증 로직같은 예외 처리는 어디로 이동해야할까?
유닛 테스트 포스트에 있는 인증 로직을 가져왔다.

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

비밀번호 검증 로직은 NotFoundException와 함께 서비스 레이어에서 분리하고 파이프에서 적용하려고한다.

### 서비스 로직 분리

비밀 번호 비교 로직과 유저 정보를 가지고 오는 메서드를 분리했다.

```ts
import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { User } from "../user/entity/user.entity";
import { LoginAdmin } from "./dto/post-login.dto";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  /**
   * @param request - 유저 정보 (username, password)
   * @desc - 유저 검증 로직
   *       - props에서 전달받은 비밀번호를 DB에 저장된 정보와 비교
   */
  login(request: LoginAdmin): Promise<User> {
    return this.userService.findOneAdminBy(request.username);
  }

  /**
   * @param request - 유저 정보 (username, password)
   * @param admin - DB에 저장된 유저 정보
   * @desc - 관리자 검증 로직
   *       - credentials에서 전달받은 비밀번호를 DB에 저장된 정보와 비교
   */
  verifyCredentials(request: LoginAdmin, admin: User): Promise<boolean> {
    return User.comparePassword(request.password, admin.password);
  }
}
```

comparePassword는 User 엔티티에 정적메서드로 추가했다.

```ts
export class User extends BaseDateEntity {
  //...
  static comparePassword(
    requestPassword: string,
    dbPassword: string
  ): Promise<boolean> {
    const parsingDBPassword = dbPassword.replace("bcrypt_sha256$", "");
    const hashed = crypto
      .createHash("sha256")
      .update(requestPassword)
      .digest("hex");
    return bcrypt.compare(hashed, parsingDBPassword);
  }
}
```

### 커스텀 파이프 만들기

비밀번호 비교 로직과 유저 정보를 가져와서 세션 정보로 만드는 과정까지를 커스텀파이프로 만들었다.

```ts
@Injectable()
export class AuthPipe
  implements PipeTransform<LoginAdmin, Promise<GetAdminSession>>
{
  constructor(private readonly authService: AuthService) {}

  async transform(value: LoginAdmin) {
    const admin = await this.authService.login(value);
    const isSamePassword = await this.authService.verifyCredentials(
      value,
      admin
    );

    if (!admin) {
      throw new UnauthorizedException(`관리자 정보가 존재하지 않습니다.`);
    }

    if (!isSamePassword) {
      throw new UnauthorizedException(`비밀번호가 일치하지 않습니다.`);
    }

    return new GetAdminSession(admin);
  }
}
```

이렇게 작성하고 컨트롤러에 적용하면 될거같지만, 한가지 문제가 있다.
**AuthService를 인식을 하지못하는 Type에러가 발생한다.**

![401 예외가 발생해야하지만, 비밀번호가 null이라는 TypeError가 발생한다.](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/8e226bfb-0193-4019-bd71-6a596c8dca85)

AuthService를 인식못하는 이유는 [이 코멘트를 보고][this-comment] 의존성 주입이 적용되지 않아서 정도로 이해했다.
그러면 미들웨어에서 `useContainer`사용하면 커스텀으로 만든 파이프나 validator에서 서비스 로직을 가져와서 사용할 수 있게된다.

```ts
import { useContainer } from "class-validator";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  //...
  useContainer(app.select(AppModule), { fallbackOnErrors: true }); // useContainer 적용
  await app.listen(+process.env.APP_SERVER_PORT);
}
bootstrap();
```

### 컨트롤러에 적용

마지막으로 컨트롤러에 `@Body()` 데코레이터에 파이프를 넣으면 `request.body`를 인식해서 파이프가 작동한다.

```ts
import { Controller, Post, Body, Session, HttpCode } from "@nestjs/common";
import { ResponseEntity } from "../common/entity/response.entity";
import { AuthService } from "./auth.service";
import { SwaggerLogIn } from "./swagger/login.decorator";
import { ApiTags } from "@nestjs/swagger";
import { LoginAdmin } from "./dto/post-login.dto";
import { AuthPipe } from "./pipe/auth.pipe";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SwaggerLogIn()
  @Post("login")
  @HttpCode(200)
  async login(
    @Body(AuthPipe) request: LoginAdmin, // Body에서 AuthPipe 적용
    @Session() session: Record<string, unknown>
  ): Promise<ResponseEntity<string>> {
    session.user = request;
    return ResponseEntity.OK(`${request.username}님이 로그인 했습니다.`);
  }
}
```

![UnauthorizedException 확인](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/6720dd07-8425-4521-95ac-c0b8dbfc2398)

![정상적인 로그인 확인](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/ce7dda1e-f8fe-4075-9fd0-e69d11d9afd3)

![세션 데이터가 들어왔는지 확인](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/6663b3de-7b0f-4a5b-9e16-3b9f9a8cb989)

## 참고 링크

- <https://github.com/leosuncin/nest-api-example/blob/master/src/blog/pipes/article.pipe.ts>

- <https://github.com/typestack/class-validator?tab=readme-ov-file#using-service-container>

- <https://docs.nestjs.com/techniques/validation>

- <https://gist.github.com/gsusmonzon/ecd7842495f07594761e40c2758617d0>

- <https://docs.nestjs.com/exception-filters>

[exception-blog]: https://jojoldu.tistory.com/734
[this-comment]: https://github.com/nestjs/nest/issues/528#issuecomment-395338798
