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
      <DiaryEditor onCreate={onCreate} />
      <DiaryList diaryList={data} onRemove={onRemove} onEdit={onEdit} />
    </>
  );
}

export default App;
