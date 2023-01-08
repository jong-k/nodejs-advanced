/*
Date 객체에 .toLocaleString() 사용하면 한국어 표기법으로 시간 가공

 */

import { DummyListType } from "./data/temp";

interface DiaryType {
  diary: DummyListType;
}

const DiaryItem = ({ diary }: DiaryType) => {
  const { author, content, emotion, createdDate } = diary;
  return (
    <div className="DiaryItem">
      <div className="Info">
        <span>
          작성자 : {author} | 감정 점수 : {emotion}
        </span>
        <br />
        <span className="date">{new Date(createdDate).toLocaleString()}</span>
        <br />
      </div>
      <div className="content">{content}</div>
    </div>
  );
};

export default DiaryItem;
