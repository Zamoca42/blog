---
title: 오후스튜디오 회원 관리 페이지 개발 후기
---

오후스튜디오에서 일하시는 개발자분과 멘토링하면서 실제 DB테이블을 가지고 회원 관리 페이지를 만들어보자고 제안해주셔서 회원 정보, 요금제 정보를 불러오는 페이지를 만들어봤습니다.

![update2](https://github.com/Zamoca42/TIL/assets/96982072/138d0dd1-61e5-4df2-bea5-a8b8b4e695cd)

![update](https://github.com/Zamoca42/TIL/assets/96982072/00721299-eb1d-43d0-b223-6faecb7cacd7)

![LicenseCreate](https://github.com/Zamoca42/TIL/assets/96982072/61c750ad-4760-41e2-9dc6-1ff1a8d51f31)

이 프로젝트를 진행하면서 했던 생각들을 후기로 남겨보려고 합니다.

## 프로젝트 시작

이 프로젝트를 시작한 이유는 실제 업무에 사용할 회원 관리 페이지를 만들어보면서 개발 사이클을 경험해보는 목적이였습니다. 그래서 기본 개발 마감 기한을 정하고, 기능을 개발하면 코드리뷰를 진행하고 최종 적용하는 걸로 진행하게 되었습니다.

처음 기술 스택을 정하면서, NestJS, React Admin를 선택하게 되었고 모두 사용해보지 않은 스택이였기 때문에 개발문서를 참고하면서 개발을 진행했습니다. 프로젝트 자체가 학습 + 경험 목적이다보니 많은 기능은 개발할 수 없었지만 최종적으로 목표한 기능을 완성할 수 있어서 많은 경험이 됐습니다.

프로젝트를 진행하면서 생각했던 것들을 정리해보겠습니다.

## 1. Monorepo로 구성

프로젝트를 시작할 때 같은 저 혼자 개발하는 것이기도 하고 같은 TypeScript를 사용하는 NestJS와 React Admin를 사용하기로 하면서 반드시 겹치는 패키지가 생길 것이라고 판단했습니다.

그래서 Monorepo로 프로젝트를 구성하고 관리하기로 했습니다. Monorepo는 Monolithic Repositores의 약자로 하나의 리포지토리에 여러개의 프로젝트가 구성된 것을 말합니다.

NestJS는 backend 폴더로 React는 frontend 폴더로 만들어서 관리하고 겹치는 패키지는 최상위에 따로 적용했습니다.

#### 레포지토리 구조

```
ohoo-studio-admin
  ⊢:open_file_folder: backend
    ∟ package.json
  ⊢:open_file_folder: frontend
    ∟ package.json
  ∟ package.json
```

### Lerna 적용

npm의 workspace 기능을 통해서 MonoRepo로 구성할 수 있습니다. 거기에 Lerna를 사용해서 패키지 관리를 편하게 할 수 있습니다. 
[Lerna에는 다양한 CLI 명령어들이 많습니다.](https://lerna.js.org/docs/api-reference/commands)
`lerna bootstrap` 명령어로 전체 레포지토리 내의 필요한 패키지를 설치할 수도 있고
`lerna run start --parallel` 명령어로 서버와 프론트의 런타임을 동시에 실행할 수도 있습니다.

## 2. NestJS

### NestJS를 선택한 이유

이번 프로젝트에서 Django와 NestJS 중에 NestJS를 사용하게 되었습니다. 처음 제안해주신 내용으로는 Django에서 기본으로 제공되는 admin을 이용해서 프로젝트 전체를 구성하는 것이였습니다.
하지만 admin의 레이아웃을 수정해야하고 관련문서도 잘 나와있지 않아서 Django admin으로 구성했을 때의 장점을 잘 느낄 수 없었습니다.

그래서 NestJS로 선택했습니다. 프레임워크에서 제공되는 기능이 기술문서에 자세히 나와있어서 필요한 기능을 빠르게 구현할 수 있을거라고 생각했습니다.
추후 다른분께서 프로젝트를 이어나갈 수도 있다고 생각해 구조적일수록 다른분이 보기쉽고 안정적인 구성이 가능할거 같습니다.

### 서비스 로직 분리

NestJS에서 권장하는 설계에 따라서 서비스를 분리하여 인증, 회원 정보, 구독 정보를 나눠서 작성했습니다.
디렉터리 `auth`, `customer`, `customer-plan`으로 3개의 모듈로 나눴는데 각각 별개의 기능을 담당하기 때문에 기능에 집중해서 구현할 수 있어서 좋았습니다.

```
:open_file_folder: backend
  ∟ :open_file_folder: src
    ⊢:open_file_folder: auth
    ⊢:open_file_folder: customer
    ⊢:open_file_folder: customer-plan
    ⊢:open_file_folder: manager
    ⊢app.module.ts
    ∟ man.ts
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
    const customer = await this.customerModel.get(userId);
    if (!customer) {
      throw new NotFoundException("고객 아이디를 찾지 못했습니다");
    }
    return plainToClass(CustomerDto, customer);
  }
}
```

타입스크립트 사용에 어느정도 익숙해지고 난 뒤에는 [DTO(Data Transfer Object)](../../js-ts/nest-js/dto.md)를 생성해서
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

## 3. Dynamoose

1. aws-sdk
2. dynamoose
3. SQL 호환 쿼리 언어인 PartiQL

비교적 설정이 간단함
이미 설계된 DB로 서비스 중이 있었기 때문에 직접 쿼리 해볼 수도 있었겠지만
Mongoose와 비슷한 ODM(Object-Document Mapper)인 Dynamoose 사용

개발문서의 내용이 불친절함 어떻게 사용하는지는 나와있지만 어떤 원리로 이렇게 되는지에 대해서는 전혀 나와있지 않음.
AWS의 DynamoDB문서와 대조해가며 찾아보는데 시간이 많이 걸림

## 4. React Admin

React에 대해서 전혀 모름
이미 있는 컴포넌트들을 사용
그러나 커스텀하기 굉장히 까다로움
Hook들이 유용함

## 마무리

코드를 올릴 수 없어서 [블로그 주제를 만들어서](../../js-ts/nest-js/) 자세히 작성해보려고함

기본적인 디버깅방법 등 스킬, 개발 방법에 대해 배우고 생각할 수 있는 시간이였음
마감기한을 정하고 개발했기 때문에 스스로 개발계획을 세우고 진행해볼 수 있었음
학습하면서 하다보니 개발시간 대비 완성도가 그렇게 높지 않았던거 같아서 아쉬움

![옵시디언 사진]()

최종적으로 

다음엔 나만의 아이디어를 가지고 사이드 프로젝트를 진행해보고 싶음
퍼블릭 레포가 아니라 아쉬움
직접 사용하는게 아니라 회사 내부에서 사용하는 거라 반응을 볼 수 없어서 아쉽다
기술은 부족하더라도 주어진 시간 내에서 목표에 도달하는 것이 개발자가 해야되는 일이라는 것을 깨닫게 된 시간이였습니다.

개발 중에 어떤 내용을 관리자 페이지에서 보여줄 것 인지에 대한 고민이 많았는데 프로젝트가 끝나고 나서 생각해보니 기술적인 내용도 중요하지만 내가 만든 앱을 누가 사용할 건지, 어떤 목적으로 주요 사용되는지 생각해보는게 좋을거 같습니다.
