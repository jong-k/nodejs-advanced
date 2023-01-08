import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import { useState, useRef } from "react";

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

  return (
    <>
      <DiaryEditor onCreate={onCreate} />
      <DiaryList diaryList={data} />
    </>
  );
}

export default App;
