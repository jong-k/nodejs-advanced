import DiaryItem from "./DiaryItem";
import { DummyListType } from "./data/temp";

interface PropType {
  diaryList: DummyListType[];
  onRemove: (id: number) => void;
  onEdit: (id: number, newContent: string) => void;
}

const DiaryList = ({ diaryList, onRemove, onEdit }: PropType) => {
  return (
    <div className="DiaryList">
      <h2 className="DiaryHeader">일기 리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div>
        {diaryList.map((diary: DummyListType) => (
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
