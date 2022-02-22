import { createContext, useContext } from "react";

interface DateContextType {
  values: boolean[][];
  selectionStarted: boolean;
  startRow: number;
  endRow: number;
  startColumn: number;
  endColumn: number;
  startDate: Date;
  handleTouchStart: (e: any, column: number, row: number) => unknown;
  handleTouchMoved: (e: any, column: number, row: number) => unknown;
}

export const DateContext = createContext<DateContextType>({
  values: [],
  selectionStarted: false,
  startRow: 0,
  endRow: 0,
  startColumn: 0,
  endColumn: 0,
  startDate: new Date(),
  handleTouchStart: (_e: any, _column: number, _row: number) => {
    console.log("shhh");
  },
  handleTouchMoved: (_e: any, _column: number, _row: number) => {
    console.log("shhh");
  },
});

// Custom hook that shorhands the context
export const useDateContext = (): DateContextType => useContext(DateContext);
