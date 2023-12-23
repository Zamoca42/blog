---
title: 응답 객체 직렬화하기 (class-transformer)
order: 6
category:
  - JS & TS
tag:
  - NestJS
---

## 일반 객체를 -> 클래스 인스턴스로 변환

Nest에서 클라이언트에 데이터를 전달할 때 일반 객체를 클래스로 바꿔서 내보내기 위해
`class-transformer`를 사용했습니다.

- [class-transformer](https://github.com/typestack/class-transformer)

```ts
import { Exclude, Expose, Type } from "class-transformer";
import { License } from "./plan-licenses.dto";

@Exclude()
class ExcludePlanModelDto {
  expirationTime: number;

  activationTime: number;

  currencyCode: string;

  amount: number;

  objective: string;

  countrycode: string;

  @Type(() => License)
  licenses: License[];
}

export class PlanDto extends ExcludePlanModelDto {
  @Expose()
  title: string;

  @Expose()
  period: number;

  @Expose({ groups: ["queryParam"] })
  id: string;
}
```

요금제 id를 조회했을 때 요금제 이름과 요금제의 구독 개월 수를 보여주게 DTO를 만들었습니다.
class-transformer를 사용하지 않으면 서비스 로직에서 일일이 매핑을 해줘야겠지만

DTO에서 보여줄 필드는 `@Expose()`를 사용하고 제외할 필드는 `@Exclude()`를 사용해서
서비스로직에서 `plainToClass` 메서드를 사용하는 것으로 일반 객체를 클래스 인스턴스로 바꿔서 내보낼 수 있습니다.

```ts
import { PlainLiteralObject } from "@nestjs/common";
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
} from "class-transformer";

export const toClassInstance = <T>(
  cls: ClassConstructor<T>,
  plain: PlainLiteralObject,
  options?: ClassTransformOptions
): T => {
  return plainToClass(cls, plain, {
    excludeExtraneousValues: true,
    ...options,
  });
};
```

저는 `excludeExtraneousValues`옵션을 true로 사용하기 위해 `plainToClass`를 커스텀해서 사용했습니다.

```ts
@Injectable()
export class CustomerPlanService {
  private readonly planModel: Model<Plan>;

  constructor(private readonly customerService: CustomerService) {
    this.planModel = createPlanModel(tablePrefix);
  }

  async findPlanTitle(planId: string): Promise<PlanDto> {
    const planTitle = await this.planModel.get(planId);
    if (!planTitle) {
      throw new NotFoundException("요금제명을 찾지 못했습니다");
    }
    return toClassInstance(PlanDto, planTitle); // 여기서 객체를 클래스 인스턴스로 변환
  }
}
```

## 왜 일반 객체를 클래스 인스턴스로 바꿔야 할까?

자바스크립트에서 일반 객체(plain object)를 클래스 인스턴스로 변환하여 외부에 전달하는 이유는 뭘까요?

그냥 일반 객체를 매핑해서 보내면 안되는 것인지 고민하던 중에 모던 딥다이브에 [클로저](../deepdive/deepdive24.md)와
[클래스](../deepdive/deepdive25.md)에 관한 챕터에서 그 이유를 알 수 있었습니다.

여러가지 이유가 있겠지만 클래스 인스턴스를 사용하면 객체 내부의 상태나 메서드를 캡슐화해서
외부로부터 상태를 조작하는 것을 방지하는 측면에서 일반 객체를 클래스 인스턴스로 변환한다고 이해했습니다.
