---
title: 우분투에 node & npm 설치
category:
  - Infra.
tag:
  - Node
  - NPM
  - EC2
  - Linux
order: 2
---

프로젝트의 서버는 NestJS를 사용하고 있다.
NestJS로 구성된 서버를 실행하려면 node와 npm이 있어야 패키지를 관리하고 실행할 수 있다.
하지만 기본적으로 EC2 인스턴스를 만들면 Node.js와 npm 등이 설치되어 있지 않다.

그래서 aws에서 ec2 인스턴스를 만들 때 기본 제공되는 unbuntu 이미지에 Node.js와 npm 설치하고
git clone으로 레포지토리까지 설정을 한 다음,
초기 설정한 볼륨을 이미지(AMI)로 만들어서 자동으로 생성된 인스턴스에 초기설정이 필요없게 만들려고 한다.

## Node.js 18버전 설치하기

수동으로 Node.js 18버전을 설치하려고한다.

```bash
curl -s https://deb.nodesource.com/setup_18.x | sudo bash
```

![설치 안내 메세지가 보인다.](https://github.com/Zamoca42/blog/assets/96982072/66a5efed-58c8-4dee-ab42-ed3b21d116b3)

패키지가 다운된거 같으면 다음 명령어로 설치한다.

```bash
sudo apt-get install nodejs -y
```

`node -v`로 설치된 버전을 확인할 수 있다.

```text
v18.19.0
```

## 글로벌 환경에서 패키지 설치하기

그 다음 글로벌 환경에서 pm2를 설치한다.
pm2는 이 후에 서버를 실행하고 pm2로 프로세스를 관리하는 용도로 사용한다.

```bash
npm install -g pm2
```

이런 메세지가 뜬다.

![Error: EACCES: permission denied](https://github.com/Zamoca42/blog/assets/96982072/5c129845-5f7c-4597-aee2-98b46e8263f8)

node를 sudo 권한으로 설치하고나면 패키지 설치시 permission denied가 발생한다.
해결 방법은 글로벌 패키지의 디렉터리를 변경하는 것이다.

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
npm get prefix -g
```

이렇게 설정하고 `npm get prefix -g`를 입력하면 .npm-global 경로가 뜬다면 패키지 설치가 가능하다.

```text
/home/ubuntu/.npm-global
```

다시 pm2 패키지를 설치해보면 정상설치가 된것을 알 수 있다.

![설치 성공](https://github.com/Zamoca42/blog/assets/96982072/6fa483e7-5521-4762-bfcd-9503b160ca3b)

하지만 pm2 관련 명령어를 입력하면 명령을 찾을 수 없다고 뜬다.

![`pm2 list` 명령어 실행은 불가능하다.](https://github.com/Zamoca42/blog/assets/96982072/1199c2cc-14f3-4889-b874-28e4a1f78d0c)

bash 환경변수를 설정해서 명령어를 실행시 node 패키지 폴더를 자동으로 설정하게 해야한다.

## npm 패키지 경로 환경변수로 설정하기

우선 터미널에 다음 명령어를 입력해보면 명령어가 작동하는 것을 알 수 있다.

```bash
export PATH=~/.npm-global/bin:$PATH
```

![환경변수를 콘솔에 입력하고 `pm2 list`를 다시 입력하면 작동한다.](https://github.com/Zamoca42/blog/assets/96982072/6e358b40-c7ce-4d6d-ad50-fccb6dbe9d6f)

하지만 ssh이나 콘솔에서 터미널을 종료하고 다시 접속하면 패키지 명령어는 실행할 수가 없다.
접속할때마다 환경변수를 입력하면 번거롭겠지만
.profile이나 .bashrc를 수정하고 등록하면 접속할 때마다 환경변수를 설정할 필요가 없다.
우선 ~/.profile을 열어준다.

```bash
nano ~/.profile
```

텍스트 편집기가 열어진다면 맨 아래 위에서 사용했던 환경변수를 넣고 저장한다.

![맨 아래 `export PATH=~/.npm-global/bin:$PATH` 추가](https://github.com/Zamoca42/blog/assets/96982072/1e9af0bd-9f73-40f3-bcbd-fcc181325b49)

그다음 source 명령어로 스크립트 파일을 적용하면 다시 인스턴스에 로그인했을 때도 환경변수가 적용되어
설치된 패키지 명령어를 사용할 수 있다.

```bash
source ~/.profile
```

![ssh로 재접속 후 `pm2 list`명령어를 입력하면 작동한다.](https://github.com/Zamoca42/blog/assets/96982072/38d1b52a-033b-4052-9091-ca15ec59c941)
