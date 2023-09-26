---
title: 1 ~ 5강
order: 1
prev: false
---
> SQL 첫걸음 1 ~ 5강의 내용입니다

## 데이터 베이스를 조작하는 언어 SQL

- SQL은 '관계형 데이터베이스 관리 시스템(RDBMS)'을 조작할 때 사용한다.

- 관계형 데이터베이스
    - Oracle
    - DB2
    - SQL Server
    - PostgreSQL
    - MySQL
    - SQLite

## SQL 명령의 종류

- SQL 명령은 크게 3가지로 나뉜다 (조작, 정의, 제어)

    - DML(Data Manipulation Language)  

        - 데이터베이스에 데이터를 추가, 삭제, 갱신 등 데이터를 조작할 때 사용

    - DDL(Data Definition Language)

        - 데이터의 객체를 만들거나 삭제하는 명령어

    - DCL(Data Control Language)

        - 데이터를 제어하는 명령어, 트랜잭션과 데이터 접근 권한을 제어
    
    :pushpin: 트랜잭션에 관해서는 아래에서 설명


## 테이블 조회

```sql
SELECT * FROM 테이블명;
```

- `SELECT`는 DML에 속하는 명령어. '질의'나 '쿼리'로 불리기도 함

- '*'은 '모든 열(Field)'을 의미하는 메타문자

- 대소문자 구별
    ```sql
    select * from sample21;
    Select * From Sample21;
    SELECT * FROM SAMPLE21;
    ```
    - 예약어와 객체명은 대소문자를 구별하지 않는다
    - 책에서는 구분하기 쉽도록 예약어는 대문자, 객체명은 소문자로 표기

## 테이블 구조 참조하기

```sql
DESC 테이블명;
```

- `DESC`는 SQL 명령이 아니다
- 테이블이 가진 열(Field)에 대한 자료형을 알 수 있음

### 자료형

- INTEGER(정수)형

    - 소수점 포함 불가

- CHAR(문자)형    

    - 최대 길이 지정
    - 지정된 길이 만큼 고정되어 저장
    - 최대 길이 보다 작은 문자열의 경우 공백문자로 나머지를 채움

- VARCHAR(문자) 형

    - '가변 길이 문자열' 자료형
    - 데이터 크기에 맞춰 저장공간의 크기도 변경

- DATE 형

    - 연월일 데이터 저장

- TIME 형

    - 시분초 데이터 저장
