/*
React.memo를 쓸 때는, 메모이제이션할 컴포넌트를 화살표 함수 대신
함수 선언문으로 선언해야 한다

 */

import React, { useState, useEffect } from "react";

interface CountType {
  count: number;
}

interface TextType {
  text: string;
}

const MemoizedCountView = React.memo(function CountView({ count }: CountType) {
  useEffect(() => {
    console.log(`업데이트 :: Count : ${count}`);
  });

  return <div>{count}</div>;
});

const MemoizedTextView = React.memo(function TextView({ text }: TextType) {
  useEffect(() => {
    console.log(`업데이트 :: Text : ${text}`);
  });

  return <div>{text}</div>;
});

const OptimizeTesting = () => {
  const [count, setCount] = useState(1);
  const [text, setText] = useState("");

  return (
    <div style={{ padding: 50 }}>
      <div>
        <h2>count</h2>
        <MemoizedCountView count={count} />
        <button
          onClick={() => {
            setCount(count + 1);
          }}
        >
          +
        </button>
      </div>
      <div>
        <h2>text</h2>
        <MemoizedTextView text={text} />
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default OptimizeTesting;
