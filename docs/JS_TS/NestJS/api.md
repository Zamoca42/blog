---
title: 고객정보 API 만들기
order: 6
---

![회원 정보 검색](https://github.com/Zamoca42/blog/assets/96982072/3cb4e5b5-b460-470e-8c80-f65a1502ed44)

이렇게 클라이언트에서 회원아이디를 입력했을때 회원의 정보를 보여주려고합니다

```json
{
  "id": "sdfsdf333",
  "phoneNumber": "+821099990001",
  "email": "이메일@.com",
  "businessName": "회사이름",
  "businessItem": "사업",
}
```

클라이언트에 이런 API로 보내줘야합니다

[데이터베이스 연결하기](./database.md)에서 고객정보 스키마는 이렇게 작성했습니다.

```typescript
export const customerMetaSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    businessName: String,
    businessItem: String,
  },
);

export const customerSchema = new Schema(
  {
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
  }
);
```

1. `customer`와 `customerMeta`의 컨벤션(convention)을 일치시켜야합니다.
2. 두 개로 이뤄진 데이터베이스 테이블을 하나의 API만들어야 합니다.

2가지의 목표를 생각하면서 작성해야합니다.

customer모듈을 만드는부분은 생략하고 Service, Controller를 작성하고 최종 Response가 어떻게 완성되는지 보겠습니다.

## 서비스 로직 만들기

customer모듈을 만들고 유저아이디를 입력하면 데이터베이스에 쿼리하는 부분을 서비스 로직에 작성했습니다.

**customer/customer.service.ts**
```typescript
@Injectable()
export class CustomerService {
  // import customer.model.ts, customer-meta.model.ts
  private readonly customerModel: Model<Customer>;
  private readonly customerMetaModel: Model<CustomerMeta>;

  constructor(private readonly configService: ConfigService) {
    const tablePrefix = this.configService.get<string>("DYNAMODB_TABLE_PREFIX");
    this.customerModel = createCustomerModel(tablePrefix);
    this.customerMetaModel = createCustomerMetaModel(tablePrefix);
  }

  async findCustomerByUserId(userId: string): Promise<CustomerDto> {
    const customer = await this.customerModel.get(userId);
    if (!customer) {
      throw new NotFoundException("고객 아이디를 찾지 못했습니다");
    }

    return plainToClass(CustomerDto, customer);
  }

  async findCustomerMetaByUserId(userId: string): Promise<CustomerMetaDto> {
    const customerMetaResults = await this.customerMetaModel
      .query("id")
      .eq(userId)
      .exec();

    const customerMeta = customerMetaResults[0];

    if (!customerMeta) {
      throw new NotFoundException("고객의 메타데이터가 없습니다");
    }

    return plainToClass(CustomerMetaDto, customerMeta);
  }
}
```

Dynamoose의 [쿼리](https://dynamoosejs.com/guide/Query)기능을 이용해서 유저아이디를 쿼리합니다.

일치하는 결과가 있으면 [`plainToClass`](https://github.com/typestack/class-transformer#plaintoclass)로 DTO와 데이터베이스 쿼리 결과(자바스크립트 객체)와 매핑합니다.

## Controller 작성

```typescript
@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('customers/:userId')
  async getCustomer(
    @Param('userId', new ParseIDPipe())
    userId: string,
  ): Promise<GetCustomerResponseDto> {
    const customerDto: CustomerDto =
      await this.customerService.findCustomerByUserId(userId);
    const customerMetaDto: CustomerMetaDto =
      await this.customerService.findCustomerMetaByUserId(userId);
    return { ...customerDto, ...customerMetaDto };
  }
}
```

클라이언트에서 `customers/유저아이디`로 GET요청을 보내면 앞서 작성한 서비스 로직을 실행해서 두 로직을 합친 결과를 반환합니다

## Response Body 만들기

**customer/dto/get-customer-response.dto.ts**
```typescript
import { Exclude, Expose } from 'class-transformer';

export class CustomerDto {
  @Expose({ name: 'user_id' })
  id: string;

  @Expose()
  email: string;

  @Expose({ name: 'phone_number' })
  phoneNumber: string;
}

export class CustomerMetaDto {
  @Exclude()
  id: string;

  @Expose()
  businessName: string;

  @Expose()
  businessItem: string;

}


export class GetCustomerResponseDto extends CustomerDto {
  @Exclude()
  id: string;

  @Expose()
  businessName: string;

  @Expose()
  businessItem: string;

}
```

앞서 서비스 로직에서 `plainToClass`를 사용했기 때문에 DTO에서 내보낼 객체는 `@Expose()`로 또는 `@Exclude()`로 제외시킬 수도 있습니다.

또 [`@Expose()`](https://github.com/typestack/class-transformer#exposing-properties-with-different-names)의 옵션으로 다른이름으로 변환해서 내보내는 것도 가능합니다