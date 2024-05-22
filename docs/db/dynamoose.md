---
title: DynamoDB 연결하기 with NestJS
order: 4
category:
  - DB
tag:
  - NestJS
  - DynamoDB
  - Dynamoose
---

Nest에서는 TypeORM, Prisma, Mongoose 등 다양한 ORM을 사용할 수 있기 때문에
SQL이나 NoSQL 데이터베이스 모두 쉽게 연결할 수 있습니다.

이번 주제에서는 AWS의 대표적인 NoSQL 기반 데이터베이스인 DynamoDB를 Dynamoose를 이용해서 연결해보겠습니다.

## Dynamoose 설치하기

Dynamoose는 MongoDB를 연결하는 Mongoose와 같이
[ODM(Object Document Mapping)][ODM]에 속하는 DynamoDB 모델링 도구 입니다.

Dynamoose를 설치하기위해서 터미널에서 명령어를 입력합니다

```bash
npm install --save dynamoose
```

## DynamoDB 연결하기

DynamoDB 서비스를 이미 사용하고 있다면, 터미널에서 환경변수를 입력하면 연결됩니다.

```bash
export AWS_ACCESS_KEY_ID = "Your AWS Access Key ID"
export AWS_SECRET_ACCESS_KEY = "Your AWS Secret Access Key"
export AWS_REGION = "us-east-1"
```

만약 로컬이나 다른 계정의 DynamoDB를 사용한다면 따로 프로젝트 내에서 config를 설정해서 연결합니다.

- [로컬에서 DynamoDB 사용하기](https://docs.aws.amazon.com/ko_kr/amazondynamodb/latest/developerguide/DynamoDBLocal.html)

```typescript
//dynamoose-config.service.ts

import {
  DynamooseOptionsFactory,
  DynamooseModuleOptions,
} from "nestjs-dynamoose";

export class DynamooseConfigService implements DynamooseOptionsFactory {
  createDynamooseOptions(): DynamooseModuleOptions {
    return {
      aws: {
        region: process.env.AWS_DEFAULT_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      local: "http://localhost:8000",
    };
  }
}
```

이어서 회원 정보를 받아오는 스키마와 모델을 작성해보겠습니다

## 고객 정보 스키마 작성

Dynamoose에서 DynamoDB의 스키마를 설정할 수 있습니다. 각 필드의 이름과 속성, 키 여부를 작성할 수 있습니다.

### [스키마(Schema)란 무엇인가?](https://coding-factory.tistory.com/216)

고객정보 스키마를 작성하면서 각 필드가 무엇을 의미하는지 살펴보겠습니다.

**schema/customer.schema.ts**

```typescript
import { Schema } from "dynamoose";

export const customerSchema = new Schema({
  user_id: {
    type: String,
    hashKey: true,
  },
  email: {
    type: String,
    index: {
      name: "EmailIndex",
      type: "global",
    },
  },
  phone_number: {
    type: String,
    index: {
      name: "PhoneNumberIndex",
      type: "global",
    },
  },
});
```

우선 고객정보 스키마입니다. 유저아이디, 이메일, 전화번호, 마케팅 동의 일자 등이 정의 되어 있습니다. type에서 어떤 속성을 가지는지 보여줍니다.

- [Dynamoose - Attribute Type][Attribute]

### 기본키(Primary Key)

그 다음 user_id에 hashKey가 true로 되어있는데 hashKey는 DynamoDB에서 PK(Primary Key)키를 의미합니다.

PK는 테이블을 생성할 때 반드시 지정해야하는 기본키입니다.

또 PK는 단일 PK와 복합 PK로 나뉘는데 단일 PK는 hashKey하나만 사용하고 복합 PK는 hashKey와 rangeKey를 설정해야합니다.

rangeKey를 사용하면 rangeKey에서 범위를 지정해서 쿼리할 수 있습니다.

- [Amazon DynamoDB의 핵심 구성 요소][AMAZON]

### 글로벌 보조 인덱스 (GSI)

테이블에서 하나 이상의 보조 인덱스를 생성할 수 있습니다. 보조 인덱스를 사용하면 기본키에 대한 쿼리와 보조 인덱스에 대한 쿼리도 사용할 수 있습니다.

여기서 글로벌 보조 인덱스는 PK와 다른 필드를 인덱스로 설정하겠다는 뜻입니다.

### 고객 메타 정보 스키마 추가

**schema/customer-meta.schema.ts**

```typescript
import { Schema } from "dynamoose";

export const customerMetaSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  businessName: String,
  businessItem: String,
});
```

고객메타정보 스키마를 설정했습니다. 고객메타정보 스키마는 유저아이디(id), 사업 이름, 업종을 저장합니다.

고객정보(customer) 스키마와는 유저아이디를 저장하는것만 같고 컨벤션(convention)과 필드가 다른데 다음 주제인 DTO에서 설명해보겠습니다.

## 고객 정보 모델 작성

마지막으로 dynamoose의 model 메서드를 사용해서 위에서 정의한 스키마들로 테이블을 정의해서 불러오거나 생성할 수 있습니다.

**schema/customer.model.ts**

```typescript
import { model } from "dynamoose";
import { customerSchema } from "./customer.schema";
import { Item } from "dynamoose/dist/Item";
import { Model } from "dynamoose/dist/Model";

export class Customer extends Item {
  user_id: string;
  email: string;
  phone_number: string;
}

export const createCustomerModel = (tablePrefix: string): Model<Customer> => {
  return model<Customer>(`${tablePrefix}-studio-service-users`, customerSchema);
};
```

**schema/customer-meta.model.ts**

```typescript
import { model } from "dynamoose";
import { Item } from "dynamoose/dist/Item";
import { customerMetaSchema } from "./customer-meta.schema";
import { Model } from "dynamoose/dist/Model";

export class CustomerMeta extends Item {
  id: string;
  businessName: string;
  businessItem: string;
}

export const createCustomerMetaModel = (
  tablePrefix: string
): Model<CustomerMeta> => {
  return model<CustomerMeta>(
    `${tablePrefix}-studio-service-user-meta`,
    customerMetaSchema
  );
};
```

tablePrefix는 환경에 따라서 개발 환경일 때는 개발용 테이블을 사용하고 실제 프로덕션 환경에서는 서비스용 테이블을 사용할 수 있게 적용했습니다

[ODM]: https://www.dctacademy.com/blog/what-is-object-document-mapper-odm
[AMAZON]: https://docs.aws.amazon.com/ko_kr/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html
[Attribute]: https://dynamoosejs.com/guide/Schema#attribute-types
