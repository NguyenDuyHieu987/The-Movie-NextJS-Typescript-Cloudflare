import classNames from 'classnames/bind';
import React, { memo, useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
import Link from 'next/link';
import styles from './TrailerModel.module.scss';

const cx = classNames.bind(styles);
function TrailerModel({
  isOpenModelTrailer,
  setIsOpenModelTrailer,
  dataModelTrailer,
}: any) {
  return (
    <div
      className={cx('model-trailer', {
        active: isOpenModelTrailer,
      })}
    >
      <div className={cx('container', 'model-trailer-container')}>
        <div className={cx('model-trailer-content')}>
          <iframe
            className={cx('trailer-video')}
            height="550px"
            width="100%"
            src={
              dataModelTrailer?.videos?.results.length !== 0
                ? `https://www.youtube.com/embed/${
                    dataModelTrailer?.videos?.results[
                      Math.floor(
                        Math.random() * dataModelTrailer?.videos?.results.length
                      )
                    ]?.key
                  }`
                : 'https://www.youtube.com/embed/ndl1W4ltcmg'
            }
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            frameBorder={0}
          ></iframe>

          <div className={cx('model-trailer-describe')}>
            <h2>
              {dataModelTrailer?.name
                ? dataModelTrailer?.name
                : dataModelTrailer?.title +
                  ` (${dataModelTrailer?.release_date.slice(0, 4)})`}
            </h2>
            <p>
              {dataModelTrailer.genres.map((item: any, index: any) =>
                index !== dataModelTrailer.genres.length - 1
                  ? item.name + ', '
                  : item.name
              )}
            </p>
            <button
              className={cx('btn-exit-trailer')}
              onClick={() => {
                setIsOpenModelTrailer(false);
              }}
            >
              Đóng
            </button>
            <div className={cx('watch-movie-trailer')}>
              <Link
                href={`/PlayPage/${dataModelTrailer?.id}/${
                  dataModelTrailer?.name
                    ? dataModelTrailer?.name?.replace(/\s/g, '-').toLowerCase()
                    : dataModelTrailer?.title?.replace(/\s/g, '-').toLowerCase()
                }/`}
              >
                <i className={cx('fa-solid fa-play')}></i> Xem ngay
              </Link>
              <div className={cx('resolution-sub')}>
                <p>HD</p>
                <p>Vietsub</p>
              </div>
            </div>
            <p className={cx('trailer-overview')}>
              {dataModelTrailer.overview}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TrailerModel);
