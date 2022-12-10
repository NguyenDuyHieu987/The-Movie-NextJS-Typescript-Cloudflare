import classNames from 'classnames/bind';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  getMovieByCountry,
  getMoviesByGenres,
  getMoviesByYear,
  getMoviesByYearBeFore2000,
  getTopRated,
  getUpComing,
  getCountry,
  getTrending,
  getMovieSeries,
  getPopular,
  getMovies,
  getDaTaSearch,
} from '../../Services/MovieService';
import styles from './DefaultPage.module.scss';
import { useParams, useSearchParams } from 'react-router-dom';
import DefaultPageMovieCard from './DefaultPageMovieCard';
import axios from 'axios';
import ControlPage from './ControlPage';
import { FilterContext } from '../../Store/FilterContext';
import { useRouter, withRouter } from 'next/router';
import Head from 'next/head';
import { ThreeDots } from 'react-loader-spinner';
import type { NextPage } from 'next';

const cx = classNames.bind(styles);

const DefaultPage: NextPage = ({ params, results }: any) => {
  const routerUse = useRouter();
  const { page, slug } = routerUse.query;

  var { genresName, year, list, country, movieName } = useParams();
  // const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(results ? results : []);
  const [page1, setPage] = useState(page != undefined ? +page : 1);
  const [title, setTitle] = useState('');
  const [isVisibleControlPageNumber, setIsVisibleControlPageNumber] =
    useState(true);

  // console.log('slug: ', params);
  // console.log('results: ', results);

  const {
    dataFilter,
    isClickFilter,
    pageFilter,
    setPageFilter,
    getDataFiter,
    isLoadingContext,
    setIsLoadingContext,
  } = useContext(FilterContext);

  const getData = async () => {
    if (isClickFilter === false) {
      if (slug[0] == 'Genres') {
        getMoviesByGenres(slug[1], page1)
          .then((movieResponse) => {
            setData(movieResponse.data.results);
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });
        setTitle(slug[1]?.toUpperCase());
      }

      if (slug[0] == 'Years') {
        if (slug[1] !== 'truoc-nam-2000') {
          getMoviesByYear(slug[1], page1)
            .then((movieResponse) => {
              setData(movieResponse.data.results);
            })
            .catch((e) => {
              if (axios.isCancel(e)) return;
            });
          setTitle(slug[1]?.toUpperCase());
        } else {
          getMoviesByYearBeFore2000('2000', page1)
            .then((movieResponse) => {
              setData(movieResponse.data.results);
            })
            .catch((e) => {
              if (axios.isCancel(e)) return;
            });
          setTitle('TRƯỚC NĂM 2000');
        }
      }

      if (slug[0] == 'Country') {
        getMovieByCountry(slug[1], page1)
          .then((movieResponse) => {
            setData(movieResponse.data.results);
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });
        const countryName = await getCountry(slug[1]);
        setTitle(countryName.name.toUpperCase());
      }

      if (slug[0] == 'Search') {
        getDaTaSearch(slug[1].replace('-', ' '), page1)
          .then((searchMovieResponse) => {
            setData(searchMovieResponse.data.results);
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });
        setTitle('KẾT QUẢ TÌM kIẾM CHO: ' + slug[1].replace('-', ' '));
      }

      if (slug[0] == 'List') {
        switch (slug[1]) {
          case 'phim-moi-cap-nhat':
            getUpComing(page1)
              .then((movieResponse) => {
                setData(movieResponse.data.results);
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
            setTitle('PHIM MỚI CẬP NHẬT');
            break;
          case 'phim-chieu-rap-moi':
            getTopRated(page1)
              .then((movieResponse) => {
                setData(movieResponse.data.results);
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
            setTitle('PHIM CHIẾU RẠP MỚI');
            break;
          case 'phim-le':
            getMovies(page1)
              .then((movieResponse) => {
                setData(movieResponse.data.results);
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
            setTitle('PHIM LẺ');
            break;
          case 'phim-bo':
            getMovieSeries(page1)
              .then((movieResponse) => {
                setData(movieResponse.data.results);
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
            setTitle('PHIM BỘ');
            break;
          default:
            break;
        }
      }
    } else {
      setTitle('DANH SÁCH PHIM ĐÃ LỌC');
      // getDataFiter();
      setData(dataFilter);
    }
  };
  useEffect(() => {
    if (data?.length < 1) {
      setIsVisibleControlPageNumber(false);
    } else {
      setIsVisibleControlPageNumber(true);
    }
  }, [data]);

  useEffect(() => {
    // getDataFiter();
    if (dataFilter?.length > 0) {
      setTitle('DANH SÁCH PHIM ĐÃ LỌC');
      setData(dataFilter);
    }
  }, [dataFilter]);

  useEffect(() => {
    if (dataFilter?.length > 0) {
      getDataFiter();
      setData(dataFilter);
    }
  }, [pageFilter]);

  useEffect(() => {
    // setPage(searchParams.get('page') != null ? +searchParams.get('page') : 1);
    setPage(page != undefined ? +page : 1);
  }, [page]);

  useEffect(() => {
    getData();
  }, [page1]);

  useEffect(() => {
    setIsLoadingContext(true);
    getData();
    setTimeout(() => {
      setIsLoadingContext(false);
    }, 1000);
  }, [slug]);

  // useEffect(() => {
  //   getData();
  // }, [slug[1]]);

  return (
    <>
      <Head>
        <title>PhimHay247 - {title.toLowerCase()}</title>
      </Head>
      <section className={cx('feature-film')}>
        <div className={cx('main-movies')}>
          <h3 className={cx('main-movies-title')} style={{ fontSize: '25px' }}>
            <strong>{title}</strong>
          </h3>

          {isLoadingContext ? (
            <div className={cx('loading-container')}>
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="red"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                visible={isLoadingContext}
              />
            </div>
          ) : (
            <div className={cx('main-movies-container')}>
              {data?.map((item, index) => (
                <DefaultPageMovieCard item={item} key={index.toString()} />
              ))}
            </div>
          )}
        </div>
      </section>

      {isVisibleControlPageNumber === true ? (
        <ControlPage
          page1={isClickFilter === false ? page1 : pageFilter}
          setPage={isClickFilter === false ? setPage : setPageFilter}
          // setSearchParams={setSearchParams}
          routerUse={routerUse}
        />
      ) : null}
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps(context: any) {
  var data = [];
  const { params, query } = context;
  const { ...slug } = params;

  if (slug.slug[0] == 'Genres') {
    data = await getMoviesByGenres(slug.slug[1], 1)
      .then((movieResponse) => {
        return movieResponse.data.results;
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  }

  if (slug.slug[0] == 'Years') {
    if (slug.slug[1] !== 'truoc-nam-2000') {
      data = await getMoviesByYear(slug.slug[1], 1)
        .then((movieResponse) => {
          return movieResponse.data.results;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    } else {
      data = await getMoviesByYearBeFore2000('2000', 1)
        .then((movieResponse) => {
          return movieResponse.data.results;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    }
  }

  if (slug.slug[0] == 'Country') {
    data = await getMovieByCountry(slug.slug[1], 1)
      .then((movieResponse) => {
        return movieResponse.data.results;
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  }

  if (slug.slug[0] == 'List') {
    switch (slug.slug[1]) {
      case 'phim-moi-cap-nhat':
        data = await getUpComing(1)
          .then((movieResponse) => {
            return movieResponse.data.results;
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });
        break;
      case 'phim-chieu-rap-moi':
        data = await getTopRated(1)
          .then((movieResponse) => {
            return movieResponse.data.results;
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });
        break;
      case 'phim-le':
        data = await getMovies(1)
          .then((movieResponse) => {
            return movieResponse.data.results;
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });
        break;
      case 'phim-bo':
        data = await getMovieSeries(1)
          .then((movieResponse) => {
            return movieResponse.data.results;
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });
        break;
      default:
        break;
    }
  }

  return {
    props: {
      params: slug,
      results: data || null,
    },
  };
}

export default DefaultPage;
