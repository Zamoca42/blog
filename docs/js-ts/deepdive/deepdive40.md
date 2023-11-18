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

이벤트 객체 중 일부는 사용자 행위에 의해 생성된 것이고 일부는 자바스크립트 코드에 의해 인위적으로 생성된 것이다.

다음 예제와 같이 이벤트 객체의 프로퍼티는 발생한 이벤트 타입에 따라 달라진다.

```html
<!DOCTYPE html>
<html>
  <body>
    <input type="text" />
    <input type="checkbox" />
    <button>Click me!</button>
    <script>
      const $input = document.querySelector("input[type=text]");
      const $checkbox = document.querySelector("input[type=checkbox]");
      const $button = document.querySelector("button");

      // load 이벤트가 발생하면 Event 타입의 이벤트 객체가 생성된다.
      window.onload = console.log;

      // change 이벤트가 발생하면 Event 타입의 이벤트 객체가 생성된다.
      $checkbox.onchange = console.log;

      // focus 이벤트가 발생하면 FocusEvent 타입의 이벤트 객체가 생성된다.
      $input.onfocus = console.log;

      // input 이벤트가 발생하면 InputEvent 타입의 이벤트 객체가 생성된다.
      $input.oninput = console.log;

      // keyup 이벤트가 발생하면 KeyboardEvent 타입의 이벤트 객체가 생성된다.
      $input.onkeyup = console.log;

      // click 이벤트가 발생하면 MouseEvent 타입의 이벤트 객체가 생성된다.
      $button.onclick = console.log;
    </script>
  </body>
</html>
```

