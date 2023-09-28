---
title: 6 ~ 10강
order: 2
---

> SQL 첫걸음 6 ~ 10강의 내용입니다

## 검색 조건 지정하기

데이터를 검색하는 방법에는 열을 지정하는 방법과 행을 지정하는 방법이 있습니다.

```sql
SELECT 열1, 열2 FROM 테이블명 WHERE 조건식
```

### **예제용 테이블: sample21**

| no | name | birthday   | address   |
|---:|:-----|:-----------|:----------|
|  1 | 박준용  | 1976-10-18 | 대구광역시 수성구 |
|  2 | 김재진  | NULL       | 대구광역시 동구  |
|  3 | 홍길동  | NULL       | 서울특별시 마포구 |

### 1. SELECT 구에서 열 지정하기

```sql
SELECT 열1, 열2 FROM 테이블명
```

- no 열과 name 열 선택하기

```sql
SELECT no, name FROM sample21;
```

| no | name |
|---:|:-----|
|  1 | 박준용  |
|  2 | 김재진  |
|  3 | 홍길동  |

### 2. WHERE 구에서 행 지정하기

```sql
SELECT 열 FROM 테이블명 WHERE 조건식
```

- SQL에서는 구의 순서가 정해져 있어 명령어 순서를 바꿔적을 수는 없다.

  - 'SELECT' -> 'WHERE' -> 'FROM'이면 에러 발생

- WHERE 구

  - 생략가능

  - 열과 연산자, 상수로 구성

- no 열의 값이 2인 행만 검색

```sql
SELECT * FROM sample21 WHERE no = 2;
```

| no | name | birthday | address  |
|---:|:-----|:---------|:---------|
|  2 | 김재진  | NULL     | 대구광역시 동구 |

- no 열의 값이 2가 아닌 행만 검색

```sql
SELECT * FROM sample21 WHERE no <> 2;
```

| no | name | birthday   | address   |
|---:|:-----|:-----------|:----------|
|  1 | 박준용  | 1976-10-18 | 대구광역시 수성구 |
|  3 | 홍길동  | NULL       | 서울특별시 마포구 |

### 3. 문자열형의 상수

- name열 값이 '박준용'인 행만 추출

```sql
SELECT * FROM sample21 WHERE name = '박준용';
```

| no | name | birthday   | address   |
|---:|:-----|:-----------|:----------|
|  1 | 박준용  | 1976-10-18 | 대구광역시 수성구 |

### 4. NULL값 검색

- 연산자로 NULL 검색하기

```sql
SELECT * FROM sample21 WHERE birthday IS NULL;
```

| no | name | birthday | address   |
|---:|:-----|:---------|:----------|
|  2 | 김재진  | NULL     | 대구광역시 동구  |
|  3 | 홍길동  | NULL     | 서울특별시 마포구 |

### 5. 비교 연산자

- `=` 연산자

  - 좌변과 우변이 값이 **같을** 경우 참이 된다.

- `<>` 연산자

  - 좌변과 우변이 값이 **같지 않을** 경우 참이 된다.

- `>` 연산자

  - 좌변의 값이 우변의 값보다 **클** 경우 참이 된다.

- `>=` 연산자

  - 좌변의 값이 우변의 값보다 **크거나 같을** 경우 참이 된다.

- `<` 연산자

  - 좌변의 값이 우변의 값보다 **작을** 경우 참이 된다.

- `<=` 연산자
  - 좌변의 값이 우변의 값보다 **작거나 같을** 경우 참이 된다.

## 조건 조합하기

3개의 논리 연산자 `AND`, `OR`, `NOT`을 사용해 조건을 조합하여 세밀하게 검색

### **예제용 테이블: sample24**

| no | a | b | c |
|---:|--:|--:|--:|
|  1 | 1 | 0 | 0 |
|  2 | 0 | 1 | 0 |
|  3 | 0 | 0 | 1 |
|  4 | 2 | 2 | 0 |
|  5 | 0 | 2 | 2 |

### 1. AND로 조합

- 좌우의 조건 모두 참일 경우 AND연산자는 참을 반환

  - 교집합과 같다

- a 열과 b 열이 모두 0이 아닌 행 검색

```sql
SELECT * FROM sample24 WHERE a <> 0 AND b <> 0;
```

| no | a | b | c |
|---:|--:|--:|--:|
|  4 | 2 | 2 | 0 |

### 2. OR로 조합하기

- 좌우의 조건 중 하나만 참일 경우 OR연산자는 참을 반환
- a 열이 0이 아니거나 b열이 0이 아닌 행을 검색

```sql
SELECT * FROM sample24 WHERE a <> 0 OR b <> 0;
```

| no | a | b | c |
|---:|--:|--:|--:|
|  1 | 1 | 0 | 0 |
|  2 | 0 | 1 | 0 |
|  4 | 2 | 2 | 0 |
|  5 | 0 | 2 | 2 |

### 3. AND와 OR을 사용할 경우 주의할 점

