/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from 'classnames/bind';
import {
  faPlay,
  faBookmark,
  faPowerOff,
  faAdd,
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  addItemList,
  getList,
  getMovieByCredit,
  getMovieById,
  getMovieByRecommend,
  getMovieBySimilar,
  getMoviesBySeason,
  getMovieSeriesById,
  getPoster,
  getTrending,
  removeItemList,
} from '../../Services/MovieService';
import styles from './PlayPage.module.scss';
import {
  // Link,
  useParams,
} from 'react-router-dom';
import Link from 'next/link';
import axios from 'axios';
import Interaction from '../../components/Interaction/Interaction';
import Comment from '../../components/Comment/Comment';
import SlideShow from '../../components/SlideShow';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import Episodes from '../../components/Episodes/Episodes';
import { useContext } from 'react';
import { FilterContext } from '../../Store/FilterContext';
import { useRouter, withRouter } from 'next/router';
import { NextPage } from 'next';
import Head from 'next/head';
import 'material-icons/iconfont/material-icons.css';

// import OwlCarousel from 'react-owl-carousel';

const cx = classNames.bind(styles);

const PlayPage: NextPage = ({
  params,
  results,
  isTV,
  similarData,
  recommendData,
  seasonData,
}: any) => {
  const routerUse = useRouter();
  const { slug } = routerUse.query;
  const tap = String(routerUse.query.tap);
  const { movieid, movieName } = useParams();
  const [data, setData] = useState(results);
  const [dataRecommend, setDataRecommend] = useState(recommendData);
  const [dataSimilar, setDataSimilar] = useState(similarData);
  const [episodes, setEpisodes] = useState([]);
  const [isEpisodes, setIsEpisodes] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [isFollow, setIsFollow] = useState(false);
  const [dataSeason, setDataSeason] = useState(seasonData);
  const [activeSeason, setActiveSeason] = useState();

  const [URL, setURL] = useState<string>('');

  const { user } = useContext(FilterContext);

  // const { episode, setEpisode } = useState(tap === undefined ? 1: tap);

  // var { tap } = useParams();

  // const [episode, setEpisode] = useState(
  //   searchParams.get('tap') != null ? +searchParams.get('tap') : 1
  // );

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
    setURL(window.location.href);
    setActiveSeason(data?.last_episode_to_air?.season_number);
  }, [slug]);

  // console.log('slug: ', props.params);
  // console.log('results: ', seasonData);

  const getData = () => {
    getMovieSeriesById(slug[0])
      .then((tvResponed) => {
        // setEpisodes(movieResponed?.data);
        if (tvResponed?.data === null)
          getMovieById(slug[0])
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

    getList(user?.id)
      .then((movieRespone) => {
        setDataList(movieRespone.data.items);
      })
      .catch((e) => {
        setDataRecommend([]);
        if (axios.isCancel(e)) return;
      });
  };

  useEffect(() => {
    dataList.map((item: any) => {
      if (item?.id === Number(slug[0])) {
        setIsFollow(true);
      }
    });
  }, [dataList || data]);

  useEffect(() => {
    getMoviesBySeason(+slug[0], activeSeason)
      .then((episodesRespones) => {
        setDataSeason(episodesRespones?.data);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  }, [activeSeason]);

  useEffect(() => {
    // getMovieByRecommend(isEpisodes ? 'tv' : 'movie', movieid, 1)
    //   .then((movieResponed) => {
    //     setDataRecommend(movieResponed?.data.recommendations.results);
    //   })
    //   .catch((e) => {
    //     setDataRecommend([]);
    //     if (axios.isCancel(e)) return;
    //   });
    // getMovieBySimilar(isEpisodes ? 'tv' : 'movie', movieid, 1)
    //   .then((movieResponed) => {
    //     setDataSimilar(movieResponed?.data.similar.results);
    //   })
    //   .catch((e) => {
    //     if (axios.isCancel(e)) return;
    //   });
  }, [isEpisodes || slug]);

  // useEffect(() => {
  //   if (data?.genres !== undefined) {
  //     getMovieBySimilar(isEpisodes ? 'tv' : 'movie', data?.genres[0], 1)
  //       .then((movieResponed) => {
  //         setDataSimilar(movieResponed?.data.results);
  //       })
  //       .catch((e) => {
  //         if (axios.isCancel(e)) return;
  //       });

  //     getTrending(1)
  //       .then((movieResponed) => {
  //         setDataRecommend(movieResponed?.data.results);
  //       })
  //       .catch((e) => {
  //         if (axios.isCancel(e)) return;
  //       });
  //   }
  // }, [data.genres]);

  useEffect(() => {
    const mainVideo: HTMLVideoElement = document.querySelector(
      '#main-video'
    ) as HTMLVideoElement;

    if (isEpisodes) {
      const video_player = document.querySelector('#video-player');
      const episode: NodeListOf<HTMLElement> = document.querySelectorAll(
        '.episodes-list .episode'
      );
      const btn_autoNext_episode = document.querySelector(
        '.' + cx('btn-autoNext-episode')
      );

      const play_pause =
        video_player &&
        video_player.querySelector('.controls-left .play-pause');

      const play_pause_large =
        video_player && video_player.querySelector('.play-video .play-pause');

      const pauseVideo = () => {
        play_pause.innerHTML = 'play_arrow';
        play_pause_large.innerHTML = 'play_arrow';
        // play_pause.title = 'play';
        video_player.classList.add('paused');
        mainVideo.pause();
      };

      for (let i = 0; i < episode.length; ++i) {
        if (episode[i].classList.contains('active')) {
          mainVideo &&
            mainVideo
              ?.querySelector('source')
              ?.setAttribute(
                'src',
                `/Videos/televisons_film/The_Witcher_S1_Ep${
                  i < 8 ? i + 1 : 8
                }.mp4`
              );
          mainVideo.load();
          pauseVideo();
        }

        episode[i].onclick = function () {
          episode.forEach(function (item) {
            item.classList.remove('active');
          });
          episode[i].classList.add('active');
          selectVideo_reloadVideo(episode[i], i);
        };
      }

      const selectVideo_reloadVideo = (episode, i) => {
        if (episode.classList.contains('active')) {
          mainVideo
            ?.querySelector('source')
            ?.setAttribute(
              'src',
              `/Videos/televisons_film/The_Witcher_S1_Ep${
                i < 8 ? i + 1 : 8
              }.mp4`
            );
          mainVideo.load();
          pauseVideo();
        }
      };

      // var videoDuration = 0;
      // mainVideo.onloadeddata = function (e) {
      //   videoDuration = e.target.duration;
      // };

      // mainVideo.ontimeupdate = function (e) {
      //   let currentVideoTime = e.target.currentTime;
      //   if (
      //     btn_autoNetx_episode.classList.contains(cx('active')) &&
      //     currentVideoTime === videoDuration
      //   ) {
      //     for (let i = 0; i < episode.length; ++i) {
      //       if (
      //         episode[i].classList.contains('active') &&
      //         i !== episode.length - 1
      //       ) {
      //         episode[i].classList.remove('active');
      //         episode[i + 1].classList.add('active');
      //         selectVideo_reloadVideo(episode[i + 1], i + 1);
      //         break;
      //       }
      //     }
      //   }
      // };
    } else {
      mainVideo
        .querySelector('source')
        .setAttribute(
          'src',
          '/Videos/River flows in you Remix - Walker Style.mp4'
        );
      mainVideo.load();
    }
  }, [tap || isEpisodes]);

  useEffect(() => {
    // Active button light off and auto next episode

    const btn_toggle_light: HTMLElement = document.querySelector(
      '.' + cx('btn-toggle-light')
    ) as HTMLElement;

    const btn_autoNetx_episode: HTMLElement = document.querySelector(
      '.' + cx('btn-autoNext-episode')
    ) as HTMLElement;

    const background_movie_light_off = document.querySelector(
      '.' + cx('background-movie-light-off')
    );

    btn_autoNetx_episode.onclick = function () {
      btn_autoNetx_episode.classList.toggle(cx('active'));
    };

    btn_toggle_light.onclick = function () {
      btn_toggle_light.classList.toggle(cx('active'));
      if (btn_toggle_light.classList.contains(cx('active'))) {
        btn_toggle_light.previousElementSibling.innerHTML = 'Bật đèn';
        background_movie_light_off.classList.add(cx('active'));
      } else {
        background_movie_light_off.classList.remove(cx('active'));
        btn_toggle_light.previousElementSibling.innerHTML = 'Tắt đèn';
      }
    };

    // active current server

    const server: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.' + cx('server')
    );

    server[0].classList.add(cx('active'));
    for (let i = 0; i < server.length; ++i) {
      server[i].onclick = function (e) {
        server.forEach(function (item) {
          item.classList.remove(cx('active'));
        });
        server[i].classList.toggle(cx('active'));
      };
    }
  }, []);

  const handleOnClickFollow = () => {
    if (isFollow === false) {
      // axios.post(
      //   'https://api.themoviedb.org/3/list/8215569/add_item?api_key=fe1b70d9265fdb22caa86dca918116eb&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d',
      //   {
      //     media_id: +movieid,
      //   }
      // );

      addItemList(user?.id, {
        media_type: isEpisodes ? 'tv' : 'movie',
        media_id: +slug[0],
      });
      setIsFollow(true);
    } else {
      // axios.post(
      //   'https://api.themoviedb.org/3/list/8215569/remove_item?api_key=fe1b70d9265fdb22caa86dca918116eb&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d',
      //   {
      //     media_id: +movieid,
      //   }
      // );
      removeItemList(user?.id, {
        media_id: +slug[0],
      });
      setIsFollow(false);
    }
  };
  return (
    <>
      <Head>
        <title>
          {data?.name ? data?.name : data?.title}
          {isEpisodes ? ' - Ep: ' + tap : null}
        </title>
      </Head>
      <div className={cx('background-movie-light-off')}></div>
      <div className={cx('player-movie')}>
        <div className={cx('player-movie-container')}>
          <VideoPlayer
            data={data}
            // movieid={slug[0]}
            tap={tap != 'undefined' ? +tap.replace('tap=', '') : 1}
            isEpisodes={isEpisodes}
          />

          <div className={cx('player-movie-widget')}>
            <div className={cx('player-movie-widget-wrapper')}>
              <ul className={cx('tools')}>
                <li className={cx('toggle-light')}>
                  <span>Tắt đèn</span>
                  <div className={cx('btn-toggle-light')}>
                    <FontAwesomeIcon
                      className={cx('fa-power-off')}
                      icon={faPowerOff}
                    />
                  </div>
                </li>

                <li className={cx('autoNext-episode')}>
                  <span>Tự chuyển tập</span>
                  <div className={cx('btn-autoNext-episode')}></div>
                </li>
              </ul>
            </div>

            <div className={cx('swap-server')}>
              <span>Server: </span>
              <ul className={cx('server-list')}>
                <li className={cx('server')}>
                  <a href="#server">Server #1</a>
                </li>

                <li className={cx('server')}>
                  <a href="#server">Server #2</a>
                </li>

                <li className={cx('server')}>
                  <a href="#server">Server #3</a>
                </li>
              </ul>
            </div>
            {isEpisodes ? (
              <Episodes
                tap={tap != 'undefined' ? +tap.replace('tap=', '') : 1}
                data={data}
                dataSeason={dataSeason}
                activeSeason={activeSeason}
                setActiveSeason={setActiveSeason}
                // lastestEpisode={data?.last_episode_to_air?.episode_number}
                // numberOfEpisodes={
                //   data?.seasons.find((item) =>
                //     item.season_number ===
                //     data?.last_episode_to_air?.season_number
                //       ? item
                //       : null
                //   ).episode_count
                // }
                // currentSeason={data?.last_episode_to_air?.season_number}
                routerUse={routerUse}
              />
            ) : null}
          </div>

          <div className={cx('movie-summary')}>
            <div className={cx('download-movie')}>
              <i className={cx('material-icons-outlined')}>file_download</i>
              <h3> Download Movie: </h3>
              <ul className={cx('download-list')}>
                <li className={cx('download')}>
                  <a
                    href="/Videos/Alan Walker Style , Adele - Set Fire To The Rain (Albert Vishi Remix).mp4"
                    download
                  >
                    480p
                  </a>
                </li>

                <li className={cx('download')}>
                  <a
                    href="/Videos/Alan Walker Style , Adele - Set Fire To The Rain (Albert Vishi Remix).mp4"
                    download
                  >
                    720p
                  </a>
                </li>

                <li className={cx('download')}>
                  <a
                    href="/Videos/Alan Walker Style , Adele - Set Fire To The Rain (Albert Vishi Remix).mp4"
                    download
                  >
                    1080p
                  </a>
                </li>
              </ul>
            </div>

            <div className={cx('rate-movie')}>
              <h3>Đánh giá phim </h3>
            </div>

            <Interaction
              isEpisodes={isEpisodes}
              movieid={data?.id}
              voteAverage={data?.vote_average}
              voteCount={data?.vote_count}
              currentURL={URL}
              data={data}
            />
            <div>
              <a
                className={cx('follow-movie', {
                  active: isFollow,
                })}
                onClick={handleOnClickFollow}
              >
                <i className="material-icons">
                  {isFollow ? 'done' : 'bookmark'}
                </i>
                {isFollow ? 'Đã lưu' : 'Lưu phim'}
              </a>
            </div>
            <div className={cx('movie-summary-content')}>
              <h2>
                {data?.title ? data?.title : data?.name}
                {`  (${
                  data?.last_air_date?.slice(0, 4)
                    ? data?.last_air_date?.slice(0, 4)
                    : data?.release_date?.slice(0, 4)
                })`}
              </h2>
              <p>
                {data?.overview}
                <span>
                  [
                  <Link
                    href={`/PrevPlayMovie/${data?.id}/${
                      data?.name?.replace(/\s/g, '-')
                        ? data?.name?.replace(/\s/g, '-')
                        : data?.title?.replace(/\s/g, '-')
                    }`}
                  >
                    Chi tiết
                  </Link>
                  ]
                </span>
              </p>
            </div>
          </div>

          <Comment currentURL={URL} />

          {dataRecommend?.length !== 0 ? (
            <section className={cx('recommend-movies')}>
              <SlideShow
                dataSlide={dataRecommend}
                title="CÓ THỂ BẠN QUAN TÂM"
              />
            </section>
          ) : null}
          {dataSimilar?.length !== 0 ? (
            <section className={cx('similar-movies')}>
              <SlideShow dataSlide={dataSimilar} title="PHIM TƯƠNG TỰ" />
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
};

export async function getStaticProps(context: any) {
  // var data = {};
  var similarData = [];
  var recommendData = [];
  var seasonData = {};
  var isTV = false;
  const { params, query } = context;
  const { ...slug } = params;

  var data = await getMovieSeriesById(slug.slug[0])
    .then((tvResponed) => {
      isTV = true;
      return tvResponed?.data;
    })
    .catch((e) => {
      if (axios.isCancel(e)) return;
    });

  if (data === null) {
    data = await getMovieById(slug.slug[0])
      .then((movieResponed) => {
        isTV = false;
        return movieResponed?.data;
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  }

  recommendData = await getTrending(1)
    .then((movieResponed) => {
      return movieResponed?.data.results;
    })
    .catch((e) => {
      if (axios.isCancel(e)) return;
    });

  if (isTV) {
    similarData = await getMovieBySimilar('tv', data?.genres[0], 1)
      .then((movieResponed) => {
        return movieResponed?.data.results;
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  } else {
    similarData = await getMovieBySimilar('movie', data?.genres[0], 1)
      .then((movieResponed) => {
        return movieResponed?.data.results;
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  }

  if (isTV) {
    seasonData = await getMoviesBySeason(
      +slug.slug[0],
      data?.last_episode_to_air?.season_number
    )
      .then((episodesRespones) => {
        return episodesRespones?.data;
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  }

  return {
    props: {
      params: slug,
      results: data,
      similarData: similarData,
      recommendData: recommendData,
      isTV: isTV,
      seasonData: seasonData,
    },
  };
}

export default memo(PlayPage);
