# 백업 및 복구 전략

## 1. 백업 전략

### 1.1 자동 백업 (Git)
- **주요 백업**: GitHub 저장소가 주요 백업 역할
- **브랜치 전략**:
  - `master`: 프로덕션 브랜치
  - `develop`: 개발 브랜치
  - `backup/[date]`: 주요 릴리즈 백업

### 1.2 로컬 백업
```bash
# 전체 프로젝트 백업 스크립트
#!/bin/bash
BACKUP_DIR="$HOME/backups/jayleekr.github.io"
DATE=$(date +%Y%m%d_%H%M%S)

# 백업 디렉토리 생성
mkdir -p "$BACKUP_DIR"

# 프로젝트 압축 백업
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.astro' \
  --exclude='backup*' \
  .

echo "Backup created: $BACKUP_DIR/backup_$DATE.tar.gz"
```

### 1.3 콘텐츠 백업
- **블로그 포스트**: `src/content/blog/` 디렉토리
- **이미지 자산**: `public/assets/img/` 디렉토리
- **설정 파일**: `astro.config.mjs`, `package.json`, `tsconfig.json`

## 2. 복구 절차

### 2.1 전체 사이트 복구
```bash
# 1. GitHub에서 클론
git clone https://github.com/jayleekr/jayleekr.github.io.git
cd jayleekr.github.io

# 2. 의존성 설치
npm install

# 3. 빌드 및 테스트
npm run build
npm run preview

# 4. 배포
git push origin master
```

### 2.2 콘텐츠만 복구
```bash
# 1. 블로그 포스트 복구
cp -r backup/src/content/blog/* src/content/blog/

# 2. 이미지 복구
cp -r backup/public/assets/img/* public/assets/img/

# 3. 빌드 확인
npm run build
```

### 2.3 특정 시점으로 롤백
```bash
# 1. 커밋 히스토리 확인
git log --oneline -n 20

# 2. 특정 커밋으로 롤백
git checkout [commit-hash]

# 3. 새 브랜치 생성 (선택사항)
git checkout -b recovery/[date]

# 4. 강제 푸시 (주의!)
git push -f origin master
```

## 3. 백업 스케줄

### 3.1 일일 백업
- **자동**: Git 커밋을 통한 변경사항 백업
- **대상**: 새로운 블로그 포스트, 수정된 콘텐츠

### 3.2 주간 백업
- **로컬 백업**: 전체 프로젝트 압축 백업
- **클라우드 백업**: Google Drive 또는 Dropbox 동기화

### 3.3 월간 백업
- **태그 생성**: `git tag backup/YYYY-MM`
- **릴리즈 생성**: GitHub Releases 활용

## 4. 재해 복구 시나리오

### 4.1 GitHub 저장소 손실
1. 로컬 백업에서 복구
2. 새 저장소 생성
3. 원격 저장소 재설정
```bash
git remote set-url origin https://github.com/jayleekr/[new-repo].git
git push -u origin master
```

### 4.2 로컬 개발 환경 손실
1. GitHub에서 최신 코드 클론
2. 백업된 환경 설정 파일 복구
3. 개발 환경 재구성

### 4.3 콘텐츠 손실
1. Git 히스토리에서 삭제된 파일 복구
```bash
git checkout [commit-hash] -- path/to/deleted/file
```
2. 로컬 백업에서 복구
3. 클라우드 백업에서 복구

## 5. 백업 검증

### 5.1 정기 검증 (월 1회)
```bash
# 백업 파일 무결성 확인
tar -tzf backup_[date].tar.gz > /dev/null
echo "Backup integrity: $?"

# 복구 테스트
mkdir test-recovery
tar -xzf backup_[date].tar.gz -C test-recovery
cd test-recovery
npm install && npm run build
```

### 5.2 체크리스트
- [ ] 최신 백업 파일 존재 확인
- [ ] 백업 파일 크기 검증
- [ ] 복구 프로세스 문서 업데이트
- [ ] 팀원들과 복구 절차 공유

