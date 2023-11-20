---
title: 성격유형 검사하기 - Python
category: 
	- etc.
tag:
  - Codingtest
  - Programmers
---

프로그래머스 [성격 유형 검사하기][personal] 문제입니다.

문제에서 각 지표는 4개 지표로 나눠집니다.

1. 라이언형(R), 튜브형(T)
2. 콘형(C), 프로도형(F)
3. 제이지형(J), 무지형(M)
4. 어피치형(A), 네오형(N)

예를 들어, 어떤 한 질문에서 4번 지표로 아래 표처럼 점수를 매길 수 있습니다.

|   선택지    |            성격 유형 점수             |
| :---------: | :-----------------------------------: |
| 매우 비동의 |              네오형 3점               |
|   비동의    |              네오형 2점               |
| 약간 비동의 |              네오형 1점               |
|  모르겠음   | 어떤 성격 유형도 점수를 얻지 않습니다 |
|  약간 동의  |             어피치형 1점              |
|    동의     |             어피치형 2점              |
|  매우 동의  |             어피치형 3점              |

**제한사항**

- 1 ≤ `survey`의 길이 ( = n) ≤ 1,000

  - `survey`의 원소는 `"RT", "TR", "FC", "CF", "MJ", "JM", "AN", "NA"` 중 하나입니다.
  - `survey[i]`의 첫 번째 캐릭터는 i+1번 질문의 비동의 관련 선택지를 선택하면 받는 성격 유형을 의미합니다.
  - `survey[i]`의 두 번째 캐릭터는 i+1번 질문의 동의 관련 선택지를 선택하면 받는 성격 유형을 의미합니다.

- `choices`의 길이 = `survey`의 길이

  - `choices[i]`는 검사자가 선택한 i+1번째 질문의 선택지를 의미합니다.
  - 1 ≤ choices의 원소 ≤ 7

  | choices | 뜻          |
  | :------ | :---------- |
  | 1       | 매우 비동의 |
  | 2       | 비동의      |
  | 3       | 약간 비동의 |
  | 4       | 모르겠음    |
  | 5       | 약간 동의   |
  | 6       | 동의        |
  | 7       | 매우 동의   |

```python
def solution(survey, choices):
    indicator = ['RT', 'CF', 'JM', 'AN']
    survey_score = {p[j]: 0 for p in indicator for j in range(2)}

    for i, v in enumerate(survey):
        survey_score[v[1 if choices[i] > 4 else 0]] += abs(4 - choices[i])

    return ''.join([p[0 if survey_score[p[0]] >= survey_score[p[1]] else 1] for p in indicator])
```

---

```python
# 입력값
survey = ["AN", "CF", "MJ", "RT", "NA"]
choices = [5, 3, 2, 7, 5]
```

[코드 보기](https://pythontutor.com/render.html#code=def%20solution%28survey,%20choices%29%3A%0A%20%20%20%20indicator%20%3D%20%5B'RT',%20'CF',%20'JM',%20'AN'%5D%0A%20%20%20%20survey_score%20%3D%20%7Bp%5Bj%5D%3A%200%20for%20p%20in%20indicator%20for%20j%20in%20range%282%29%7D%0A%20%20%20%20%0A%20%20%20%20for%20i,%20v%20in%20enumerate%28survey%29%3A%0A%20%20%20%20%20%20%20%20survey_score%5Bv%5B1%20if%20choices%5Bi%5D%20%3E%204%20else%200%5D%5D%20%2B%3D%20abs%284%20-%20choices%5Bi%5D%29%0A%20%20%20%20%0A%20%20%20%20return%20''.join%28%5Bp%5B0%20if%20survey_score%5Bp%5B0%5D%5D%20%3E%3D%20survey_score%5Bp%5B1%5D%5D%20else%201%5D%20for%20p%20in%20indicator%5D%29%0A%20%20%20%20%0Asolution%28%5B%22AN%22,%20%22CF%22,%20%22MJ%22,%20%22RT%22,%20%22NA%22%5D,%20%5B5,%203,%202,%207,%205%5D%29&cumulative=false&curInstr=39&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=3&rawInputLstJSON=%5B%5D&textReferences=false)

출력값

```text
result > "TCMA"
```

[personal]: https://school.programmers.co.kr/learn/courses/30/lessons/118666
