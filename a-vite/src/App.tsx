import { useState, useRef, useEffect, useMemo } from "react";

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

  const onCreate = (author: string, content: string, emotion: number) => {
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
  };

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
