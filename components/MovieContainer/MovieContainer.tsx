import React, { memo, useEffect, useRef, useState } from 'react';
import {
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Carousel } from 'react-responsive-carousel';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';
import MovieCard from '../MovieCard/MovieCard';
import classNames from 'classnames/bind';
import styles from './MovieContainer.module.scss';
// import List from 'react-virtualized/dist/commonjs/List';
// import { Link } from 'react-router-dom';
import Link from 'next/link';

const cx = classNames.bind(styles);

function MovieContainer({ data, title, type }: any) {
  return (
    <section
      className={
        type === 'follow'
          ? cx('following-main-content', 'new-movies-update')
          : cx('new-movies-update')
      }
    >
      <div className={cx('main-movies')}>
        <h3 className={cx('main-movies-title')}>
          <strong>{title?.toUpperCase()}</strong>
          <span className={cx('view-all')}>
            <Link
              href={`/DefaultPage/List/${title
                ?.toLowerCase()
                ?.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s/g, '-')}/`}
            >
              Xem tất cả
            </Link>
          </span>
        </h3>

        <div className={cx('main-movies-container')}>
          {data?.map((item: any, index: any) => (
            <MovieCard item={item} key={index.toString()} type={type} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(MovieContainer);
