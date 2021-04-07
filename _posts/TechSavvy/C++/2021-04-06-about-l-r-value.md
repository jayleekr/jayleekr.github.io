---
title: About l-r-value & Move Semantic of Modern C++
author: Jay Lee
date: 2021-04-06 00:00:00 +0800
categories: [TechSavvy, C++]
tags: [TechSavvy, ProgrammingLanguage, C++, l-value, r-value, move]
image : /assets/img/post/cpp.png
---

## Modern C++의 l-r-value & Move Semantic 에 대하여

### 0. Preface

들어가기 전에 참조(&)와 포인터(*)의 기본 개념을  짚어보자.

> 참조(&)는 포인터(*)와 같이 메모리 어딘가에 위치한 개체의 주소를 저장한다.
> 하지만 참조는 한번 초기화 된 후 다른 개체를 참조하거나 null로 만들 수 없다.

값(value)은 l-value 와 r-value 두가지로 분류가 가능하다.
l-value 와 r-value 즉, 좌측값과 우측값의 정의는 C 언어로부터 내려온다.

> 좌측값은 대입시에는 왼쪽 혹은 오른쪽에서 오는 식이고, 우측값은 대입시에 오직 오른쪽에만 오는 식이다.

``` cpp
int a = 0;  
a; // l-value
0; // r-value
Player player;
player; // l-value
Player(); // r-value
```

이는 C++ 에 넘어와서 다소 다른 방법으로 정의되었다. 

> 좌측값은 어떠한 메모리위치를 가리키며 &연산자로 그 위치를 참조할 수 있다. 우측값은 좌측값이 아닌값이다.
> l-value 는 식이 끝난 후에 지속됨
> r-value 는 식이 끝난 후에 지속되지 않음
> l-value 는 이름있는 변수를 참조 (&)
> r-value 는 일시적인 개체를 참조(&&)

사실 이 정의도 너무나 모호하여 많은이들이 헷갈려한다.

자 이제 차근차근 l-r-value에 대해 좀 더 자세히 알아보자..

### 1. l-value

l-value는 다소 명료하다.

가능한 정리
-  단일식을 넘어서 지속되는 개체!!
   - 주소가 있음
   - 이름이 있는 변수
   - const 변수
   - 배열 변수
   - 비트 필드 (bit-fields)
   - 공용 구조체 (unions)
   - Class 멤버
   - 좌측 값의 참조(&)로 반환하는 함수 호출
   - 문자열 리터럴

그렇다면 l-value의 대입 및 참조는 어떨까?

아래 코드와 주석을 보며 이야기하자.

``` cpp
// 모두 l-value
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

하지만 r-value 는 정의가 다소 어렵다..

일단 가능한 정리는 아래와 같다.

- l-value가 아닌 개체... (대우 명제ㅎㅎ..)
- 사용되는 단일식을 넘어 지속되지 않는 일시적인 값!!
  - 주소가 없는 개체
  - 리터럴(문자열 리터럴 제외)
  - 참조로 반환하지 않는 함수 호출(e.g. int function())
  - i++ 와 i-- (하지만, ++ 와 -- 연산자는 l-value 이다)
  - 기본 산술식, 논리식, 비교식(+,-,*,=, <,> 등, 연산자 overload 시 달라질수 있음)
  - 열거형(enum)
  - 람다(lambda) (즉, 컴파일러는 람다(무명함수)를 일시적인 것으로 판단한다..)

예시들을 보자.


r-value 의 예제1

``` cpp
int num1 = 10;
int num2 = 15;

if (num1 < num2) // (num1 < num2)는 r-value
{
    ...
}
```


r-value 의 예제2

``` cpp
int function();         // funtion 은 호출후 지속되지 않음 -> r-value 
function();             // r-value
int i = 0;
i = function();         // r-value function의 return값을 대입한 i 는 l-value
int *ptr = &function(); // ERROR!!! r-value의 주소는 참조할수 없다
```

초기 c/c++의 설계자들은 r-value를 일시적 개체로 정의했기 때문에 기본적으로 대입이되지 않게 만들어 두었다.

하지만 Modern C++ (stdc++11)에서 r-value의 "**move semantic**" 을 도입한 이후에 달라졌다.

### 3. Move Semantic의 등장

아래와 같은 시나리오를 생각해보자.

``` cpp
//Math.cpp
std::vector<float> Math::ConvertToPercentage(const std::vector<float>& scores){
    std:vector<float> percentages;
    for (auto& score : scores){
        //...
    }
    return percentages;
}
// main.cpp
#include "Math.h"
int main(){
    std::vector<float> scores;
    //...
    scores = ConvertToPercentage(scores); 
    //...
}

```

main 함수에서 ConvertToPercentage(scores)를 호출 했을때 Math 클래스는 std::vector<int> 타입의 percentages의 임시값을 생성하고 scores에 대입을 한다.
이 경우 Modern C++ 이라 불리우는 C++1x 이전인 구 C++에서는 위와 같은 상황에서 어떻게 동작할까?

scores의 초기화시 생성된 메모리 영역에 percentages의 임시 값이 **대입**되는 순간에 **복사**가 된다.
그리고 임시 값은 Math::ConvertToPercentage 함수 스택을 나오며 사라지게 된다.

여기에서 상당히 불필요한 과정이 있는데, 이는 percentages 임시값을 **복사** 하는 순간이다.

임시로 생성된 percentages의 결과값이 저장된 메모리 영역과 scores의 초기화 과정에서 생성된 메모리 영역을 단순히 바꿔(**Swap**)버리면,
어짜피 임시로 생성된 percentages의 메모리영역은 스택을 빠져나오며 없어질 것이기 때문에 "**복사**"라는 과정이 필요없게 된다.

이 불필요한 **복사**를 막는 방법이 바로 Modern C++ 가 자랑하는 r-value의 참조와 Move Semantic의 핵심이다.

> 사실 최근엔 컴파일러느님들이 알아서 잘해준다.

### 4. r-value 참조 (&&) 와 std::move

r-value 의 참조는 Modern C++ 인 C++11에 처음 등장한 연산자이다.
기능상 & 연산자와 비슷한 역할을 한다.

아래에 예시코드를 보자.

``` cpp
#include <memory>
#include <utility>
float CaculateAverage(){
    float average=3;
    // ...
    return average;
}

int main(){
    int num = 10;
    int && rNum = num;                   // Error!!! num 은 l-value -> int & lnum 은 가능
    int && rNum = std::move(num);           // l-value인 num을 참조할 수 있도록 해주는 move
    int && rNum1= 10;                       // OK, 10 은 r-value
    float&& rAverage = CaculateAverage();   // OK CaculateAverage 는 r-value
}
```

위




## Appendix.A References

1. [https://m.blog.naver.com/yoochansong/222082508401](https://m.blog.naver.com/yoochansong/222082508401)
2. [https://docs.microsoft.com/ko-kr/cpp/cpp/references-cpp?view=msvc-160&viewFallbackFrom=vs-2019](https://docs.microsoft.com/ko-kr/cpp/cpp/references-cpp?view=msvc-160&viewFallbackFrom=vs-2019)
3. [https://skstormdummy.tistory.com/entry/%EC%9A%B0%EC%B8%A1-%EA%B0%92-%EC%B0%B8%EC%A1%B0-RValue-Reference](https://skstormdummy.tistory.com/entry/%EC%9A%B0%EC%B8%A1-%EA%B0%92-%EC%B0%B8%EC%A1%B0-RValue-Reference)
4. [https://modoocode.com/189](https://modoocode.com/189)





