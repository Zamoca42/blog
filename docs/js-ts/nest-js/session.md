---
title: 세션 쿠키 인증/인가
category:
  - JS & TS
tag:
  - NestJS
  - Express
---

NestJS에서 [express-session][express-session]으로 세션 인증을 구현해보면서 알게된 점을 정리해보려고 합니다.

## 세션 동작 과정

- 참고링크:
  - <https://okky.kr/questions/680128>
  - <https://inpa.tistory.com/entry/EXPRESS-%F0%9F%93%9A-express-session-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4>

두 가지 링크를 참고해서 세션 동작과정을 정리했습니다.

1. 클라이언트에서 로그인 정보를 서버에 전송

2. 서버에서 DB를 조회하여 로그인 정보 일치여부를 확인

3. 일치할 경우 response에 set-cookie 설정하여 클라이언트에 session-cookie로 세션ID 부여

4. 클라이언트가 로그인이 필요한 요청을 보냄

5. 서버에서는 클라이언트에서 보낸 세션ID를 확인하고 DB에서 조회

6. true일 경우 요청에 대한 응답을 정상적으로 반환 (200 OK)

7. false이거나 세션ID가 없을경우 Error 반환

1~3은 로그인 과정이고 NestJS에서 login 메서드를 만들 예정입니다.
4~7은 로그인 후 다른 API를 요청할 때 로그인을 확인하는 기능으로 UseGuard를 사용해서 로그인 여부를 체크합니다.

그 다음 세션을 저장할 DB로 메모리 스토어 대신 postgreSQL을 연결해보겠습니다.

## express-session 모듈

express-session은 세션관리용 미들웨어입니다. 로그인 등의 이유로 세션을 구현하거나,
특정 사용자를 위한 데이터를 임시로 저장할때 유용합니다. 세션은 req.session 객체 안에 유지됩니다.
쿠키의 경우 암호화해서 클라이언트에 전달합니다.

```js
app.use(cookieParser(process.env.COOKIE_SECRET);

app.use(session({
  secure: true, // https 환경에서만 session 정보를 주고받도록처리
  secret: process.env.COOKIE_SECRET, // 암호화하는 데 쓰일 키
  resave: false, // 세션을 언제나 저장할지 설정함
  saveUninitialized: true, // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정
  cookie: { //세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
    httpOnly: true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
    Secure: true
  },
  name: 'session-cookie' // 세션 쿠키명 디폴트값은 connect.sid이지만 다른 이름을 줄수도 있다.
}));

app.get('/', (req, res, next) => {
 // 세션에 데이터를 설정하면, 모든 세션이 설정되는게아니라, 요청 받은 고유의 세션 사용자의 값만 설정 된다.
 // 즉, 개인의 저장 공간이 생긴 것과 같다.
 req.session.id = "hello";
}
```

해당 예제는 Node.js에서 사용하는 예제로 NestJS에서는 main.ts에서 설정해줄 수 있습니다.

**src/main.ts**

```ts
//import modules...

async function bootstrap(): Promise<void> {
  //...
  const sessionOptions = {
    secret: process.env.SET_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      Secure: true,
    },
    name: "session-cookie",
  };
  //...

  app.use(session(sessionOptions)); // -> 여기서 세션 옵션 적용
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app
    .useGlobalPipes(new ValidationPipe(validationPipeOptions))
    .useGlobalFilters(new HttpExceptionFilter(new Logger()))
    .enableCors(corsOptions);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  //...
  await app.listen(+process.env.APP_SERVER_PORT);
}
bootstrap();
```

이렇게 세션옵션을 설정하면 메모리 스토어를 사용해서 서버 메모리에 세션 유저 객체를 저장하게 됩니다.
우선은 개발환경이고 배포 전이기 때문에 secure 옵션은 적용하지 않았습니다.

## 인증 모듈 작성

auth 모듈을 만들고 로그인 메서드를 만들어 보겠습니다.

**src/auth/auth.controller.ts**

```js
  @UseGuards(LoggedCheckGuard)
  @Post('login')
  async logIn(
    @Body() dto: LogInDto,
    @Session() session: Record<string, SessionAdminInfo>,
  ) {
    const sessionUser = await this.authService.logInAndSetSession(
      dto.toEntity(),
      session,
    );
    return ResponseEntity.OK(`${sessionUser.username}님이 로그인 했습니다.`);
  }
```

로그인 요청을 보내게되면 Body에 아이디와 비밀번호가 들어가고 Session은 req.session에 해당하는 부분입니다.

서비스 메서드로 아이디와 비밀번호, 빈 세션 객체를 인자로 보내주고 sessionUser에
유저 정보가 포함된 세션 객체를 반환 해보겠습니다.

`@UseGuards(LoggedCheckGuard)`에 대해서는 서비스 메서드를 정의한 후에 설명하겠습니다.

## 인증 서비스 메서드 작성

앞선 동작과정에서 1~3에 해당하는 로그인 인증의 서비스 메서드

1. DB에서 유저를 가져오는 메서드
2. 비밀번호 검증
3. 세션 유저 객체 업데이트 (아이디, 이메일, 역할)
4. logInAndSetSession에서 검증 후 세션 객체 반환

