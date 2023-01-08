export interface DummyListType {
  id: number;
  author: string;
  content: string;
  emotion: number;
  createdDate: number;
}
export const DUMMY_LIST: DummyListType[] = [
  {
    id: 1,
    author: "Faker",
    content: "잘하는 걸로는 부족해, 탁월해야해",
    emotion: 5,
    createdDate: new Date().getTime(),
  },
  {
    id: 2,
    author: "Fam",
    content: "하고 싶은 일이 있으면 길을 찾아라",
    emotion: 4,
    createdDate: new Date().getTime(),
  },
  {
    id: 3,
    author: "Ryan",
    content: "이제는 디지털 트랜스포메이션",
    emotion: 4,
    createdDate: new Date().getTime(),
  },
];
