---
title: 신고 결과 받기 - Python
category:
  - etc.
tag:
  - Codingtest
  - Programmers
---

프로그래머스 [신고 결과 받기][report] 문제입니다

```python
def solution(id_list, report, k):
    report_id = {id: list() for id in id_list}
    count_id = {id: 0 for id in id_list}

    for x in set(report):
        id, id_reported = x.split()
        report_id[id].append(id_reported)
        count_id[id_reported] += 1

    return [sum(1 for name in report_list if count_id[name] >= k) for report_list in report_id.values()]
```

먼저 주어진 입출력을 보면 id_list와 report가 모두 배열로 이루어져있습니다.

```python
report_id = {id: list() for id in id_list}
count_id = {id: 0 for id in id_list}
```

저는 dictionary 2개를 사용했습니다

```python
for x in set(report):
    id, id_reported = x.split()
    report_id[id].append(id_reported)
    count_id[id_reported] += 1
```

한 유저가 같은 유저를 여러 번 신고한 경우는 신고 횟수 1회로 처리한다는 조건이 있었기 때문에
중복을 제거하기 위해 [`set()`](https://wikidocs.net/1015)을 사용했습니다.
이후 중복이 제거된 report의 항목만큼 신고당한 횟수와 기록을 추가합니다.

마지막으로 각 유저별로 처리 결과 메일을 받은 횟수를 return 합니다

**입력값**

```python
id_list = ["muzi", "frodo", "apeach", "neo"]
report = ["muzi frodo","apeach frodo","frodo neo","muzi neo","apeach muzi"]
k = 2

solution(id_list, report, k)
```

[코드 작동 보기](https://pythontutor.com/render.html#code=def%20solution%28id_list,%20report,%20k%29%3A%0A%20%20%20%20report_id%20%3D%20%7Bid%3A%20list%28%29%20for%20id%20in%20id_list%7D%0A%20%20%20%20count_id%20%3D%20%7Bid%3A%200%20for%20id%20in%20id_list%7D%0A%20%20%20%20%0A%20%20%20%20for%20x%20in%20set%28report%29%3A%0A%20%20%20%20%20%20%20%20id,%20id_reported%20%3D%20x.split%28%29%0A%20%20%20%20%20%20%20%20report_id%5Bid%5D.append%28id_reported%29%0A%20%20%20%20%20%20%20%20count_id%5Bid_reported%5D%20%2B%3D%201%0A%0A%20%20%20%20return%20%5Bsum%281%20for%20name%20in%20report_list%20if%20count_id%5Bname%5D%20%3E%3D%20k%29%20for%20report_list%20in%20report_id.values%28%29%5D%0A%20%20%20%20%0Asolution%28%5B%22muzi%22,%20%22frodo%22,%20%22apeach%22,%20%22neo%22%5D,%5B%22muzi%20frodo%22,%22apeach%20frodo%22,%22frodo%20neo%22,%22muzi%20neo%22,%22apeach%20muzi%22%5D,%202%29&cumulative=false&curInstr=73&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=3&rawInputLstJSON=%5B%5D&textReferences=false)

```text
result > [2, 1, 1, 0]
```

#### 다른 사람의 코드

```python
def solution(id_list, report, k):
    answer = [0] * len(id_list)
    reports = {x : 0 for x in id_list}

    for r in set(report):
        reports[r.split()[1]] += 1

    for r in set(report):
        if reports[r.split()[1]] >= k:
            answer[id_list.index(r.split()[0])] += 1

    return answer
```

제일 좋아요를 많이 받았던 풀이입니다.
array 1개, dictionary 1개로도 가능합니다.

[report]: https://school.programmers.co.kr/learn/courses/30/lessons/92334
