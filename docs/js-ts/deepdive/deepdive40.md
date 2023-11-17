---
title: 40. 이벤트
category:
  - JS & TS
tag:
  - JavaScript
---

## 1. 이벤트 드리븐 프로그래밍

브라우저는 처리해야 할 특정 사건이 발생하면 이를 감지하여 이벤트를 발생시킨다.
예를 들어, 클릭, 키보드 입력, 마우스 이동 등이 일어나면 브라우저는 이를 감지하여 특정한 타입의 이벤트를 발생시킨다.

이벤트가 발생했을 때 호출될 함수를 이벤트 핸들러라 하고,
이벤트가 발생했을 때 브라우저에게 이벤트 핸들러의 호출을 위임하는 것을 이벤트 핸들러 등록이라 한다.

브라우저는 사용자 버튼 클릭을 감지하여 클릭 이벤트를 발생시킬 수 있다.
그리고 특정 버튼 요소에서 클릭 이벤트가 발생하면 이벤트 핸들러를 호출하도록 브라우저에게 위임할 수 있다.

<!--more-->

```html
<!DOCTYPE html>
<html>
  <body>
    <button>Click me!</button>
    <script>
      const $button = document.querySelector("button");

      // 사용자가 버튼을 클릭하면 함수를 호출하도록 요청
      $button.onclick = () => {
        alert("button click");
      };
    </script>
  </body>
</html>
```

위 예제는 버튼 요소 $button의 onclick 프로퍼티에 함수를 할당했다.
이처럼 이벤트와 그에 대응하는 함수를 통해 사용자와 애플리케이션은 상호작용을 할 수 있다.
이와 같이 이벤트 중심으로 제어하는 프로그래밍 방식을 **이벤트 드리븐 프로그래밍**이라 한다.

## 2. 이벤트 타입

이벤트 타입은 이벤트의 종류를 나타내는 문자열이다. 이벤트 타입은 약 200여 가지가 있다.
다음은 사용 빈도가 높은 이벤트 타입이다.

### 2.1. 마우스 이벤트

- click

  - 마우스 버튼을 클릭 했을 때

- dblclick

  - 마우스 버튼을 더블 클릭 했을 때

- mousedown

  - 마우스 버튼을 눌렀을 때

- mouseup

  - 누르고 있던 마우스 버튼을 놓았을 때

- mousemove

  - 마우스 커서를 움직였을 때

- mouseenter

  - 마우스 커서를 HTML 요소 안으로 이동했을 때 (버블링 x)

- mouseover

  - 마우스 커서를 HTML 요소 안으로 이동했을 때 (버블링 o)

- mouseleave

  - 마우스 커서를 HTML 요소 밖으로 이동했을 때 (버블링 x)

- mouseout
  - 마우스 커서를 HTML 요소 밖으로 이동했을 때 (버블링 o)

### 2.2. 키보드 이벤트

- keydown

  - 모든 키를 눌렀을 때 발생
  - control, option, shift, tab, delete, 방향키를 눌렀을 때 한 번만 발생
  - enter, 문자, 숫자, 특수 문자 키는 연속적으로 발생

- keypress

  - 문자 키를 눌렀을 때 연속적으로 발생
  - 폐지(deprecated)되었으므로 사용하지 않을 것을 권장

- keyup
  - 누르고 있던 키를 놓았을 떄 한 번만 발생한다.
  - keydown 이벤트와 같은 키를 놓았을 때 발생

### 2.3. 포커스 이벤트

- focus

  - HTML 요소가 포커스를 받았을 때 (버블링 x)

- blur

  - HTML 요소가 포커스를 잃었을 때 (버블링 x)

- focusin

  - HTML 요소가 포커스를 받았을 때 (버블링 o)

- focusout
  - HTML 요소가 포커스를 잃었을 때 (버블링 o)

### 2.4. 폼 이벤트

- submit
  1. form 요소 내의 input, select 입력 필드에서 엔터키를 눌렀을 때
  2. form 요소 내의 submit 버튼을 클릭했을 때
     \*. submit 이벤트는 form 요소에서 발생한다.

### 2.5. 값 변경 이벤트

- input

  - input, select, textarea 요소의 값이 입력되었을 때

- change

  - input, select, textarea 요소의 값이 변경되었을 때

- readystatechange
  - HTML 문서의 로드와 파싱 상태를 나타내는 document, readyState 프로퍼티 갑싱 변경될 때

### 2.6. DOM 뮤테이션 이벤트

- DOMContentLoaded
  - HTML 문서의 로드와 파싱이 완료되어 DOM 생성이 완료되었을 때

### 2.7. 뷰 이벤트

- resize

  - 브라우저 윈도우의 크기를 리사이즈할 때 연속적으로 발생
  - window 객체에서만 발생

