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