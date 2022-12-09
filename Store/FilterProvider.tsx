import axios from 'axios';
import { createContext, useState, useEffect, useCallback } from 'react';
import { FilterDataMovie } from '../Services/MovieService';
import { FilterContext } from './FilterContext';

function FilterProvider({ children }) {
  const [dataFilter, setDataFilter] = useState([]);
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [isClickFilter, setIsClickFilter] = useState(false);
  const [pageFilter, setPageFilter] = useState(1);
  const [user, setUser] = useState<any>({});

  const handleOnclickFilter = useCallback(() => {
    setIsLoadingContext(true);
    getDataFiter();
    setTimeout(() => {
      setIsLoadingContext(false);
    }, 1000);
    setIsClickFilter(true);
  }, []);

  // useEffect(() => {
  //   getDataFiter();
  // }, [isClickFilter]);
  const getDataFiter = () => {
    const type: HTMLOptionElement = document.getElementById(
      'type'
    ) as HTMLOptionElement;
    const sort: HTMLOptionElement = document.getElementById(
      'sort'
    ) as HTMLOptionElement;
    const genres: HTMLOptionElement = document.getElementById(
      'genres'
    ) as HTMLOptionElement;
    const country: HTMLOptionElement = document.getElementById(
      'country'
    ) as HTMLOptionElement;
    const year: HTMLOptionElement = document.getElementById(
      'year'
    ) as HTMLOptionElement;

    FilterDataMovie(
      type.value,
      sort.value,
      genres.value,
      country.value,
      year.value,
      pageFilter
    )
      .then((movieResponse) => {
        setDataFilter(movieResponse.data.results);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  };

  return (
    <FilterContext.Provider
      value={{
        dataFilter,
        setDataFilter,
        handleOnclickFilter,
        isClickFilter,
        setIsClickFilter,
        pageFilter,
        setPageFilter,
        getDataFiter,
        user,
        setUser,
        isLoadingContext,
        setIsLoadingContext,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export default FilterProvider;
