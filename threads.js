// threads pool size 변경
process.env.UV_THREADPOOL_SIZE = "5";

const crypto = require("crypto");

const start = Date.now();
// #1
crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    // hash 가 완료되면 실행되는 콜백 (소요 시간 측정)
    console.log("1:", Date.now() - start);
});
// #2
crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    console.log("2:", Date.now() - start);
})
// #3
crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    // hash 가 완료되면 실행되는 콜백 (소요 시간 측정)
    console.log("3:", Date.now() - start);
});
// #4
crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    console.log("4:", Date.now() - start);
})
// #5
crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    console.log("5:", Date.now() - start);
})

/*
#1, #2 실행 결과
거의 동시에 완료되며, #2 가 먼저 끝나는경우도 있음 -> 이걸 어떻게 생각해야 할까?
싱글 스레드였다면 #1 다음에 #2 처럼 순차적으로 실행되어야 하는데..

#1 ~ #4 실행 결과
마찬가지로 4개가 동시에 완료됨

#1 ~ #5 실행 결과
#1 ~ #4 실행 끝나고 #5가 완료됨 -> 4개의 스레드풀 확인

스레드풀 사이즈를 2로 변경 후 #1 ~ #5 실행 결과
3번의 작업단위로 나눠서 실행됨

스레드풀 사이즈를 5로 변경 후 #1 ~ #5 실행 결과
5개의 작업이 시간#1 에 한번에 처리됨!
모든 작업이 미세하게 시간이 증가 (20ms 정도)
 */

