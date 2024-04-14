# 1. The Internals of Node

## 목차
1. Implementation of Node.js
2. Event Loop

## 1. Implementation of Node.js
### 노드의 세부 구현
개발자가 JavaScript 코드 입력 -> Node.js -> V8 & libuv

### Node.js
- 50% JS
- 50% C++
- standard library module로 구성됨
  - http
  - fs
  - crypto
  - path 등등..

### V8 & libuv(립 유브이)
V8
- JS 코드를 해석하고 실행
- 30% JS
- 70% C++

libuv
- 파일 시스템에 접근, 동시성 제어 등
- 100% C++

### 작동 예시
1. 개발자가 JS 코드 입력
    - 예) pbkdf2 해시 함수 호출
2. Node의 JS side
    - 역할분담
      - JS 에서는 주로 validation 역할
      - 실제 연산은 C++에서
    - /lib 폴더
      - process.binding(): JS와 C++ 함수 연결
      - V8: JS와 C++ 사이에서 값 변환
3. Node의 C++ side
    - /src 폴더
      - libuv: Node가 OS에 접근하게 도와줌

## 2. Event Loop

### The Basics of Threads
프로세스
- 동작중인 프로그램의 인스턴스
- 컴퓨터 실행 시 기본적으로 프로세스가 실행
- 프로세스는 1개 이상의 스레드를 가진다

스레드
- 최종적으로 CPU에 전달되어 처리될 작업 단위
- 작업 to-do list 와 비슷하며 CPU에 전달되어 수행됨

스케줄러 (OS 귀속)
- 적시에 스레드를 프로세스에 전달 수행
- 스케줄러는 긴급한 스레드가 너무 오래 기다리게 해선 안됨

멀티 스레딩
- CPU는 여러 Core를 가져서 동시에 여러 프로세스(스레드)를 처리

### The Node Event Loop and It's Implementation
이벤트 루프
- Node 프로그램에서 하나의 스레드는 무조건 하나의 이벤트 루프를 가짐
- 예시 Pseudo Code

```
// node myFile.js

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

myFile.runContents();

function shouldContinue() {
    // 1번째 체크: 남아있는 setTimeout, setInterval, setImmediate 가 있는지?
    // 2번째 체크: 남아있는 OS 태스트가 있는지? (예 - server listening to port)
    // 3번째 체크: 시간이 오래 걸리는 연산이 있는지? (예 - fs module같은 읽기쓰기 작업)
    return pendingTimers.length || pendingOSTasks.length || pendingOperations.length;
}

// Node 앱에서 1`tick`마다 반복해서 실행됨
while (shouldContinue()) {
    // 마지막 OS Tasks, Operations 들이 모두 완료되거나,
    // 마지막 timer가 거의 완료되려고 하면 Pause
    // Pause execution 이후 재실행 대기
    
    // 마지막 timer 완료되면 setImmediate 호출
    
    // 모든 'close' 이벤트 핸들러 호출
    // 아래의 readStream close 이벤트 핸들러 참조
    
}


// exit back to terminal

```

```
// onClose Event Handler Sample
readStream.on("close", () => {
    console.log("Cleanup Code");
})
```

### Is Node Single Threaded?
Node.js Event Loop
- Single Threaded (1 Event Loop has 1 Thread)

Some of Node Framework/Std Lib
- Not Single Threaded
  - 모든 기능이 이벤트 루프의 스레드 내에서만 실행되는 것은 아니기 때문

### Simple Test of Single Threads with crypto 
thread.js 실행 결과
- `thread.js`파일을 `node thread.js` 명령어로 실행

### The Libuv Thread Pool
Thread Pool
- 앞서 봤던 `thread.js`파일에서 각 pbkdf2 함수들은 실제로는 Node의 C++ 영역에서 연산됨
- Node의 C++ 영역에 있는 libuv는 4개의 스레드가 있는 스레드 풀을 가짐
- 오래 걸리는 연산의 경우 스레드를 나눠서 처리 (예 - pbkdf2에서 hash 1만번 반복)

### Thread Pools with MultiThreading
5개의 pbkdf2 함수 실행 테스트
- 코어 하나가 1개의 이벤트 루프, 4개의 스레드를 가지므로 4개의 작업이 한번에 처리됨
  - 코어#1 에서 4개의 pbkdf2 함수들 처리되고, 코어#2 에서 나머지 1개의 pbkdf2 함수가 처리됨

### Changing Threads Pool Size
UV_THREADPOOL_SIZE 환경변수
- `process.UV_THREADPOOL_SIZE` 환경변수를 바꿔서 스레드풀 사이즈 변경 가능
- 스레드풀 사이즈를 2로 변경 후 5개의 pbkdf2 함수를 실행하면,
  - 시간#1
    - pbkdf2 #1 이 스레드 #1
    - pbkdf2 #2 가 스레드 #2
  - 시간#2
    - pbkdf2 #3 이 스레드 #1
    - pbkdf2 #4 기 스레드 #2
  - 시간#3
    - pbkdf2 #5 가 스레드 #1

### Common Threadpool Questions
Node.js std library 이외에도 개발자가 직접 만든 함수들도 스레드풀을 활용할 수 있나?
- 스레드풀을 사용하는 커스텀 JS 코드 작성 가능

Node.js std library 중 스레드풀을 이용하는 함수는?
- 모든 fs 모듈 (읽기, 쓰기 기능)
- 몇가지 crypto 모듈
- 이외에는 OS에 따라 다름 (windows vs unix based)

이 스레드풀은 이벤트 루프에 어떻게 적용되나?
- 스레드풀에서 실행 중인 작업은 코드 샘플의 pendingOperations
