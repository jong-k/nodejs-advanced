/*
onChange 프로퍼티 : value가 바뀌면 발생
e.target.name -> input의 name 사용 가능
input element의 onchage 프로퍼티에서 e 에 커서 올리면 무슨 타입 붙여야 하는지 알려줌
계산된 프로퍼티 네임 기능을 써서 e.target.name 조건문을 만들 필요 없음
alert은 사실 사용하지 않는게 좋음
useRef 사용하여 element 참조할때 current 프로퍼티 꼭 붙여야 함
element.focus() : element에 focus하기
 */

import { ChangeEvent, useState, useRef } from "react";

interface PropType {
  onCreate: (author: string, content: string, emotion: number) => void;
}

const DiaryEditor = ({ onCreate }: PropType) => {
  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 3,
  });

  const authorInput = useRef<HTMLInputElement>(null);
  const contentInput = useRef<HTMLTextAreaElement>(null);

  const handleChangeState = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (state.author.length < 1) {
      if (authorInput.current == null) throw Error("authorInput is invalid");
      authorInput.current.focus();
      return;
    }

    if (state.content.length < 5) {
      if (contentInput.current == null) throw Error("contentInput is invalid");
      contentInput.current.focus();
      return;
    }

    onCreate(state.author, state.content, state.emotion);
    alert("저장 성공!");
    setState({
      author: "",
      content: "",
      emotion: 3,
    });
  };

  return (
    <div className="DiaryEditor">
      <h2>오늘의 일기</h2>
      <div>
        <input
          name="author"
          value={state.author}
          onChange={handleChangeState}
          ref={authorInput}
        />
      </div>
      <div>
        <textarea
          name="content"
          value={state.content}
          onChange={handleChangeState}
          ref={contentInput}
        />
      </div>
      <div>
        <span>오늘의 감정 점수 : </span>
        <select
          name="emotion"
          value={state.emotion}
          onChange={handleChangeState}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>
      <div>
        <button onClick={handleSubmit}>일기 저장하기</button>
      </div>
    </div>
  );
};

export default DiaryEditor;