- no 열의 값이 1 또는 2인 행을 추출하고 싶은 경우

  - 올바른 조건식

  ```sql
  SELECT * FROM sample24 WHERE no = 1 OR no = 2;
  ```

  - 잘못된 조건식

  ```sql
  SELECT * FROM sample24 WHERE no = 1 OR 2;
  ```

        - '2'가 항상 참이 되기 때문에 올바른 결과가 나오지 않음

- OR 연산자와 AND 연산자를 조합해서 a 열이 1 또는 2이고, b열이 1 또는 2인 행 검색

```sql
SELECT * FROM sample24 WHERE a=1 OR a=2 AND b=1 OR b=2;
```

| no | a | b | c |
|---:|--:|--:|--:|
|  1 | 1 | 0 | 0 |
|  4 | 2 | 2 | 0 |
|  5 | 0 | 2 | 2 |

- 원하는 결과가 나오지 않은 이유?

  - OR 보다 AND 쪽이 우선순위가 높기 때문

  ```sql
  SELECT * FROM sample24 WHERE a=1 OR (a=2 AND b=1) OR b=2;
  ```

  - 해결방법 -> 괄호를 지정해서 우선순위 변경

  ```sql
  SELECT * FROM sample24 WHERE (a=1 OR a=2) AND (b=1 OR b=2);
  ```

### 4. NOT으로 조합

- a열이 0이 아니거나 b열이 0이 아닌 행을 제외한 나머지 행을 검색

```sql
SELECT * FROM sample24 WHERE NOT(a<>0 OR b<>0);
```

| no | a | b | c |
|---:|--:|--:|--:|
|  3 | 0 | 0 | 1 |

## 패턴 매칭에 의한 검색

`LIKE` 술어를 사용하면 문자열의 일부분을 비교하는 '부분 검색'을 할 수 있다.

### **예제용 테이블: sample25**

| no | text                               |
|---:|:-----------------------------------|
|  1 | **SQL**은 RDMS를 조작하는 언어이다           |
|  2 | LIKE에서는 메타문자 &와 \_를 사용할 수 있다       |
|  3 | LIKE는 **SQL**에서 사용할 수 있는 술어 중 하나이다 |

### LIKE로 패턴 매칭

```sql
열명 LIKE '패턴';
```

- `%`는 임의의 문자열을 매치하는 메타문자
- `_`는 임의의 문자 하나를 의미하는 메타문자

- text열에서 'SQL%'을 포함하는 행을 검색 (전방 일치)

```sql
SELECT * FROM sample25 WHERE text LIKE 'SQL%';
```

| no | text                     |
|---:|:-------------------------|
|  1 | **SQL**은 RDMS를 조작하는 언어이다 |

    - no.3이 포함되지 않은 이유는 SQL 앞에 문자열이 존재하기 때문

- text열이 '%SQL%'을 포함하는 행을 검색 (중간 일치)

```sql
SELECT * FROM sample25 WHERE text LIKE '%SQL%';
```

| no | text                               |
|---:|:-----------------------------------|
|  1 | **SQL**은 RDMS를 조작하는 언어이다           |
|  3 | LIKE는 **SQL**에서 사용할 수 있는 술어 중 하나이다 |

    - no.1이 포함된 이유는 %가 빈 문자열에도 매치하기 때문

:pushpin: 간단한 패턴 매칭이라면 `LIKE`로 충분하지만 복잡한 패턴매칭의 경우 정규표현식을 사용하는 편이 낫다.

## 정렬 - ORDER BY

SELECT 명령의 ORDER BY 구를 사용하여 검색결과의 행 순서를 바꿀 수 있습니다.
여기서는 정렬(sort) 방법을 배워보겠습니다.

```sql
SELECT 열명 FROM 테이블명 WHERE 조건식 ORDER BY 열명
```

ORDER BY 구를 지정하지 않을 경우에는 데이터베이스 내부에 저장된 순서로 반환합니다.

언제나 정해진 순서로 결괏값을 얻기 위해서는 ORDER BY구를 지정해야합니다.

### **예제용 테이블: sample31**

| name | age | address   |
|:-----|----:|:----------|
| A씨   |  36 | 대구광역시 중구  |
| B씨   |  18 | 부산광역시 연제구 |
| C씨   |  25 | 서울특별시 중구  |

### 1. ORDER BY로 검색 결과 정렬하기

SELECT 명령의 ORDER BY 구로 정렬하고 싶은 열을 지정합니다.
지정된 열에 따라 행 순서가 변경됩니다.

검색 조건이 필요없는 경우에는 WHERE 구를 생략하는데 이때 ORDER BY 구는 FROM 구의 뒤에 지정합니다.

```sql
SELECT 열명 FROM 테이블명 ORDER BY 열명
```

- age 열의 값을 오름차순으로 정렬하기

```sql
SELECT * FROM sample31 ORDER BY age;
```

| name | age | address   |
|:-----|----:|:----------|
| B씨   |  18 | 부산광역시 연제구 |
| C씨   |  25 | 서울특별시 중구  |
| A씨   |  36 | 대구광역시 중구  |

- address 열로 정렬하기

| name | age | address   |
|:-----|----:|:----------|
| A씨   |  36 | 대구광역시 중구  |
| B씨   |  18 | 부산광역시 연제구 |
| C씨   |  25 | 서울특별시 중구  |


