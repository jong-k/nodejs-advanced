import React, { ChangeEvent, useState, useRef, useEffect } from "react";

interface PropType {
  onCreate: (author: string, content: string, emotion: number) => void;
}

const DiaryEditor = ({ onCreate }: PropType) => {
  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 3,
  });

  useEffect(() => {
    console.log("DiaryEditor 렌더링");
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

export default React.memo(DiaryEditor);

/*
onChange 프로퍼티 : value가 바뀌면 발생
e.target.name -> input의 name 사용 가능
input element의 onchage 프로퍼티에서 e 에 커서 올리면 무슨 타입 붙여야 하는지 알려줌
계산된 프로퍼티 네임 기능을 써서 e.target.name 조건문을 만들 필요 없음
alert은 사실 사용하지 않는게 좋음
useRef 사용하여 element 참조할때 current 프로퍼티 꼭 붙여야 함
element.focus() : element에 focus하기

React.memo 로 묶어줄 때는 export 하는 컴포넌트 이름만 묶어줘도 됨

useEffect로 DiaryEditor가 몇번 렌더린 되는지 확인해보면
-> 2번 렌더링 됨을 알 수 있다
-> 그 이유는, App 컴포넌트를 보면, 처음에 data state에 빈 배열이 할당됨
-> 그 이후, useEffect에 getData가 호출되면서 setData가 일어남, 그에 따라 App 컴포넌트도 2번 렌더링됨
-> 그리고 App 컴포넌트에서 정의하는 onCreate 함수도 계속 재생성되어 props로 전달되는 자식 컴포넌트인 DiaryEditor도 2번 렌더링 발생
-> 따라서 DiaryEditor 컴포넌트의 재생성을 막으려면 onCreate 함수를 메모이제이션해주면 된다
 */
