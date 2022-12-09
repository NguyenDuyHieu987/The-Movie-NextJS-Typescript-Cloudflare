import classNames from 'classnames/bind';
import {
  faPlay,
  faBookmark,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  getMovieByCredit,
  getMovieById,
  getMovieByRecommend,
  getMovieBySimilar,
  getMoviesBySeason,
  getPoster,
} from '../../Services/MovieService';
// import styles from './Episodes.scss';
// import { Link } from 'react-router-dom';
import Link from 'next/link';
import axios from 'axios';
import { useContext } from 'react';

// const cx = classNames.bind(styles);

function Episodes({
  data,
  tap,
  // numberOfEpisodes,
  // lastestEpisode,
  // currentSeason,
  dataSeason,
  activeSeason,
  setActiveSeason,
  routerUse,
}) {
  // const [dataSeason, setDataSeason] = useState<any>({});
  // const [activeSeason, setActiveSeason] = useState(currentSeason);
  useEffect(() => {
    // getMoviesBySeason(data?.id, activeSeason)
    //   .then((episodesRespones) => {
    //     setDataSeason(episodesRespones?.data);
    //   })
    //   .catch((e) => {
    //     if (axios.isCancel(e)) return;
    //   });

    document.querySelector('select').value = activeSeason;
  }, [activeSeason]);

  const handleOnchangeSeason = (value: any) => {
    setActiveSeason(value);
  };
  return (
    <div className="episodes">
      <div className="list-seasons-episodes">
        <h3 className="title-list-episodes">Danh sách tập</h3>
        <select onChange={(e) => handleOnchangeSeason(e.target.value)}>
          {data?.seasons.map((item, index) => (
            <option value={item.season_number} key={index.toString()}>
              {item.name.split(' ')[0] === 'Season' || item.name === 'Specials'
                ? item.name
                : 'Season ' + item.season_number + ' - ' + item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="episodes-wrapper">
        <ul className="episodes-list">
          {
            // Array.from({ length: lastestEpisode }, (_, i) => i + 1)

            dataSeason?.episodes?.map((item, index) => (
              <li
                className={'episode' + (index === tap - 1 ? ' active' : '')}
                key={index.toString()}
              >
                {/* {item?.episode_number === dataSeason?.episodes?.length ? (
                  <Link
                    href={`/PlayPage/${data?.id}/${
                      data?.name
                        ? data?.name?.replace(/\s/g, '-').toLowerCase()
                        : data?.title?.replace(/\s/g, '-').toLowerCase()
                    }?tap=${item?.episode_number}`}
                  >
                    {item?.episode_number < 10
                      ? '0' + item?.episode_number + '-End'
                      : item?.episode_number + '-End'}
                  </Link>
                ) : (
                  <Link
                    href={`/PlayPage/${data?.id}/${
                      data?.name
                        ? data?.name?.replace(/\s/g, '-').toLowerCase()
                        : data?.title?.replace(/\s/g, '-').toLowerCase()
                    }?tap=${item?.episode_number}`}
                  >
                    {item?.episode_number < 10
                      ? '0' + item?.episode_number
                      : item?.episode_number}
                  </Link>
                )} */}
                <a
                  onClick={() => {
                    routerUse.query.tap = `${item?.episode_number}`;
                    routerUse.push(routerUse);
                  }}
                >
                  {item?.episode_number === dataSeason?.episodes?.length
                    ? item?.episode_number < 10
                      ? '0' + item?.episode_number + '-End'
                      : item?.episode_number + '-End'
                    : item?.episode_number < 10
                    ? '0' + item?.episode_number
                    : item?.episode_number}
                </a>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default memo(Episodes);
