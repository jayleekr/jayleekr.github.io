---
layout: post
title: "차량용 임베디드 시스템과 Docker: 현장에서 배운 교훈들 (1)"
date: 2025-03-05 09:00:00 +0900
categories: TechSavvy/Container
tags: [Docker, Embedded, Automotive, Linux, Container]
image: /assets/img/docker.jpeg
---

![Docker in Automotive Embedded Systems](/assets/img/docker.jpeg)

# 차량용 임베디드 시스템과 Docker: 현장에서 배운 교훈들 (1)

안녕하세요! 오늘부터 차량용 임베디드 시스템에 Docker를 이식하면서 경험한 다양한 도전과 해결책을 시리즈로 공유하려고 합니다. 이 시리즈에서는 실제 현장에서 마주친 문제들과 그 해결 과정을 통해 얻은 교훈을 소개할 예정입니다. 이번 글은 시리즈의 첫 번째 발간물로, Docker 컨테이너와 마운트 포인트 간의 미묘한 상호작용에 관한 이야기입니다.

## 🕵️‍♀️ 미스터리한 현상: "사라진 파일들"

어느 날 저희 차량용 임베디드 시스템에서 이상한 현상이 발생했습니다. 재부팅 후 Docker 컨테이너를 실행했는데, 이전에 잘 보이던 파일들이 모두 사라져버린 것이었습니다! 컨테이너는 정상적으로 실행되지만, 마운트된 디렉토리의 파일들은 어디론가 사라져버렸습니다. 마치 유령처럼 말이죠.

## 🔍 원인 분석: Docker 실행 시점과 마운트 상태의 중요한 관계

조사 결과, 이 문제는 임베디드 환경에서 **시스템 부팅 시퀀스의 타이밍**과 깊은 관련이 있었습니다.

1. 저희 시스템은 init.d 스크립트를 통해 Docker 데몬을 실행합니다
2. 시스템에서는 NFS를 활용한 네트워크 스토리지 마운트가 부팅 시점에 이루어집니다
3. **가장 중요한 발견**: Docker가 실행되는 시점에 따라 컨테이너가 참조하는 마운트 상태가 완전히 달라질 수 있다는 것이었습니다!
4. Docker 데몬이 먼저 시작되고 나중에 스토리지가 마운트되면, 컨테이너는 빈 디렉토리나 이전 상태를 참조하게 됩니다
5. 이렇게 되면 재부팅 후 컨테이너는 "파일이 없다"고 판단하게 되는 것이죠

단순한 타이밍 문제로 보일 수 있지만, 이는 **시스템 아키텍처 설계의 중요한 문제**였습니다. 특히 차량용 임베디드 환경에서는 이러한 서비스 의존성과 시작 순서가 매우 중요합니다.

## 💡 임시 해결 방법: Docker 실행 전 마운트 확인

문제를 해결하기 위해 docker.init 스크립트에 마운트 확인 로직을 추가했습니다:

```bash
# Storage volume mount status check
trials_mount=5
while [ $trials_mount -gt 0 ]; do
    dfoutput=$(df -PTh mount_path)
    echo "df output: $dfoutput" >/dev/kmsg
    echo "$dfoutput" | grep -q "volume_identifier"
    if [ $? -eq 0 ]; then
        echo "Volume is set up correctly" >/dev/kmsg
        break
    else
        echo "Volume is not set up, waiting 1 second" >/dev/kmsg
        trials_mount=$((trials_mount - 1))
        sleep 1
    fi
done

if [ $trials_mount -eq 0 ]; then
    echo "Volume is not set up. Cannot start Docker" >/dev/kmsg
    exit 5
fi
```

이 임시 해결책은 Docker가 시작되기 전에 필요한 마운트가 모두 준비되었는지 확인합니다. 하지만 이는 근본적인 해결책이 아닙니다.

## 🧠 교훈: 시스템 설계 시 서비스 의존성 관리가 핵심입니다!

이번 경험을 통해 얻은 중요한 통찰은 다음과 같습니다:

1. **Docker 실행 시점이 결정적**: Docker가 언제 실행되느냐에 따라 컨테이너가 보는 파일 시스템 상태가 완전히 달라질 수 있습니다
2. **시스템 부팅 설계의 중요성**: 서비스 시작 순서와 의존성은 임베디드 시스템 설계에서 가장 중요한 요소 중 하나입니다
3. **이상적인 해결책**: 궁극적으로는 Docker를 제어하는 별도의 관리 서비스가 있어서 모든 시스템 마운트가 완료된 후에만 Docker를 시작하도록 해야 합니다

차량용 임베디드 시스템에서 Docker를 사용할 때는 부팅 시퀀스와 마운트 타이밍에 특별한 주의를 기울여야 합니다. 서비스 간의 의존성을 명확히 하고, 시스템 설계 단계에서부터 이러한 문제를 고려해야 합니다.

여러분도 비슷한 경험이 있으신가요? 댓글로 공유해주세요! 다음 시리즈에서는 차량용 임베디드 환경에서 Docker를 사용할 때 마주치는 또 다른 도전과제를 다룰 예정입니다.

---

*이 글은 실제 차량용 임베디드 시스템에 Docker를 적용하면서 얻은 경험을 바탕으로 작성되었으며, 유사한 환경에서 개발하는 엔지니어들에게 도움이 되길 바랍니다.* 