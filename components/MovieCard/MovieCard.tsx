import classNames from 'classnames/bind';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import {
  getAllGenresById,
  getLanguage,
  getMovieById,
  getMovieSeriesById,
  getPoster,
  getYear,
  handleWatchList,
  removeItemList,
} from '../../Services/MovieService';
import styles from './MovieCard.module.scss';
// import { Link } from 'react-router-dom';
import Link from 'next/link';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ContentLoader from 'react-content-loader';
import { FilterContext } from '../../Store/FilterContext';
import Image from 'next/image';
import 'material-icons/iconfont/material-icons.css';

const cx = classNames.bind(styles);

function MovieCard({ item, type }: any) {
  const [isRemoveFollow, setIsRemoveFollow] = useState(false);
  const [isRemoveWatchList, setIsRemoveWatchList] = useState(false);
  const [runtime, setRuntime] = useState('');
  const [numberOfEpisodes, setNumberOfEpisodes] = useState();
  const [isEpisodes, setIsEpisodes] = useState(false);
  const [data, setData] = useState<any>({});
  const [genresName, setGenresName] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(FilterContext);

  useEffect(() => {
    getMovieSeriesById(item?.id)
      .then((tvResponed) => {
        // setEpisodes(movieResponed?.data);
        if (tvResponed?.data === null)
          getMovieById(item?.id)
            .then((movieResponed) => {
              setIsEpisodes(false);
              setData(movieResponed?.data);
            })
            .catch((e) => {
              if (axios.isCancel(e)) return;
            });
        else {
          setIsEpisodes(true);
          setData(tvResponed?.data);
        }
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });

    getGenresName();
  }, [item]);

  const getGenresName = async () => {
    setGenresName(
      await getAllGenresById(
        item?.genre_ids?.length !== 0
          ? item.genre_ids
          : item?.genres?.length !== 0
          ? item.genres
          : data.genres
      )
    );
  };

  const handleOnLoad = () => {
    setLoading(true);
  };

  return (type === 'follow' && !isRemoveFollow) ||
    (type === 'history' && !isRemoveWatchList) ||
    type === 'box-movie' ||
    type === 'slide' ? (
    <div
      className={cx(
        type === 'box-movie' || type === 'follow' || type === 'history'
          ? 'box-movie'
          : type === 'slide'
          ? 'item'
          : 'item'
      )}
    >
      <Link
        href={`/PrevPlayMovie/${item?.id}/${
          item?.name
            ? item?.name?.replace(/\s/g, '-').toLowerCase()
            : item?.title?.replace(/\s/g, '-').toLowerCase()
        }/`}
        className={cx('thumbnail')}
      >
        <a className={cx('thumbnail')}>
          <div className={cx('img-container')}>
            {!loading && (
              <ContentLoader
                width={233}
                height={'100%'}
                backgroundColor={'#161616'}
                foregroundColor={'#222222'}
                speed={2}
                interval={0.15}
                style={{ position: 'absolute' }}
              >
                <rect x="0" y="0" width="100%" height="100%" />
              </ContentLoader>
            )}

            <LazyLoadImage
              delayTime={250}
              effect="opacity"
              className={cx('poster-movie')}
              src={getPoster(item?.poster_path)}
              // src={
              //   item?.poster_path === null
              //     ? {}
              //     : require(`../../constants/poster_backdrop${item?.poster_path}`)
              // }
              alt={item?.name ? item?.name : item?.title}
              title={item?.name ? item?.name : item?.title}
              onLoad={handleOnLoad}
            />

            {/* <Image
              className={cx('poster-movie')}
              src={getPoster(item?.poster_path)}
              // src={
              //   item?.poster_path === null
              //     ? {}
              //     : require(`../../constants/poster_backdrop${item?.poster_path}`)
              // }
              alt={item?.name ? item?.name : item?.title}
              title={item?.name ? item?.name : item?.title}
              layout="fill"
              // width="100%"
              // height="100%"
              placeholder="blur"
              blurDataURL={getPoster(item?.poster_path)}
              priority
            /> */}
          </div>

          <div className={cx('icon-play-wrapper')}>
            <FontAwesomeIcon icon={faPlay} className={cx('fa-play')} />
          </div>
          {/* <!-- <i  className={cx("icon-play"></i> --> */}

          <div className={cx('item-info')}>
            {!loading && (
              <ContentLoader
                height={55.28}
                width={'100%'}
                backgroundColor={'#161616'}
                foregroundColor={'#222222'}
                speed={2}
                // style={{
                //   display: 'flex',
                //   alignItems: 'center',
                //   flexDirection: 'column',
                // }}
              >
                <rect x="0" y="3" width="65%" height={26.58} />
                <rect x="0" y="35" width="100%" height={22.71} />
              </ContentLoader>
            )}

            {loading && (
              <h3 className={cx('title-film')}>
                {item?.name ? item?.name : item?.title}
              </h3>
            )}

            {loading && (
              <p className={cx('release-year')}>
                {isEpisodes
                  ? data?.first_air_date?.slice(0, 4) +
                    ' | ' +
                    genresName?.join(', ')
                  : item?.release_date?.slice(0, 4) +
                    ' | ' +
                    genresName?.join(', ')}
              </p>
            )}

            <p className={cx('resolution')}>
              {'HD - ' + getLanguage(item.original_language)?.english_name}
            </p>
            <p className={cx('duration')}>
              {isEpisodes
                ? data?.number_of_episodes + '-Tập'
                : data?.runtime + ' min'}
            </p>
          </div>
        </a>
      </Link>
      {type === 'follow' ? (
        <p
          className={cx('remove-follow')}
          onClick={() => {
            if (isRemoveFollow === false) {
              // axios.post(
              //   'https://api.themoviedb.org/3/list/8215569/remove_item?api_key=fe1b70d9265fdb22caa86dca918116eb&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d',
              //   {
              //     media_id: +item?.id,
              //   }
              // );
              removeItemList(user?.id, {
                media_id: +item?.id,
              });
              setIsRemoveFollow(true);
            }
          }}
        >
          <i className="material-icons-outlined x-mark"> close</i>
          Bỏ theo dõi
        </p>
      ) : null}
      {type === 'history' ? (
        <p
          className={cx('remove-history')}
          onClick={() => {
            if (isRemoveWatchList === false) {
              // axios.post(
              //   'https://api.themoviedb.org/3/account/14271386/watchlist?api_key=fe1b70d9265fdb22caa86dca918116eb&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d',
              //   {
              //     media_type: 'movie',
              //     media_id: +item?.id,
              //     watchlist: false,
              //   }
              // );
              handleWatchList(user?.id, {
                media_id: +item?.id,
                watchlist: false,
              });
              setIsRemoveWatchList(true);
            }
          }}
        >
          <i className="material-icons-outlined x-mark"> close</i>
          Xóa
        </p>
      ) : null}
    </div>
  ) : null;
}

export default memo(MovieCard);
