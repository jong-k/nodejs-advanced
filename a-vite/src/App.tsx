import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useReducer,
} from "react";

import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

export interface DiaryType {
  id: number;
  author: string;
  content: string;
  emotion: number;
  createdDate: number;
}

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return action.data;
    case "CREATE": {
      const createdDate = new Date().getTime();
      const newItem = {
        ...action.data,
        createdDate,
      };
      return [newItem, ...state];
    }
    case "REMOVE":
      return state.filter((item: DiaryType) => item.id !== action.id);
    case "EDIT":
      return state.map((item: DiaryType) =>
        item.id === action.id ? { ...item, content: action.newContent } : item,
      );
    default:
      throw new Error();
  }
};

export const DiaryStateContext = React.createContext<DiaryType[] | null>(null);
export const DiaryDispatchContext = React.createContext();

function App() {
  // const [data, setData] = useState<DataType[]>([]);
  const [data, dispatch] = useReducer(reducer, []);

  const dataId = useRef(0);

  const getData = async (): Promise<any> => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments",
    ).then(async (res) => await res.json());

    const initData = res.slice(0, 20).map((item: any) => {
      return {
        id: dataId.current++,
        author: item.email,
        content: item.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        createdDate: new Date().getTime(),
      };
    });

    dispatch({ type: "INIT", data: initData });
  };

  useEffect(() => {
    getData();
  }, []);

  const onCreate = useCallback(
    (author: string, content: string, emotion: number) => {
      dispatch({
        type: "CREATE",
        data: { id: dataId.current, author, content, emotion },
      });
      dataId.current += 1;
      // useReducer 사용으로 useState 사용 X
      // setData([newItem, ...data]);
      // 의존성 배열을 사용하지 않는다면 setState 동작을 함수형 업데이트 방식으로 바꾸면 됨
      // setData((data) => [newItem, ...data]);
    },
    [],
    // 의존성 배열 안에 변수를 넣으면, 해당 state를 참조하여 메모이제이션을 재실행하라는 의미
    // 의존성 배열을 사용하지 않으면 data가 mount 최초 상태인 빈배열을 계속 가리키게 됨
  );

  const onRemove = useCallback((id: number) => {
    dispatch({ type: "REMOVE", id });
    // setdata 내부에서 data를 한번 전달하여 함수형 업데이트 형태로 바꿈
    // 이렇게 안하면 의존성 배열에 data를 추가해야 함
    // setData((data) => data.filter((diary) => diary.id !== id));
  }, []);

  const onEdit = useCallback((id: number, newContent: string) => {
    dispatch({ type: "EDIT", id, newContent });
    // // setdata 내부에서 data를 한번 전달하여 함수형 업데이트 형태로 바꿈
    // // 이렇게 안하면 의존성 배열에 data를 추가해야 함
    // setData((data) =>
    //   data.map((diary) =>
    //     diary.id === id ? { ...diary, content: newContent } : diary,
    //   ),
    // );
  }, []);

  // context에 하나로 묶어서 전달하기 위해 콜백함수 3개를 묶음
  // App 컴포넌트가 재생성될 때에도 콜백함수들이 메모이제이션되게 하기 위해 useMemo 사용
  const memoizedDispatches = useMemo(() => {
    return { onCreate, onRemove, onEdit };
  }, []);

  const getDiaryAnalysis = useMemo(() => {
    console.log("일기 분석 시작");
    const goodCount = data.filter(
      (diary: DiaryType) => diary.emotion >= 3,
    ).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        {/* <Testing /> */}
        {/* <OptimizeTesting /> */}
        {/* <ObtimizeTestingB /> */}
        <DiaryEditor />
        <div>전체 일기 : {data.length}</div>
        <div>기분 좋은 일기 : {goodCount}</div>
        <div>기분 나쁜 일기 : {badCount}</div>
        <div>기분 좋은 일기 비율 : {goodRatio}</div>
        <DiaryList onRemove={onRemove} onEdit={onEdit} />
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;

/*
useCallback을 썼는데 의존성 배열이 비어있는 경우,
-> useCallback은 mount 초창기에 1번 실행됨 (이 때 state는 초기값)
-> 이후 컴포넌트가 재렌더링되어도 useCallback의 콜백 함수가 재생성되지 않고 그대로 사용됨
-> 그러나, 이는 콜백 함수가 바뀌는 state를 참조하지 못하는 문제를 일으킴
-> 그래서 콜백함수가 이상한 state를 참조하게 하는 에러를 유발

-> 이때 해결 방법은 2가지
1. 의존성 배열에 변화를 감지하여 콜백함수를 업데이트할 state를 넣음
2. 콜백 함수 내부에서 setState 동작에 함수형 업데이트 실행

useReducer를 사용하는 이유
-> 복잡한 상태변화 로직을 컴포넌트에서 분리하기 위해서
 */
