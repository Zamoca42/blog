---
title: 38. 브라우저의 렌더링 과정
---

구글의 V8 자바스크립트 엔진으로 빌드된 자바스크립트 런타임 환경인 Node.js의 등장으로 자바스크립트는
웹 브라우저를 벗어나 서버사이드 애플리케이션 개발에서도 사용할 수 있는 범용 개발 언어가 되었다.

하지만 자바스크립트가 가장 많이 사용되는 분야는 역시 웹 브라우저 환경에서 동작하는 웹페이지/애플리케이션의 클라이언트 사이드다.

대부분의 프로그래밍 언어는 운영체제나 가상머신 위에서 실행되지만 클라이언트 사이드 자바스크립트는 브라우저에서 HTML, CSS와 함께 실행된다. 브라우저가 자바스크립트로 작성된 텍스트 문서를 어떻게 파싱하여 브라우저에 렌더링하는지 살펴보자.

- 파싱(parsing)

  1. 프로그래밍 언어의 문법에 맞게 작성된 텍스트 문서의 문자열 토큰으로 분해
  2. 토큰에 문법적 의미와 구조를 반영하여 트리 구조의 자료구조인 파스 트리를 생성
  3. 파스 트리를 기반으로 중간 언어인 바이트코드를 생성하고 실행한다.

- 렌더링
  - 문서를 파싱하여 브라우저에 시각적으로 출력

