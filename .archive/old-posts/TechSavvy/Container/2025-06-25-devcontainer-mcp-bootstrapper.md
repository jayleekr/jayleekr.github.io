---
layout: post
title: "개발환경 부트스트래핑 자동화: DevContainer MCP Bootstrapper 만들기"
date: 2025-06-25 10:00:00 +0900
categories: [TechSavvy, Container]
tags: [DevContainer, MCP, Docker, Claude, AI, Bootstrap, Automation, Development]
image: /assets/img/docker.jpeg
---

![DevContainer MCP Bootstrapper](/assets/img/docker.jpeg)

# 개발환경 부트스트래핑 자동화: DevContainer MCP Bootstrapper 만들기

안녕하세요! 오늘은 최근에 만든 [DevContainer MCP Bootstrapper](https://github.com/jayleekr/devcontainer-mcp-bootstrapper)에 대해서 이야기해보려고 한다. 

Claude MCP(Model Context Protocol) 서버들을 자동으로 설치하고 개발 도구들을 쭉 설정해주는 부트스트래퍼를 만들어봤는데, 개발 과정에서 꽤 재밌는 이야기들이 있어서 공유하고 싶다.

## 🤔 왜 만들게 되었나?

최근에 Claude Code 설치 가이드를 작성하면서 느낀 점이 있었다. 컨테이너 환경에서 매번 개발 환경을 설정하는 게 너무 번거롭다는 것이었다.

특히 다음과 같은 상황들이 반복되고 있었다:

1. **새로운 DevContainer 생성할 때마다**: Git 설정, 셸 alias, Vim 설정 등을 매번 다시 해야 함
2. **Claude MCP 설정**: Context7과 Supermemory MCP 서버를 매번 수동으로 설치하고 설정
3. **개발 도구들**: Docker alias, 유용한 함수들을 계속 다시 설정

이런 반복 작업이 귀찮아서 "아예 원스텝으로 모든 걸 자동화해버리자!"라고 생각했다.

## 🚀 뭘 자동화했나?

### 핵심 기능들

**1. Claude MCP 서버 자동 설치**
- Context7: 최신 문서와 코드 예제 검색
- Supermemory: AI 도구 간 개인 메모리 관리

**2. 개발 도구 설정**
- Git 글로벌 설정과 유용한 alias들
- 생산성을 높이는 셸 alias와 함수들
- Vim 기본 설정
- Docker 관리용 단축 명령어들

**3. 환경 감지와 적응**
- Docker, DevContainer, Codespaces 등 자동 감지
- 패키지 매니저 자동 선택 (apt, yum, brew 등)
- 권한 상황에 맞는 설치 방식 선택

## 🔧 설계 철학: 모듈화와 선택적 설치

처음에는 그냥 "모든 걸 다 설치하자!"였는데, 개발하다 보니 사용자마다 필요한 게 다르다는 걸 깨달았다.

```bash
# 모든 컴포넌트 설치 (기본)
curl -fsSL https://raw.githubusercontent.com/jayleekr/devcontainer-mcp-bootstrapper/main/bootstrap.sh | bash

# 특정 컴포넌트만 설치
curl -fsSL https://raw.githubusercontent.com/jayleekr/devcontainer-mcp-bootstrapper/main/bootstrap.sh | bash -s -- --only claude,git,shell
```

이런 식으로 모듈화해서 원하는 것만 설치할 수 있게 만들었다.

### 컴포넌트별 구성

| 컴포넌트 | 기능 | 왜 필요한가? |
|----------|------|-------------|
| `claude` | Claude MCP 서버들 | AI 개발 워크플로우 통합 |
| `git` | Git 설정과 alias | 버전 관리 효율성 |
| `shell` | 셸 alias와 함수 | 터미널 생산성 |
| `vim` | Vim 기본 설정 | 에디터 환경 |
| `docker` | Docker alias | 컨테이너 관리 편의성 |

## 🕵️ 환경 감지의 복잡함

가장 까다로웠던 부분은 **환경 감지**였다. 

Docker 컨테이너인지, GitHub Codespaces인지, WSL인지, 일반 Linux인지를 정확히 판단해야 했고, 각각에 맞는 설치 방식을 써야 했다.

```bash
# 환경 감지 로직의 일부
detect_environment() {
    if [ -f /.dockerenv ]; then
        echo "docker"
    elif [ -n "$CODESPACES" ]; then
        echo "codespaces"
    elif grep -q Microsoft /proc/version 2>/dev/null; then
        echo "wsl"
    else
        echo "native"
    fi
}
```

특히 권한 관리가 까다로웠다. 일부 환경에서는 sudo가 없고, 일부는 root로 실행되고, 또 일부는 사용자 권한만 있는 상황이었다.

```bash
# 권한에 맞는 패키지 설치
install_package() {
    local package=$1
    if command -v sudo >/dev/null 2>&1 && [ "$EUID" -ne 0 ]; then
        sudo $PKG_MANAGER install -y "$package"
    elif [ "$EUID" -eq 0 ]; then
        $PKG_MANAGER install -y "$package"
    else
        echo "⚠️  권한 부족: $package 설치를 건너뜀"
    fi
}
```

## 💡 MCP 설정의 자동화

Claude MCP 설정이 생각보다 복잡했다. 특히 설정 파일 구조가 JSON이라서 기존 설정을 망가뜨리지 않으면서 새로운 서버를 추가하는 게 까다로웠다.

```bash
# MCP 설정 파일 백업 및 업데이트
update_claude_config() {
    local config_file="$HOME/.config/Claude/claude_desktop_config.json"
    
    # 기존 설정 백업
    if [ -f "$config_file" ]; then
        cp "$config_file" "$config_file.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # 새 설정 생성
    create_mcp_config "$config_file"
}
```

그리고 Supermemory MCP의 경우 개인별 고유 URL이 필요해서, 환경변수로 받을 수 있게 만들었다:

```bash
# 개인 Supermemory URL 설정
export SUPERMEMORY_MCP_URL="https://mcp.supermemory.ai/YOUR_UNIQUE_ID/sse"
```

## 🎯 사용자 경험 개선

처음에는 단순히 "설치만 되면 끝"이라고 생각했는데, 실제로 써보니 사용자가 뭐가 설치되고 있는지, 어떻게 사용하는지 알기 어려웠다.

그래서 다음과 같은 기능들을 추가했다:

**1. 상세한 진행상황 표시**
```bash
echo "📦 NVM 설치..."
echo "🔧 NVM 환경 설정..."
echo "🚀 Node.js 최신 LTS 설치..."
echo "✅ 설치된 버전 확인..."
```

**2. 설치 후 가이드**
```bash
echo "=== 설치 완료! ==="
echo "Claude Code 버전: $(claude --version)"
echo ""
echo "다음 단계:"
echo "1. 새 터미널을 열거나 'source ~/.bashrc' 실행"
echo "2. 'claude' 명령어로 실행"
echo "3. 첫 실행 시 인증 과정 진행"
```

**3. 편리한 관리 명령어들**
```bash
mcp_status              # MCP 설정 상태 확인
bootstrap_update        # 부트스트래퍼 업데이트
dev_info               # 개발 환경 정보 표시
```

## 🐛 예상치 못한 문제들

### 1. 패키지 매니저의 다양성

Linux 배포판마다 패키지 매니저가 다르다는 건 알고 있었지만, 실제로 지원하려니 정말 다양했다:

- Debian/Ubuntu: `apt`
- CentOS/RHEL/Fedora: `yum`/`dnf`
- Arch Linux: `pacman`
- openSUSE: `zypper`
- Alpine: `apk`
- macOS/Linux: `brew`

각각의 문법도 미묘하게 달라서 통합 인터페이스를 만드는 게 생각보다 복잡했다.

### 2. 컨테이너별 특이사항들

**Google Colab**: 패키지 설치는 되는데 영구 저장이 안 됨
**Replit**: Node.js가 이미 설치되어 있지만 권한 문제 있음
**GitHub Codespaces**: 사용자 설정이 특별한 위치에 저장됨

이런 환경별 특이사항들을 다 고려해야 했다.

### 3. 네트워크 문제

기업 환경에서는 프록시 설정 때문에 외부 스크립트 다운로드가 안 되는 경우가 많았다. 그래서 오프라인 모드도 지원하게 되었다:

```bash
# 오프라인 모드
./bootstrap.sh --offline
```

## 🔄 업데이트와 유지보수

부트스트래퍼를 만들고 나니 "이걸 어떻게 업데이트하지?"라는 고민이 생겼다.

그래서 자체 업데이트 기능을 추가했다:

```bash
bootstrap_update() {
    echo "🔄 부트스트래퍼 업데이트 중..."
    curl -fsSL https://raw.githubusercontent.com/jayleekr/devcontainer-mcp-bootstrapper/main/bootstrap.sh -o /tmp/bootstrap_update.sh
    chmod +x /tmp/bootstrap_update.sh
    /tmp/bootstrap_update.sh --update
}
```

그리고 설정 백업 기능도 넣어서 업데이트할 때 기존 설정이 날아가지 않게 했다.

## 📊 실제 사용해본 결과

몇 주 동안 실제로 써보니 정말 편했다. 

**이전**: 새 환경 설정에 30분 이상
**현재**: 원라이너로 5분 안에 완료

```bash
# 정말 이거 한 줄이면 끝
curl -fsSL https://raw.githubusercontent.com/jayleekr/devcontainer-mcp-bootstrapper/main/bootstrap.sh | bash
```

특히 DevContainer나 Codespaces에서 새 프로젝트 시작할 때 `postCreateCommand`에 넣어두면 자동으로 모든 게 설정되니까 정말 편하다.

### DevContainer 통합 예시

```json
{
  "name": "My Development Environment",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "postCreateCommand": "curl -fsSL https://raw.githubusercontent.com/jayleekr/devcontainer-mcp-bootstrapper/main/bootstrap.sh | bash",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-vscode.claude-dev"
      ]
    }
  }
}
```

## 🎨 앞으로의 계획

현재 기본적인 기능들은 다 구현했지만, 앞으로 추가하고 싶은 것들이 있다:

1. **더 많은 MCP 서버 지원**: 앞으로 나올 새로운 MCP 서버들 자동 지원
2. **개인화 설정**: 사용자별 프리셋 저장 기능
3. **GUI 도구들**: 개발에 유용한 GUI 도구들 자동 설치
4. **성능 최적화**: 병렬 설치로 설치 시간 단축

## 💭 회고: 자동화의 가치

이번 프로젝트를 하면서 느낀 건, **반복되는 작업은 무조건 자동화해야 한다**는 것이다.

처음에는 "스크립트 만드는 시간에 그냥 수동으로 하는 게 빠르지 않을까?"라고 생각했는데, 막상 만들고 나니 시간 절약은 물론이고 **실수도 줄고**, **일관성도 보장**되고, **다른 사람들도 쉽게 사용**할 수 있게 되었다.

특히 개발 환경 설정 같은 경우는 한 번 제대로 자동화해두면 계속 써먹을 수 있어서 투자 대비 효과가 크다.

## 🤝 커뮤니티와 기여

이 부트스트래퍼는 개인적인 필요에서 시작했지만, 비슷한 문제를 겪는 개발자들이 많을 것 같다. 그래서 MIT 라이선스로 오픈소스화했다.

혹시 사용해보시고 개선점이나 버그를 발견하시면 언제든지 이슈나 PR을 올려주세요! 

특히 다음과 같은 기여를 환영한다:
- 새로운 환경 지원 (새로운 컨테이너 플랫폼, OS 등)
- 추가 MCP 서버 통합
- 설치 스크립트 최적화
- 문서 개선

## 🔚 마무리

DevContainer MCP Bootstrapper를 만들면서 환경 감지, 패키지 관리, 사용자 경험 등 많은 것들을 배웠다. 

무엇보다도 **자동화의 힘**을 다시 한번 실감했다. 반복적인 작업을 자동화하는 것은 단순히 시간을 절약하는 것뿐만 아니라, 실수를 줄이고 일관성을 보장하며 다른 사람들과 쉽게 공유할 수 있게 해준다.

앞으로도 개발 워크플로우에서 반복되는 부분들을 찾아서 자동화해나갈 계획이다. 여러분도 반복 작업이 있으면 자동화를 고려해보시길!

---

*이 글은 실제 DevContainer MCP Bootstrapper 개발 과정에서 겪은 경험을 바탕으로 작성되었으며, 다양한 개발 환경에서 테스트되었다.*

**저장소**: [https://github.com/jayleekr/devcontainer-mcp-bootstrapper](https://github.com/jayleekr/devcontainer-mcp-bootstrapper) 