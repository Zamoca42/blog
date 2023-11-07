---
title: Custom validation 만들기
---

위도, 경도에 대한 범위를 넣어서 검증하는 validator를 만들어 보겠습니다.

```ts
@ValidatorConstraint({ async: true })
export class IsLatLongInRangeConstraint
  implements ValidatorConstraintInterface
{
  validate(value: number, args: ValidationArguments): boolean {
    if (typeof value !== 'number' || isNaN(value)) {
      return false;
    }

    const [minLatLon, maxLatLon] = args.constraints;

    if (value < minLatLon || value > maxLatLon) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const [minLatLon, maxLatLon] = args.constraints;
    const propertyName = args.property;

    if (typeof args.value !== 'number' || isNaN(args.value)) {
      return `${propertyName}은(는) 숫자여야 합니다.`;
    }

    return `${propertyName}은(는) ${minLatLon}에서 ${maxLatLon} 사이여야 합니다.`;
  }
}

export function IsLatLongInRange<T>(
  range: [number, number],
  validationOptions?: ValidationOptions,
) {
  return function (object: T, propertyName: string): void {
    registerDecorator({
      name: 'IsLatLonInRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: range,
      validator: IsLatLongInRangeConstraint,
    });
  };
}
```

우리나라 경기도 전체의 위도 경도 범위는 대략 다음과 같습니다.

- 최남단 위도: 약 36.0도
- 최북단 위도: 약 38.0도
- 최서단 경도: 약 126.0도
- 최동단 경도: 약 128.0도

```ts
export class RequestCoordinateWithRangeDto {
  @ApiProperty({
    description: '맛집 추천 받을 장소의 위도입니다',
    required: true,
    example: 37.237,
  })
  @IsLatLongInRange([36, 38]) // -> 경기도 위도 범위
  @Type(() => Number)
  lat: number;

  @ApiProperty({
    description: '맛집 추천 받을 장소의 경도입니다',
    required: true,
    example: 127.199,
  })
  @IsLatLongInRange([126, 128]) // -> 경기도 경도 범위
  @Type(() => Number)
  lon: number;

  @ApiProperty({
    description: '찾고싶은 범위 1~3KM 이하의 값을 입력(기본값: 1)',
    required: false,
    example: 1,
  })
  @IsInt()
  @Min(1, { message: '1 이상의 값이 필요합니다' })
  @Max(3, { message: '3 이하의 값이 필요합니다' })
  @IsOptional()
  @Type(() => Number)
  range?: number;

  constructor(range?: number) {
    this.range = range;
  }

  get validateRange(): number {
    return !this.range ? 0.01 : this.range / 100;
  }
}

```

![스크린샷 2023-11-06 오후 11 22 34](https://github.com/pre-onboarding-backend-G/feed-me-baby/assets/96982072/f3cd02ff-604f-47a2-8c9f-d82625cc9acd)
![스크린샷 2023-11-06 오후 11 23 14](https://github.com/pre-onboarding-backend-G/feed-me-baby/assets/96982072/c9667024-a53d-41f7-9cda-188a4930d04e)
![스크린샷 2023-11-06 오후 11 23 47](https://github.com/pre-onboarding-backend-G/feed-me-baby/assets/96982072/53c2e33e-14d5-47d9-bf57-c02ede5bf0d7)