![그림 38-1. 브라우저의 렌더링 과정](https://github.com/Zamoca42/blog/assets/96982072/575e5baf-049d-48f7-aed0-a28e12f4b2b1)

1. 렌더링에 필요한 리소스를 요청하고 서버로부터 응답

2. 렌더링 엔진은 서버로부터 응답된 HTML과 CSS를 파싱하여 DOM과 CSSOM을 생성하고 렌더 트리를 생성

3. 브라우저의 자바스크립트 엔진은 자바스크립트를 파싱하여 AST를 생성하고 바이트코드로 변환

4. 자바스크립트는 DOM API를 통해 DOM이나 CSSOM을 변경

5. 렌더 트리를 기반으로 HTML 요소의 레이아웃을 계싼하고 브라우저 화면에 HTML 요소를 페인팅

## 1. 요청과 응답

브라우저의 핵심 기능은 필요한 리소스를 서버에 요청하고 서버로부터 응답받아 브라우저에 시각적으로
렌더링 하는 것이다.

렌더링에 필요한 리소스는 모두 서버에 존재하므로 필요한 리소스를 서버에 요청하고
서버에 응답한 리스소를 파싱하여 렌더링하는 것이다.

![그림 38-2. URI](https://github.com/Zamoca42/blog/assets/96982072/e6ec493a-dd7f-4ad2-a2b0-1bf6b36c32fa)

서버는 루트 요청에 대해 서버의 루트 폴더에 존재하는 정적 파일 index.html을 클라이언트로 응답한다.
만약 index.html이 아닌 다른 정적 파일을 서버에 요청하려면 정적 파일 경로와 파일이름을 URI의 호스트 뒤의 path에 기술하여 서버에 요청한다.

반드시 브라우저의 주소창을 통해 서버에게 정적 파일만을 요청할 수 있는 것은 아니다.
자바스크립트를 통해 동적으로 서버에 정적/동적 데이터를 요청할 수도 있다.

## 2. HTTP 1.1과 HTTP 2.0

HTTP/1.1은 기본적으로 커넥션당 하나의 요청과 응답만 처리한다.
여러 개의 요청을 전송할 수 없고 리소스의 동시 전송이 불가능한 구조이므로 요청할 리소스의 개수에 비례하여
응답 시간도 증가하는 단점이 있다.

![그림 38-4. HTTP/1.1](https://github.com/Zamoca42/blog/assets/96982072/feb3536f-89a3-429f-ac1a-7fa1715d687c)

HTTP/1.1은 다중 요청/응답이 불가하다는 단점이 있지만 HTTP/2는 커넥션당 여러 개의 요청과 응답, 즉 다중 요청/응답이 가능하다. 따라서 HTTP/2.0은 여러 리소스의 동시 전송이 가능하므로 HTTP/1.1에 비해 페이지 로드 속도가 약 50% 정도 빠르다고 알려져 있다.

![그림 38-5. HTTP/2](https://github.com/Zamoca42/blog/assets/96982072/5378d7d8-d81f-4281-81d8-7cbe942631cb)

## 3. HTML 파싱과 DOM 생성

브라우저의 요청에 의해 서버가 응답한 HTML 문서는 문자열로 이루어진 순수한 텍스트다.
예를 들어, 다음과 같은 index.html이 서버로부터 응답되었다고 가정해보자.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <ul>
      <li id="apple">Apple</li>
      <li id="banana">Banana</li>
      <li id="orange">Orange</li>
    </ul>
    <script src="app.js"></script>
  </body>
</html>
```

HTML 문서를 파싱하여 브라우저가 이해할 수 있는 자료구조인 DOM을 생성한다.

![그림 38-6. HTML 파싱과 DOM 생성](https://github.com/Zamoca42/blog/assets/96982072/6548e630-061c-46bd-bf12-371647703f48)

DOM은 HTML 문서를 파싱한 결과물이다.

## 4. CSS 파싱과 CSSOM 생성

link 태그의 href 어트리뷰트에 지정된 CSS 파일을 서버에 요청하여 로드한 CSS 파일이나 style 태그 내의 CSS를 HTML과 동일한 파싱 과정을 거치며 해석하여 CSSOM을 성상한다.

이후 CSS 파싱을 완료하면 HTML 파싱이 중단된 지점부터 다시 HTML을 파싱하기 시작하여 DOM 생성을 재개한다.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="style.css" />
    ...
  </head>
</html>
```

렌더링 엔진은 meta 태그까지 HTML을 순차적으로 해석한 다음, link 태그를 만나면 DOM 생성을 일시 중단하고 link 태그의 href 어트리뷰트에 지정된 CSS 파일을 서버에 요청한다.

```css
body {
  font-size: 18px;
}

ul {
  list-style-type: none;
}
```

서버로부터 CSS 파일이 응답되면 렌더링 엔진은 HTML과 동일한 해석 과정을 거쳐 CSS를 파싱하여 CSSOM을 생성한다.

![그림 38-7. CSSOM 생성](https://github.com/Zamoca42/blog/assets/96982072/cb3e6747-8e98-4252-8b2e-43c0deb0ff23)

## 5. 렌더 트리 생성

렌더링 엔진은 서버로부터 응답된 HTML과 CSS를 파싱하여 각각 DOM과 CSSOM을 생성한다.
그리고 DOM과 CSSOM은 렌더링을 위해 렌더 트리로 결합된다.

![그림 38-8. 렌더 트리 생성](https://github.com/Zamoca42/blog/assets/96982072/564a3405-1d7e-4297-b379-40290ae009e7)

이후 완성된 렌더 트리는 각 HTML 요소의 레이아웃을 계산하고 렌더링하는 페인팅처리에 입력

![그림 38-9. 렌더 트리와 레이아웃 / 페인트](https://github.com/Zamoca42/blog/assets/96982072/2584e361-7a4e-49d6-be77-a7d40273c3f4)

반복해서 레이아웃 계산과 페인팅이 재차 실행

- 자바스크립트에 의한 노드 추가 또는 삭제
- 브라우저 창의 리사이징에 의한 뷰포트 크기 변경
- HTML 요소의 레이아웃에 변경을 발생시키는 스타일 변경

레이아웃 계산과 페인팅을 다시 실행하는 리렌더링은 성능에 악영향을 주는 작업이다.
따라서 가급적 리렌더링이 빈번하게 발생하지 않도록 주의할 필요가 있다.

## 6. 자바스크립트 파싱과 실행

![그림 38-10. 자바스크립트 파싱과 실행](https://github.com/Zamoca42/blog/assets/96982072/c1e7c53d-1de2-49a3-9e5d-c21b5ff44c65)

#### 토크나이징

자바스크립트 소스코드를 분석하여 최소 단위인 토큰들로 분해.
이 과정을 렉싱이라고 부르기도하지만 토크나이징과 미묘한 차이가 있다

#### 파싱

토큰들의 집합을 구문 분석하여 추상적 구문 트리(Abstract Syntax Tree)를 생성
AST는 토큰에 문법적 의미와 구조를 반영한 트리 구조의 자료구조다.
AST는 인터프리터나 컴파일러만이 사용하는 것은 아니다.
AST를 사용하면 TypeScript, Babel, Prettier 같은 트랜스파일러를 구현할 수도 있다.

![그림 38-11. AST Explorer](https://github.com/Zamoca42/blog/assets/96982072/435a050d-9fbc-4c5a-98d0-15cf0ae46703)

#### 바이트코드 생성과 실행

파싱의 결과물로서 생성된 AST는 인터프리터가 실행할 수 있는 중간 코드인 바이트코드로 변환되고
인터프리터에 의해 실행.
V8엔진의 경우 자주 사용되는 코드는 터보팬이라고 불리는 컴파일러에 의해 최적화된 머신 코드로 컴파일되어
성능을 최적화.
코드의 사용 빈도가 적어지면 디옵티마이징 하기도 한다.

## 7. 리플로우와 리페인트

자바스크립트 코드에 DOM이나 CSSOM을 변경하는 DOM API가 사용된 경우 변경된 DOM과 CSSOM은 다시
렌더 트리를 기반으로 레이아웃과 페인트 과정을 거쳐 다시 렌더링 된다.
이를 리플로우와 리페인트라 한다.

![그림 38-12. DOM API에 의한 리플로우, 리페인트](https://github.com/Zamoca42/blog/assets/96982072/a08a51bf-3525-45ff-995d-5f85a4d7085e)

리플로우는 레이아웃 계산을 다시 하는 것을 말하며, 노드 추가/삭제, 요소의 크기/위치 변경, 윈도우 리사이징 등 레이아웃에 영향을 주는 변경이 발생한 경우에 한하여 실행

## 8. 자바스크립트 파싱에 의한 HTML 파싱 중단

![그림 38-13. 직렬적 파싱](https://github.com/Zamoca42/blog/assets/96982072/8b66fa7b-bc7a-4d9a-b39b-229bdb6a4dd6)

이처럼 브라우저는 동기적으로 HTML, CSS, 자바스크립트를 파싱하고 실행
이것은 script 태그의 위치에 따라 HTML 파싱이 블로킹되어 DOM 생성이 지연될 수 있다는 의미

다음 예제에서 주목할 것은 script 태그의 위치에 의해 블로킹이 발생하는 것이다.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="style.css" />
    <script>
      /*
      DOM API인 document.getElementById는 DOM에서 id가 'apple'인 HTML 요소를
      취득한다. 아래 DOM API가 실행되는 시점에는 아직 id가 'apple'인 HTML 요소를 파싱하지
      않았기 때문에 DOM에는 id가 'apple'인 HTML 요소가 포함되어 있지 않다.
      따라서 아래 코드는 정상적으로 id가 'apple'인 HTML 요소를 취득하지 못한다.
      */
      const $apple = document.getElementById("apple");

      // id가 'apple'인 HTML 요소의 css color 프로퍼티 값을 변경한다.
      // 이때 DOM에는 id가 'apple'인 HTML 요소가 포함되어 있지 않기 때문에 에러가 발생한다.
      $apple.style.color = "red"; // TypeError: Cannot read property 'style' of null
    </script>
  </head>
  <body>
    <ul>
      <li id="apple">Apple</li>
      <li id="banana">Banana</li>
      <li id="orange">Orange</li>
    </ul>
  </body>
</html>
```

이러한 문제를 회피하기 위해 body 요소의 가장 아래에 자바스크립트를 위치시키는 것은 좋은 아이디어다.

- DOM이 완성되지 않은 상태에서 자바스크립트가 DOM을 조작하면 에러가 발생
- 자바스크립트 로딩/파싱/실행으로 인해 HTML 요소들의 렌더링에 지장받는 일이 발생하지 않아 페이지 로딩 시간 단축

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <ul>
      <li id="apple">Apple</li>
      <li id="banana">Banana</li>
      <li id="orange">Orange</li>
    </ul>
    <script>
      /*
      DOM API인 document.getElementById는 DOM에서 id가 'apple'인 HTML 요소를
      취득한다. 아래 코드가 실행되는 시점에는 id가 'apple'인 HTML 요소의 파싱이 완료되어
      DOM에 포함되어 있기 때문에 정상적으로 동작한다.
      */
      const $apple = document.getElementById("apple");

      // apple 요소의 css color 프로퍼티 값을 변경한다.
      $apple.style.color = "red";
    </script>
  </body>
</html>
```

자바스크립트가 실행될 시점에는 이미 렌더링 엔진이 HTML 요소를 모두 파싱하여 DOM 생성을 완료한 이후다.
따라서 DOM이 완성되지 않은 상태에서 자바스크립트가 DOM을 조작하는 에러가 발생할 우려도 없다.
자바스크립트가 실행되기 이전에 DOM 생성이 완료되어 렌더링되므로 페이지 로딩 시간이 단축되는 이점도 있다.

## 9. script 태그의 async/defer 어트리뷰트

앞에서 살펴본 자바스크립트 파싱에 의한 DOM 생성이 중단되는 문제를 근본적으로 해결하기 위해
HTML5부터 script 태그에 async와 defer 어트리뷰트가 추가

async와 defer 어트리뷰트는 다음과 같이 src 어트리뷰트를 통해 외부 자바스크립트 파일을 로드하는 경우에만 사용할 수 있다.

```js
<script async src="extern.js"></script>
<script defer src="extern.js"></script>
```

async와 defer 어트리뷰트를 사용하면 HTML 파싱과 외부 자바스크립트 파일의 로드가 비동기적으로 동시에 진행된다.

#### async 어트리뷰트

HTML 파싱과 외부 자바스크립트 파일의 로드가 비동기적으로 동시에 진행
단, 자바스크립트의 파싱과 실행은 자바스크립트 파일의 로드가 완료된 직후 진행

![그림 38-14. script 태그와 async 어트리뷰트](https://github.com/Zamoca42/blog/assets/96982072/e440f1c9-4ab1-4eb3-a355-86cd72e192be)

여러 개의 script 태그에 async 어트리뷰트를 지정하면 script 태그의 순서와는 상관없이 로드가 완료된 자바스크립트부터 먼저 실행되므로 순서가 보장되지 않는다.

#### defer 어트리뷰트

async와 마찬가지로 비동기적으로 동시에 진행된다.
자바스크립트의 파싱과 실행은 DOm이 생성이 완료된 직후 진행.

![그림 38-15. script 태그의 defer 어트리뷰트](https://github.com/Zamoca42/blog/assets/96982072/84856385-0821-46b0-b148-c2dd915a079e)
