---
title: 39. DOM
---

DOM(Document Object Model)은 HTML 문서의 계층적 구조와 정보를 표현하며 이를 제어할 수 있는 API, 즉 프로퍼티와 메서드를 제공하는 트리 자료구조다.

## 1. 노드

### 1.1. HTML 요소와 노드 객체

HTML 요소는 HTML 문서를 구성하는 개별적인 요소를 의미

![그림 39-1. HTML 요소의 구조](https://github.com/Zamoca42/blog/assets/96982072/2e1f1d03-32b3-4c2f-a4fa-4a7d6348ca86)

HTML요소의 어트리뷰트는 어트리뷰트 노드로, HTML 요소의 텍스트 콘텐츠는 텍스트 노드로 변환

![그림 39-2. HTML 요소와 노드 객체](https://github.com/Zamoca42/blog/assets/96982072/46ed82cd-2602-432b-929a-8d8ca09849f4)

HTML 문서는 HTML 요소들의 집합으로 이뤄지며 중첩관계를 갖는다
이 때 요소 간에는 중첩 관계에 의해 계층적 부자(parent-child) 관계가 형성된다.

#### 트리 자료구조

트리 자료구조는 부모 노드와 자식 노드로 구성되어 노드 간의 계층적 구조를 표현하는 비선형 자료구조를 말한다.

하나의 최상위 노드에서 시작한다. 최상위 노드를 루트노드라 한다.
자식 노드가 없는 노드를 리프 노드라 한다.

![그림 39-3. 트리 자료구조](https://github.com/Zamoca42/blog/assets/96982072/9081a622-1691-47e1-b86d-17b1f574b942)

노드 객체들로 구성된 트리 자료구조를 DOM 트리라고 부르기도 한다.

### 1.2. 노드 객체 타입

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

렌더링 엔진은 위 HTML 문서를 파싱하여 다음과 같이 DOM을 생성

![그림 39-4. DOM](https://github.com/Zamoca42/blog/assets/96982072/42994a9b-0ceb-4ef0-9f3f-3d07c17324ea)

이처럼 DOM은 노드 객체의 계층적 구조로 구성된다. 이 중 중요한 노드 타입은 다음과 같이 4가지다

#### 문서 노드

- 루트 노드로서 document 객체를 가리킴
- 전역 객체 window의 document에 바인딩 (window.document)

#### 요소 노드

- HTML 요소를 가리키는 객체
- 요소간의 중첩에 의해 정보를 구조화

#### 어트리뷰트 노드

- 어트리뷰트가 지정된 요소의 요소 노드와 연결
- 참조하거나 변경하려면 먼저 요소 노드에 접근

#### 텍스트 노드

- HTML 요소의 텍스트를 가리키는 객체
- DOM 트리의 최종단
- 텍스트 노드에 접근하려면 먼저 부모 노드인 요소 노드에 접근

### 1.3. 노드 객체의 상속 구조

DOM을 구성하는 노드 객체의 상속 구조는 다음과 같다.

![그림 39-5. 노드 객체의 상속 구조](https://github.com/Zamoca42/blog/assets/96982072/00f5e14e-3d38-4716-b78b-97c562db0063)

input 요소 노드의 객체는 프로토타입 체인에 있는 모든 프로토타입의 프로퍼티나 메스드를 상속받아 사용할 수 있다.

![그림 39-6. input 요소 노드의 객체는 프로토타입 체인](https://github.com/Zamoca42/blog/assets/96982072/e73cc1b5-b351-47f4-be64-63644b65f8f6)

```html
<!DOCTYPE html>
<html>
  <body>
    <input type="text" />
    <script>
      // input 요소 노드 객체를 선택
      const $input = document.querySelector("input");

      // input 요소 노드 객체의 프로토타입 체인
      console.log(
        Object.getPrototypeOf($input) === HTMLInputElement.prototype,
        Object.getPrototypeOf(HTMLInputElement.prototype) ===
          HTMLElement.prototype,
        Object.getPrototypeOf(HTMLElement.prototype) === Element.prototype,
        Object.getPrototypeOf(Element.prototype) === Node.prototype,
        Object.getPrototypeOf(Node.prototype) === EventTarget.prototype,
        Object.getPrototypeOf(EventTarget.prototype) === Object.prototype
      ); // 모두 true
    </script>
  </body>
</html>
```

배열이 객체인 동시에 배열인 것처럼 input 요소 노드 객체도 다음과 같이 다양한 특성을 갖는 객체이며, 이러한 특성을 나타내는 기능들을 상속을 통해 제공받는다.

| input 요소 노드 객체의 특성                                | 프로토타입을 제공하는 객체 |
| ---------------------------------------------------------- | -------------------------- |
| 객체                                                       | Object                     |
| 이벤트를 발생시키는 객체                                   | EventTarget                |
| 트리 자료구조의 노드 객체                                  | Node                       |
| 브라우저가 렌더링할 수 있는 웹 문서의 요소를 표현하는 객체 | Element                    |
| 웹 문서의 요소 중에서 HTML 요소를 표현하는 객체            | HTMLElement                |
| HTML 요소 중에서 input 요소를 표현하는 객체                | HTMLInputElement           |

노드 객체의 상속 구조는 개발자 도구의 Elements 패널 우측의 Properties 패널에서 확인할 수 있다.

![그림 39-7. 노드 객체의 상속 구조](https://github.com/Zamoca42/blog/assets/96982072/947cfe85-2ba6-4cbc-a5a8-c5dd2c4b8b8e)

DOM은 HTML 문서의 계층적 구조와 정보를 표현하는 것은 물론 노드 객체의 종류, 즉 노드 타입에 따라 필요한 기능을 프로퍼티와 메서드의 집합인 DOM API로 제공한다.

이 DOM API를 통해 HTML의 구조나 내용 또는 스타일 등을 동적으로 조작할 수 있다.

## 2. 요소 노드 취득

요소 노드의 취득은 HTML 요소를 조작하는 시작점이다. 이를 위해 DOM은 요소 노드를 취득할 수 있는 다양한 메서드를 제공한다.

### 2.1. id를 이용한 요소 노드 취득

```html
<!DOCTYPE html>
<html>
  <body>
    <ul>
      <li id="apple">Apple</li>
      <li id="banana">Banana</li>
      <li id="orange">Orange</li>
    </ul>
    <script>
      // id 값이 'banana'인 요소 노드를 탐색하여 반환한다.
      // 두 번째 li 요소가 파싱되어 생성된 요소 노드가 반환된다.
      const $elem = document.getElementById("banana");

      // 취득한 요소 노드의 style.color 프로퍼티 값을 변경한다.
      $elem.style.color = "red";
    </script>
  </body>
</html>
```

id 값은 HTML 문서 내의 유일한 값이여야 한다.
HTML 문서 내에는 중복된 id값을 갖는 요소가 여러 개 존재할 가능성이 있다.
이러한 경우 `getElementById` 메서드는 인수로 전달된 id 값을 갖는 첫 번째 요소 노드만 반환한다.
`getElementById` 메서드는 언제나 단 하나의 요소 노드를 반환한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul>
      <li id="banana">Apple</li>
      <li id="banana">Banana</li>
      <li id="banana">Orange</li>
    </ul>
    <script>
      // getElementById 메서드는 언제나 단 하나의 요소 노드를 반환한다.
      // 첫 번째 li 요소가 파싱되어 생성된 요소 노드가 반환된다.
      const $elem = document.getElementById("banana");

      // 취득한 요소 노드의 style.color 프로퍼티 값을 변경한다.
      $elem.style.color = "red";
    </script>
  </body>
</html>
```

만약 인수로 전달된 id 값을 갖는 HTML 요소가 존재하는 경우 `getElementById` 메서드는 null을 반환한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul>
      <li id="apple">Apple</li>
      <li id="banana">Banana</li>
      <li id="orange">Orange</li>
    </ul>
    <script>
      // id 값이 'grape'인 요소 노드를 탐색하여 반환한다. null이 반환된다.
      const $elem = document.getElementById("grape");

      // 취득한 요소 노드의 style.color 프로퍼티 값을 변경한다.
      $elem.style.color = "red";
      // -> TypeError: Cannot read property 'style' of null
    </script>
  </body>
</html>
```

### 2.2. 태그 이름을 이용한 요소 노드를 취득

Document.prototype/Element.prototype.getElementsByTagName 메서드는 인수로 전달한 태그 이름을 갖는 모든 요소 노드들을 탐색하여 반환한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul>
      <li id="apple">Apple</li>
      <li id="banana">Banana</li>
      <li id="orange">Orange</li>
    </ul>
    <script>
      // 태그 이름이 li인 요소 노드를 모두 탐색하여 반환한다.
      // 탐색된 요소 노드들은 HTMLCollection 객체에 담겨 반환된다.
      // HTMLCollection 객체는 유사 배열 객체이면서 이터러블이다.
      const $elems = document.getElementsByTagName("li");

      // 취득한 모든 요소 노드의 style.color 프로퍼티 값을 변경한다.
      // HTMLCollection 객체를 배열로 변환하여 순회하며 color 프로퍼티 값을 변경한다.
      [...$elems].forEach((elem) => {
        elem.style.color = "red";
      });
    </script>
  </body>
</html>
```

getElementsByTagName 메서드가 반환하는 DOM 컬렉션 객체인 HTMLCollection 객체는 유사 배열 객체이면서 이터러블이다.

![그림 39-8. HTMLCollection](https://github.com/Zamoca42/blog/assets/96982072/3429f874-45c2-4144-b6c7-19eab186fdbb)

### 2.3. class를 이용한 요소 노드 취득

Document.prototype/Element.prototype.getElementsByClassName 메서드는 인수로 전달한 class 어트리뷰트 값을 갖는 모든 요소 노드들을 탐색하여 반환한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul>
      <li class="fruit apple">Apple</li>
      <li class="fruit banana">Banana</li>
      <li class="fruit orange">Orange</li>
    </ul>
    <script>
      // class 값이 'fruit'인 요소 노드를 모두 탐색하여 HTMLCollection 객체에 담아 반환한다.
      const $elems = document.getElementsByClassName("fruit");

      // 취득한 모든 요소의 CSS color 프로퍼티 값을 변경한다.
      [...$elems].forEach((elem) => {
        elem.style.color = "red";
      });

      // class 값이 'fruit apple'인 요소 노드를 모두 탐색하여 HTMLCollection 객체에 담아 반환한다.
      const $apples = document.getElementsByClassName("fruit apple");

      // 취득한 모든 요소 노드의 style.color 프로퍼티 값을 변경한다.
      [...$apples].forEach((elem) => {
        elem.style.color = "blue";
      });
    </script>
  </body>
</html>
```

### 2.4. CSS 선택자를 이용한 요소 노드 취득

CSS 선택자는 스타일을 적용하고자 하는 HTML 요소를 특정할 때 사용하는 문법이다.

```CSS
/* 전체 선택자: 모든 요소를 선택 */
* { ... }
/* 태그 선택자: 모든 p 태그 요소를 모두 선택 */
p { ... }
/* id 선택자: id 값이 'foo'인 요소를 모두 선택 */
#foo { ... }
/* class 선택자: class 값이 'foo'인 요소를 모두 선택 */
.foo { ... }
/* 어트리뷰트 선택자: input 요소 중에 type 어트리뷰트 값이 'text'인 요소를 모두 선택 */
input[type=text] { ... }
/* 후손 선택자: div 요소의 후손 요소 중 p 요소를 모두 선택 */
div p { ... }
/* 자식 선택자: div 요소의 자식 요소 중 p 요소를 모두 선택 */
div > p { ... }
/* 인접 형제 선택자: p 요소의 형제 요소 중에 p 요소 바로 뒤에 위치하는 ul 요소를 선택 */
p + ul { ... }
/* 일반 형제 선택자: p 요소의 형제 요소 중에 p 요소 뒤에 위치하는 ul 요소를 모두 선택 */
p ~ ul { ... }
/* 가상 클래스 선택자: hover 상태인 a 요소를 모두 선택 */
a:hover { ... }
/* 가상 요소 선택자: p 요소의 콘텐츠의 앞에 위치하는 공간을 선택
   일반적으로 content 프로퍼티와 함께 사용된다. */
p::before { ... }
```

### 2.6. HTMLCollection과 NodeList

HTMLCollection과 NodeList의 중요한 특징은 노드 객체의 상태 변화를 실시간으로 반영하는 살아 있는 객체라는 것이다.

#### HTMLCollection

```html
<!DOCTYPE html>
<head>
  <style>
    .red {
      color: red;
    }
    .blue {
      color: blue;
    }
  </style>
</head>
<html>
  <body>
    <ul id="fruits">
      <li class="red">Apple</li>
      <li class="red">Banana</li>
      <li class="red">Orange</li>
    </ul>
    <script>
      // class 값이 'red'인 요소 노드를 모두 탐색하여 HTMLCollection 객체에 담아 반환한다.
      const $elems = document.getElementsByClassName("red");
      // 이 시점에 HTMLCollection 객체에는 3개의 요소 노드가 담겨 있다.
      console.log($elems); // HTMLCollection(3) [li.red, li.red, li.red]

      // HTMLCollection 객체의 모든 요소의 class 값을 'blue'로 변경한다.
      for (let i = 0; i < $elems.length; i++) {
        $elems[i].className = "blue";
      }

      // HTMLCollection 객체의 요소가 3개에서 1개로 변경되었다.
      console.log($elems); // HTMLCollection(1) [li.red]
    </script>
  </body>
</html>
```

위 예제는 HTMLCollection 객체를 for 문으로 순회하며 className 프로퍼티를 사용하여 모든 요소의 class 값을 'red'에서 'blue'로 변경한다.

![그림 39-9. 예상대로 동작하지 않는다](https://github.com/Zamoca42/blog/assets/96982072/6f05cc4a-ba13-46fd-8bee-71983c8b26e1)

`$elems.length`는 3이므로 for 문의 코드 블록은 3번 반복된다.

HTMLCollection 객체는 실시간으로 노드 객체의 상태를 변경을 반영하여 요소를 제거할 수 있기 때문에
for 문을 순회하면서 노드 객체의 상태를 변경해야할 때 주의해야한다.
이 문제는 for문을 역방향으로 순회하는 방법으로 회피할 수 있다.

```js
// for 문을 역방향으로 순회
for (let i = $elems.length - 1; i >= 0; i--) {
  $elems[i].className = "blue";
}
```

while 문을 사용하여 HTMLCollection 객체에 노드 객체가 남아 있지 않을 때 까지 무한 반복하는 방법으로 회피할 수 있다.

```js
// while 문으로 HTMLCollection에 요소가 남아 있지 않을 때까지 무한 반복
let i = 0;
while ($elems.length > i) {
  $elems[i].className = "blue";
}
```

유사 배열 객체이면서 이터러블인 HTMLCollection 객체를 배열로 변환하면 부작용을 발생시키는 HTMLCollection 객체를 사용할 필요가 없고 유용한 배열의 고차함수를 사용할 수 있다.

```js
// 유사 배열 객체이면서 이터러블인 HTMLCollection을 배열로 변환하여 순회
[...$elems].forEach((elem) => (elem.className = "blue"));
```

#### NodeList

`getElementsByTagName`, `getElementsByClassName` 메서드 대신 querySelectorAll 메서드를 사용하는 방법도 있다.

`querySelectorAll` 메서드는 DOM 컬렉션 객체인 NodeList 객체를 반환한다.

이때 NodeList 객체는 실시간 노드 객체의 상태 변경을 반영하지 않는 객체다.

```js
// querySelectorAll은 DOM 컬렉션 객체인 NodeList를 반환한다.
const $elems = document.querySelectorAll(".red");

// NodeList 객체는 NodeList.prototype.forEach 메서드를 상속받아 사용할 수 있다.
$elems.forEach((elem) => (elem.className = "blue"));
```

## 3. 노드 탐색

```html
<ul id="fruits">
  <li class="apple">Apple</li>
  <li class="banana">Banana</li>
  <li class="orange">Orange</li>
</ul>
```

ul#fruits 요소는 3개의 자식 요소를 갖는다.
먼저 li.banana 요소 노드를 취득한 다음, 형제 노드를 탐색하거나 부모 노드를 탐색할 수 있다.

![그림 39-10. 트리 노드 탐색 프로퍼티](https://github.com/Zamoca42/blog/assets/96982072/34aa4a9f-2e61-4c3e-8c9d-a573dd71189f)

parentNode, previousSibling, firstChild, childNodes 프로퍼티 Node.prototype이 제공하고, 프로퍼티 키에 Element가 포함된 previousElementSibling, nextElementSibling과 children 프로퍼티는 Element.prototype이 제공된다.

![그림 39-11. 읽기 전용 접근자 프로퍼티](https://github.com/Zamoca42/blog/assets/96982072/df622570-f573-405a-b76b-83921ae7ae94)

### 3.1. 공백 텍스트 노드

HTML 요소 사이의 스페이스, 탭, 줄바꿈 등의 공백 문자는 텍스트 노드를 생성한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li class="apple">Apple</li>
      <li class="banana">Banana</li>
      <li class="orange">Orange</li>
    </ul>
  </body>
</html>
```

![그림 39-12. 공백 문자는 텍스트 노드를 생성한다](https://github.com/Zamoca42/blog/assets/96982072/75859933-ee29-47c7-9973-8d58cce6514e)

### 3.2. 자식 노드 탐색

- Node.prototype.childNodes

  - 자식 노드를 모두 탐색하여 NodeList에 담아 반환
  - 텍스트 노드도 포함

- Element.prototype.children
  - 요소 노드만 모두 탐색하여 HTMLCollection에 담아 반환
  - children 프로퍼티가 반환한 HTMLCollection에는 텍스트 노드가 포함되지 않음

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li class="apple">Apple</li>
      <li class="banana">Banana</li>
      <li class="orange">Orange</li>
    </ul>
  </body>
  <script>
    // 노드 탐색의 기점이 되는 #fruits 요소 노드를 취득한다.
    const $fruits = document.getElementById("fruits");

    // #fruits 요소의 모든 자식 노드를 탐색한다.
    // childNodes 프로퍼티가 반환한 NodeList에는 요소 노드뿐만 아니라 텍스트 노드도 포함되어 있다.
    console.log($fruits.childNodes);
    // NodeList(7) [text, li.apple, text, li.banana, text, li.orange, text]

    // #fruits 요소의 모든 자식 노드를 탐색한다.
    // children 프로퍼티가 반환한 HTMLCollection에는 요소 노드만 포함되어 있다.
    console.log($fruits.children);
    // HTMLCollection(3) [li.apple, li.banana, li.orange]

    // #fruits 요소의 첫 번째 자식 노드를 탐색한다.
    // firstChild 프로퍼티는 텍스트 노드를 반환할 수도 있다.
    console.log($fruits.firstChild); // #text

    // #fruits 요소의 마지막 자식 노드를 탐색한다.
    // lastChild 프로퍼티는 텍스트 노드를 반환할 수도 있다.
    console.log($fruits.lastChild); // #text

    // #fruits 요소의 첫 번째 자식 노드를 탐색한다.
    // firstElementChild 프로퍼티는 요소 노드만 반환한다.
    console.log($fruits.firstElementChild); // li.apple

    // #fruits 요소의 마지막 자식 노드를 탐색한다.
    // lastElementChild 프로퍼티는 요소 노드만 반환한다.
    console.log($fruits.lastElementChild); // li.orange
  </script>
</html>
```

### 3.3. 자식 노드 존재 확인

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits"></ul>
  </body>
  <script>
    // 노드 탐색의 기점이 되는 #fruits 요소 노드를 취득한다.
    const $fruits = document.getElementById("fruits");

    // hasChildNodes 메서드는 텍스트 노드를 포함하여 자식 노드의 존재를 확인한다.
    console.log($fruits.hasChildNodes()); // true

    // 자식 노드 중에 텍스트 노드가 아닌 요소 노드가 존재하는지는 확인한다.
    console.log(!!$fruits.children.length); // 0 -> false
    // 자식 노드 중에 텍스트 노드가 아닌 요소 노드가 존재하는지는 확인한다.
    console.log(!!$fruits.childElementCount); // 0 -> false
  </script>
</html>
```

## 4. 노드 정보 취득

노드 객체에 대한 정보를 취득하려면 다음과 같은 노드 정보 프로퍼티를 사용

- Node.prototype.nodeType

  - 노드 객체의 종류로 노드 타입을 나타내는 상수를 반환
  - Node.ELEMENT_NODE: 요소 노드 타입을 나타내는 상수 1을 반환
  - Node.TEXT_NODE: 텍스트 노드 타입을 나타내는 상수 3을 반환
  - Node.DOCUMENT_NODE: 문서 노드 타입을 나타내는 상수 9를 반환

- Node.prototype.nodeName
  - 노드의 이름을 문자열로 반환
  - 요소 노드: 대문자 문자열로 태그 이름을 반환
  - 텍스트 노드: 문자열 "#text"를 반환
  - 문서 노드: 문자열 "#document"를 반환

## 5. 요소 노드의 텍스트 조작

### 5.1. nodeValue

노드 객체의 nodeValue 프로퍼티를 참조하면 노드 객체의 값을 반환
노드 객체의 값이란 텍스트 노드의 텍스트다.
텍스트가 아닌 노드의 nodeValue 프로퍼티를 참조하면 null을 반환한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="foo">Hello</div>
  </body>
  <script>
    // 문서 노드의 nodeValue 프로퍼티를 참조한다.
    console.log(document.nodeValue); // null

    // 요소 노드의 nodeValue 프로퍼티를 참조한다.
    const $foo = document.getElementById("foo");
    console.log($foo.nodeValue); // null

    // 텍스트 노드의 nodeValue 프로퍼티를 참조한다.
    const $textNode = $foo.firstChild;
    console.log($textNode.nodeValue); // Hello
  </script>
</html>
```

### 5.2. textContent

Node.prototype.textContent 프로퍼티는 setter와 getter 모두 존재하는 접근자 프로퍼티로서 요소 노드의 텍스트와 모든 자손 노드의 텍스트를
모두 취득하거나 변경한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="foo">Hello <span>world!</span></div>
  </body>
  <script>
    // #foo 요소 노드는 텍스트 노드가 아니다.
    console.log(document.getElementById("foo").nodeValue); // null
    // #foo 요소 노드의 자식 노드인 텍스트 노드의 값을 취득한다.
    console.log(document.getElementById("foo").firstChild.nodeValue); // Hello
    // span 요소 노드의 자식 노드인 텍스트 노드의 값을 취득한다.
    console.log(document.getElementById("foo").lastChild.firstChild.nodeValue); // world!
  </script>
</html>
```

![그림 39-13. textContent 프로퍼티에 의한 텍스트 취득]()

## 6. DOM 조작

DOM 조작은 새로운 노드를 생성하여 DOM에 추가하거나 기존 노드를 삭제 또는 교체하는 것을 말한다.
DOM 조작에 의해 DOM에 새로운 노드가 추가되거나 삭제되면 리플로우 리페인트가 발생하는 원인이 되므로 성능에 영향을 준다.

### 6.1. innerHTML

요소 노드의 innerHTML 프로퍼티를 참조하면 요소 노드의 콘텐츠 영역 내에 포함된 모든 HTML 마크업을 문자열로 반환

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="foo">Hello <span>world!</span></div>
  </body>
  <script>
    // #foo 요소의 콘텐츠 영역 내의 HTML 마크업을 문자열로 취득한다.
    console.log(document.getElementById("foo").innerHTML);
    // "Hello <span>world!</span>"
  </script>
</html>
```

![그림 39-16. innerHTML 프로퍼티에 의한 HTML 마크업 취득](https://github.com/Zamoca42/blog/assets/96982072/8382c404-7c43-4c75-a273-4a300ba63403)

요소 노드의 innerHTML 프로퍼티에 문자열을 할당하면 요소 노드의 모든 자식 노드가 제거되고 할당한 문자열에 포함되어 있는
HTML 마크업이 파싱되어 요소 노드의 자식 노드로 DOM에 반영

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="foo">Hello <span>world!</span></div>
  </body>
  <script>
    // HTML 마크업이 파싱되어 요소 노드의 자식 노드로 DOM에 반영된다.
    document.getElementById("foo").innerHTML = "Hi <span>there!</span>";
  </script>
</html>
```

![그림 39-17. innerHTML 프로퍼티에 의한 DOM 조작](https://github.com/Zamoca42/blog/assets/96982072/5615e3b7-2c1d-4157-ad8f-789e5115082d)

사용자로부터 입력받은 데이터를 그대로 innerHTML프로퍼티에 할당하는 것은 크로스 사이트 스크립팅 공격에 취약하다.

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="foo">Hello</div>
  </body>
  <script>
    // innerHTML 프로퍼티로 스크립트 태그를 삽입하여 자바스크립트가 실행되도록 한다.
    // HTML5는 innerHTML 프로퍼티로 삽입된 script 요소 내의 자바스크립트 코드를 실행하지 않는다.
    document.getElementById('foo').innerHTML
      = '<script>alert(document.cookie)</script>';
  </script>
</html>
```

:::info HTML sanitization

크로스 사이트 스크립팅 공격을 예방하기 위해 잠재적 위험을 제거하는 기능을 말한다.
DOMPurify 라이브러리를 사용하는 것을 권장한다.

잠재적 위험을 내포한 HTML 마크업을 새니티제이션하여 잠재적 위험을 제거한다.

```js
DOMPurify.sanitize('<img src="x" onerror="alert(document.cookie)">');
```

:::

### 6.2. insertAdjacentHTML 메서드

insertAdjacentHTML 메서드는 두 번째 인수로 전달한 HTML 마크업 문자열을 파싱하고 그 결과로 생성된 노드를 첫 번쨰 인수로 전달한
위치에 삽입하여 DOM에 반영한다.

![그림 39-18. insertAdjacentHTML 메서드](https://github.com/Zamoca42/blog/assets/96982072/34b409fa-9238-40d4-a6ab-f555e97791ec)

```html
<!DOCTYPE html>
<html>
  <body>
    <!-- beforebegin -->
    <div id="foo">
      <!-- afterbegin -->
      text
      <!-- beforeend -->
    </div>
    <!-- afterend -->
  </body>
  <script>
    const $foo = document.getElementById("foo");

    $foo.insertAdjacentHTML("beforebegin", "<p>beforebegin</p>");
    $foo.insertAdjacentHTML("afterbegin", "<p>afterbegin</p>");
    $foo.insertAdjacentHTML("beforeend", "<p>beforeend</p>");
    $foo.insertAdjacentHTML("afterend", "<p>afterend</p>");
  </script>
</html>
```

단, innerHTML 프로퍼티와 마찬가지로 HTML 마크업 문자열을 파싱하므로 크로스 사이트 스크립팅 공격에 취약하다.

### 6.3. 노드 생성과 추가

DOM은 노드를 직접 생성/삽입/삭제/치환하는 메서드도 제공한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li>Apple</li>
    </ul>
  </body>
  <script>
    const $fruits = document.getElementById("fruits");

    // 1. 요소 노드 생성
    const $li = document.createElement("li");

    // 2. 텍스트 노드 생성
    const textNode = document.createTextNode("Banana");

    // 3. 텍스트 노드를 $li 요소 노드의 자식 노드로 추가
    $li.appendChild(textNode);

    // 4. $li 요소 노드를 #fruits 요소 노드의 마지막 자식 노드로 추가
    $fruits.appendChild($li);
  </script>
</html>
```

## 7. 어트리뷰트

### 7.1. 어트리뷰트 노드와 attributes 프로퍼티

HTML 요소의 동작을 제어하기 위한 추가적인 정보를 제공하는 HTML 어트리뷰트는 HTML 요소의 시작 태그에
어트리뷰트 이름 = "어트리뷰트 값" 형식으로 정의한다.

```html
<input id="user" type="text" value="ungmo2" />
```

![그림 39-31. 요소 노드의 attributes 프로퍼티](https://github.com/Zamoca42/blog/assets/96982072/f0d2ec65-aa57-4cfe-8173-1078e19bbfc5)

attributes 프로퍼티는 getter만 존재하는 읽기 전용 접근자 프로퍼티이며,
요소 노드의 모든 어트리뷰트 노드의 참조가 담긴 NamedNodeMap 객체를 반환한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <input id="user" type="text" value="ungmo2" />
    <script>
      // 요소 노드의 attribute 프로퍼티는 요소 노드의 모든 어트리뷰트 노드의 참조가 담긴 NamedNodeMap 객체를 반환한다.
      const { attributes } = document.getElementById("user");
      console.log(attributes);
      // NamedNodeMap {0: id, 1: type, 2: value, id: id, type: type, value: value, length: 3}

      // 어트리뷰트 값 취득
      console.log(attributes.id.value); // user
      console.log(attributes.type.value); // text
      console.log(attributes.value.value); // ungmo2
    </script>
  </body>
</html>
```

### 7.2. HTML 어트리뷰트 조작

attributes 프로퍼티는 getter만 존재하는 읽기 전용 접근자 프로퍼티로 HTML 어트리뷰트 값을 취득할 수 있지만 변경할 수는 없다.

```html
<!DOCTYPE html>
<html>
  <body>
    <input id="user" type="text" value="ungmo2" />
    <script>
      const $input = document.getElementById("user");

      // value 어트리뷰트 값을 취득
      const inputValue = $input.getAttribute("value");
      console.log(inputValue); // ungmo2

      // value 어트리뷰트 값을 변경
      $input.setAttribute("value", "foo");
      console.log($input.getAttribute("value")); // foo
    </script>
  </body>
</html>
```

## 8. 스타일

### 8.1. 인라인 스타일 조작

HTMLElement.prototype.style 프로퍼티는 setter와 getter 모두 존재하는 접근자 프로퍼티로서
요소 노드의 인라인 스타일을 취득하거나 추가 또는 변경한다.

![그림 39-34. style 프로퍼티에 의한 인라인 스타일 조작](https://github.com/Zamoca42/blog/assets/96982072/7dd82402-5f43-4ee6-84dc-49f884004a28)

style 프로퍼티를 참조하면 CSSStyleDeclaration 객체는 다양한 CSS 프로퍼티에 대응하는 프로퍼티를 가지고 있으며, 이 프로퍼티에 값을 할당하면 해당 CSS 프로퍼티가 인라인 스타일로 HTML 요소에 추가되거나 변경된다.

```js
$div.style.backgroundColor = "yellow";
```

### 8.2. 클래스 조작

HTML 요소의 class 어트리뷰트 값을 변경하여 HTML 요소의 스타일을 변경할 수도 있다.
이때 HTML 요소의 class 어트리뷰트를 조작하려면 class 어트리뷰트에 대응하는 요소 노드의 DOM 프로퍼티를 사용한다.

#### className

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .box {
        width: 100px;
        height: 100px;
        background-color: antiquewhite;
      }
      .red {
        color: red;
      }
      .blue {
        color: blue;
      }
    </style>
  </head>
  <body>
    <div class="box red">Hello World</div>
    <script>
      const $box = document.querySelector(".box");

      // .box 요소의 class 어트리뷰트 값을 취득
      console.log($box.className); // 'box red'

      // .box 요소의 class 어트리뷰트 값 중에서 'red'만 'blue'로 변경
      $box.className = $box.className.replace("red", "blue");
    </script>
  </body>
</html>
```

#### classList

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .box {
        width: 100px;
        height: 100px;
        background-color: antiquewhite;
      }
      .red {
        color: red;
      }
      .blue {
        color: blue;
      }
    </style>
  </head>
  <body>
    <div class="box red">Hello World</div>
    <script>
      const $box = document.querySelector(".box");

      // .box 요소의 class 어트리뷰트 정보를 담은 DOMTokenList 객체를 취득
      // classList가 반환하는 DOMTokenList 객체는 HTMLCollection과 NodeList와 같이
      // 노드 객체의 상태 변화를 실시간으로 반영하는 살아 있는(live) 객체다.
      console.log($box.classList);
      // DOMTokenList(2) [length: 2, value: "box blue", 0: "box", 1: "blue"]

      // .box 요소의 class 어트리뷰트 값 중에서 'red'만 'blue'로 변경
      $box.classList.replace("red", "blue");
    </script>
  </body>
</html>
```

## 9. DOM 표준

DOM은 현재 다음과 같이 4개의 버전이 있다.

| 레벨        | 표준 문서 URL                          |
| :---------- | :------------------------------------- |
| DOM Level 1 | https://www.w3.org/TR/REC-DOM-Level-1  |
| DOM Level 2 | https://www.w3.org/TR/DOM-Level-2-Core |
| DOM Level 3 | https://www.w3.org/TR/DOM-Level-3-Core |
| DOM Level 4 | https://dom.spec.whatwg.org            |
