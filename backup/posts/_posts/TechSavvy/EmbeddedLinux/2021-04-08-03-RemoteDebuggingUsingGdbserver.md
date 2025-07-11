---
title: 03.Remote Debugging Using Gdbserver
author: Jay Lee
date: 2021-04-08 00:00:00 +0800
categories: [TechSavvy, EmbeddedLinux]
tags: [Blogging, Linux, AGL, EmbeddedLinux, OpenEmbedded, Yocto, CrossDevelopment, GCC, GDB, Toolchain]
image: /assets/img/embeddedlinux.jpg
---

디버거 툴인  gdbserver 와 gdb를 이용하여 원격 디버깅을 할 수 있는 방법을 포스팅한다.

Remote debugging이란 실제로 Application이 동작하고 있는 Target에 gdbserver를 실행시켜 원격 Host에서 gdb 및 toolchain을 활용하여 디버깅하는 방식이다.

![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/1.png" | relative_url }})
Ref. Linux Foundation Conference 2020

이 방식은 Target에는 compiler를 통해 최적화 및 디버깅 심볼을 제외한 어플리케이션을 gdbserver를 통해 Listening 시키고, 원격 Host에서는 최적화 및 디버깅 심볼이 포함된 어플리케이션을 Toolchain 및 gdb를 통해 gdbserver에 접속하여 디버깅하는 방식이다.

Target 이 Embedded Board인 경우에는 디스크 메모리의 용량이나 시스템 메모리의 용량이 매우 제한적인데, 이런 케이스에 Remote debugging이 유용하다.

# **Break into Examples**

- 본격적 설명에 앞서 일단 기본적으로 gdb를 command line으로 어느정도는 다룰 줄 안다고 가정한다.

## **0. Setting up Environment**

![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/2.png" | relative_url }})

위 그림은 두개의 VS Code에서 각각 Docker Container를 띄운 상황이다.

- Host IP : 172.25.125.2
- Target IP : 172.25.125.3

## **1. Printing Helloworld**

테스트하고자하는 예제 시나리오는 아래와 같다.

1. Host에서 Target용 ***Helloworld.cpp*** 를 Compile하여 Target에 전송
    - ***Not Stripped, with debug info, no optimization***
2. GDBServer 와 GDB를 연동
3. Target상의 Application을 Host에서 Network로 실시간 Debugging

***Helloworld.cpp*** 테스트 코드를 확대하면 아래와 같다.

```cpp
#include <iostream>
#include <vector>

int main(){
    std::vector<int> intVector {1,2,3,4,5,6,7};
    
    for (auto i : intVector){
        std::cout << "Hello World : "<< i << std::endl;
    }
    return 0;
}
```

### 1. Host에서 Target용 ***Helloworld.cpp*** 를 Compile하여 Target에 전송

![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/3.png" | relative_url }})
### 2. GDBServer 와 GDB를 연동

- ***[TARGET]*** 먼저 Target에서 GDBServer를 틀어 Listening 상태로 만들자

    ![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/4.png" | relative_url }})

- *[HOST]* GDB를 실행하여 네트워크로 GDBServer에 접속하자

    ![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/5.png" | relative_url }})

- *[HOST, TARGET]* 성공적으로 연결된 화면

    ![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/6.png" | relative_url }})

### 4. Target상의 Application을 Host에서 Network로 실시간 Debugging

- *[HOST]* main 함수에 Breaking 포인트를 잡고 확인

    ![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/7.png" | relative_url }})

- *[HOST]* 실행

    ![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/8.png" | relative_url }})

    - remote로 접속한 gdb 에서는 run command는 불가능하다
    - HOST에서 n 으로 Line by Line 으로 진행하면 TARGET에서 std::cout 을 통한 메세지가 stdout에 찍히는 것을 확인 할 수 있다

## **2. Attaching to running applications**

GDBServer를 이용하여 Applcation을 처음부터 시작하는 경우를 제외하고도 Just-In-Time 한 동작중인 Application에도 Attach 할 수 있다.

무한으로 Loop을 타며 동작하는 아래와 같은 예시를 들어 설명하겠다.

```cpp
//running_app.cpp
#include <iostream>
#include <vector>
#include <thread>
#include <chrono>

int main(){
    using namespace std::chrono_literals;
    while (true){
        std::vector<int> intVector {1,2,3,4,5,6,7};
        for (auto i : intVector){
            std::cout << "Hello World : "<< i << std::endl;
            std::this_thread::sleep_for(1s);
        }
    }
    
    return 0;
}
```

위 예제는 1초마다 Hello World : 1 ~ 7 을 반복해서 stdout으로 출력할 것이다.

*[TARGET]* 먼저 빌드한 위 어플케이션을 Target으로 옮긴 후 실행해보자.

- running_app 은 pid=25685 가 할당 되어 실행 중이다.

    ![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/9.png" | relative_url }})

***[TARGET]*** gdbserver를 runnining_app에 attach 해보자

- 정상적으로 Listening 이 시작되면 역시 아래와 같은 로그가 확인된다

    ![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/10.png" | relative_url }})

***[HOST]*** gdb로 TARGET에 아래와 같이 연결하자

![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/11.png" | relative_url }})

- 연결과 동시에 TARGET의 동작이 일시정지된다

    ![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/12.png" | relative_url }})

- 로그를 보면 연결한 시점이

    ![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/13.png" | relative_url }})

    ```cpp
    std::this_thread::sleep_for(1s);
    ```

    를 실행 중인 것으로 판단된다.

    - nanosleep.c 쪽의 source 코드가 없기 때문에 심볼의 내용은 tracing이 불가능하다

***[HOST]*** n나 s 커맨드로 Line by Line으로 디버깅을 진행하면 된다

- n command (next)

    ![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/14.png" | relative_url }})

- s command (step into)

    ![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/15.png" | relative_url }})

***[HOST]*** detach 를 통해 다시 정상 동작을 시킬 수 있다

- Debugging 하던 마지막 시점부터 다시 정상 동작한다

    ![Desktop View]({{ "/assets/img/03-RemoteDebuggingUsingGdbserver/16.png" | relative_url }})