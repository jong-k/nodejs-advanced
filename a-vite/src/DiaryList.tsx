import { useContext } from "react";

import DiaryItem from "./DiaryItem";
import { DiaryStateContext, DiaryDispatchContext } from "./App";

const DiaryList = () => {
  const diaryList = useContext(DiaryStateContext);
  const { onEdit, onRemove } = useContext(DiaryDispatchContext);
  if (diaryList == null) throw new Error();

  return (
    <div className="DiaryList">
      <h2 className="DiaryHeader">일기 리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div>
        {diaryList.map((diary) => (
          <DiaryItem
            key={diary.id}
            diary={diary}
            onRemove={onRemove}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

/*
defaultProps 쓰는 형태
DiaryList.defaultProps = {
  diaryList: []
};
 */

export default DiaryList;
