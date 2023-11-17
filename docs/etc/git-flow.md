---
title: Git-flow
category:
  - etc.
tag:
  - Git
  - Strategy
---

![git flow](https://user-images.githubusercontent.com/96982072/227922966-e7f04bb8-7943-434b-8a8a-cbb4097a0339.png)

git-flow는 브랜치를 5가지 종류로 구분하여 개발하는 전략이다.

## git-flow의 브랜칭 전략

- 주기적으로 배포를 진행해야 하는 프로젝트에 적합

- 다양한 분야의 사람들과 개발할 때 효과적

- 다양한 상황에 유연하게 대응

## git-flow의 흐름

![git flow flow](https://user-images.githubusercontent.com/96982072/227924759-0e4dc474-667a-477e-8aca-33b936a2dc77.png)

**main**

- 배포 가능한 상태만을 관리하는 브랜치

**develop**

- 다음 출시 버전을 개발하는 브랜치
- develop 브랜치는 통합 브랜치의 역할을 하며, 평소에는 이 브랜치를 기반으로 개발을 진행

**feature**

- 기능을 개발하는 브랜치로, develop 브랜치로부터 분기
- feature 브랜치는 해당 기능이 완성될 때까지 유지하며, 완성되면 develop 브랜치로 병합

**release**

- 이번 출시 버전을 준비하는 브랜치
- develop 브랜치에 이번 버전에 포함되는 기능이 병합되었다면, QA를 위해 develop 브랜치에서부터 release 브랜치를 생성
- 배포를 위한 최종적인 버그 수정 등의 개발을 수행
- 배포 가능한 상태가 되면 main 브랜치로 병합하고, 출시된 main 브랜치에 버전 태그를 추가

**hotfix**

- 배포한 버전에서 긴급하게 수정해야 할 필요가 있을 때, main 브랜치에서 분기
- 버그를 수정하는 동안에도 다른 사람들은 develop 브랜치에서 개발을 진행
- hotfix 브랜치에서의 변경 사항은 develop 브랜치에도 병합하여 문제가 되는 부분을 처리

## 참고 링크

- <https://blog.programster.org/git-workflows>
- <https://github.com/nvie/gitflow>
