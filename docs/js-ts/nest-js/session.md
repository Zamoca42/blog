---
title: 세션 인증
category:
  - JS & TS
tag:
  - NestJS
---

<https://velog.io/@shleecloud/whatisSession>

## 추가 내용 1

NestJS에서 request에 가드(local-auth, cookie-auth)가 동작하는 과정

- 참고링크: <https://slides.com/yariv-gilad/nest-js-request-lifecycle/#/1>

![스크린샷 2023-11-11 오전 4 33 58](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/1386ca30-b751-456a-9338-2863b148d915)

## 추가 내용 2

session이 동작하는 플로우

- 참고링크: <https://okky.kr/questions/680128>

![스크린샷 2023-11-10 오후 11 20 25](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/675e18db-d5f5-4cd3-b779-2939640d4c37)

## 세션 스토어

### 메모리

### 데이터베이스

## 현재까지 알게된 점

### 1. 세션ID은 언제, 어디서 생기는가

- API가 요청될 때마다 자동으로 미들웨어에서 생성
- 로그아웃 요청시에도 세션이 생긴다

### 2. 로그인 되어있는 세션과 아닌 세션은 어떻게 구분하는가

- 로그인시 유저 정보를 넣어서 확인
- 이후 세션에 있는 유저 정보를 확인해서 인가

### 3. 로그아웃은 어떻게 하는가

- 세션을 열어서 유저 정보가 있는지 확인
- 유저 정보가 없으면 예외 처리
- 유저 정보가 있으면 쿠키 제거

### 4. 가드의 역할

- 미들웨어 다음으로 컨트롤러에서 로그인 검증하는 용도
- 세션 생성 여부로는 검증 불가능 (미들웨어에서 이미 생성)

- 참고 링크
  - <https://expressjs.com/en/resources/middleware/session.html>
  - <https://forum.freecodecamp.org/t/what-is-the-secret-key-in-express-session/354972>
  - <https://en.wikipedia.org/wiki/HMAC>
