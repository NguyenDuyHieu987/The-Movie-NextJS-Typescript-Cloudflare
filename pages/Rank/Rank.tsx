import classNames from 'classnames/bind';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  getList,
  getNowPlaying,
  getTheMostVoteCount,
  getWatchList,
} from '../../Services/MovieService';
import styles from './Rank.module.scss';
import { useParams, useSearchParams } from 'react-router-dom';
import RightSideFollow from '../../components/RightSideFollow/RightSideFollow';
import RightSideRank from '../../components/RightSideRank/RightSideRank';
import MovieCard from '../../components/MovieCard';
import axios from 'axios';
import Head from 'next/head';
import { NextPage } from 'next';

const cx = classNames.bind(styles);

const Rank: NextPage = ({ dataTheMostView, dataNowPlaying }: any) => {
  const [data, setData] = useState(dataNowPlaying);
  const [page, setPage] = useState(1);
  const [dataHistory, setDataHistory] = useState([]);
  const [dataRank, setDataRank] = useState(dataTheMostView);
  const [pageRank, setPageRank] = useState(1);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getNowPlaying(page).then((movieRespose) => {
      setData(movieRespose.data.results);
    });
  };

  useEffect(() => {
    getDataTheMostVoteCount();
  }, [pageRank]);

  const getDataTheMostVoteCount = useCallback(() => {
    getTheMostVoteCount(pageRank)
      .then((movieRespone) => {
        setDataRank(movieRespone.data.results);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  }, [pageRank]);

  // console.log(dataNowPlaying);

  return (
    <>
      <Head>
        <title>PhimHay247 - Xếp hạng</title>
      </Head>
      <div className={cx('rank')}>
        <section className={cx('rank-main-content')}>
          <div className={cx('main-movies')}>
            <h3 className={cx('main-movies-title') + ' main-movies-title'}>
              <strong>PHIM HOT NHẤT</strong>
            </h3>

            <div className={cx('main-movies-container')}>
              {data?.map((item, index) => (
                <MovieCard
                  item={item}
                  key={index.toString()}
                  type="box-movie"
                />
              ))}
            </div>
          </div>
        </section>

        <RightSideRank
          data={dataRank}
          type="rank"
          setPageRank={setPageRank}
          page="rank"
        />
      </div>
    </>
  );
};

// export async function getServerSideProps() {
//   const dataTheMostView = await getTheMostVoteCount(1)
//     .then((movieResponse) => {
//       return movieResponse?.data?.results;
//     })
//     .catch((e) => {
//       if (axios.isCancel(e)) return;
//     });
//   console.log(dataTheMostView);
//   const dataNowPlaying = await getNowPlaying(1).then((movieRespose) => {
//     return movieRespose.data.results;
//   });

//   return {
//     props: {
//       dataTheMostView: dataTheMostView || [],
//       dataNowPlaying: dataNowPlaying || [],
//     },
//   };
// }

export default Rank;
