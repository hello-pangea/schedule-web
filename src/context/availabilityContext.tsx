import { createContext, useContext } from "react";

interface AvailabilityContextType {
  values: string[][][];
  startDate: Date;
  minTime: Date;
  totalPeople: number;
  handleTouchMoved: (e: any, column: number, row: number) => unknown;
}

export const AvailabilityContext = createContext<AvailabilityContextType>({
  values: [],
  startDate: new Date(),
  minTime: new Date(),
  totalPeople: 0,
  handleTouchMoved: (_e: any, _column: number, _row: number) => {
    console.log("shhh");
  },
});

// Custom hook that shorhands the context
export const useAvailabilityContext = (): AvailabilityContextType =>
  useContext(AvailabilityContext);
