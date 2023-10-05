---
title: 오후스튜디오 회원 관리 페이지 개발 후기
---

오후스튜디오에서 일하시는 개발자분과 멘토링하면서 실제 DB테이블을 가지고 회원 관리 페이지를 만들어보자고 제안해주셔서 회원 정보, 요금제 정보를 불러오는 페이지를 만들어봤습니다.

![회원 정보, 요금제 정보 검색](https://github.com/Zamoca42/TIL/assets/96982072/138d0dd1-61e5-4df2-bea5-a8b8b4e695cd)

![회원 정보 업데이트](https://github.com/Zamoca42/TIL/assets/96982072/00721299-eb1d-43d0-b223-6faecb7cacd7)

![요금제 생성](https://github.com/Zamoca42/TIL/assets/96982072/61c750ad-4760-41e2-9dc6-1ff1a8d51f31)

이 프로젝트를 진행하면서 했던 생각들을 후기로 남겨보려고 합니다.

## 프로젝트 시작

이 프로젝트를 시작한 이유는 실제 업무에 사용할 회원 관리 페이지를 만들어보면서 개발 사이클을 경험해보는 목적이였습니다. 그래서 기본 개발 마감 기한을 정하고, 기능을 개발하면 코드리뷰를 진행하고 최종 적용하는 걸로 진행하게 되었습니다.

처음 기술 스택을 정하면서, NestJS, React Admin를 선택하게 되었고 모두 사용해보지 않은 스택이였기 때문에 개발문서를 참고하면서 개발을 진행했습니다. 프로젝트 자체가 학습 + 경험 목적이다보니 많은 기능은 개발할 수 없었지만 최종적으로 목표한 기능을 완성할 수 있어서 많은 경험이 됐습니다.

프로젝트를 진행하면서 생각했던 것들을 정리해보겠습니다.

## 1. Monorepo로 구성

프로젝트를 시작할 때 같은 저 혼자 개발하는 것이기도 하고 같은 TypeScript를 사용하는 NestJS와 React Admin를 사용하기로 하면서 반드시 겹치는 패키지가 생길 것이라고 판단했습니다.

그래서 Monorepo로 프로젝트를 구성하고 관리하기로 했습니다. `Monorepo`는 `Monolithic Repositores`의 약자로 하나의 리포지토리에 여러 개의 프로젝트가 구성된 것을 말합니다.

NestJS는 backend 폴더로 React는 frontend 폴더로 만들어서 관리하고 겹치는 패키지는 최상위에 따로 적용했습니다.

#### 레포지토리 구조

```
ohoo-studio-admin
  ⊢📂 packages
    ⊢📂 backend
      ∟ package.json
    ⊢📂 frontend
      ∟ package.json
    ∟ package.json
```

### Lerna

npm의 workspace 기능을 통해서 `MonoRepo`로 구성할 수 있습니다.
거기에 더해 Lerna는 `MonoRepo`를 사용을 편리하게해주는 도구입니다. 예를 들어, 공통된 패키지가 있다면 최상위 package.json으로 한번에 이동시킬 수 있습니다.
[Lerna에는 다양한 CLI 명령어들이 많습니다.](https://lerna.js.org/docs/api-reference/commands)
몇 가지 명령어를 더 소개하면 `lerna bootstrap` 명령어로 전체 레포지토리 내의 필요한 패키지를 한번에 설치할 수도 있고
`lerna run start --parallel` 명령어로 서버와 프론트의 런타임을 동시에 실행할 수도 있습니다.

## 2. NestJS

### NestJS를 선택한 이유

이번 프로젝트에서 Django와 NestJS 중에 NestJS를 사용하게 되었습니다. 처음 제안해주신 내용으로는 Django에서 기본으로 제공되는 admin을 이용해서 프로젝트 전체를 구성하는 것이였습니다.
하지만 admin의 레이아웃을 수정해야하고 관련문서도 잘 나와있지 않아서 Django admin으로 구성했을 때의 장점을 잘 느낄 수 없었습니다.

그래서 NestJS로 선택했습니다. 프레임워크에서 제공되는 기능이 기술문서에 자세히 나와있어서 필요한 기능을 빠르게 구현할 수 있을거라고 생각했습니다.
추후 다른분께서 프로젝트를 이어나갈 수도 있다고 생각해 구조적일수록 시간이 지나서도 보기쉽고 안정적인 구성이 가능할거 같습니다.

### 서비스 로직 분리

NestJS에서 권장하는 설계에 따라서 서비스를 분리하여 인증, 회원 정보, 구독 정보를 나눠서 작성했습니다.
`auth`, `customer`, `customer-plan`으로 3개의 모듈로 나눴는데 각각 별개의 기능을 담당하기 때문에 기능에 집중해서 구현할 수 있었습니다.

```
📂 backend
  ∟ 📂 src
    ⊢📂 auth
    ⊢📂 customer
    ⊢📂 customer-plan
    ⊢📂 manager
    ⊢app.module.ts
    ∟ man.ts
```

마지막 최상위 모듈에서는 이렇게 사용됩니다.
**backend/src/app.module.ts**

```ts
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ManagerModule } from "./manager/manager.module";
import { CustomerModule } from "./customer/customer.module";
import { ConfigModule } from "@nestjs/config";
import { validate } from "./common/env.validation";
import { CustomerPlanModule } from "./customer-plan/customer-plan.module";

@Module({
  imports: [
    AuthModule,
    ManagerModule,
    CustomerModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      validate,
    }),
    CustomerPlanModule,
  ],
})
export class AppModule {}
```

### TypeScript

NestJS를 선택하게되면서 NestJS에서 기본으로 사용하는 TypeScript도 자연스럽게 선택하게 되었습니다.
자바스크립트의 유연한 타입변환에 익숙했는데 타입스크립트에 적응하는 과정이 힘들었습니다.

서비스로직을 작성할 때 타입 설정에서 반환 타입을 `Object`로 사용하기도 했습니다.
시간이 조금 지난 뒤에야 왜 반환타입을 `Object`로 사용하면 안되는지 모던 자바스크립트를 공부해면서 자바스크립트가 객체 기반의 언어라 `Object`를 사용하면 타입설정이 의미 없다는 것을 알게 되었습니다.

```ts
@Injectable()
export class CustomerService {
  //...
  async findCustomerByUserId(userId: string): Promise<Object> {
    // 여기서 Object를 type으로 설정
    const customer = await this.customerModel.get(userId);
    if (!customer) {
      throw new NotFoundException("고객 아이디를 찾지 못했습니다");
    }
    return plainToClass(CustomerDto, customer);
  }
}
```

타입스크립트 사용에 어느정도 익숙해지고 난 뒤에는 [DTO(Data Transfer Object)](../../js-ts/nest-js/dto.md)를 만들어서
반환 타입을 `Promise<Object>`에 `Object`대신 넣어주게 되었습니다.

```ts
export class CustomerDto extends ExcludeCustomerDto {
  @Expose({ name: "user_id" })
  id: string;

  @Expose()
  email: string;

  @Expose({ name: "phone_number" })
  phoneNumber: string;

  @Expose({ name: "marketing_information_agree_date" })
  marketingInformationAgreeDate: string;

  @Expose({ name: "create_time" })
  createTime: Date;
}
```

### class-transformer

TypeScript에서 리터럴 객체를 클래스 인스턴스로 변환하는 작업에 [class-transformer](https://github.com/typestack/class-transformer#class-transformer)를 사용했습니다.
중첩 객체를 변환하거나 서로 컨벤션이 다른 객체를 한가지로 변환하는 경우에도 유용하게 사용할 수 있었습니다.

#### `plainToClass`

`plainToClass`를 이용해서 리터럴 객체를 클래스 인스턴스로 한번에 변환해줄 수 있었습니다.
기본적으로 클래스 속성으로 선언되어있으면 변환 대상으로 자동으로 인지합니다.

위의 `findCustomerByUserId` 메서드에서 controller에 plainToClass로 변환한 인스턴스를

```ts
@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get("customers/:userId")
  async getCustomer(
    @Param("userId", new ParseIDPipe())
    userId: string
  ): Promise<GetCustomerResponseDto> {
    const customerDto: CustomerDto =
      await this.customerService.findCustomerByUserId(userId);
    return { customerDto };
  }
  //...
}
```

회원 아이디로 get요청이 오면 해당 회원의 정보를 보여줍니다.

```json
{
  "id": "ohoostudio",
  "email": "ohoostudio@email.com",
  "phoneNumber": "+8210123456789"
  //...
}
```

#### 스네이크 케이스 -> 카멜 케이스

class-transformer는 일반적으로 `@Expose()` 데코레이터를 기반으로 프로퍼티를 변환할지 말지 결정합니다.
반대로 제외할 프로퍼티는 `@Exlude()` 데코레이터를 사용할 수 있습니다.

`@Expose()` 서로 이름/컨벤션이 다른 경우에 유용하게 쓸 수 있습니다.
데이터베이스의 스키마에서 스네이크 케이스를 사용했을 때 모델의 스키마를 훼손하지 않으면서 카멜케이스로 변환할 수 있습니다.

```ts
export class CustomerDto extends ExcludeCustomerDto {
  @Expose({ name: "user_id" })
  id: string;

  @Expose()
  email: string;

  @Expose({ name: "phone_number" })
  phoneNumber: string;

  @Expose({ name: "marketing_information_agree_date" })
  marketingInformationAgreeDate: string;

  @Expose({ name: "create_time" })
  createTime: Date;
}
```

만약에 보여주고 싶지 않거나 변환에서 제외하고싶은 프로퍼티가 있다면 `@Exclude`를 사용합니다.

```ts
import { Exclude, Expose } from "class-transformer";

@Exclude()
class ExcludeCustomerDto {
  update_time: Date;

  personal_data_retention_period?: number;

  archive_time?: number;
}
```

하나의 프로퍼티에만 지정해줄 수도 있지만 제외할 프로퍼티가 여러 개라면 클래스 위에 지정하면 한번에 변환에서 제외할 수 있습니다.

#### 중첩 객체 변환

데이터베이스 안의 중첩 객체가 있는 인스턴스를 변환하려는 경우 `@Type()` 데코레이터를 사용해서 변환이 가능합니다.
중첩 객체는 인식을 못하기 때문에 각 프로퍼티에 설정된 객체 타입을 명시적으로 작성해야합니다.

요금제 대한 기간, 종류, 가격 등의 정보가 중첩 객체로 정리되어 있었기 때문에 `@Type()`을 사용했습니다.

```ts
class Limit {
  @Expose()
  type: string;

  @Expose()
  value: number;

  @Expose()
  period: number;
}
```

```ts
export class License {
  @Expose()
  @Type(() => Limit)
  limit: Limit;

  @Expose()
  features: string[];

  @Expose()
  period: number;

  @Expose()
  scope: string;
}
```

## 3. AWS DynamoDB

이번 프로젝트에서 처음으로 NoSQL 데이터베이스인 AWS DynamoDB를 사용해봤습니다.
이미 서비스 중인 테이블이 존재해서 설계를 직접해보진 못해서 아쉬웠습니다.
DynamoDB와 연결할 때 ODM(Object-Document Mapper)인 [Dynamoose](https://dynamoosejs.com/getting_started/Introduction) 사용했습니다.

DynamoDB를 사용하는 방법은 세 가지 있었습니다.

1. aws-sdk
2. dynamoose
3. SQL 호환 쿼리 언어인 PartiQL

초보자도 쉽게 사용할 수 있을 거라 기대하고 Dynamoose를 선택했습니다.
aws-sdk에 비해 DB와 연결하는 방법이 비교적 간단했습니다.
연결 이후 스키마나 모델에 대해서 어떻게 사용하는지는 나와있지만 어떤 원리로 이렇게 되는지에 대해서는 전혀 나와있지 않아서 오류가 있을 때 많이 당황했습니다. Dynamoose 문서의 내용이 부족하다고 생각해서 초보자에게는 별로 추천하고 싶지 않습니다.

이슈가 있으면 AWS의 DynamoDB문서에서 찾는 것이 조금 더 도움이 될거 같습니다.

## 4. React Admin

전체 프로젝트를 제가 해보는 것이다 보니 프론트 페이지를 만들어야 했는데 React Admin를 사용해서 빠르게 만들기로 했습니다.
로그인 페이지는 이미 컴포넌트로 구현되어있기 때문에 `<Admin>` 컴포넌트에 `requireAuth` props를 사용한다면 바로 로그인 페이지를 사용할 수 있었습니다.

```js
const App = () => (
  <UserContextProvider>
    <PlanContextProvider>
      <Admin
        dataProvider={customDataProvider}
        theme={mainTheme}
        layout={CustomLayout}
        authProvider={authProvider}
        requireAuth
      >
        <CustomRoutes>
          <Route path="/" element={<UserTabs />} />
        </CustomRoutes>
      </Admin>
    </PlanContextProvider>
  </UserContextProvider>
);
```

공식문서에 자세히 나와있기도 하고 이미 컴포넌트로 구현되어 있는 기능들이 많아서 초보자도 사용하기 좋다고 생각합니다.
이미 컴포넌트로 구현되어 있는 기능을 커스텀 해야했는데 여기서 시간이 많이 걸렸습니다.

로그인 한 후 바로 단일 회원 정보를 검색하는 페이지를 만들고 싶었는데
목록을 보여주는 list 컴포넌트로 자동으로 이동하게 되어 있어 이미 한덩어리인 컴포넌트를 hook 단위로 커스텀해서
레이아웃에 설정했습니다.

그냥 주어진 컴포넌트를 사용하면 편하겠지만, 원하는 기능만 사용하고싶다면 페이지는 새로 만들고 React Admin에서 제공하는 `useEditController`같은 훅을 사용하는 것이 좋다고 생각합니다.

## 마무리

회사의 레포지토리에서 작업하고 DB의 기간이 제한된 권한만 받았기 때문에 작업물을 보여줄 수 없다는 아쉬움이 있습니다. 
로컬의 코드만 남아있어서 자세한 내용은 [블로그에 주제를 만들어서](../../js-ts/nest-js/) 과정을 작성해보려고합니다.

마감기한을 정하고 개발했기 때문에 스스로 개발계획을 세우고 진행해볼 수 있었고 학습과 병행하면서 작업 하다보니 시간 대비 완성도가 그렇게 높지 않았던거 같습니다.

![프로젝트 동안 작업했던 내용을 개인적으로 기록](https://github.com/Zamoca42/blog/assets/96982072/89f74529-bb45-4de1-8259-a04d71252797)

여러가지 부족했던 점이 많았지만 기술은 부족하더라도 주어진 시간 내에서 목표에 도달하는 것이 개발자가 해야되는 일이라는 것을 깨닫게 된 시간이였습니다.
개발 중에 어떤 내용을 관리자 페이지에서 보여줄 것 인지에 대한 고민이 많았는데 프로젝트가 끝나고 나서 생각해보니 기술적인 내용도 중요하지만 내가 만든 앱을 누가 사용할 건지, 어떤 목적으로 주요 사용되는지 생각해보는게 좋을거 같습니다.
