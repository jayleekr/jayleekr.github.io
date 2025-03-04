# Jay's GithubPage Blog 

## Blog URL
[https://jayleekr.github.io](https://jayleekr.github.io/)

## About blog framework

Irrc, I think I forked this repo from some fancy blogger (back then 201X year lol)
And I used this repo for practicing Markdown and writing down some bull-shit posts (hope nobody watchin this)

Basically all you gotta do is just to write down your post on **_posts** directory.
If there are any hierachy in directory manner in the _post, build libraries will create categories automatically.

And there's no PR needed, coz no one is gonna review your post lol

Anyway have fun (if you forked this from my repo) !

## Update History

|Date|Description|
|---|--|
|2022-12-27|Update template html and test scripts for github action|
|2025-03-04|Update Framework to use docker|

## Docker로 개발 환경 구성하기

이 프로젝트는 Docker를 사용하여 개발 환경을 쉽게 구성할 수 있습니다.

### 필수 요구사항

- Docker
- Docker Compose

### 개발 서버 실행

```bash
# 개발 서버 실행
docker-compose up jekyll

# 백그라운드에서 실행
docker-compose up -d jekyll
```

개발 서버는 http://localhost:4000 에서 접근할 수 있습니다.

### 빌드 및 테스트

```bash
# 사이트 빌드하기
docker-compose run build

# 테스트 실행하기
docker-compose run test
```

### 컨테이너 정리

```bash
# 컨테이너 중지
docker-compose down

# 컨테이너 및 이미지 제거
docker-compose down --rmi all
```
