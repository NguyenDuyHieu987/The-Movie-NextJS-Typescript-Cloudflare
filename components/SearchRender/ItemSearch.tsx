import styles from './SearchRender.module.scss';
import classNames from 'classnames/bind';
import React, { useState, useEffect } from 'react';
// import {  Link } from 'react-router-dom';
import Link from 'next/link';
import { getPoster } from '../../Services/MovieService';
import axios from 'axios';
import Image from 'next/image';

const cx = classNames.bind(styles);
function ItemSearch({
  item,
  // setIsChangeInput
}) {
  return (
    <Link
      href={`/PrevPlayMovie/${item?.id}/${
        item?.name
          ? item?.name?.replace(/\s/g, '-').toLowerCase()
          : item?.title?.replace(/\s/g, '-').toLowerCase()
      }/`}
      className={cx('search-render-item')}
      onClick={() => {
        // setIsChangeInput(false);
      }}
    >
      <a className={cx('search-render-item')}>
        <Image
          src={getPoster(
            item?.poster_path ? item?.poster_path : item?.backdrop_path
          )}
          // alt={item?.name ? item?.name : item?.title}
          alt=""
          title={item?.name ? item?.name : item?.title}
          className={cx('img-item-search')}
          // layout="fill"
          width={60}
          height={80}
          placeholder="blur"
          blurDataURL={getPoster(
            item?.poster_path ? item?.poster_path : item?.backdrop_path
          )}
          priority
          // loading="lazy"
        />
        <div className={cx('info-item-search')}>
          <p>{item?.name ? item?.name : item?.title}</p>
          <p>
            {item?.original_name ? item?.original_name : item?.original_title}
          </p>
          <p>
            {item?.release_date ? item?.release_date : item?.first_air_date}
          </p>
        </div>
      </a>
    </Link>
  );
}

export default ItemSearch;
