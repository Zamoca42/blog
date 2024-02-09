---
title: (SQL 첫걸음) 11 ~ 15강
order: 3
category:
  - DB
tag:
  - SQL
---

> SQL 첫걸음 11 ~ 15강의 내용입니다

## 결과 행 제한하기

LIMIT 구로 결과 행을 제한하는 방법에 관해 알아보겠습니다.

```sql
SELECT 열명 FROM 테이블명 LIMIT 행수 [OFFSET 시작행]
```

### **예제용 테이블: sample33**

| no  |
| --- |
| 1   |
| 2   |
| 3   |
| 4   |
| 5   |
| 6   |
| 7   |

### 1. 행수 제한

LIMIT 구는 표준 SQL이 아닌 MySQL과 PostgreSQL에서 사용할 수 있는 문법입니다.
LIMIT 구는 SELECT 명령의 마지막에 지정하는 것으로 WHERE 구나 ORDER BY 구의 뒤에 지정.

```sql
SELECT 열명 FROM 테이블명 WHERE 조건식 ORDER BY 열명 LIMIT 행수
```

LIMIT 다음에는 최대 행수를 수치로 지정합니다.
만약 LIMIT 10으로 지정하면 최대 10개의 행이 클라이언트로 반환.

- LIMIT 3으로 상위 3건만 취득하기

```sql
SELECT * FROM sample33 LIMIT 3;
```

| no  |
| --- |
| 1   |
| 2   |
| 3   |

- 정렬한 후 LIMIT 3으로 상위 3건만 취득하기

```sql
SELECT * FROM sample33 ORDER BY no DESC LIMIT 3;
```

| no  |
| --- |
| 7   |
| 6   |
| 5   |

### 2. 오프셋 지정

- 대량의 데이터를 하나에 페이지에 표시하는 것은 효율적이지 못하므로 페이지네이션 기능을 사용
- 페이지네이션 기능은 LIMIT을 사용해 간단히 구현
- 다음 페이지는 LIMIT 구에 OFFSET으로 지정

- LIMIT 3 OFFSET 0으로 첫 번쨰 페이지에 표시할 데이터 취득

```sql
SELECT * FROM sample33 LIMIT 3 OFFSET 0;
```

| no  |
| --- |
| 1   |
| 2   |
| 3   |

- LIMIT 3 OFFSET 3으로 두 번쨰 페이지에 표시할 데이터 취득

```sql
SELECT * FROM sample33 LIMIT 3 OFFSET 3;
```

| no  |
| --- |
| 4   |
| 5   |
| 6   |

## 수치 연산

SQL은 데이터베이스를 조작하는 언어지만 기본적으로 계산 기능을 포함
여기서는 계산하는 방법, 수치의 연산방법에 대해 알아보자.

```sql
+-*/%MOD
```

### **예제용 테이블: sample34**

| no  | price | quantity |
| --- | ----- | -------- |
| 1   | 100   | 10       |
| 2   | 230   | 24       |
| 3   | 1980  | 1        |

### 1. 사칙 연산

- 연산자 우선순위

| 우선순위 | 연산자 |
| :------- | :----- |
| 1        | \* / % |
| 2        | + -    |

### 2. SELECT 구로 연산하기

- SELECT 구로 가격 × 수량으로 금액 계산하기

```sql
SELECT *, price * quantity FROM sample34;
```

| no  | price | quantity | price \* quantity (계산 결과) |
| --- | ----- | -------- | ----------------------------- |
| 1   | 100   | 10       | 1000                          |
| 2   | 230   | 24       | 5520                          |
| 3   | 1980  | 1        | 1980                          |

### 3. 열의 별명

price \* quantity와 같이 열 이름이 길고 알아보기 어려운 경우는 별명을 붙여
열명을 재지정할 수 있습니다.
예를 들어, price \* quantity에 amount라는 별명을 붙일 수 있다.

- price \* quantity 식에 amount라는 별명 붙이기

```sql
SELECT *, price * quantity AS amount FROM sample34;
```

| no  | price | quantity | amount (별명으로 표시) |
| --- | ----- | -------- | ---------------------- |
| 1   | 100   | 10       | 1000                   |
| 2   | 230   | 24       | 5520                   |
| 3   | 1980  | 1        | 1980                   |

별명은 예약어 AS를 사용해 지정하고 복수의 식을 지정할 수 있습니다.
키워드 AS는 생략할 수 있습니다. 이름에 ASCII 문자 이외의 것을 포함할 경우는 더블쿼드로 둘러싸서 지정

### 4. WHERE 구에서 연산하기

- WHERE 구에서 금액을 계산하고 2000원 이상인 행 검색하기