### 2. ORDER BY DESC로 내림차순으로 정렬하기

앞선 예제에서는 오름차순으로 정렬하였습니다. 이와 반대로 내림차순으로도 정렬할 수 있습니다.

```sql
SELECT 열명 FROM 테이블명 ORDER BY 열명 DESC
```

앞선 예제에서 아무것도 지정하지 않았는데 오름차순으로 정렬되었습니다.
오름차순은 내림차순과 달리 생략 가능하며 ASC로 지정할 수 있습니다.

```sql
SELECT 열명 FROM 테이블명 ORDER BY 열명 ASC
```

- age열의 값을 DESC로 내림차순 정렬하기

```sql
SELECT * FROM sample31 ORDER BY age DESC;
```

| name | age | address   |
|:-----|----:|:----------|
| A씨   |  36 | 대구광역시 중구  |
| C씨   |  25 | 서울특별시 중구  |
| B씨   |  18 | 부산광역시 연제구 |

- age열의 값을 ASC로 오름차순 정렬하기

```sql
SELECT * FROM sample31 ORDER BY age ASC;
```

| name | age | address   |
|:-----|----:|:----------|
| B씨   |  18 | 부산광역시 연제구 |
| C씨   |  25 | 서울특별시 중구  |
| A씨   |  36 | 대구광역시 중구  |


### 3. 대소관계

ORDER BY로 정렬할 때는 값의 대소관계가 중요합니다.
수치형 데이터라면 대소관계는 숫자의 크기로 판별하므로 이해하기 쉽습니다.

```
1 < 2 < 10 < 100
```

날짜시간형 데이터도 수치형 데이터와 마찬가지로 숫자 크기로 판별합니다.

```
1999년 < ... 2013년 < 2014년 
```
- 작다 = 이전
- 크다 = 최근

문자열 데이터는 '사전식 순서'에 의해 결정됩니다.

### **예제용 테이블: sample311**

|  a |  b |
|---:|---:|
|  1 |  1 |
|  2 |  2 |
| 10 | 10 |
| 11 | 11 |

- a 열을 오름차순으로 정렬하기
```sql
SELECT * FROM sample311 ORDER BY a;
```

|  a |  b |
|---:|---:|
|  1 |  1 |
| 10 | 10 |
| 11 | 11 |
|  2 |  2 |

:pushpin: 수치형과 문자열형 데이터는 대소관계의 계산 방법이 다르다.

### 4. ORDER BY는 테이블에 영향을 주지 않는다

ORDER BY를 이용해 행 순서를 바꿀 수 있습니다.
SELECT 명령은 데이터를 검색하는 명령입니다. 
이는 테이블 데이터를 참조만할 뿐이며 변경은 하지 않습니다.

## 복수의 열을 지정해 정렬하기

ORDER BY 구로 복수 열을 지정해 정렬하는 방법에 관해 알아보도록 하겠습니다.

```sql
SELECT 열명 FROM 테이블명 WHERE 조건식 
ORDER BY 열명1 [ASC|DESC], 열명2 [ASC|DESC]
```

### **예제용 테이블: sample32**

| a | b |
|--:|--:|
| 1 | 1 |
| 2 | 1 |
| 2 | 2 |
| 1 | 3 |
| 1 | 2 |

### 1. 복수 열로 정렬 지정

- a 열과 b 열로 정렬하기
```sql
SELECT * FROM sample32 ORDER BY a, b;
```
| a | b |
|--:|--:|
| 1 | 1 |
| 1 | 2 |
| 1 | 3 |
| 2 | 1 |
| 2 | 2 |

다음으로 ORDER BY b, a열과 같이 열 지정 순서를 바꾸면 어떻게 되는지 알아보겠습니다.

- b 열과 a 열로 정렬하기
```sql
SELECT * FROM sample32 ORDER BY b,a;
```
| a | b |
|--:|--:|
| 1 | 1 |
| 2 | 1 |
| 1 | 2 |
| 2 | 2 |
| 1 | 3 |

먼저 b 열에서 값의 크기 순서대로 정렬되고, 값이 같은 부분은 a열로 정렬된 것을 알 수 있습니다.

### 2. 정렬방법 지정하기

- a 열 ASC로, b 열 DESC로 정렬하기
```sql
SELECT * FROM sample32 ORDER BY a ASC, b DESC;
```

|   a |    b |
|----:|-----:|
|   1 |    3 |
|   1 |    2 |
|   1 |    1 |
|   2 |    2 |
|   2 |    1 |
| ASC | DESC |

### 3. NULL 값의 정렬 순서

NULL에 관해서는 특성상 대소비교를 할 수 없어 정렬 시에는 별도의 방법으로 취급합니다.
ORDER BY로 지정한 열에서 NULL 값이 가지는 대소비교 방법은 데이터베이스 제품에 따라 기준이 다릅니다.
MySQL의 경우는 NULL 값은 가장 작은 값으로 취급해 ASC(오름차순)에서는 가장 먼저,
DESC(내림차순)에서는 가장 나중에 표시합니다.