- scroll
  - 웹페이지 또는 HTML 요소를 스크롤할 때 연속적으로 발생

### 2.8. 리소스 이벤트

- load

  - **DOMContentLoaded** 이벤트가 발생한 이후, 모든 리소스의 로딩이 완료 되었을 때

- upload

  - 리소스가 언로드 될 때 (주로 새로운 웹페이지를 요청한 경우)

- abort

  - 리소스 로딩이 중단되었을 때

- error
  - 리소스 로딩이 실패했을 때

## 3. 이벤트 핸들러 등록

이벤트가 발생했을 때 브라우저에게 이벤트 핸들러의 호출을 위임하는 것을 이벤트 핸들러 등록이라 한다.
이벤트 핸들러를 등록하는 방법은 3가지다.

### 3.1. 이벤트 핸들러 어트리뷰트 방식

이벤트 핸들러 어트리뷰트의 이름은 onclick과 같이 on 접두사와 이벤트의 종류를 나타내는 이벤트 타입으로 이루어져 있다.

```js
<!DOCTYPE html>
<html>
<body>
  <button onclick="sayHi('Lee')">Click me!</button>
  <script>
    function sayHi(name) {
      console.log(`Hi! ${name}.`);
    }
  </script>
</body>
</html>
```

함수가 아닌 값을 반환하는 함수 호출문을 이벤트 핸들러로 등록하면 브라우저가 이벤트 핸들러를 호출할 수 없다.
이때 이벤트 핸들러 어트리뷰트 값은 사실 암묵적으로 생성될 이벤트 핸들러의 함수 몸체를 의미한다.

```js
function onclick(event) {
  sayHi("Lee");
}
```

