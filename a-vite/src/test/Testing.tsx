/*
Component Lifecycle
1. Mount
2. Update
3. Unmount -> cleanup 함수

 */

import { useState, useEffect } from "react";

const TestComp = () => {
  useEffect(() => {
    // React.StrictMode 컴포넌트로 감싸져 있는 경우 useEffect가 2번 실행됨
    console.log("Mount!");

    return () => {
      console.log("Unmount!");
    };
  }, []);

  return <div>Unmount Testing Component</div>;
};

const Testing = () => {
  // const [count, setCount] = useState(0);
  // const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Mount! 는 최초 Mount 시 2번 출력됨
  // useEffect(() => {
  //   console.log("Mount!");
  // }, []);

  // Update!는 최초 Mount 시 2번 출력되고 리렌더링 때마다 출력됨
  // deps 배열 없음
  // useEffect(() => {
  //   console.log("Update!");
  // });

  // useEffect(() => {
  //   console.log(`${count} : current count`);
  // }, [count]);

  return (
    <div style={{ padding: 20 }}>
      <div>
        <button
          onClick={() => {
            setIsVisible(!isVisible);
          }}
        >
          ON / OFF
        </button>
      </div>
      {isVisible && <TestComp />}
      {/* <div> */}
      {/*  {count} */}
      {/*  <button */}
      {/*    onClick={() => { */}
      {/*      setCount(count + 1); */}
      {/*    }} */}
      {/*  > */}
      {/*    + */}
      {/*  </button> */}
      {/* </div> */}
      {/* <div> */}
      {/*  <input */}
      {/*    value={text} */}
      {/*    onChange={(e) => { */}
      {/*      setText(e.target.value); */}
      {/*    }} */}
      {/*  /> */}
      {/* </div> */}
    </div>
  );
};

export default Testing;
