import classNames from 'classnames/bind';
import React, { useEffect, useRef, useState } from 'react';
import {
  getAllGenresById,
  getPoster,
  getYear,
} from '../../Services/MovieService';
import styles from './Home.module.scss';
// import { Link } from 'react-router-dom';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';

const cx = classNames.bind(styles);

function BannerSlideItem({ item }: any) {
  const [genresName, setGenresName] = useState<string[]>([]);

  useEffect(() => {
    getGenresName();
  }, [item]);
  const getGenresName = async () => {
    setGenresName(await getAllGenresById(item?.genre_ids));
  };

  return (
    <div className={cx('banner-item')}>
      <Link
        href={`/PrevPlayMovie/${item?.id}/${
          item?.name
            ? item?.name?.replace(/\s/g, '-').toLowerCase()
            : item?.title?.replace(/\s/g, '-').toLowerCase()
        }`}
        className={cx('banner-item-link')}
      >
        <a className={cx('banner-item-link')}>
          <Image
            src={getPoster(
              item?.backdrop_path ? item?.backdrop_path : item?.poster_path
            )}
            // src={
            //   item?.backdrop_path === null
            //     ? {}
            //     : require(`../../constants/poster_backdrop${item?.backdrop_path}`)
            // }
            alt={item?.name ? item?.name : item?.title}
            layout="fill"
            // width="100%"
            // height="100%"
            placeholder="blur"
            blurDataURL={getPoster(
              item?.backdrop_path ? item?.backdrop_path : item?.poster_path
            )}
            priority
            // loading="lazy"
          />
          <div className={cx('banner-item-info')}>
            <div className={cx('banner-item-info-wrapper')}>
              <Image
                src={'/Images/pngegg.png'}
                alt={item?.name ? item?.name : item?.title}
                title={item?.name ? item?.name : item?.title}
                height={64}
                width={64}
              />

              <div className={cx('banner-item-resolution')}>
                <span>
                  {item?.release_date
                    ? item?.release_date.slice(0, 4)
                    : item?.first_air_date.slice(0, 4)}
                </span>
                <span>{genresName.join(', ')}</span>
              </div>
            </div>
            <h1 className={cx('banner-item-title')}>
              {item?.name ? item?.name : item?.title}
            </h1>
            <p className={cx('banner-item-describe')}>{item?.overview}</p>
          </div>
        </a>
      </Link>
    </div>
  );
}

export default BannerSlideItem;
