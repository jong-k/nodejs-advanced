import { useState, useRef, useEffect } from "react";

import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
// import Testing from "./Testing";
// https://jsonplaceholder.typicode.com/comments

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

  return (
    <>
      {/* <Testing /> */}
      <DiaryEditor onCreate={onCreate} />
      <DiaryList diaryList={data} onRemove={onRemove} onEdit={onEdit} />
    </>
  );
}

export default App;
