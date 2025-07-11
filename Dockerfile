FROM ruby:3.0

LABEL maintainer="Jay Lee <jayleekr0125@gmail.com>"
LABEL description="Jekyll 블로그 개발 및 테스트를 위한 컨테이너"

# 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    nodejs \
    npm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 설정
WORKDIR /blog

# Jekyll 및 Bundler 명시적 설치
RUN gem install jekyll bundler

# Gemfile 복사
COPY Gemfile ./
# 의존성 설치
RUN bundle config path vendor/bundle && \
    bundle install && \
    bundle binstubs jekyll --force

# 포트 노출
EXPOSE 4000

# 볼륨 설정
VOLUME /blog

# 기본 명령어 설정
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--incremental"] 