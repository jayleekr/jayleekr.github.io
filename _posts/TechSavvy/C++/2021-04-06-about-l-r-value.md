---
title: About l-r-value of Modern C++
author: Jay Lee
date: 2021-04-06 00:00:00 +0800
categories: [TechSavvy, C++]
tags: [TechSavvy, ProgrammingLanguage, C++, l-value, r-value, move]
image : /assets/img/post/cpp.png
---

## Modern C++의 l-r-value에 대하여

### 0. Preface

참조(&)는 포인터(*)와 같이 메모리 어딘가에 위치한 개체의 주소를 저장한다.
하지만 참조는 한번 초기화 된 후 다른 개체를 참조하거나 null로 만들 수 없다.

l-value 와 r-value 즉, 좌측값과 우측값의 정의는 C 언어로부터 내려온다.

> 좌측값은 대입시에는 왼쪽 혹은 오른쪽에서 오는 식이고, 우측값은 대입시에 오직 오른쪽에만 오는 식이다.

이는 C++ 에 넘어와서 다소 다른 방법으로 정의되었다. 

> 좌측값은 어떠한 메모리위치를 가리키며 &연산자로 그 위치를 참조할 수 있다. 우측값은 좌측값이 아닌값이다.
> l-value 는 식이 끝난 후에 지속됨
> r-value 는 식이 끝난 후에 지속되지 않음
> l-value 는 이름있는 변수를 참조 (&)
> r-value 는 일시적인 개체를 참조(&&)

``` cpp
int a = 0;  
a; // l-value
0; // r-value
Player player;
player; // l-value
Player(); // r-value
```
여기까지의 설명으로는 l-r-value를 설명할 수 없다.

차근차근 l-r-value에 대해 알아보자..


### 1. l-value

l-value는 다소 명료하다.
아래 코드와 주석을 보며 이야기하자.

``` cpp
// 모두 좌측값
int a = 1;                    // global 변수 a -> l-value
int& function(){              // l-value function은 return 하는 a의 주소값으로 초기화
    a = 3;                    // a-> l-value, 대입가능  
    return a;
}

int main()
{
    int i = 3;                // i 는 l-value
    i = 4;                    // i 는 l-value, 대입가능
                              // i -> 4
    int *ptr = &i;            // i 는 l-value & 연산자 참조가능, ptr는 i의 주소값을 가르킴
                              // *ptr 는 i의 값 -> 4
    ptr = &a;                 // ptr 는 int * 타입의 pointer이므로 참조하는 주소를 변경가능
                              // *ptr 는 a의 값 -> 1
    int & r = i;              // l-value인 i의 주소값으로 r은 초기화, 즉 r은 l-value 가 대입된 l-value
    r = 5;                    // r이 가르키는 주소값에 그 위치에 값을 씀, 즉 i의 값이 변함(r 과 i 는 5)
                              // r 과 i 둘 다 같은 주소를 가르키고있음 -> 5
    int c = function();       // l-vlaue의 참조는 초기화시에만 그 주소를 저장
                              // c -> function의 내부 스택의 연산후의 return 값인 바뀐 a 값 3
    function() = 50;          // function 은 l-value, r-value 50을 대입가능
                              // a 의 값이 50으로 변한다. 
                              // 그리고 ptr 는 a의 주소를 가르키므로 *ptr -> 50 으로 대입된다.
    int d = a;                // l-value d는 a 값인 50이 대입된다.
    int *ptr_2 = &function(); // int *타입의 ptr_2는 &function 가능(funtion은 좌측값이므로)
                              // function의 내부 스택의 연산후의 return 값인 바뀐 a 값 3
                              // * ptr_2 -> 바뀐 a의 값 -> 3
                              // c 의 값 도 변함 -> 3
                              // * ptr 의 값도 변함 -> 3
    return 0;
}
```

좌측값의 대입은 위처럼 비교적 명료하여 쉽사리 이해된다.

### 2. r-value

우측 값 r-value 의 참조는 약간 다르다.

``` cpp
int function();         // funtion 은 호출후 지속되지 않음 -> r-value 
function();             // r-value
int i = 0;
i = function();         // r-value function의 return값을 대입한 i 는 l-value
int *ptr = &function(); // ERROR!!! r-value의 주소는 참조할수 없다
```

초기 c/c++의 설계자들은 r-value를 일시적 개체로 정의했기 때문에 기본적으로 대입이되지 않게 만들어 두었다.

하지만 Modern C++ (stdc++11)에서 "**move semantic**" 을 도입한 이후에 많은 것들이 변했다.

### 3. Move Semantic

아래와 같은 시나리오를 생각해보자.

``` cpp
ClassX returnX(); // returnX()함수는 ClassX타입의 개체를 리턴
                  // 그리고 r-value
ClassX tmpX;      // tmpX 는 l-value
tmpX = returnX(); // ClassX 타입의 개체를 tmpX 에 복사하고 싶음!!
```

위 코드의 세번째 라인에서 tmpX 에 returnX()의 결과물을 복사하는 개발자의 의도를 보여준다.
이를 위해서는 아래와 같은 과정을 거치면 가능할 것이다.

 1. tmpX의 리소스가 먼저 소멸
 2. returnX() 가 리턴한 임시 개체의 리소스가 생성
 3. tmpX 는 복제된 개체를 가리키고, 임시로 생성된 개체는 삭제


## Appendix.A References

[1] [https://m.blog.naver.com/yoochansong/222082508401](https://m.blog.naver.com/yoochansong/222082508401)
[2] [https://docs.microsoft.com/ko-kr/cpp/cpp/references-cpp?view=msvc-160&viewFallbackFrom=vs-2019](https://docs.microsoft.com/ko-kr/cpp/cpp/references-cpp?view=msvc-160&viewFallbackFrom=vs-2019)
[3] [https://skstormdummy.tistory.com/entry/%EC%9A%B0%EC%B8%A1-%EA%B0%92-%EC%B0%B8%EC%A1%B0-RValue-Reference](https://skstormdummy.tistory.com/entry/%EC%9A%B0%EC%B8%A1-%EA%B0%92-%EC%B0%B8%EC%A1%B0-RValue-Reference)
[4] [https://modoocode.com/189](https://modoocode.com/189)





