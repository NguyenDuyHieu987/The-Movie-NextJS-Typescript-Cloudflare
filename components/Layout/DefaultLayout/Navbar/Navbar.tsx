import styles from './Navbar.module.scss';
import classNames from 'classnames/bind';
import {
  faSearch,
  faHome,
  faChevronUp,
  faAngleDown,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import {
  // Link,
  useParams,
} from 'react-router-dom';
import Link from 'next/link';
import axios from 'axios';
import SearchRender from '../../../SearchRender/SearchRender';
import {
  getAllCountry,
  getAllGenre,
  getAllNational,
  getAllYear,
  getCountry2,
} from '../../../../Services/MovieService';
import { FilterContext } from '../../../../Store/FilterContext';
import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/router';

const cx = classNames.bind(styles);

function Navbar() {
  const [isNavSearchClick, setIsNavSearchClick] = useState(false);
  const [genresData, setGenresData] = useState([]);
  const [countryData, setCountrysData] = useState([]);
  const [years, setYears] = useState([]);
  const [valueInput, setValueInput] = useState('');
  const [isFoucusSearch, setIsFocuSearch] = useState(false);
  const [isChangeInput, setIsChangeInput] = useState(false);
  const [dataSearch, setDataSearch] = useState([]);
  const [pageSearch, setPageSearch] = useState(1);
  const { setIsClickFilter } = useContext(FilterContext);
  // const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    // getAllGenre().then((genreResponse) => {
    //   setGenresData(genreResponse.data);
    // });

    // getAllNational().then((countryResponse) => {
    //   setCountrysData(countryResponse.data);
    // });

    // getAllYear().then((yearResponse) => {
    //   setYears(yearResponse.data);
    // });

    Promise.all([getAllGenre(), getAllNational(), getAllYear()])
      .then((res) => {
        setGenresData(res[0].data);
        setCountrysData(res[1].data);
        setYears(res[2].data);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });

    // setGenresData(genreResponse.genres);

    // axios
    //   .get(
    //     'https://api.themoviedb.org/3/genre/movie/list?api_key=fe1b70d9265fdb22caa86dca918116eb'
    //   )
    //   .then((genresRespose) => {
    //     setGenresData(genresRespose.data.genres);
    //   });
  }, []);

  const handleOnclickBtnSearchNav = () => {
    setIsNavSearchClick(!isNavSearchClick);
  };

  useEffect(() => {
    const navBar = document.getElementsByClassName(cx('main-nav'));
    const searchbar_wrapper = document.getElementsByClassName(
      cx('nav-search-bar-wrapper')
    );
    const btn_search_nav = document.getElementsByClassName(
      cx('btn-search-nav')
    );

    window.addEventListener('scroll', () => {
      const window_pos = document.documentElement.scrollTop;
      if (window.innerWidth > 830) {
        // fixed navbar
        navBar[0]?.classList.toggle(cx('sticky'), window_pos >= 75);

        // add button search in navbar
        if (navBar[0]?.classList.contains(cx('sticky'))) {
          btn_search_nav[0]?.classList.add(cx('active'));
        } else {
          btn_search_nav[0]?.classList.remove(cx('active'));
          searchbar_wrapper[0]?.classList.remove(cx('active'));
        }
      } else {
        navBar[0]?.classList.remove(cx('sticky'));
      }

      const btn_move_top = document.getElementsByClassName(cx('btn-move-top'));
      btn_move_top[0]?.classList.toggle(
        cx('active'),
        window.pageYOffset >= 300
      );
    });

    const menuItem1 = document.getElementsByClassName(cx('funct'));

    for (let i = 0; i < menuItem1.length; i++) {
      menuItem1[i].addEventListener('click', () => {
        setIsClickFilter(false);
      });
    }

    window.addEventListener('click', () => {
      setIsChangeInput(false);
    });

    document
      .getElementsByClassName(cx('textbox-SearchFilm-nav'))[0]
      .addEventListener('click', (e) => {
        e.stopPropagation();
      });
  }, []);

  var currentLocation: any = undefined;
  if (typeof window !== 'undefined') {
    currentLocation = window.location.href;
    // const { list } = useParams();
    // console.log(list);
  }

  useEffect(() => {
    const menu = document.getElementById('menu');
    const menuItem: NodeListOf<HTMLLinkElement> = menu.querySelectorAll(
      'li.' + cx('funct') + '>a'
    );
    const menuLi = menu.querySelectorAll('li.' + cx('funct'));

    for (let i = 0; i < menuItem.length; i++) {
      menuLi[i].classList.toggle(
        cx('active'),
        menuItem[i].href === currentLocation
      );
    }

    // active function collapse
    const funct_type = menu.querySelector(
      'li.' + cx('funct') + '.' + cx('genres')
    );

    const funct_type_href: NodeListOf<HTMLLinkElement> =
      funct_type.querySelectorAll('ul li>a');

    for (let i = 0; i < funct_type_href.length; i++) {
      if (funct_type_href[i].href === currentLocation) {
        funct_type.classList.add(cx('active'));
      }
    }

    const funct_country = menu.querySelector(
      'li.' + cx('funct') + '.' + cx('country')
    );
    const funct_country_href: NodeListOf<HTMLLinkElement> =
      funct_country.querySelectorAll('ul li>a');

    for (let i = 0; i < funct_country_href.length; i++) {
      if (funct_country_href[i].href === currentLocation) {
        funct_country.classList.add(cx('active'));
      }
    }

    const funct_year = menu.querySelector(
      'li.' + cx('funct') + '.' + cx('year')
    );
    const funct_year_href: NodeListOf<HTMLLinkElement> =
      funct_year.querySelectorAll('ul li>a');

    for (let i = 0; i < funct_year_href.length; i++) {
      if (funct_year_href[i].href === currentLocation) {
        funct_year.classList.add(cx('active'));
      }
    }
  }, [currentLocation]);

  const handleOnChangeTextSearch = async (text: any) => {
    setValueInput(text);

    if (text.length === 0) {
      setDataSearch([]);
      setIsFocuSearch(false);
      setIsChangeInput(false);
    } else if (text.length >= 1) {
      setIsChangeInput(true);
      setIsFocuSearch(true);

      await axios
        .get(
          // `https://api.themoviedb.org/3/search/multi?api_key=fe1b70d9265fdb22caa86dca918116eb&query=${text}`
          `https://the-movie-node.onrender.com/search/multi?api=hieu987&query=${text}`
        )
        .then((searchMovieResponse) => {
          setDataSearch(searchMovieResponse.data.results);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });

      const xMark = document.getElementsByClassName(cx('x-mark'));
      xMark[0]?.addEventListener('mousedown', (e) => {
        e.preventDefault();
        setValueInput('');
        setIsFocuSearch(false);
        setIsChangeInput(false);
      });
      window.onkeydown = (e: any) => {
        if (e.key === 'Enter') {
          if (text !== '') {
            e.preventDefault();
            setIsChangeInput(false);
            // navigate(`/Searh/${text.replace(/\s/g, '-')}/`);
            router.push(`/DefaultPage/Search/${text.replace(/\s/g, '-')}`);
          }
        }
      };
    }
  };

  const handleOnClickBtnSearch = (e: any) => {
    if (e.key === 'Enter') {
      if (valueInput !== '') {
        e.preventDefault();
        setIsChangeInput(false);
        // navigate(`/Searh/${valueInput.replace(/\s/g, '-')}/`);
        router.push(`/DefaultPage/Search/${valueInput.replace(/\s/g, '-')}`);
      }
    }
  };

  const handleOnclickBtnMoveTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <nav className={cx('main-nav')}>
        <div
          className={cx('nav-search-bar-wrapper', {
            active: isNavSearchClick,
          })}
        >
          <div className="container">
            <form className={cx('nav-search-bar')} action="" method="GET">
              <input
                className={cx('textbox-SearchFilm-nav')}
                type="text"
                placeholder=""
                autoComplete="off"
                required
                value={valueInput}
                onChange={(e) => handleOnChangeTextSearch(e.target.value)}
              />
              <label
                htmlFor="textbox-SearchFilm-nav"
                className={cx('search-label-nav')}
              >
                {!isFoucusSearch ? 'Nhập tên phim...' : ''}
              </label>
              {isFoucusSearch ? (
                <FontAwesomeIcon
                  className={cx('x-mark')}
                  icon={faXmark}
                  // onClick={handleOnClickXmark}
                />
              ) : null}
              <button
                // type="submit"
                className={cx('btn-SearchFilm-nav')}
                title="Tìm kiếm"
                onClick={handleOnClickBtnSearch}
              >
                Search
              </button>
              {isChangeInput ? (
                <SearchRender
                  dataSearch={dataSearch}
                  // setIsChangeInput={undefined}
                />
              ) : null}
            </form>
          </div>
        </div>
        <div className={cx('main-menu')}>
          <div className={cx('container')}>
            <ul className={cx('menu')} id="menu">
              <li className={cx('funct')}>
                <Link href="/">
                  <a>
                    <FontAwesomeIcon icon={faHome} />
                  </a>
                </Link>
              </li>

              <li className={cx('funct')}>
                <Link href={`/DefaultPage/List/phim-le/`}>PHIM LẺ</Link>
              </li>
              <li className={cx('funct')}>
                <Link href={`/DefaultPage/List/phim-bo/`}>PHIM BỘ</Link>
              </li>

              <li className={cx('funct', 'genres')}>
                <a>
                  THỂ LOẠI
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className={cx('fa-angle-down')}
                  />
                </a>

                <div className={cx('genres-container')}>
                  <ul className={cx('items-genres')}>
                    {genresData.map((item: any, index: any) => (
                      <li key={item.id.toString()}>
                        <Link href={`/DefaultPage/Genres/${item.name}/`}>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              <li className={cx('funct', 'year')}>
                <a>
                  NĂM PHÁT HÀNH
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className={cx('fa-angle-down')}
                  />
                </a>

                <div className={cx('year-container')}>
                  <ul className={cx('items-year')}>
                    {years.map((item: any, index: any) =>
                      index !== years.length - 1 ? (
                        <li key={index.toString()}>
                          <Link href={`/DefaultPage/Years/${item.name}/`}>
                            {item.name}
                          </Link>
                        </li>
                      ) : null
                    )}
                    <li>
                      <Link href={`/DefaultPage/Years/truoc-nam-2000`}>
                        {/* {years[years.length - 1]?.name} */}
                        Trước năm 2000
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className={cx('funct', 'country')}>
                <a>
                  QUỐC GIA
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className={cx('fa-angle-down')}
                  />
                </a>

                <div className={cx('country-container')}>
                  <ul className={cx('items-country')}>
                    {
                      // getAllCountry()
                      countryData.map((item: any, index: any) => (
                        <li key={index.toString()}>
                          <Link
                            href={`/DefaultPage/Country/${item.name2}/`}
                            key={index.toString()}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </li>

              <li className={cx('funct')}>
                <Link href="/Follow/Follow">THEO DÕI</Link>
              </li>
              <li className={cx('funct')}>
                <Link href="/Rank/Rank">XẾP HẠNG</Link>
              </li>

              <div className={cx('btn-search-nav')} title="Tìm kiếm">
                <FontAwesomeIcon
                  className={cx('icon-search')}
                  icon={faSearch}
                  onClick={handleOnclickBtnSearchNav}
                />
              </div>
            </ul>
          </div>
        </div>
      </nav>
      <button className={cx('btn-move-top')} onClick={handleOnclickBtnMoveTop}>
        <FontAwesomeIcon className={cx('icon-chevron-up')} icon={faChevronUp} />
      </button>
    </>
  );
}

export default memo(Navbar);