![그림 40-1. 이벤트 핸들러 어트리뷰트와 이벤트 핸들러 프로퍼티](https://github.com/Zamoca42/blog/assets/96982072/99a71d9e-ea09-4ccc-967e-5bd716c9c26d)

이처럼 동작하는 이유는 이벤트 핸들러에 인수를 전달하기 위해서다.
만약 이벤트 핸들러 어트리뷰트 값으로 함수 참조를 할당해야 한다면 이벤트 핸들러에 인수를 전달하기 곤란하다.

```html
<!-- 이벤트 핸들러에 인수를 전달하기 곤란하다. -->
<button onclick="sayHi">Click me!</button>
```

이벤트 핸들러 어트리뷰트 값으로 다음과 같이 여러 개의 문을 할당할 수 있다.

```html
<button onclick="console.log('Hi! '); console.log('Lee');">Click me!</button>
```

CBD 방식의 Angular/React/Svelte/Vue.js 같은 프레임워크/라이브러리에서는 이벤트 핸들러 어트리뷰트 방식으로 이벤트를 처리한다.

```html
<!-- Angular -->
<button (click)="handleClick($event)">Save</button>

{ /* React */ }
<button onClick="{handleClick}">Save</button>

<!-- Svelte -->
<button on:click="{handleClick}">Save</button>

<!-- Vue.js -->
<button v-on:click="handleClick($event)">Save</button>
```

### 3.2. 이벤트 핸들러 프로퍼티 방식

이벤트 핸들러 프로퍼티에 함수를 바인딩하면 이벤트 핸들러가 등록된다.

```html
<!DOCTYPE html>
<html>
  <body>
    <button>Click me!</button>
    <script>
      const $button = document.querySelector("button");

      // 이벤트 핸들러 프로퍼티에 이벤트 핸들러를 바인딩
      $button.onclick = function () {
        console.log("button click");
      };
    </script>
  </body>
</html>
```

- 이벤트 핸들러를 등록 과정

  - 이벤트를 발생시킬 객체인 **이벤트 타깃**
  - 이벤트의 종류를 나타내는 문자열인 **이벤트 타입**
  - **이벤트 핸들러**를 지정

![그림 40-2. 이벤트 핸들러 프로퍼티 방식](https://github.com/Zamoca42/blog/assets/96982072/506125d9-e9a2-421f-afa7-415602ec674f)

이벤트 핸들러는 대부분 이벤트를 발생시킬 이벤트 타깃에 바인딩한다.
하지만 반드시 이벤트 타깃에 이벤트 핸들러를 바인딩해야 하는 것은 아니다.

```html
<!DOCTYPE html>
<html>
  <body>
    <button>Click me!</button>
    <script>
      const $button = document.querySelector("button");

      // 이벤트 핸들러 프로퍼티 방식은 하나의 이벤트에 하나의 이벤트 핸들러만을 바인딩할 수 있다.
      // 첫 번째로 바인딩된 이벤트 핸들러는 두 번째 바인딩된 이벤트 핸들러에 의해 재할당되어
      // 실행되지 않는다.
      $button.onclick = function () {
        console.log("Button clicked 1");
      };

      // 두 번째로 바인딩된 이벤트 핸들러
      $button.onclick = function () {
        console.log("Button clicked 2");
      };
    </script>
  </body>
</html>
```

### 3.3. addEventListener 메서드 방식

EventTarget.prototype.addEventListener 메서드를 사용하여 이벤트 핸들러를 등록할 수 있다.

![그림 40-3. addEventListener 메서드](https://github.com/Zamoca42/blog/assets/96982072/b022bd8e-a886-40c4-b15d-fe0e9bfb2631)

```html
<!DOCTYPE html>
<html>
  <body>
    <button>Click me!</button>
    <script>
      const $button = document.querySelector("button");

      // 이벤트 핸들러 프로퍼티 방식
      // $button.onclick = function () {
      //   console.log('button click');
      // };

      // addEventListener 메서드 방식
      $button.addEventListener("click", function () {
        console.log("button click");
      });
    </script>
  </body>
</html>
```

addEventListener 메서드에는 이벤트 핸들러를 인수를 전달한다.
만약 동일한 HTML 요소에서 발생한 동일한 이벤트에 대해 이벤트 핸들러 프로퍼티 방식과
addEventListener 메서드 방식을 모두 사용하여 이벤트 핸들러를 등록하면 어떻게 동작할지 생각해보자.

```html
<!DOCTYPE html>
<html>
  <body>
    <button>Click me!</button>
    <script>
      const $button = document.querySelector("button");

      // 이벤트 핸들러 프로퍼티 방식
      $button.onclick = function () {
        console.log("[이벤트 핸들러 프로퍼티 방식]button click");
      };

      // addEventListener 메서드 방식
      $button.addEventListener("click", function () {
        console.log("[addEventListener 메서드 방식]button click");
      });
    </script>
  </body>
</html>
```

이벤트 핸들러는 등록된 순서대로 호출된다.

```html
<!DOCTYPE html>
<html>
  <body>
    <button>Click me!</button>
    <script>
      const $button = document.querySelector("button");

      // addEventListener 메서드는 동일한 요소에서 발생한 동일한 이벤트에 대해
      // 하나 이상의 이벤트 핸들러를 등록할 수 있다.
      $button.addEventListener("click", function () {
        console.log("[1]button click");
      });

      $button.addEventListener("click", function () {
        console.log("[2]button click");
      });
    </script>
  </body>
</html>
```

단, addEventListener 메서드를 통해 참조가 동일한 이벤트 핸들러를 중복 등록하면 하나의 이벤트 핸들러만 등록된다.

```html
<!DOCTYPE html>
<html>
  <body>
    <button>Click me!</button>
    <script>
      const $button = document.querySelector("button");

      const handleClick = () => console.log("button click");

      // 참조가 동일한 이벤트 핸들러를 중복 등록하면 하나의 핸들러만 등록된다.
      $button.addEventListener("click", handleClick);
      $button.addEventListener("click", handleClick);
    </script>
  </body>
</html>
```

## 4. 이벤트 핸들러 제거

addEventListener 메서드로 등록한 이벤트를 제거하려면
EventTarget.prototype.removeEventListener 메서드를 사용한다.

removeEventListener 메서드에 전달할 인수는 addEventListener와 동일하다.

```html
<!DOCTYPE html>
<html>
  <body>
    <button>Click me!</button>
    <script>
      const $button = document.querySelector("button");

      const handleClick = () => console.log("button click");

      // 이벤트 핸들러 등록
      $button.addEventListener("click", handleClick);

      // 이벤트 핸들러 제거
      // addEventListener 메서드에 전달한 인수와 removeEventListener 메서드에
      // 전달한 인수가 일치하지 않으면 이벤트 핸들러가 제거되지 않는다.
      $button.removeEventListener("click", handleClick, true); // 실패
      $button.removeEventListener("click", handleClick); // 성공
    </script>
  </body>
</html>
```

removeEventListener 메서드에 인수로 전달한 이벤트 핸들러는 addEventListener 메서드로 인수로 전달한
이벤트 핸들러와 동일한 함수이어야 한다.

```js
// 이벤트 핸들러 등록
$button.addEventListener("click", () => console.log("button click"));
// 등록한 이벤트 핸들러를 참조할 수 없으므로 제거할 수 없다.
```

단, 기명 이벤트 핸들러 내부에서 removeEventListener 메서드를 호출하여 이벤트 핸들러를 제거하는 것은 가능하다.

```js
// 기명 함수를 이벤트 핸들러로 등록
$button.addEventListener("click", function foo() {
  console.log("button click");
  // 이벤트 핸들러를 제거한다. 따라서 이벤트 핸들러는 단 한 번만 호출된다.
  $button.removeEventListener("click", foo);
});
```

## 5. 이벤트 객체

이벤트가 발생하면 이벤트에 관련한 다양한 정보를 담고 있는 이벤트 객체가 동적으로 생성된다.
생성된 이벤트 객체는 이벤트 핸들러의 첫 번째 인수로 전달된다.

```html
<!DOCTYPE html>
<html>
  <body>
    <p>클릭하세요. 클릭한 곳의 좌표가 표시됩니다.</p>
    <em class="message"></em>
    <script>
      const $msg = document.querySelector(".message");

      // 클릭 이벤트에 의해 생성된 이벤트 객체는 이벤트 핸들러의 첫 번째 인수로 전달된다.
      function showCoords(e) {
        $msg.textContent = `clientX: ${e.clientX}, clientY: ${e.clientY}`;
      }

      document.onclick = showCoords;
    </script>
  </body>
</html>
```

이벤트 핸들러 어트리뷰트 방식으로 이벤트 핸들러를 등록했다면 다음과 같이 event를 통해 이벤트 객체를 전달받을 수 있다.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      html,
      body {
        height: 100%;
      }
    </style>
  </head>
  <!-- 이벤트 핸들러 어트리뷰트 방식의 경우 event가 아닌 다른 이름으로는 이벤트 객체를
전달받지 못한다. -->
  <body onclick="showCoords(event)">
    <p>클릭하세요. 클릭한 곳의 좌표가 표시됩니다.</p>
    <em class="message"></em>
    <script>
      const $msg = document.querySelector(".message");

      // 클릭 이벤트에 의해 생성된 이벤트 객체는 이벤트 핸들러의 첫 번째 인수로 전달된다.
      function showCoords(e) {
        $msg.textContent = `clientX: ${e.clientX}, clientY: ${e.clientY}`;
      }
    </script>
  </body>
</html>
```

이벤트 핸들러 어트리뷰트 방식의 경우 이벤트 객체를 전달받으려면 이벤트 핸들러의 첫 번째 매개변수 이름이 반드시 event이어야 한다.
이벤트 핸들러 어트리뷰트 값은 사실 암묵적으로 생성되는 이벤트 핸들러의 함수 몸체를 의미하기 때문이다.

```js
function onclick(event) {
  showCoords(event);
}
```

이때 암묵적으로 생성된 onclick 이벤트 핸들러의 첫 번째 매개변수의 이름이 event로 암묵적으로 명명되기 때문에
event가 아닌 다른 이름으로 이벤트 객체를 전달 받지 못한다.

### 5.1. 이벤트 객체의 상속 구조

![그림 40-4. 이벤트 객체의 상속 구조](https://github.com/Zamoca42/blog/assets/96982072/a46373f9-1f19-4d5c-8d7e-0f708b75b008)

```html
<!DOCTYPE html>
<html>
  <body>
    <script>
      // Event 생성자 함수를 호출하여 foo 이벤트 타입의 Event 객체를 생성한다.
      let e = new Event("foo");
      console.log(e);
      // Event {isTrusted: false, type: "foo", target: null, ...}
      console.log(e.type); // "foo"
      console.log(e instanceof Event); // true
      console.log(e instanceof Object); // true

      // FocusEvent 생성자 함수를 호출하여 focus 이벤트 타입의 FocusEvent 객체를 생성한다.
      e = new FocusEvent("focus");
      console.log(e);
      // FocusEvent {isTrusted: false, relatedTarget: null, view: null, ...}

      // MouseEvent 생성자 함수를 호출하여 click 이벤트 타입의 MouseEvent 객체를 생성한다.
      e = new MouseEvent("click");
      console.log(e);
      // MouseEvent {isTrusted: false, screenX: 0, screenY: 0, clientX: 0, ... }

      // KeyboardEvent 생성자 함수를 호출하여 keyup 이벤트 타입의 KeyboardEvent 객체를
      // 생성한다.
      e = new KeyboardEvent("keyup");
      console.log(e);
      // KeyboardEvent {isTrusted: false, key: "", code: "", ctrlKey: false, ...}

      // InputEvent 생성자 함수를 호출하여 change 이벤트 타입의 InputEvent 객체를 생성한다.
      e = new InputEvent("change");
      console.log(e);
      // InputEvent {isTrusted: false, data: null, inputType: "", ...}
    </script>
  </body>
</html>
```

이처럼 이벤트가 발생하면 암묵적으로 생성되는 이벤트 객체도 생성자 함수에 의해 생성된다.
그리고 생성된 이벤트 객체는 생성자 함수와 더불어 생성되는 프로토타입으로 구성된 프로토타입 체인의 일원이 된다.

![그림 40-5. 이벤트에 의해 생성된 객체의 프로토타입 체인](https://github.com/Zamoca42/blog/assets/96982072/133016d0-9476-4edb-b544-e57f530d4c59)
