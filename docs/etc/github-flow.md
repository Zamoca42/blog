# GitHub-flow

![](https://user-images.githubusercontent.com/96982072/227937502-73a8e6cd-1c9d-4a9f-93b0-0141d95f06c6.png)

## GitHub-flow의 브랜칭 전략

-   수시로 배포가 일어나며, CI와 배포가 자동화된 프로젝트
-   Release Branch가 명확하게 구분되지 않은 시스템
-   Pull Request 기능을 사용

## GitHub-flow의 흐름

1. main 브랜치는 언제든 배포 가능한 상태로 유지
    - 다른 브랜치에서 merge후 main에서 배포

2. 다른 브랜치에서 commit & push
	
3. PR(Pull Request) 생성  
    - 피드백이나 도움이 필요할 때, 또는 병합 준비가 완료되었을 때는 PR을 생성
    - PR이 main에 합쳐지면 곧바로 서버에 배포되므로, 코드 리뷰와 토의가 필요

4. 최종 병합(Merge PR)
    - 대부분의 Github-flow에서는 main 브랜치를 최신 브랜치로 가정하고, PR에서 merge하면 CI/CD 도구에서 배포 진행

## 참고 링크

- http://scottchacon.com/2011/08/31/github-flow.html
- https://techblog.woowahan.com/2553/
- https://nvie.com/posts/a-successful-git-branching-model/
- https://inpa.tistory.com/entry/GIT-⚡%EF%B8%8F-github-flow-git-flow-📈-브랜치-전략#github-flow_전략