```sql
SELECT *, price * quantity AS amount FROM sample34
  WHERE price * quantity >= 2000;
```

| no  | price | quantity | amount |
| --- | ----- | -------- | ------ |
| 2   | 230   | 24       | 5520   |

- WHERE 구와 SELECT 구의 내부처리 순서

데이터베이스 서버 내부에서 WHERE 구 -> SELECT 구의 순서로 처리
SELECT 구에서 지정한 별명은 WHERE 구 안에서 사용할 수 없다.

### 5. NULL 값의 연산

프로그래밍 언어에서는 NULL이 0으로도 처리되지만 SQL에서는 NULL 값이 0으로 처리되지 않음
'NULL + 1'의 결괏값은 1이 아닌 NULL입니다.

- NULL + 1
- 1 + NULL
- 1 + 2 \* NULL
- 1 / NULL

:pushpin: NULL로 연산하면 결과는 NULL이 된다.

### 6. ORDER BY 구에서 연산하기

ORDER BY 구에서도 연산할 수 있고 그 결괏값들을 정렬할 수 있습니다.

- ORDER BY 구에서 금액을 계산하고 내림차순으로 정렬하기

```sql
SELECT *, price * quantity AS amount FROM sample34
  ORDER BY price * quantity DESC;
```

| no  | price | quantity | amount |
| --- | ----- | -------- | ------ |
| 2   | 230   | 24       | 5520   |
| 3   | 1980  | 1        | 1980   |
| 1   | 100   | 10       | 1000   |

amount 값이 내림차순으로 정렬. ORDER BY는 SELECT 구보다 나중에 처리

- ORDER BY구에서 별명을 사용해 정렬하기

```sql
SELECT *, price * quantity AS amount FROM sample34
  ORDER BY amount DESC;
```

| no  | price | quantity | amount |
| --- | ----- | -------- | ------ |
| 2   | 230   | 24       | 5520   |
| 3   | 1980  | 1        | 1980   |
| 1   | 100   | 10       | 1000   |

이처럼 SELECT 구에서 지정한 별명을 마치 그런 열이 존재하는 것처럼 ORDER BY 구에서 사용할 수 있음.
한편 WHERE 구에서는 별명을 사용할 수 없었습니다.
서버에서 내부처리가 다음과 같은 순으로 처리되기 때문.

```sql
WHERE 구 -> SELECT 구 -> ORDER BY 구
```

### 7. 함수

연산자 외에 함수를 사용해 연산할 수 있습니다.

```sql
함수(인수1, 인수2...)
```

대부분의 함수는 1개 이상의 인수를 가집니다.
함수도 연산자도 표기 방법이 다를 뿐 같은것을 알 수 있습니다.

### 8. ROUND 함수

연산을 사용할 경우, 경우에 따라 소수점을 가질 수도 있습니다.
이런 경우 반올림을 하는데 이때 사용하는 것이 ROUND 함수 입니다.

- ROUND 함수로 반올림

```sql
SELECT amount, ROUND(amount) FROM sample341;
```

| amount  | round(amount) |
| ------- | ------------- |
| 5961.60 | 5962          |
| 2138.40 | 2138          |
| 1080.00 | 1080          |

- ROUND 함수의 두 번째 인수를 지정해, 소수점 둘째 자리를 반올림

```sql
SELECT amount, ROUND(amount, 1) FROM sample341;
```

| amount  | round(amount, 1) |
| ------- | ---------------- |
| 5961.60 | 5961.6           |
| 2138.40 | 2138.4           |
| 1080.00 | 1080.0           |

두 번째 인수로 -1을 지정하면 1단위, -2를 지정하면 10단위로 반올림할 수 있습니다.

- ROUND 함수의 두 번째 인수를 지정해 10단위를 반올림

```sql
SELECT amount, ROUND(amount, -2) FROM sample341;
```

| amount  | round(amount) |
| ------- | ------------- |
| 5961.60 | 6000          |
| 2138.40 | 2100          |
| 1080.00 | 1100          |

그 외 함수들(더 많은 함수는 메뉴얼 참고)

- SIN, COS 등의 삼각함수
- 루트를 계산하는 SQRT
- 대수를 계산하는 LOG
- 합계를 계산하는 SUM

## 문자열 연산

### 1. 문자열 결합

### 2. SUBSTRING 함수

### 3. TRIM 함수

### 4. CHARACTER_LENGTH 함수

## 날짜 연산

### 1. SQL에서의 날짜

### 2. 날짜의 덧셈과 뺄셈

## CASE 문으로 데이터 변환하기

### 1. CASE 문

### 2. 또 하나의 CASE 문

### 3. CASE를 사용할 경우 주의사항