![그림 40-6. 이벤트 타입에 따라 생성되는 이벤트 객체](https://github.com/Zamoca42/blog/assets/96982072/ccd69578-55af-4602-88f0-d4f9c8976f7a)

### 5.2. 이벤트 객체의 공통 프로퍼티

Event 인터페이스의 이벤트 관련 프로퍼티는 모든 이벤트 객체가 상속받는 공통 프로퍼티다.
이벤트 객체의 공통 프로퍼티는 다음과 같다.

- type (string)

  - 이벤트 타입

- target (DOM 요소 노드)

  - 이벤트를 발생시킨 DOM 요소

- currentTarget (DOM 요소 노드)

  - 이벤트 핸들러가 바인딩된 DOM 요소

- eventPhase (number)

  - 이벤트 전파 단계
  - 0: 이벤트 없음, 1: 캡처링, 2: 타깃, 3: 버블링

- bubbles (boolean)

  - 이벤트를 버블링으로 전파하는지 여부.
  - 다음 이벤트는 `bubbles: false`로 버블링 하지 않는다.
  - 포커스 이벤트 focus/blur
  - 리소스 이벤트 load/unload/abort/error
  - 마우스 이벤트 mouseenter/mouseleave

- cancelable (boolean)

  - preventDefault 메서드를 호출하여 이벤트의 기본 동작을 취소할 수 있는지 여부
  - 다음 이벤트는 `cancelable: false`로 취소할 수 없다.
  - 포커스 이벤트 focus/blur
  - 리소스 이벤트 load/unload/abort/error
  - 마우스 이벤트 dblclick/mouseenter/mouseleave

- defaultPrevented (boolean)

  - preventDefault 메서드를 호출하여 이벤트를 취소했는지 여부

- isTrusted (boolean)

  - 사용자의 행위에 의해 발생한 이벤트인지 여부.
  - 인위적으로 발생시킨 이벤트의 경우 isTrusted는 false

- timeStamp (number)

  - 이벤트 발생한 시각

체크박스 요소의 체크 상태가 변경되면 현재 체크 상태를 출력해보도록 하자.

```html
<!DOCTYPE html>
<html>
  <body>
    <input type="checkbox" />
    <em class="message">off</em>
    <script>
      const $checkbox = document.querySelector("input[type=checkbox]");
      const $msg = document.querySelector(".message");

      // change 이벤트가 발생하면 Event 타입의 이벤트 객체가 생성된다.
      $checkbox.onchange = (e) => {
        console.log(Object.getPrototypeOf(e) === Event.prototype); // true

        // e.target은 change 이벤트를 발생시킨 DOM 요소 $checkbox를 가리키고
        // e.target.checked는 체크박스 요소의 현재 체크 상태를 나타낸다.
        $msg.textContent = e.target.checked ? "on" : "off";
      };
    </script>
  </body>
</html>
```

사용자의 입력에 의해 체크박스 요소의 체크 상태가 변경되면
checked 프로퍼티의 값이 변경되고 change 이벤트가 발생한다.

이때 Event 타입의 이벤트 객체가 생성된다.

### 5.3. 마우스 정보 취득

이벤트가 발생하면 생성되는 MouseEvent 타입의 이벤트 객체는 다음과 같은 고유의 프로퍼티를 갖는다.

- 마우스 포인터의 좌표 정보를 나타내는 프로퍼티

  - screenX/screenY
  - clientX/clientY
  - pageX/pageY
  - offsetX/offsetY

- 버튼 정보를 나타내는 프로퍼티
  - altKey
  - ctrlKey
  - shiftKey
  - button

드래그는 마우스 버튼을 누른 상태(mousedown)에서 마우스를 이동(mousemove)하는 것으로 시작
마우스 버튼을 떼면(mouseup) 종료한다.

![그림 40-7. 드래그 대상 요소의 이동 거리 계산](https://github.com/Zamoca42/blog/assets/96982072/1b89ee70-186a-45b5-ac18-d919e51c823b)

마우스 포인터 좌표는 웹페이지의 가시 영역을 기준으로 MouseEvent 타입의 이벤트 객체에서 제공한다.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .box {
        width: 100px;
        height: 100px;
        background-color: #fff700;
        border: 5px solid orange;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="box"></div>
    <script>
      // 드래그 대상 요소
      const $box = document.querySelector(".box");

      // 드래그 시작 시점의 마우스 포인터 위치
      const initialMousePos = { x: 0, y: 0 };
      // 오프셋: 이동할 거리
      const offset = { x: 0, y: 0 };

      // mousemove 이벤트 핸들러
      const move = (e) => {
        // 오프셋 = 현재(드래그하고 있는 시점) 마우스 포인터 위치 - 드래그 시작 시점의 마우스 포인터 위치
        offset.x = e.clientX - initialMousePos.x;
        offset.y = e.clientY - initialMousePos.y;

        // translate3d는 GPU를 사용하므로 absolute의 top, left를 사용하는 것보다 빠르다.
        // top, left는 레이아웃에 영향을 준다.
        $box.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0)`;
      };

      // mousedown 이벤트가 발생하면 드래그 시작 시점의 마우스 포인터 좌표를 저장한다.
      $box.addEventListener("mousedown", (e) => {
        // 이동 거리를 계산하기 위해 mousedown 이벤트가 발생(드래그를 시작)하면
        // 드래그 시작 시점의 마우스 포인터 좌표(e.clientX/e.clientY: 뷰포트 상에서 현재
        // 마우스의 포인터 좌표)를 저장해 둔다. 한번 이상 드래그로 이동한 경우 move에서
        // translate3d(${offset.x}px, ${offset.y}px, 0)으로 이동한 상태이므로
        // offset.x와 offset.y를 빼주어야 한다.
        initialMousePos.x = e.clientX - offset.x;
        initialMousePos.y = e.clientY - offset.y;

        // mousedown 이벤트가 발생한 상태에서 mousemove 이벤트가 발생하면
        // box 요소를 이동시킨다.
        document.addEventListener("mousemove", move);
      });

      // mouseup 이벤트가 발생하면 mousemove 이벤트를 제거해 이동을 멈춘다.
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", move);
      });
    </script>
  </body>
</html>
```

### 5.4. 키보드 정보 취득

keydown, keyup, keypress 이벤트가 발생하면 생성되는 keyboardEvent 타입의 이벤트 객체는
altKey, ctrlKey, shiftKey, metaKey, key, keyCode 같은 고유의 프로퍼티를 갖는다.

```html
<!DOCTYPE html>
<html>
  <body>
    <input type="text" />
    <em class="message"></em>
    <script>
      const $input = document.querySelector("input[type=text]");
      const $msg = document.querySelector(".message");

      $input.onkeyup = (e) => {
        // e.key는 입력한 키 값을 문자열로 반환한다.
        // 입력한 키가 'Enter', 즉 엔터 키가 아니면 무시한다.
        if (e.key !== "Enter") return;

        // 엔터키가 입력되면 현재까지 입력 필드에 입력된 값을 출력한다.
        $msg.textContent = e.target.value;
        e.target.value = "";
      };
    </script>
  </body>
</html>
```

입력한 키와 key 프로퍼티 값의 대응 관계는 <https://keycode.info>를 참고하기 바란다.

input 요소의 입력 필드에 한글을 입력하고 엔터 키를 누르면
keyup 이벤트 핸들러가 두 번 호출되는 현상이 발생한다.

이 같은 문제를 회피하려면 keyup 이벤트 대신 keydown 이벤트를 캐치한다.

## 6. 이벤트 전파

DOM 트리 상에 존재하는 DOM 요소 노드에서 발생한 이벤트는 DOM 트리를 통해 전파된다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li id="apple">Apple</li>
      <li id="banana">Banana</li>
      <li id="orange">Orange</li>
    </ul>
  </body>
</html>
```

ul 요소의 두 번쨰 자식 요소인 li 요소를 클릭하면 클릭 이벤트가 발생.
생성된 이벤트 객체는 이벤트를 발생시킨 DOM 요소인 이벤트 타깃을 중심으로 DOM 트리를 통해 전파된다.

![그림 40-8. 이벤트 전파](https://github.com/Zamoca42/blog/assets/96982072/77be6f5f-1a05-49d0-88f8-113310a76b3d)

- 캡처링 단계: 이벤트가 상위 요소에서 하위 요소 방향으로 전파
- 타깃 단계: 이벤트가 이벤트 타깃에 도달
- 버블링 단계: 이벤트 하위 요소에서 상위 요소 방향으로 전파

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li id="apple">Apple</li>
      <li id="banana">Banana</li>
      <li id="orange">Orange</li>
    </ul>
    <script>
      const $fruits = document.getElementById("fruits");
      const $banana = document.getElementById("banana");

      // #fruits 요소의 하위 요소인 li 요소를 클릭한 경우
      // 캡처링 단계의 이벤트를 캐치한다.
      $fruits.addEventListener(
        "click",
        (e) => {
          console.log(`이벤트 단계: ${e.eventPhase}`); // 1: 캡처링 단계
          console.log(`이벤트 타깃: ${e.target}`); // [object HTMLLIElement]
          console.log(`커런트 타깃: ${e.currentTarget}`); // [object HTMLUListElement]
        },
        true
      );

      // 타깃 단계의 이벤트를 캐치한다.
      $banana.addEventListener("click", (e) => {
        console.log(`이벤트 단계: ${e.eventPhase}`); // 2: 타깃 단계
        console.log(`이벤트 타깃: ${e.target}`); // [object HTMLLIElement]
        console.log(`커런트 타깃: ${e.currentTarget}`); // [object HTMLLIElement]
      });

      // 버블링 단계의 이벤트를 캐치한다.
      $fruits.addEventListener("click", (e) => {
        console.log(`이벤트 단계: ${e.eventPhase}`); // 3: 버블링 단계
        console.log(`이벤트 타깃: ${e.target}`); // [object HTMLLIElement]
        console.log(`커런트 타깃: ${e.currentTarget}`); // [object HTMLUListElement]
      });
    </script>
  </body>
</html>
```

이처럼 이벤트는 이벤트를 발생시킨 이벤트 타깃은 물론 상위 DOM 요소에서도 캐치할 수 있다.
대부분의 이벤트는 캡처링과 버블링을 통해 전파된다.

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    html, body { height: 100%; }
  </style>
<body>
  <p>버블링과 캡처링 이벤트 <button>버튼</button></p>
  <script>
    // 버블링 단계의 이벤트를 캐치
    document.body.addEventListener('click', () => {
      console.log('Handler for body.');
    });

    // 캡처링 단계의 이벤트를 캐치
    document.querySelector('p').addEventListener('click', () => {
      console.log('Handler for paragraph.');
    }, true);

    // 타깃 단계의 이벤트를 캐치
    document.querySelector('button').addEventListener('click', () => {
      console.log('Handler for button.');
    });
  </script>
</body>
</html>
```

위 예제의 경우 body 요소는 버블링 단계의 이벤트만을 캐치하고 p 요소는 캡처링 단계의 이벤트만 캐치한다.

```text
Handler for paragraph
Handler for button
Handler for body
```

만약 p 요소에서 클릭 이벤트가 발생하면 캡처링 단계를 캐치하는 p 요소의 이벤트 핸들러가 호출되고
버블링 단계를 캐치하는 body 요소의 이벤트 핸들러가 순차적으로 호출된다.

```text
Handler for paragraph
Handler for body
```

## 7. 이벤트 위임

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      #fruits {
        display: flex;
        list-style-type: none;
        padding: 0;
      }

      #fruits li {
        width: 100px;
        cursor: pointer;
      }

      #fruits .active {
        color: red;
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <nav>
      <ul id="fruits">
        <li id="apple" class="active">Apple</li>
        <li id="banana">Banana</li>
        <li id="orange">Orange</li>
      </ul>
    </nav>
    <div>선택된 내비게이션 아이템: <em class="msg">apple</em></div>
    <script>
      const $fruits = document.getElementById("fruits");
      const $msg = document.querySelector(".msg");

      // 사용자 클릭에 의해 선택된 내비게이션 아이템(li 요소)에 active 클래스를 추가하고
      // 그 외의 모든 내비게이션 아이템의 active 클래스를 제거한다.
      function activate({ target }) {
        [...$fruits.children].forEach(($fruit) => {
          $fruit.classList.toggle("active", $fruit === target);
          $msg.textContent = target.id;
        });
      }

      // 모든 내비게이션 아이템(li 요소)에 이벤트 핸들러를 등록한다.
      document.getElementById("apple").onclick = activate;
      document.getElementById("banana").onclick = activate;
      document.getElementById("orange").onclick = activate;
    </script>
  </body>
</html>
```

이벤트 위임은 여러 개의 하위 DOM 요소에 각각 이벤트 핸들러를 등록하는 대신
하나의 상위 DOM 요소에 이벤트 핸들러를 등록하는 방법을 말한다.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      #fruits {
        display: flex;
        list-style-type: none;
        padding: 0;
      }

      #fruits li {
        width: 100px;
        cursor: pointer;
      }

      #fruits .active {
        color: red;
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <nav>
      <ul id="fruits">
        <li id="apple" class="active">Apple</li>
        <li id="banana">Banana</li>
        <li id="orange">Orange</li>
      </ul>
    </nav>
    <div>선택된 내비게이션 아이템: <em class="msg">apple</em></div>
    <script>
      const $fruits = document.getElementById("fruits");
      const $msg = document.querySelector(".msg");

      // 사용자 클릭에 의해 선택된 내비게이션 아이템(li 요소)에 active 클래스를 추가하고
      // 그 외의 모든 내비게이션 아이템의 active 클래스를 제거한다.
      function activate({ target }) {
        // 이벤트를 발생시킨 요소(target)가 ul#fruits의 자식 요소가 아니라면 무시한다.
        if (!target.matches("#fruits > li")) return;

        [...$fruits.children].forEach(($fruit) => {
          $fruit.classList.toggle("active", $fruit === target);
          $msg.textContent = target.id;
        });
      }

      // 이벤트 위임: 상위 요소(ul#fruits)는 하위 요소의 이벤트를 캐치할 수 있다.
      $fruits.onclick = activate;
    </script>
  </body>
</html>
```

이벤트 위임을 통해서 하위 DOM 요소에서 발생한 이벤트를 처리할 때 주의할 점은
상위 요소에 이벤트 핸들러를 등록하기 때문에 이벤트 타깃,
즉 이벤트를 실제로 발생시킨 DOM 요소가 개발자가 기대한 DOM 요소가 아닐 수 있다는 것이다.

따라서 이벤트에 반응이 필요한 DOM 요소에 한정하여 이벤트 핸들러가 실행되도록 이벤트 타깃을 검사할 필요가 있다.

```js
function activate({ target }) {
  // 이벤트를 발생시킨 요소(target)이 ul#fruits의 자식 요소가 아니라면 무시한다.
  if (!target.matches("#fruits > li")) return;
  //...
}
```

위 예제에서 다음과 같이 $fruits 요소에 이벤트를 바인딩했다.

```js
$fruits.onclick = activate;
```

이떄 이벤트 객체의 currentTarget 프로퍼티는 언제느 $fruits 요소를 가리키지만
이벤트 객체의 target 프로퍼티는 실제로 이벤트를 발생시킨 DOM 요소를 가리킨다.

## 8. DOM 요소의 기본 동작 조작

### 8.1. DOM 요소의 기본 동작 중단

이벤트 객체의 preventDefault 메서드는 이러한 DOM 요소의 기본 동작을 중단시킨다.

```html
<!DOCTYPE html>
<html>
  <body>
    <a href="https://www.google.com">go</a>
    <input type="checkbox" />
    <script>
      document.querySelector("a").onclick = (e) => {
        // a 요소의 기본 동작을 중단한다.
        e.preventDefault();
      };

      document.querySelector("input[type=checkbox]").onclick = (e) => {
        // checkbox 요소의 기본 동작을 중단한다.
        e.preventDefault();
      };
    </script>
  </body>
</html>
```

### 8.2. 이벤트 전파 방지

이벤트 객체의 stopPropagation 메서드는 이벤트 전파를 중지시킨다.

```html
<!DOCTYPE html>
<html>
  <body>
    <div class="container">
      <button class="btn1">Button 1</button>
      <button class="btn2">Button 2</button>
      <button class="btn3">Button 3</button>
    </div>
    <script>
      // 이벤트 위임. 클릭된 하위 버튼 요소의 color를 변경한다.
      document.querySelector(".container").onclick = ({ target }) => {
        if (!target.matches(".container > button")) return;
        target.style.color = "red";
      };

      // .btn2 요소는 이벤트를 전파하지 않으므로 상위 요소에서 이벤트를 캐치할 수 없다.
      document.querySelector(".btn2").onclick = (e) => {
        e.stopPropagation(); // 이벤트 전파 중단
        e.target.style.color = "blue";
      };
    </script>
  </body>
</html>
```

위 예제를 살펴보면 상위 DOM 요소인 container 요소에 이벤트를 위임했다.
따라서 하위 DOM 요소에서 발생한 클릭 이벤트를 상위 DOM 요소인
container 요소가 캐치하여 이벤트를 처리한다.

이처럼 stopPropagation 메서드는 하위 DOM 요소의 이벤트를 개별적으로 처리하기 위해
이벤트 전파를 중지 시킨다.

## 9. 이벤트 핸들러 내부의 this

### 9.1. 이벤트 핸들러 어트리뷰트 방식

다음 예제의 handleClick 함수 내부의 this는 전역 객체 window를 가리킨다.

```html
<!DOCTYPE html>
<html>
  <body>
    <button onclick="handleClick()">Click me</button>
    <script>
      function handleClick() {
        console.log(this); // window
      }
    </script>
  </body>
</html>
```

단, 이벤트 핸들러를 호출할 때 인수로 전달한 this는 이벤트를 바인딩한 DOM 요소를 가리킨다.

```html
<!DOCTYPE html>
<html>
  <body>
    <button onclick="handleClick(this)">Click me</button>
    <script>
      function handleClick(button) {
        console.log(button); // 이벤트를 바인딩한 button 요소
        console.log(this); // window
      }
    </script>
  </body>
</html>
```

### 9.2. 이벤트 핸들러 프로퍼티 방식과 addEventListener 메서드 방식

이벤트 핸들러 내부의 this는 이벤트 객체의 currentTarget 프로퍼티와 같다.

```html
<!DOCTYPE html>
<html>
  <body>
    <button class="btn1">0</button>
    <button class="btn2">0</button>
    <script>
      const $button1 = document.querySelector(".btn1");
      const $button2 = document.querySelector(".btn2");

      // 이벤트 핸들러 프로퍼티 방식
      $button1.onclick = function (e) {
        // this는 이벤트를 바인딩한 DOM 요소를 가리킨다.
        console.log(this); // $button1
        console.log(e.currentTarget); // $button1
        console.log(this === e.currentTarget); // true

        // $button1의 textContent를 1 증가시킨다.
        ++this.textContent;
      };

      // addEventListener 메서드 방식
      $button2.addEventListener("click", function (e) {
        // this는 이벤트를 바인딩한 DOM 요소를 가리킨다.
        console.log(this); // $button2
        console.log(e.currentTarget); // $button2
        console.log(this === e.currentTarget); // true

        // $button2의 textContent를 1 증가시킨다.
        ++this.textContent;
      });
    </script>
  </body>
</html>
```

## 10. 이벤트 핸들러에 인수 전달

함수에 인수를 전달하려면 함수를 호출할 때 전달해야 한다.
이벤트 핸들러 프로퍼티와 addEventListener 메서드 방식의 경우 이벤트 핸들러를 브라우저가
호출하기 때문에 함수 호출문이 아닌 함수 자체를 등록해야하기 때문에 인수를 전달할 수 없다.
그러나 인수를 전달할 방법이 전혀 없는 것은 아니다.

```html
<!DOCTYPE html>
<html>
  <body>
    <label>User name <input type="text" /></label>
    <em class="message"></em>
    <script>
      const MIN_USER_NAME_LENGTH = 5; // 이름 최소 길이
      const $input = document.querySelector("input[type=text]");
      const $msg = document.querySelector(".message");

      const checkUserNameLength = (min) => {
        $msg.textContent =
          $input.value.length < min ? `이름은 ${min}자 이상 입력해 주세요` : "";
      };

      // 이벤트 핸들러 내부에서 함수를 호출하면서 인수를 전달한다.
      $input.onblur = () => {
        checkUserNameLength(MIN_USER_NAME_LENGTH);
      };
    </script>
  </body>
</html>
```

또는 이벤트 핸들러를 반환하는 함수를 호출하면서 인수를 전달할 수도 있다.

```html
<!DOCTYPE html>
<html>
  <body>
    <label>User name <input type="text" /></label>
    <em class="message"></em>
    <script>
      const MIN_USER_NAME_LENGTH = 5; // 이름 최소 길이
      const $input = document.querySelector("input[type=text]");
      const $msg = document.querySelector(".message");

      // 이벤트 핸들러를 반환하는 함수
      const checkUserNameLength = (min) => (e) => {
        $msg.textContent =
          $input.value.length < min ? `이름은 ${min}자 이상 입력해 주세요` : "";
      };

      // 이벤트 핸들러를 반환하는 함수를 호출하면서 인수를 전달한다.
      $input.onblur = checkUserNameLength(MIN_USER_NAME_LENGTH);
    </script>
  </body>
</html>
```

checkUserNameLength 함수는 함수를 반환한다.
따라서 `$input.onblur`에는 결국 checkUserNameLength 함수가 반환하는 함수가 바인딩된다.

## 11. 커스텀 이벤트

### 11.1 커스텀 이벤트 생성

이벤트가 발생하면 암묵적으로 생성되는 이벤트 객체는 발생한 이벤트의 종류에 따라 이벤트 타입이 결정된다.
하지만 Event, UIEvent, MouseEvent 같은 이벤트 생성자 함수를 호출하여 명시적으로 생성한
이벤트 객체는 임의의 이벤트 타입을 지정할 수 있다.

이처럼 개발자의 의도로 생성된 이벤트를 커스텀 이벤트라 한다.

```js
// KeyboardEvent 생성자 함수로 keyup 이벤트 타입의 커스텀 이벤트 객체를 생성
const keyboardEvent = new KeyboardEvent("keyup");
console.log(keyboardEvent.type); // keyup

// CustomEvent 생성자 함수로 foo 이벤트 타입의 커스텀 이벤트 객체를 생성
const customEvent = new CustomEvent("foo");
console.log(customEvent.type); // foo
```

생성된 커스텀 이벤트 객체는 버블링되지 않으며 preventDefault 메서드로 취소할 수도 없다.
즉, 커스텀 이벤트 객체는 bubbles와 cancelable 프로퍼터의 값이 false로 기본 설정된다.

```js
// MouseEvent 생성자 함수로 click 이벤트 타입의 커스텀 이벤트 객체를 생성
const customEvent = new MouseEvent("click");
console.log(customEvent.type); // click
console.log(customEvent.bubbles); // false
console.log(customEvent.cancelable); // false
```

커스텀 이벤트 객체의 bubbles 또는 cancelable 프로퍼티를 true로 설정하려면
이벤트 생성자 함수의 두 번쨰 인수로 bubbles 또는 cancelable 프로퍼티를 갖는 객체를 전달한다.

```js
// MouseEvent 생성자 함수로 click 이벤트 타입의 커스텀 이벤트 객체를 생성
const customEvent = new MouseEvent("click", {
  bubbles: true,
  cancelable: true,
});

console.log(customEvent.bubbles); // true
console.log(customEvent.cancelable); // true
```

커스텀 이벤트 객체에는 bubbles 또는 cancelable 프로퍼티 뿐만 아니라
이벤트 타입에 따라 가지는 이벤트 고유의 프로퍼티 값을 지정할 수 있다.

```js
// MouseEvent 생성자 함수로 click 이벤트 타입의 커스텀 이벤트 객체를 생성
const mouseEvent = new MouseEvent("click", {
  bubbles: true,
  cancelable: true,
  clientX: 50,
  clientY: 100,
});

console.log(mouseEvent.clientX); // 50
console.log(mouseEvent.clientY); // 100

// KeyboardEvent 생성자 함수로 keyup 이벤트 타입의 커스텀 이벤트 객체를 생성
const keyboardEvent = new KeyboardEvent("keyup", { key: "Enter" });

console.log(keyboardEvent.key); // Enter
```

이벤트 생성자 함수로 생성한 커스텀 이벤트는 isTrusted 프로퍼티의 값이 언제나 false다.

```js
// InputEvent 생성자 함수로 foo 이벤트 타입의 커스텀 이벤트 객체를 생성
const customEvent = new InputEvent("foo");
console.log(customEvent.isTrusted); // false
```

### 11.2. 커스텀 이벤트 디스패치

생성된 커스텀 이벤트는 dispatchEvent 메서드로 디스패치할 수 있다.
dispatchEvent 메서드에 이벤트 객체를 인수로 전달하면서 호출하면 인수로 전달한
이벤트 타입의 이벤트가 발생한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <button class="btn">Click me</button>
    <script>
      const $button = document.querySelector(".btn");

      // 버튼 요소에 click 커스텀 이벤트 핸들러를 등록
      // 커스텀 이벤트를 디스패치하기 이전에 이벤트 핸들러를 등록해야 한다.
      $button.addEventListener("click", (e) => {
        console.log(e); // MouseEvent {isTrusted: false, screenX: 0, ...}
        alert(`${e} Clicked!`);
      });

      // 커스텀 이벤트 생성
      const customEvent = new MouseEvent("click");

      // 커스텀 이벤트 디스패치(동기 처리). click 이벤트가 발생한다.
      $button.dispatchEvent(customEvent);
    </script>
  </body>
</html>
```

일반적으로 이벤트 핸들러는 비동기처리 방식으로 동작하지만 dispatchEvent 메서드는
이벤트 핸들러를 동기 처리 방식으로 호출한다.

임의의 이벤트 타입을 지정하여 이벤트 객체를 생성하는 경우 일반적으로
CustomEvent 이벤트 생성자 함수를 사용한다.

```js
// CustomEvent 생성자 함수로 foo 이벤트 타입의 커스텀 이벤트 객체를 생성
const customEvent = new CustomEvent("foo");
console.log(customEvent.type); // foo
```

이 정보는 이벤트 객체의 detail 프로퍼티에 담겨 전달된다.

```html
<!DOCTYPE html>
<html>
  <body>
    <button class="btn">Click me</button>
    <script>
      const $button = document.querySelector(".btn");

      // 버튼 요소에 foo 커스텀 이벤트 핸들러를 등록
      // 커스텀 이벤트를 디스패치하기 이전에 이벤트 핸들러를 등록해야 한다.
      $button.addEventListener("foo", (e) => {
        // e.detail에는 CustomEvent 함수의 두 번째 인수로 전달한 정보가 담겨 있다.
        alert(e.detail.message);
      });

      // CustomEvent 생성자 함수로 foo 이벤트 타입의 커스텀 이벤트 객체를 생성
      const customEvent = new CustomEvent("foo", {
        detail: { message: "Hello" }, // 이벤트와 함께 전달하고 싶은 정보
      });

      // 커스텀 이벤트 디스패치
      $button.dispatchEvent(customEvent);
    </script>
  </body>
</html>
```

기존 이벤트 타입이 아닌 임의의 이벤트 타입을 지정하여 커스텀 이벤트 객체를 생성한 경우 반드시
addEventListener 메서드 방식으로 이벤트 핸들러를 등록해야 한다.