과정으로 인증 메서드를 나눴습니다.

**src/auth/auth.service.ts**

```js
//import modules..

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async logInAndSetSession(
    user: User,
    session: Record<string, SessionAdminInfo>,
  ): Promise<SessionAdminInfo> {
    /**
     * @param user - 컨트롤러에서 받은 유저 정보 (username, password)
     * @param session - 세션에 넣을 정보
     * @desc 유저 로그인 정보와 세션에 유저 정보를 업데이트 하기 위한 로직
     */
    const admin = await this.findAdminByUsername(user.username);

    await this.validateAdminForLogin(admin.password, user.password);

    const sessionUser = new GetSessionAdminDto(admin);
    return this.setSessionUser(session, sessionUser);
  }

  private async findAdminByUsername(username: string): Promise<RawAdmin> {
    /**
     * @param username - 로그인에서 요청 받은 유저 아이디
     * @desc 요청 받은 유저 아이디가 있는지, 어드민 유저 인지 검증
     */
    const adminByUsername = await this.userRepository.findByUsername(username);

    if (!adminByUsername) {
      throw new UnauthorizedException('사용자 정보를 찾을 수 없습니다.');
    }
    if (!adminByUsername.isAdmin) {
      throw new UnauthorizedException('관리자 권한이 없습니다');
    }
    return adminByUsername;
  }

  // private async validateAdminForLogin...

  // private setSessionUser...
}
```

## 로그인 여부 확인

로그인 요청 전에 로그인이 되어있는지 확인하는 절차를 `UseGuard`를 이용해서 확인하겠습니다.
세션에서 로그인 되어있는지 확인하는 방법은 세션ID에 해당하는 user 객체가 들어있는지 여부로 확인할 수 있습니다.

![출처: https://slides.com/yariv-gilad/nest-js-request-lifecycle/#/1][lifecycle]

쿠키에는 세션ID와 정보들이 암호화되서 클라이언트에 저장되어있고 Controller에 전달되기 전에 Guard에서
로그인 여부를 확인해볼 수 있습니다.

```js
//import ...
@Injectable()
export class LoggedCheckGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userInfo = request.session.user;
    const isLoginRequest = request.url.includes("login");

    if (isLoginRequest && userInfo) {
      throw new BadRequestException("이미 로그인한 사용자입니다.");
    }

    return true;
  }
}
```

세션 유저가 존재하는데 로그인 요청을 보내게되면 이미 로그인한 사용자라는 예외처리를 했습니다.
로그인 유저가 있는지 확인하려면 결국 세션 DB에 접근해야하지만 빠른 예외처리가 가능합니다.

## 세션 스토어

세션 정보를 서버 메모리에 저장하는 대신 postgreSQL의 DB를 연결해보겠습니다.

postgreSQL을 연결하는 방법은 [connect-pg-simple][pg-simple] 이라는 패키지를 통해 연결할 수도 있지만
저는 TypeORM을 이용해서 postgreSQL을 설정했는데 connect-pg-simple을 이용하면
`pg.Pool`을 이용해서 다시 한번 DB 설정을 해야하는 번거로움이 있습니다.

그래서 [connect-typeorm][connect-typeorm] 패키지를 이용해 세션 DB를 연결했습니다.

Session 엔티티를 작성하고 main.ts에서 store 옵션을 추가합니다.

```js
const sessionRepo = app.get(DataSource).getRepository(Session);
const sessionOptions = {
  store: new TypeormStore({ cleanupLimit: 3, ttl: 86400 }).connect(sessionRepo),
  secret: process.env.SET_COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    Secure: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
  name: "session-cookie",
};
```

그다음 app.module에서 entity에 세션을 추가합니다.

```js
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExceptionModule } from "./common/filter/exception-filter.module";
import { User } from "./user/entity/user.entity";
import { AuthModule } from "./auth/auth.module";
import { Session } from "./auth/entity/session.entity";

@Module({
  imports: [
    //...
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      synchronize: process.env.NODE_ENV === "local",
      logging: process.env.NODE_ENV !== "production",
      entities: [User, Session], //-> 세션 엔티티 추가
      ssl:
        process.env.NODE_ENV === "local"
          ? undefined
          : { rejectUnauthorized: false },
    }),
    //...
  ],
})
export class AppModule {}
```

서버를 실행하고 synchronize 옵션이 켜져있다면 세션 테이블이 생성됩니다.

![세션DB 연결 확인][session-store]

## 참고 링크

- <https://expressjs.com/en/resources/middleware/session.html>
- <https://forum.freecodecamp.org/t/what-is-the-secret-key-in-express-session/354972>
- <https://en.wikipedia.org/wiki/HMAC>

[express-session]: https://www.npmjs.com/package/express-session
[pg-simple]: https://www.npmjs.com/package/connect-pg-simple
[connect-typeorm]: https://www.npmjs.com/package/connect-typeorm
[lifecycle]: https://github.com/Zamoca42/blog/assets/96982072/9decee8b-43af-4713-84af-e3969ed923a8
[session-store]: https://github.com/Zamoca42/blog/assets/96982072/ab5c9c54-8278-47c3-91da-3aab6e518014
