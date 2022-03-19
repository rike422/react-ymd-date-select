import { useCallback, useReducer, useMemo } from "react";
import { range } from "./range";
import { compileDateString, parseDateString } from "./date-string";

// TODO: Be compatible with React-Select (https://github.com/JedWatson/react-select)
const monthOptions = range(1, 12).map((i) => i.toString());
const dayOptions = range(1, 31).map((i) => i.toString());

interface DateSelectState {
  yearValue: string; // It's of type string because it's <select />'s value.
  monthValue: string; // It's of type string because it's <select />'s value.
  dayValue: string; // It's of type string because it's <select />'s value.
  dateString: string | null;
}

interface DateSelectActionBase {
  type: string;
}
interface SetDateAction extends DateSelectActionBase {
  type: "SET_DATE";
  year?: string;
  month?: string;
  day?: string;
}
type DateSelectAction = SetDateAction;
const dateSelectReducer: React.Reducer<DateSelectState, DateSelectAction> = (
  state,
  action
) => {
  let yearValue: string, monthValue: string, dayValue: string;
  switch (action.type) {
    case "SET_DATE": {  // TODO: `useState` is sufficient?
      yearValue = action.year || state.yearValue;
      monthValue = action.month || state.monthValue;
      dayValue = action.day || state.dayValue;
    }
  }

  return {
    yearValue,
    monthValue,
    dayValue,
    dateString: compileDateString(
      parseInt(yearValue),
      parseInt(monthValue),
      parseInt(dayValue)
    ),
  };
};


interface UseDateSelectOptions {
  minYear: number;
  maxYear: number;
}
export const useDateSelect = (opts: UseDateSelectOptions) => {
  const [state, dispatch] = useReducer(dateSelectReducer, {
    yearValue: "",
    monthValue: "",
    dayValue: "",
    dateString: null,
  });

  // TODO: Be compatible with React-Select (https://github.com/JedWatson/react-select)
  const yearOptions = useMemo(() => {
    const raw = range(opts.minYear, opts.maxYear).map((i) => i.toString());
    if (!raw.includes(state.yearValue)) {
      return raw.concat(state.yearValue)
    }
    return raw
  }, [opts.minYear, opts.maxYear, state.yearValue]);

  return {
    state,
    yearOptions,
    monthOptions,
    dayOptions,
    onYearChange: useCallback((e: React.ChangeEvent<HTMLSelectElement>) =>
      dispatch({ type: "SET_DATE", year: e.target.value }), []),
    onMonthChange: useCallback((e: React.ChangeEvent<HTMLSelectElement>) =>
      dispatch({ type: "SET_DATE", month: e.target.value }), []),
    onDayChange: useCallback((e: React.ChangeEvent<HTMLSelectElement>) =>
      dispatch({ type: "SET_DATE", day: e.target.value }), []),
    onDateChange: useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { year, month, day } = parseDateString(e.target.value)
      dispatch({ type: "SET_DATE", year, month, day })
    }, [])
  };
};
