import { createContext } from 'react';

export const FilterContext = createContext({
  user: undefined,
  dataFilter: undefined,
  setDataFilter: undefined,
  handleOnclickFilter: undefined,
  isClickFilter: undefined,
  setIsClickFilter: undefined,
  pageFilter: undefined,
  setPageFilter: undefined,
  getDataFiter: undefined,
  setUser: undefined,
  isLoadingContext: undefined,
  setIsLoadingContext: undefined,
});
