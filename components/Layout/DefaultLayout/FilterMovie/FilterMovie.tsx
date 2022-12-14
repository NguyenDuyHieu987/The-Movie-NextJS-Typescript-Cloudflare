import classNames from 'classnames/bind';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './FilterMovie.module.scss';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import genreResponse from '../../../../constants/genres';
import AllYears from '../../../../constants/years.json';
import {
  FilterDataMovie,
  getAllCountry,
  getAllYear,
} from '../../../../Services/MovieService';
import Countries from '../../../../constants/Country';
import Sortby from '../../../../constants/Sortby';
import { FilterContext } from '../../../../Store/FilterContext';

const cx = classNames.bind(styles);

function FilterMovie() {
  const [isDropDownFilter, setIsDropDownFilter] = useState(false);
  const [genresData, setGenresData] = useState(genreResponse.genres);
  const [years, setYears] = useState([]);
  const [allSortby, setAllSortby] = useState(Sortby);
  const [data, setData] = useState([]);

  const { handleOnclickFilter } = useContext(FilterContext);

  useEffect(() => {
    getAllYear().then((yearResponse) => {
      setYears(yearResponse.data);
    });
  }, []);

  // sort.value || type.value || country.value || year.value

  return (
    <div className={cx('filter-film')}>
      <div className={cx('filter-film-container')}>
        <div
          className={cx('filter-film-title')}
          onClick={() => {
            setIsDropDownFilter(!isDropDownFilter);
          }}
        >
          <h3>Advanced Search</h3>
          <FontAwesomeIcon
            icon={!isDropDownFilter ? faAngleDown : faAngleUp}
            className={cx('fa-angle-down')}
          />
        </div>

        <div
          className={cx('filter-film-body', isDropDownFilter ? 'active' : null)}
        >
          <ul className={cx('filter-film-content')}>
            <li className={cx('filter-item')}>
              <select
                name="type"
                id="type"
                className={cx('filter-item-select')}
              >
                <option value="all">All</option>
                <option value="movie">Phim l???</option>
                <option value="tv">Phim b???</option>
              </select>
            </li>

            <li className={cx('filter-item')}>
              <select
                name="sort"
                id="sort"
                className={cx('filter-item-select')}
              >
                <option value="">S???p x???p</option>
                {allSortby.map((item, index) => (
                  <option value={item.id} key={index.toString()}>
                    {item.name}
                  </option>
                ))}
              </select>
            </li>

            {/* <li className={cx('filter-item')}>
              <select name="status" id="" className={cx('filter-item-select')}>
                <option value="">T??nh tr???ng</option>
                <option value="">Ho??n Th??nh</option>
                <option value="">??ang C???p Nh???t</option>
                <option value="">Trailer</option>
              </select>
            </li> */}

            <li className={cx('filter-item')}>
              <select
                name="genres"
                id="genres"
                className={cx('filter-item-select')}
              >
                <option value="">Th??? lo???i</option>
                {genresData.map((item, index) => (
                  <option value={item.name} key={item.id.toString()}>
                    {item.name}
                  </option>
                ))}
              </select>
            </li>

            <li className={cx('filter-item')}>
              <select
                name="country"
                id="country"
                className={cx('filter-item-select')}
              >
                <option value="">Qu???c gia</option>
                {Countries.map((item, index) => (
                  <option value={item.iso_639_1} key={index.toString()}>
                    {item.name}
                  </option>
                ))}
              </select>
            </li>

            <li className={cx('filter-item')}>
              <select
                name="year"
                id="year"
                className={cx('filter-item-select')}
              >
                <option value="">N??m ph??t h??nh</option>
                {years.map((item, index) =>
                  index !== years.length - 1 ? (
                    <option value={item.name} key={index.toString()}>
                      {item.name}
                    </option>
                  ) : null
                )}
                <option value="truoc-nam-2000">
                  {years[years.length - 1]?.name}
                </option>
              </select>
            </li>

            {/* <li className={cx('filter-item')}>
              <select name="style" id="" className={cx('filter-item-select')}>
                <option value="">Ki???u phim</option>
                <option value="">Phim Chi???u R???p</option>
                <option value="">Phim L???</option>
                <option value="">Phim B???</option>
              </select>
            </li> */}

            <li className={cx('btn-submit-filter')}>
              <button
                type="submit"
                className={cx('submit-filter')}
                onClick={handleOnclickFilter}
              >
                L???c phim
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default memo(FilterMovie);
