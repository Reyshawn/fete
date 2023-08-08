import { useReducer } from 'react';

const updateReducer = (num: number): number => (num + 1) % 1_000_000;


// https://github.com/streamich/react-use/blob/master/src/useUpdate.ts
export default function useRerender(): () => void {
  const [, setRendering] = useReducer(updateReducer, 0);

  return setRendering;
}