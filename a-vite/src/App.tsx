import { useState, useRef, useEffect, useMemo, useCallback } from "react";

import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
// import OptimizeTesting from "./test/OptimizeTesting";
// import ObtimizeTestingB from "./test/ObtimizeTestingB";
// import Testing from "./Testing";

interface DataType {
  id: number;
  author: string;
  content: string;
  emotion: number;
  createdDate: number;
}

function App() {
  const [data, setData] = useState<DataType[]>([]);

  const dataId = useRef(0);

  const getData = async (): Promise<any> => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments",
    ).then(async (res) => await res.json());

    const initData = res.slice(0, 20).map((item: any) => {
      return {
        id: ++dataId.current,
        author: item.email,
        content: item.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        createdDate: new Date().getTime(),
      };
    });

    setData(initData);
  };

  useEffect(() => {
    getData();
  }, []);

  const onCreate = useCallback(
    (author: string, content: string, emotion: number) => {
      const createdDate = new Date().getTime();
      const newItem = {
        id: dataId.current,
        author,
        content,
        emotion,
        createdDate,
      };
      dataId.current += 1;
      setData([newItem, ...data]);
      // 의존성 배열을 사용하지 않는다면 setState 동작을 함수형 업데이트 방식으로 바꾸면 됨
      // setData((data) => [newItem, ...data]);
    },
    [data],
    // 의존성 배열 안에 변수를 넣으면, 해당 state를 참조하여 메모이제이션을 재실행하라는 의미
    // 의존성 배열을 사용하지 않으면 data가 mount 최초 상태인 빈배열을 계속 가리키게 됨
  );

  const onRemove = (id: number) => {
    setData(data.filter((diary) => diary.id !== id));
  };

  const onEdit = (id: number, newContent: string) => {
    setData(
      data.map((diary) =>
        diary.id === id ? { ...diary, content: newContent } : diary,
      ),
    );
  };

  const getDiaryAnalysis = useMemo(() => {
    console.log("일기 분석 시작");
    const goodCount = data.filter((diary) => diary.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <>
      {/* <Testing /> */}
      {/* <OptimizeTesting /> */}
      {/* <ObtimizeTestingB /> */}
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 : {goodCount}</div>
      <div>기분 나쁜 일기 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}</div>
      <DiaryList diaryList={data} onRemove={onRemove} onEdit={onEdit} />
    </>
  );
}

export default App;

/*
useCallback을 썼는데 의존성 배열이 비어있는 경우,
-> useCallback은 mount 초창기에 1번 실행됨 (이 때 state는 초기값)
-> 이후 컴포넌트가 재렌더링되어도 useCallback의 콜백 함수가 재생성되지 않고 그대로 사용됨
-> 그러나, 이는 콜백 함수가 바뀌는 state를 참조하지 못하는 문제를 일으킴
-> 그래서 콜백함수가 이상한 state를 참조하게 하는 에러를 유발

-> 이때 해결 방법은 2가지
1. 의존성 배열에 변화를 감지하여 콜백함수를 업데이트할 state를 넣음
2. 콜백 함수 내부에서 setState 동작에 함수형 업데이트 실행
 */
