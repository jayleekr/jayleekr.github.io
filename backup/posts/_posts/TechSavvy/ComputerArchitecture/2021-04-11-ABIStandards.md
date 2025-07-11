---
title:  ABI Standards
author: Jay Lee
date: 2021-04-11 00:00:00 +0800
categories: [TechSavvy, ComputerArchitecture]
tags: [Blogging, ComputerArchitecture, Linux, AGL, EmbeddedLinux, OpenEmbedded, Yocto, CrossDevelopment, GCC, GDB, Toolchain]
image: /assets/img/abi.png
---

## **ABI(Application Binary Interface) 표준**

Application간 binary 데이터를 어떻게 교환해야 하는지 다음과 같은 규칙들을 정한다.

- 데이터 타입과 정렬 방법
- 함수 호출 시 인수 및 결과에 대해 레지스터 교환 방법
- 시스템 콜 호출 방법
- 프로그램 코드의 시작과 데이터에 대한 초기화 방법
- 파일 교환 방법(ELF 등)

### **EABI 표준**

EABI(Embeded ABI)는 임베디드 환경의 ABI를 다룬다. ARM 아키텍처에서 리눅스 버전에 따라 ABI를 사용하는 방식이 다음 두 가지로 나뉜다.

- arm/OABI
    - 커널 v2.6.15 (mainline v2.6.16) 이전에 사용되던 ABI 방식(Old ABI 또는 legacy ABI라고도 불린다)
    - glibc 2.3.6 까지 사용
    - gcc: linux-arm-none-gnu
- arm/EABI
    - 커널 v2.6.16 부터 사용되는 ARM EABI 방식
    - glibc v2.3.7 및 v2.4 부터 사용
    - gcc: linux-arm-none-gnueabi

## **arm/OABI 및 arm/EABI 차이점**

### **소프트 인터럽트 호출방식**

- OABI
    - swi __NR_SYSCALL_BASE(==0x900000)+1
- EABI
    - mov r7, #1 (시스템콜 인덱스)
    - swi 0

### **구조체 패키징**

- OABI
    - 구조체는 4 바이트 단위로 정렬
- EABI
    - 구조체 사이즈대로 사용

### **스택에 인수 정렬**

- OABI
    - 스택에 저장할 때 4 바이트 단위로 저장
- EABI
    - 스택에 저장할 때 8 바이트 단위로 저장

### **64bit 타입 인수 정렬**

- OABI
    - 4 바이트 단위로 정렬
- EABI
    - 8 바이트 단위로 정렬

### **Enum 타입 사이즈**

- OABI
    - 4 바이트 단위
- EABI
    - 가변으로 지정할 수 있음

### **인수 전달 시 레지스터 수**

- OABI
    - 4개 (r0~r3)
- EABI
    - 7개(r0~r6)

## **차이점 예제**

### **소프트 인터럽트 + 64bit 타입 인수 정렬**

예) long sum64(unsigned int start, size_t size);   syscall no=100

- arm/OABI
    - r0에 start 대입
    - r1과 r2에 size를 64비트로 대입
    - swi #(0x900000 + 100)
- arm/EABI
    - r0에 start 대입
    - r2와 r3에 size를 64비트로 대입
    - r7에 100 대입
    - swi 0