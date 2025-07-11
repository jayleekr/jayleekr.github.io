---
layout: post
title: "기존 Linux Container에서 Claude Code 설치 가이드 (실제 검증됨)"
date: 2025-06-25 09:00:00 +0900
categories: [TechSavvy, Container]
tags: [Claude, AI, Docker, Linux, Container, Node.js, Installation]
image: /assets/img/claude.jpeg
---

![Claude Code Installation Guide](/assets/img/claude.jpeg)

# 기존 Linux Container에서 Claude Code 설치 가이드 (실제 검증됨)

## 목차
1. [Claude Code 개요](#claude-code-개요)
2. [실행 중인 컨테이너에 접속](#실행-중인-컨테이너에-접속)
3. [시스템 환경 확인](#시스템-환경-확인)
4. [Node.js 설치 (NVM 권장)](#nodejs-설치-nvm-권장)
5. [Claude Code 설치](#claude-code-설치)
6. [인증 설정](#인증-설정)
7. [사용법](#사용법)
8. [문제 해결](#문제-해결)
9. [검증된 설치 스크립트](#검증된-설치-스크립트)

## Claude Code 개요

Claude Code는 Anthropic에서 개발한 터미널 기반 AI 코딩 도구로, 다음과 같은 기능을 제공한다:
- 코드베이스 전반의 파일 편집 및 버그 수정
- 코드 아키텍처와 로직에 대한 질문 응답
- 테스트, 린팅 및 기타 명령 실행 및 수정
- Git 워크플로우 관리 (병합 충돌 해결, PR 생성 등)
- 웹 검색을 통한 문서 및 리소스 탐색

**시스템 요구사항**: Node.js 18+ (권장: 20+ LTS)

## 실행 중인 컨테이너에 접속

### 1. 컨테이너 목록 확인
```bash
# 실행 중인 컨테이너 확인
docker ps

# 또는 모든 컨테이너 확인 (중지된 것 포함)
docker ps -a
```

### 2. 컨테이너에 접속
```bash
# 컨테이너 이름으로 접속
docker exec -it <컨테이너_이름> /bin/bash

# 또는 컨테이너 ID로 접속
docker exec -it <컨테이너_ID> /bin/bash

# bash가 없는 경우 sh 사용
docker exec -it <컨테이너_이름> /bin/sh
```

### 3. root 권한으로 접속 (필요시)
```bash
# root 사용자로 접속
docker exec -it -u root <컨테이너_이름> /bin/bash
```

## 시스템 환경 확인

### 1. 운영체제 및 권한 확인
```bash
# OS 정보 확인
cat /etc/os-release

# 현재 사용자 및 권한 확인
whoami && id

# sudo 권한 확인
sudo -l 2>/dev/null || echo "sudo not available"
```

### 2. 기존 Node.js 확인
```bash
# 현재 Node.js 확인
node --version 2>/dev/null || echo "Node.js not installed"
npm --version 2>/dev/null || echo "npm not installed"
```

## Node.js 설치 (NVM 권장)

⚠️ **중요**: Ubuntu 기본 저장소의 Node.js는 버전이 너무 낮다 (v10.x). NVM 사용을 강력히 권장한다.

### 방법 1: NVM 사용 (추천 - 검증됨)

```bash
# 1. NVM 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 2. NVM 환경 변수 로드
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# 3. 최신 LTS Node.js 설치
nvm install --lts
nvm use --lts

# 4. 설치 확인
node --version  # v22.x.x (또는 최신 LTS)
npm --version   # v10.x.x

# 5. 기본값으로 설정
nvm alias default lts/*
```

### 방법 2: NodeSource 저장소 (문제 발생 가능)

⚠️ **주의**: 실제 테스트에서 컨테이너 환경에서 문제가 발생할 수 있다.

```bash
# Ubuntu/Debian 계열
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# 버전 확인
node --version
npm --version
```

### npm 설정 충돌 해결

NVM 사용 시 기존 npm 설정과 충돌이 발생할 수 있다:

```bash
# 기존 npm 설정 파일 제거
rm -f ~/.npmrc

# NVM 재로드
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use --lts
```

## Claude Code 설치

### 1. 환경 설정 (NVM 사용자)

```bash
# NVM 환경 로드 (매번 터미널 시작 시 필요)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

### 2. Claude Code 설치

```bash
# Claude Code 전역 설치
npm install -g @anthropic-ai/claude-code

# 설치 확인
claude --version  # 1.0.34 (또는 최신 버전)
```

### 3. 영구 환경 설정

```bash
# bashrc에 NVM 설정 추가 (영구 설정)
cat >> ~/.bashrc << 'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF

# 현재 세션에 적용
source ~/.bashrc
```

### 4. 선택적 도구 설치

```bash
# Git (이미 설치되어 있을 가능성 높음)
sudo apt install -y git

# Ripgrep (검색 성능 향상 - 이미 설치되어 있을 수 있음)
sudo apt install -y ripgrep

# 설치 확인
git --version
rg --version
```

## 인증 설정

### 방법 1: OAuth 인증 (권장 - Claude Max 사용자)

```bash
# Claude Code 첫 실행
claude

# 프로세스:
# 1. 터미널 스타일 선택
# 2. Enter 키를 눌러 브라우저에서 로그인
# 3. Anthropic 계정으로 로그인
# 4. 인증 완료 후 터미널로 돌아옴
```

### 방법 2: API 키 사용

```bash
# API 키 환경변수 설정
export ANTHROPIC_API_KEY="your_api_key_here"

# 영구 설정
echo 'export ANTHROPIC_API_KEY="your_api_key_here"' >> ~/.bashrc
source ~/.bashrc
```

### 컨테이너 환경에서 브라우저 접근이 어려운 경우

```bash
# 방법 1: API 키 방식 사용 (위 참조)

# 방법 2: 호스트에서 인증 후 설정 파일 복사
# 호스트에서 claude 실행하여 인증 완료 후:
# docker cp ~/.claude/ <컨테이너_이름>:/home/<사용자>/
```

## 사용법

### 1. 기본 실행

```bash
# 프로젝트 디렉토리로 이동
cd /path/to/your/project

# Claude Code 시작
claude

# 도움말
claude --help
```

### 2. 일반적인 사용 예시

```bash
# 프로젝트 분석
claude "이 프로젝트의 구조와 주요 기능을 설명해줘"

# 코드 작성
claude "Python Flask API 엔드포인트를 만들어줘"

# 버그 수정
claude "main.py 파일을 검토하고 버그를 찾아서 수정해줘"

# 테스트 실행
claude "테스트를 실행하고 실패한 부분이 있으면 수정해줘"

# 대화 계속
claude --continue

# 특정 대화 재개
claude --resume
```

### 3. 고급 옵션

```bash
# 권한 확인 무시 (샌드박스 환경에서만)
claude --dangerously-skip-permissions

# 특정 모델 사용
claude --model sonnet

# 디버그 모드
claude --debug

# 출력만 확인 (비대화형)
claude --print "코드 리뷰해줘"
```

## 문제 해결

### 1. "claude: command not found" 오류

```bash
# NVM 환경 재로드
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 또는 bashrc 재로드
source ~/.bashrc

# Claude 명령어 위치 확인
which claude
npm list -g --depth=0 | grep claude
```

### 2. Node.js 버전 문제

```bash
# 현재 버전 확인
node --version

# 18 미만인 경우 업그레이드 필요
if [[ $(node --version | cut -d'v' -f2 | cut -d'.' -f1) -lt 18 ]]; then
    echo "Node.js 18+ 버전이 필요하다"
    nvm install --lts
    nvm use --lts
fi
```

### 3. npm 권한 오류

```bash
# npm 설정 초기화
rm -f ~/.npmrc

# NVM 재설정
nvm uninstall node
nvm install --lts
nvm use --lts

# Claude Code 재설치
npm install -g @anthropic-ai/claude-code
```

### 4. 시스템 패키지 오류 (tzdata 등)

컨테이너 환경에서 시스템 패키지 설정 오류는 일반적으로 Claude Code 기능에 영향을 주지 않는다. 다음과 같은 오류는 무시해도 된다:

```
tzdata failed to preconfigure
/etc/timezone: Read-only file system
```

### 5. 네트워크 연결 문제

```bash
# 인터넷 연결 확인
ping -c 3 8.8.8.8

# npm 레지스트리 연결 확인
npm ping

# 프록시 설정 (필요시)
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

## 검증된 설치 스크립트

다음은 실제 테스트를 통해 검증된 원스텝 설치 스크립트다:

```bash
#!/bin/bash
# Claude Code 자동 설치 스크립트 (검증됨)

set -e

echo "=== Claude Code 설치 시작 ==="

# 1. 시스템 정보 확인
echo "📋 시스템 환경 확인..."
cat /etc/os-release | head -3
echo "사용자: $(whoami)"

# 2. 기존 npm 설정 정리
echo "🧹 기존 npm 설정 정리..."
rm -f ~/.npmrc 2>/dev/null || true

# 3. NVM 설치
echo "📦 NVM 설치..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 4. NVM 환경 로드
echo "🔧 NVM 환경 설정..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# 5. Node.js LTS 설치
echo "🚀 Node.js 최신 LTS 설치..."
nvm install --lts
nvm use --lts
nvm alias default lts/*

# 6. 버전 확인
echo "✅ 설치된 버전 확인..."
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"

# 7. Claude Code 설치
echo "🤖 Claude Code 설치..."
npm install -g @anthropic-ai/claude-code

# 8. bashrc에 영구 설정 추가
echo "⚙️  영구 환경 설정..."
cat >> ~/.bashrc << 'EOF'

# NVM 설정 (Claude Code용)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF

# 9. 설치 확인
echo "🎉 설치 완료 확인..."
claude --version

echo ""
echo "=== 설치 완료! ==="
echo "Claude Code 버전: $(claude --version)"
echo ""
echo "다음 단계:"
echo "1. 새 터미널을 열거나 'source ~/.bashrc' 실행"
echo "2. 'claude' 명령어로 실행"
echo "3. 첫 실행 시 인증 과정 진행"
echo ""
echo "사용법:"
echo "  claude                    # 대화형 모드 시작"
echo "  claude --help            # 도움말"
echo "  claude \"질문내용\"        # 직접 질문"
echo ""
```

### 스크립트 사용법

```bash
# 스크립트 파일 생성
cat > install_claude_code.sh << 'EOF'
[위의 스크립트 내용]
EOF

# 실행 권한 부여
chmod +x install_claude_code.sh

# 실행
./install_claude_code.sh
```

## 컨테이너 영구화

현재 컨테이너의 변경사항을 새 이미지로 저장한다:

```bash
# 호스트에서 실행 (새 터미널)
docker commit <컨테이너_이름> my-claude-code-image:latest

# 새 이미지로 컨테이너 실행
docker run -it --name claude-env \
  -v $(pwd):/workspace \
  -w /workspace \
  my-claude-code-image:latest
```

## 추가 팁

1. **성능**: ripgrep이 설치되어 있어 빠른 코드 검색이 가능하다
2. **권한**: 컨테이너 환경에서는 `--dangerously-skip-permissions` 옵션 사용을 고려한다
3. **모델**: `--model sonnet` 또는 `--model opus`로 특정 모델 사용이 가능하다
4. **대화 관리**: `--continue`로 이전 대화를 이어갈 수 있고, `--resume`으로 특정 세션을 재개할 수 있다
5. **디버깅**: 문제 발생 시 `--debug` 옵션으로 상세 정보를 확인할 수 있다

이 가이드는 실제 Ubuntu 20.04 컨테이너 환경에서 테스트하여 검증되었다.

---

*이 글은 실제 컨테이너 환경에서 Claude Code를 설치하면서 얻은 경험을 바탕으로 작성되었으며, 다양한 Linux 배포판과 컨테이너 환경에서 테스트되었다.* 