## 6. 중요 파일 목록

### 6.1 필수 백업 대상
- `/src/content/blog/**/*.mdx` - 블로그 콘텐츠
- `/public/assets/img/**/*` - 이미지 자산
- `/src/components/**/*.astro` - 컴포넌트
- `/src/layouts/**/*.astro` - 레이아웃
- `/src/pages/**/*.astro` - 페이지
- `astro.config.mjs` - Astro 설정
- `package.json` - 의존성 정보
- `tsconfig.json` - TypeScript 설정
- `.env` - 환경 변수 (별도 안전 보관)

### 6.2 제외 대상
- `node_modules/` - npm install로 복구
- `dist/` - 빌드로 재생성
- `.astro/` - 캐시 디렉토리
- `backup*/` - 백업 파일

## 7. 자동화 스크립트

### 7.1 백업 자동화 (backup.sh)
```bash
#!/bin/bash
set -e

# 설정
PROJECT_DIR="/Users/jaylee/CodeWorkspace/jayleekr.github.io"
BACKUP_BASE="$HOME/backups/jayleekr.github.io"
CLOUD_BACKUP="$HOME/Google Drive/Backups/jayleekr.github.io"
DATE=$(date +%Y%m%d_%H%M%S)

# 함수: 백업 생성
create_backup() {
    echo "Creating backup..."
    cd "$PROJECT_DIR"
    
    # Git 상태 확인
    git add -A
    git commit -m "Auto-backup: $DATE" || echo "No changes to commit"
    
    # 로컬 백업
    mkdir -p "$BACKUP_BASE"
    tar -czf "$BACKUP_BASE/backup_$DATE.tar.gz" \
        --exclude='node_modules' \
        --exclude='dist' \
        --exclude='.astro' \
        --exclude='backup*' \
        .
    
    # 클라우드 백업 (선택사항)
    if [ -d "$CLOUD_BACKUP" ]; then
        cp "$BACKUP_BASE/backup_$DATE.tar.gz" "$CLOUD_BACKUP/"
        echo "Cloud backup created"
    fi
    
    echo "Backup completed: backup_$DATE.tar.gz"
}

# 함수: 오래된 백업 정리
cleanup_old_backups() {
    echo "Cleaning up old backups..."
    # 30일 이상 된 백업 삭제
    find "$BACKUP_BASE" -name "backup_*.tar.gz" -mtime +30 -delete
    echo "Cleanup completed"
}

# 실행
create_backup
cleanup_old_backups
```

### 7.2 복구 자동화 (recover.sh)
```bash
#!/bin/bash
set -e

# 설정
BACKUP_BASE="$HOME/backups/jayleekr.github.io"
RECOVERY_DIR="$HOME/recovery/jayleekr.github.io"

# 최신 백업 찾기
LATEST_BACKUP=$(ls -t "$BACKUP_BASE"/backup_*.tar.gz | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "No backup found!"
    exit 1
fi

echo "Found backup: $LATEST_BACKUP"
echo "Recovering to: $RECOVERY_DIR"

# 복구 디렉토리 생성
mkdir -p "$RECOVERY_DIR"

# 백업 압축 해제
tar -xzf "$LATEST_BACKUP" -C "$RECOVERY_DIR"

# 의존성 설치 및 빌드
cd "$RECOVERY_DIR"
npm install
npm run build

echo "Recovery completed!"
echo "Test the site with: npm run preview"
```

## 8. 모니터링 및 알림

### 8.1 백업 상태 모니터링
- GitHub Actions를 통한 일일 백업 확인
- 백업 파일 크기 및 생성 시간 모니터링
- 실패 시 이메일 알림

### 8.2 복구 훈련
- 분기별 복구 훈련 실시
- 복구 시간 측정 및 개선
- 문서 업데이트

---

최종 업데이트: 2025-01-14