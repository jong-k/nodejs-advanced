/*
obj.count는 메모이제이션을 했고, 실제로 값이 변하지 않았지만,
다르게 인식되어 리렌더링되어버림

왜냐면, 객체를 비교할 때는 얕은 비교를 하기 떄문 (메모리 주소를 비교)
 */

import React, { useState, useEffect } from "react";

interface CountType {
  count: number;
}

const MemoizedCounterA = React.memo(function CounterA({ count }: CountType) {
  useEffect(() => {
    console.log(`CounterA update - count: ${count}`);
  });

  return <div>{count}</div>;
});

const areEqual = (prevProps, nextProps) => {
  return prevProps.obj.count === nextProps.obj.count;
};

const MemoizedCounterB = React.memo(function CounterB({ obj }: any) {
  useEffect(() => {
    console.log(`CounterB update - count: ${obj.count}`);
  });

  return <div>{obj.count}</div>;
}, areEqual);

const ObtimizeTestingB = () => {
  const [count, setCount] = useState(1);
  const [obj, setObj] = useState({
    count: 1,
  });
  return (
    <div style={{ padding: 50 }}>
      <div>
        <h2>Counter A</h2>
        <MemoizedCounterA count={count} />
        <button
          onClick={() => {
            setCount(count);
          }}
        >
          A Button
        </button>
      </div>
      <div>
        <h2>Counter B</h2>
        <MemoizedCounterB obj={obj} />
        <button
          onClick={() => {
            setObj({
              count: obj.count,
            });
          }}
        >
          B Button
        </button>
      </div>
    </div>
  );
};

export default ObtimizeTestingB;
