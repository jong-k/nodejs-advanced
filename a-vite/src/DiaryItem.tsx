/*
Date 객체에 .toLocaleString() 사용하면 한국어 표기법으로 시간 가공

 */
import { useState, useRef } from "react";

import { DummyListType } from "./data/temp";

interface PropType {
  diary: DummyListType;
  onRemove: (id: number) => void;
  onEdit: (id: number, newContent: string) => void;
}

const DiaryItem = ({ diary, onRemove, onEdit }: PropType) => {
  const { id, author, content, emotion, createdDate } = diary;

  const [isEdit, setIsEdit] = useState(false);
  const toggleIsEdit = () => {
    setIsEdit(!isEdit);
  };

  const [localContent, setLocalContent] = useState(content);
  const localContentInput = useRef<HTMLTextAreaElement>(null);

  const handleRemove = () => {
    if (confirm(`${id}번째 일기를 삭제하시겠습니까?`)) {
      onRemove(id);
    }
  };

  const handleQuitEdit = () => {
    setIsEdit(false);
    setLocalContent(content);
  };

  const handleEdit = () => {
    if (localContent.length < 5) {
      if (localContentInput.current == null)
        throw Error("localContentInput is invalid");
      localContentInput.current.focus();
      return;
    }

    if (confirm(`${id}번 째 일기를 수정하시겠습니까?`)) {
      onEdit(id, localContent);
      setIsEdit(false);
    }
  };

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
      <div className="content">
        {isEdit ? (
          <textarea
            ref={localContentInput}
            value={localContent}
            onChange={(e) => {
              setLocalContent(e.target.value);
            }}
          />
        ) : (
          content
        )}
      </div>
      {isEdit ? (
        <>
          <button onClick={handleQuitEdit}>수정 취소</button>
          <button onClick={handleEdit}>수정 완료</button>
        </>
      ) : (
        <>
          <button onClick={toggleIsEdit}>수정</button>
          <button onClick={handleRemove}>삭제</button>
        </>
      )}
    </div>
  );
};

export default DiaryItem;
